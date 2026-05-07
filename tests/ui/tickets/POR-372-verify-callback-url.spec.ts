import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("POR-372: Verify callback URL", { tag: [TAGS.ticket] }, () => {
  test("login page rejects external callback URLs", async ({ page }) => {
    const malicious = "https://evil.example.com/redirect";
    await page.goto(`/login?callbackUrl=${encodeURIComponent(malicious)}`);
    await expect(page).not.toHaveURL(/evil\.example\.com/);
  });
});
