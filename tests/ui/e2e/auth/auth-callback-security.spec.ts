import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Authentication: Callback URL security", { tag: [TAGS.regression] }, () => {
  test("ignores external callback URLs", async ({ page }) => {
    const evilCallback = "https://evil.example.com/steal";
    await page.goto(`/login?callbackUrl=${encodeURIComponent(evilCallback)}`);
    await expect(page).not.toHaveURL(/evil\.example\.com/);
  });
});
