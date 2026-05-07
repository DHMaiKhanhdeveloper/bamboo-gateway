import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { CardFactory } from "~/data/factories/card.factory";

test.describe("Virtual Terminal Sale Flows API", { tag: [TAGS.api, TAGS.regression] }, () => {
  const card = {
    encryptedPan:
      "TxI1E+VTCwi9V4PdDC50l3Rt4e/p21XzOUlZMIHCkU5zqUI3cxn8C32IlTW1fgNVs37QJ2KYrIAGxEGoxYe9pw==",
    cvv2: CardFactory.valid().cvv,
    cardType: "CREDIT" as const,
    expMonth: "12",
    expYear: "29",
  };

  test("sale → reversal (full)", async ({ transactionService, request }) => {
    const saleResponse = await transactionService.createSale(request, "30.00", card);
    const sale = await transactionService.verifyTransactionResponse(saleResponse);
    expect(sale.isSuccess).toBeTruthy();
    if (!sale.transactionId) test.skip(true, "no transactionId returned");

    const reversal = await transactionService.reversal(request, sale.transactionId!);
    const reversalResult = await transactionService.verifyTransactionResponse(reversal);
    expect(reversalResult.isSuccess).toBeTruthy();
  });

  test("sale → void", async ({ transactionService, request }) => {
    const saleResponse = await transactionService.createSale(request, "20.00", card);
    const sale = await transactionService.verifyTransactionResponse(saleResponse);
    expect(sale.isSuccess).toBeTruthy();
    if (!sale.transactionId) test.skip(true, "no transactionId returned");

    const voidResponse = await transactionService.void(request, sale.transactionId!);
    expect([200, 201, 409]).toContain(voidResponse.status());
  });

  test("cash sale", async ({ transactionService, request }) => {
    const cashResponse = await transactionService.createSaleCash(request, "12.00");
    const result = await transactionService.verifyTransactionResponse(cashResponse);
    expect(result.isSuccess).toBeTruthy();
  });
});
