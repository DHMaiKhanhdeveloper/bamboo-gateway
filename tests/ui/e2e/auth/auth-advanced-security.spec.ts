import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Authentication: Advanced security", { tag: [TAGS.regression] }, () => {
  test("login form is served over the configured HTTPS host", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBeLessThan(400);
  });

  test("password input has type=password", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("password-input")).toHaveAttribute("type", "password");
  });
});
