import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

const validCredentials = {
  username: "admin.test",
  password: "Qwerty@12345",
};

test.describe("Authentication: Success", { tag: [TAGS.regression] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("username-input")).toBeVisible();
    await expect(page.getByTestId("password-input")).toBeVisible();
    await expect(page.getByTestId("login-submit-button")).toBeVisible();
  });

  test("redirects to two-factor page after valid login", async ({ page }) => {
    await page.route("**/login", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: "MFA required", code: "mfa_required" }),
      });
    });

    await page.getByTestId("username-input").fill(validCredentials.username);
    await page.getByTestId("password-input").fill(validCredentials.password);
    await page.getByTestId("login-submit-button").click();

    await expect(page).toHaveURL("/two-factor");
  });

  test("preserves callback URL on redirect to two-factor", async ({ page }) => {
    const callbackUrl = "/merchants/123";
    await page.goto(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);

    await page.route("**/login", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: "MFA required", code: "mfa_required" }),
      });
    });

    await page.getByTestId("username-input").fill(validCredentials.username);
    await page.getByTestId("password-input").fill(validCredentials.password);
    await page.getByTestId("login-submit-button").click();

    await expect(page).toHaveURL(`/two-factor?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  });
});
