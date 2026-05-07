import type { APIRequestContext, APIResponse } from "@playwright/test";
import { getApiBaseURL } from "~/config/env";
import { API_ENDPOINTS } from "~/config/constants";
import { Logger } from "~/core/logger/logger";
import { maskSecret } from "~/helpers/string.helper";

/**
 * Low-level HTTP client for authentication endpoints.
 *
 * This is a thin wrapper around Playwright's APIRequestContext that knows
 * the shape of /login and /2fa_check (both raw URLs, no auth header needed).
 *
 * Use `AuthService` for the orchestrated login + 2FA + token-extraction flow.
 */
export class AuthApiClient {
  private readonly log = new Logger({ scope: "auth-client" });

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = getApiBaseURL()
  ) {}

  async login(username: string, password: string): Promise<APIResponse> {
    this.log.debug(`POST ${this.baseURL}${API_ENDPOINTS.login} (${maskSecret(username, 3)})`);
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.login}`, {
      data: { username, password },
    });
  }

  async verifyTwoFactor(authCode: string): Promise<APIResponse> {
    this.log.debug(`POST ${this.baseURL}${API_ENDPOINTS.twoFactorCheck}`);
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.twoFactorCheck}`, {
      data: { authCode },
    });
  }

  async me(bearerToken?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${API_ENDPOINTS.me}`, {
      headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined,
    });
  }

  /**
   * Try to extract a bearer token from a 2FA response — body, header, or cookie.
   * Returns undefined if none found.
   */
  extractBearerToken(response: APIResponse, body: Record<string, unknown>): string | undefined {
    // 1) Body (with several common naming conventions)
    const candidates = [
      body["token"],
      body["access_token"],
      body["accessToken"],
      body["bearerToken"],
      (body["data"] as Record<string, unknown> | undefined)?.["token"],
      (body["data"] as Record<string, unknown> | undefined)?.["access_token"],
    ];
    for (const c of candidates) {
      if (typeof c === "string" && c.length > 0) return c;
    }

    // 2) Headers
    const headers = response.headers();
    const auth = headers["authorization"];
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    const tokenHeader = headers["x-auth-token"] ?? headers["x-access-token"];
    if (tokenHeader) return tokenHeader;

    // 3) Cookies
    const cookies = headers["set-cookie"];
    if (cookies) {
      const cookieStr = Array.isArray(cookies) ? cookies.join("; ") : cookies;
      const match = cookieStr.match(/(?:token|access_token|bearer|auth_token|session_id|jwt)=([^;]+)/i);
      if (match?.[1]) return match[1];
    }

    return undefined;
  }
}
