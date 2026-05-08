import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { getCommonMerchantIdSync } from "~/config/env";

test.describe("Virtual Terminal: Standard Sale", { tag: [TAGS.regression] }, () => {
  test.skip(!process.env["RUN_FULL_E2E"], "VT requires real merchant — set RUN_FULL_E2E=1");

  test("creates a sale with valid card", async ({
    authenticatedPage,
    virtualTerminalPage,
    cardFactory,
  }) => {
    void authenticatedPage;
    const card = cardFactory.valid();
    await virtualTerminalPage.gotoSaleMode(getCommonMerchantIdSync());
    await virtualTerminalPage.createSaleWithManualCard({
      amount: "25.00",
      cardNumber: card.cardNumber,
      expiryDate: card.expDate,
      cvv: card.cvv,
    });
    await virtualTerminalPage.verifySuccessToast();
  });
});
