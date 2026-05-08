import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Merchant CRUD", { tag: [TAGS.regression] }, () => {
  test.skip(
    !process.env["RUN_FULL_E2E"],
    "Merchant creation requires reseller context — set RUN_FULL_E2E=1"
  );

  test("creates merchant with all sections", async ({
    authenticatedPage,
    merchantPage,
    merchantFactory,
  }) => {
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
