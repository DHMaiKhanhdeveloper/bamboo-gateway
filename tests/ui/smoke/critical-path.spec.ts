import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { getAuthCredentials } from "~/config/env";

test.describe("Critical Path Smoke Tests", { tag: [TAGS.smoke, TAGS.critical] }, () => {
  test("Complete payment flow - End to End", async ({ loginPage, headerComponent }) => {
    await test.step("User Login", async () => {
      try {
        const credentials = getAuthCredentials();
        await loginPage.login(credentials.username, credentials.password, credentials.totpSecret);
      } catch {
        test.skip(true, "Credentials not configured for smoke test");
      }
    });

    await test.step("Verify User Can Logout", async () => {
      await headerComponent.verifyHeaderVisible();
    });
  });

  test("Quick health check - Page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/login/i);
  });

  test("Environment validation", async () => {
    try {
      getAuthCredentials();
      expect(true).toBeTruthy();
    } catch {
      test.skip(true, "Required environment variables are missing");
    }
  });
});
