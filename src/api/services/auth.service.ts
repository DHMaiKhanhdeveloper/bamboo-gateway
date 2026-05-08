import type { APIRequestContext } from "@playwright/test";
import { AuthApiClient } from "~/api/clients/auth.client";
import {
  type AuthCredentialsInput,
  type AuthResult,
  LoginResponseSchema,
  TwoFactorResponseSchema,
} from "~/api/schemas/auth.schema";
import { generateTotp } from "~/helpers/otp.helper";
import { AuthError } from "~/core/http/http-errors";
import { Logger } from "~/core/logger/logger";

/**
 * Orchestrates the full API authentication flow:
 *   1. POST /login (200 OR 403 mfa_required → both treated as success)
 *   2. Generate TOTP from secret
 *   3. POST /2fa_check
 *   4. Extract bearer token (body / header / cookie)
 *
 * Returns an `AuthResult` rather than throwing for graceful error reporting.
 */
export class AuthService {
  private readonly log = new Logger({ scope: "auth-service" });
  private readonly client: AuthApiClient;
  private bearerToken: string | undefined;

  constructor(request: APIRequestContext) {
    this.client = new AuthApiClient(request);
  }

  async authenticate(credentials: AuthCredentialsInput): Promise<AuthResult> {
    try {
      // Step 1: Login
      const loginRes = await this.client.login(credentials.username, credentials.password);
      const loginBodyRaw = await this.safeJson(loginRes);
      const loginBody = LoginResponseSchema.safeParse(loginBodyRaw).data ?? {};

      const isMfaRequired = loginRes.status() === 403 && loginBody["code"] === "mfa_required";
      const ok = loginRes.ok() || isMfaRequired;
      if (!ok) {
        return {
          success: false,
          error: `Login failed with status ${loginRes.status()} - ${JSON.stringify(loginBody)}`,
        };
      }
      this.log.info(isMfaRequired ? "Login OK (MFA required)" : "Login OK");

      // Step 2: TOTP
      const authCode = generateTotp(credentials.totpSecret);

      // Step 3: Verify 2FA
      const verifyRes = await this.client.verifyTwoFactor(authCode);
      const verifyBodyRaw = await this.safeJson(verifyRes);
      const verifyBody = TwoFactorResponseSchema.safeParse(verifyBodyRaw).data ?? {};

      if (!verifyRes.ok()) {
        return {
          success: false,
          error: `2FA verification failed with status ${verifyRes.status()} - ${JSON.stringify(verifyBody)}`,
        };
      }

      // Step 4: Extract bearer token
      const token = this.client.extractBearerToken(
        verifyRes,
        verifyBody as Record<string, unknown>
      );
      if (!token) {
        return {
          success: false,
          error:
            "Could not extract bearer token from /2fa_check response. " +
            "If the API uses session cookies only, set BYPASS_AUTH_TOKEN in .env.local " +
            "with a token captured from browser DevTools.",
        };
      }

      this.bearerToken = token;
      return { success: true, bearerToken: token };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Authentication error: ${message}` };
    }
  }

  getToken(): string | undefined {
    return this.bearerToken;
  }

  isAuthenticated(): boolean {
    return Boolean(this.bearerToken);
  }

  getAuthHeader(): string {
    if (!this.bearerToken) {
      throw new AuthError("Not authenticated. Call authenticate() first.");
    }
    return `Bearer ${this.bearerToken}`;
  }

  clear(): void {
    this.bearerToken = undefined;
  }

  private async safeJson(response: { json: () => Promise<unknown> }): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }
}
