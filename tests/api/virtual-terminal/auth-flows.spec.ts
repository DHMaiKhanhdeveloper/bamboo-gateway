import { test, expect } from "~/fixtures";
import { CardFactory } from "~/data/factories/card.factory";
import { TAGS } from "~/config/constants";

test.describe("Virtual Terminal Auth/Capture API", { tag: [TAGS.api, TAGS.regression] }, () => {
  test("auth-only then capture", async ({ transactionService, request }) => {
    const card = {
      encryptedPan:
        "TxI1E+VTCwi9V4PdDC50l3Rt4e/p21XzOUlZMIHCkU5zqUI3cxn8C32IlTW1fgNVs37QJ2KYrIAGxEGoxYe9pw==",
      cvv2: CardFactory.valid().cvv,
      cardType: "CREDIT" as const,
      expMonth: "12",
      expYear: "29",
    };
    const authResponse = await transactionService.createAuthOnly(request, "50.00", card);
    const authResult = await transactionService.verifyTransactionResponse(authResponse);
    expect(authResult.isSuccess).toBeTruthy();
    if (!authResult.transactionId) test.skip(true, "Auth did not return transactionId");

    const captureResponse = await transactionService.captureAuth(
      request,
      authResult.transactionId!
    );
    const captureResult = await transactionService.verifyTransactionResponse(captureResponse);
    expect(captureResult.isSuccess).toBeTruthy();
  });
});
