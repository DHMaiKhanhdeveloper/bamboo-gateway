import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { getCommonMerchantIdSync } from "~/config/env";

test.describe("Customer: Create", { tag: [TAGS.regression] }, () => {
  test("creates a new customer with billing address", async ({
    authenticatedPage,
    customerPage,
    customerFactory,
  }) => {
    void authenticatedPage;
    const data = customerFactory.build();
    await customerPage.gotoAddCustomer(getCommonMerchantIdSync());
    await customerPage.fillCustomerForm({
      customerInfo: { customerId: data.customerId, firstName: data.firstName, lastName: data.lastName },
      paymentInfo: {
        cardNumber: data.card.cardNumber,
        expMonth: data.card.expDate.split("/")[0] ?? "12",
        expYear: data.card.expDate.split("/")[1] ?? "34",
        cvv: data.card.cvv,
      },
      billingAddress: data.billingAddress,
    });
    await customerPage.submitForm();
  });
});
