import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { getCommonMerchantIdSync } from "~/config/env";

test.describe("Smoke: Payment via Virtual Terminal", { tag: [TAGS.smoke, TAGS.critical] }, () => {
  test("creates a sale through Virtual Terminal", async ({
    authenticatedPage,
    virtualTerminalPage,
    cardFactory,
  }) => {
    test.skip(!process.env["RUN_FULL_SMOKE"], "Full smoke disabled — set RUN_FULL_SMOKE=1 to run");
    void authenticatedPage;

    const merchantId = getCommonMerchantIdSync();
    const card = cardFactory.valid();

    await virtualTerminalPage.gotoSaleMode(merchantId);
    await virtualTerminalPage.createSaleWithManualCard({
      amount: "10.00",
      cardNumber: card.cardNumber,
      expiryDate: card.expDate,
      cvv: card.cvv,
    });
    await virtualTerminalPage.verifySuccessToast();
  });
});
