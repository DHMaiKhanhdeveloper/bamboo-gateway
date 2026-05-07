import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Virtual Terminal Sale API", { tag: [TAGS.api, TAGS.regression] }, () => {
  test("creates a basic sale transaction", async ({ virtualTerminalService, request }) => {
    const requestId = virtualTerminalService.generateRequestId();
    const response = await virtualTerminalService.createSale(request, "100.00", { requestId });
    const result = await virtualTerminalService.verifySaleResponse(response);
    expect(result.isSuccess).toBeTruthy();
  });

  test("creates a sale with a specific amount", async ({ virtualTerminalService, request }) => {
    const requestId = virtualTerminalService.generateRequestId();
    const response = await virtualTerminalService.createSale(request, "150.00", { requestId });
    const result = await virtualTerminalService.verifySaleResponse(response);
    expect(result.isSuccess).toBeTruthy();
    expect(String(result.total)).toBe("150.00");
  });

  test("creates a sale with the complete payload", async ({ virtualTerminalService, request }) => {
    const requestId = virtualTerminalService.generateRequestId();
    const cardHolderData = virtualTerminalService.generateCardHolderData();

    const response = await virtualTerminalService.createSaleWithCompleteData(request, "108.74", {
      requestId,
      cardData: {
        encryptedPan:
          "BN253zh9axn6MrYG0qHZzC3qNW683R9acKsR6NU+7h8gG7ZqyFXfdVAsYUrnzbmdt8ELD3Vn5H3G5MUHwN2mxw==",
        cvv2: "999",
        cardType: "CREDIT",
        expMonth: "12",
        expYear: "29",
      },
      cardHolderData,
      amountData: { subTotal: "100.00", tax: "9.89", total: "108.74", discount: "1.15" },
      industryCode: "D",
      authOnly: false,
    });

    const result = await virtualTerminalService.verifySaleResponse(response);
    expect(result.isSuccess).toBeTruthy();
    expect(result.status).toBe(200);
    expect(result.transactionId).toBeTruthy();
    expect(result.transactionType).toBe("Sale");
    expect(result.processorApproved).toBe(true);
    expect(String(result.total)).toBe("108.74");
    expect(String(result.subTotal)).toBe("100.00");
    expect(String(result.tax)).toBe("9.89");
    expect(String(result.discount)).toBe("1.15");
    expect(result.fullName).toBeTruthy();
  });
});
