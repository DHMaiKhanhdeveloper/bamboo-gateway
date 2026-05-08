import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Authentication: Error handling", { tag: [TAGS.regression] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.route("**/login", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid credentials" }),
      });
    });
    await page.getByTestId("username-input").fill("invalid@test.com");
    await page.getByTestId("password-input").fill("wrong");
    await page.getByTestId("login-submit-button").click();
    await expect(page.locator('[data-sonner-toast][data-type="error"]').first()).toBeVisible();
  });
});
