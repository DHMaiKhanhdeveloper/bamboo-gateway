import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Authentication: MFA", { tag: [TAGS.regression] }, () => {
  test.skip(!process.env["RUN_FULL_E2E"], "MFA UI flow requires real TOTP — set RUN_FULL_E2E=1");

  test("requires TOTP code at /two-factor", async ({ page, loginPage }) => {
    void loginPage;
    await page.goto("/two-factor");
    await expect(page.getByText("2-Step Verification")).toBeVisible();
  });
});
