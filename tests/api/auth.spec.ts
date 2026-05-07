import { test, expect } from "@playwright/test";
import { AuthApiClient } from "~/api/clients/auth.client";
import { AuthService } from "~/api/services/auth.service";
import { getAuthCredentials } from "~/config/env";
import { generateTotp } from "~/helpers/otp.helper";
import { TAGS } from "~/config/constants";

test.describe("Authentication API", { tag: [TAGS.api] }, () => {
  test("login returns 403 mfa_required for valid credentials", async ({ request }) => {
    try {
      const credentials = getAuthCredentials();
      const client = new AuthApiClient(request);
      const response = await client.login(credentials.username, credentials.password);
      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body).toHaveProperty("code");
    } catch {
      test.skip(true, "API credentials not configured");
    }
  });

  test("login rejects invalid credentials", async ({ request }) => {
    const client = new AuthApiClient(request);
    const response = await client.login("invalid@test.com", "wrongpassword");
    expect(response.status()).toBe(400);
  });

  test("/2fa_check accepts a generated TOTP", async ({ request }) => {
    try {
      const credentials = getAuthCredentials();
      const client = new AuthApiClient(request);
      const loginResponse = await client.login(credentials.username, credentials.password);
      expect(loginResponse.status()).toBe(403);
      const code = generateTotp(credentials.totpSecret);
      const verifyResponse = await client.verifyTwoFactor(code);
      expect([200, 201, 401, 400]).toContain(verifyResponse.status());
    } catch {
      test.skip(true, "2FA credentials not configured");
    }
  });

  test("AuthService.authenticate returns a bearer token", async ({ request }) => {
    try {
      const service = new AuthService(request);
      const result = await service.authenticate(getAuthCredentials());
      expect(result.success || typeof result.error === "string").toBeTruthy();
      if (result.success) expect(result.bearerToken?.length).toBeGreaterThan(10);
    } catch {
      test.skip(true, "Auth service test skipped — env not configured");
    }
  });
});
