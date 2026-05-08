import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Smoke: Create Merchant", { tag: [TAGS.smoke] }, () => {
  test("creates a new merchant via the UI", async ({
    authenticatedPage,
    merchantPage,
    merchantFactory,
  }) => {
    test.skip(!process.env["RUN_FULL_SMOKE"], "Full smoke disabled — set RUN_FULL_SMOKE=1 to run");

    void authenticatedPage;
    const data = merchantFactory.build();
    await merchantPage.gotoAddMerchant();
    await merchantPage.fillMerchantInfo({
      merchantName: data.merchantName,
      timezone: data.timezone,
      categoryName: data.category,
    });
    await merchantPage.fillContactInfo(data.contact);
    await merchantPage.fillBusinessInfo(data.business);
    await merchantPage.submitMerchantForm();
    await merchantPage.verifyCreationSuccess();
  });
});
