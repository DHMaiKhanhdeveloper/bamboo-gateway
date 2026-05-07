import { test as base, type Page } from "@playwright/test";
import { LoginPage } from "~/pages/auth/login.page";
import { AuthService } from "~/api/services/auth.service";
import { AuthStateManager } from "~/support/auth/auth-state-manager";
import { getAuthCredentials, getBypassAuthToken } from "~/config/env";
import { Logger } from "~/core/logger/logger";
import { AUTH_ROLES } from "~/config/constants";

const log = new Logger({ scope: "auth-fixture" });

export interface AuthFixtures {
  /**
   * UI page already authenticated as admin.
   * Uses the cached storage state when valid; otherwise performs a fresh login
   * and saves a new state.
   */
  authenticatedPage: Page;

  /**
   * API bearer token for the admin role.
   * Honors `BYPASS_AUTH_TOKEN` env var as an emergency fallback.
   */
  apiBearerToken: string;
}

export const authTest = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, context }, use) => {
    try {
      const validState = AuthStateManager.isAuthStateValid(AUTH_ROLES.admin);
      if (validState) {
        const state = AuthStateManager.loadAuthState(AUTH_ROLES.admin);
        if (state) await AuthStateManager.applyAuthState(context, state, AUTH_ROLES.admin);
        if (await AuthStateManager.validateAuthentication(page)) {
          log.info("Using cached admin auth state");
          await use(page);
          return;
        }
        log.info("Cached state invalid — refreshing");
      }
      const creds = getAuthCredentials();
      const loginPage = new LoginPage(page);
      await loginPage.login(creds.username, creds.password, creds.totpSecret);
      await AuthStateManager.saveAuthState(context, AUTH_ROLES.admin);
      await use(page);
    } catch (err) {
      log.error("Authentication failed", err);
      throw err;
    }
  },

  apiBearerToken: async ({ request }, use) => {
    const bypass = getBypassAuthToken();
    if (bypass) {
      log.warn(`Using BYPASS_AUTH_TOKEN (${bypass.substring(0, 8)}…)`);
      await use(bypass);
      return;
    }
    const service = new AuthService(request);
    const result = await service.authenticate(getAuthCredentials());
    if (!result.success || !result.bearerToken) {
      throw new Error(
        "❌ API authentication failed.\n\n" +
          `Error: ${result.error ?? "unknown"}\n\n` +
          "Check:\n" +
          "  1. .env.local exists\n" +
          "  2. ADMIN_USERNAME / ADMIN_PASSWORD / TOTP_SECRET are set\n" +
          "  3. Credentials are valid (manual login works)\n" +
          "  4. API endpoint is reachable\n\n" +
          "Workaround: set BYPASS_AUTH_TOKEN=<token> in .env.local"
      );
    }
    log.info(`API auth OK (token: ${result.bearerToken.substring(0, 12)}…)`);
    await use(result.bearerToken);
  },
});
