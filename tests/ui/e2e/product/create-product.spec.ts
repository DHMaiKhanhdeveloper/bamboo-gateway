import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { faker } from "@faker-js/faker";
import { getCommonMerchantIdSync } from "~/config/env";

test.describe("Product: Create", { tag: [TAGS.regression] }, () => {
  test("creates a basic product", async ({ authenticatedPage, productPage }) => {
    void authenticatedPage;
    const merchantId = getCommonMerchantIdSync();
    await productPage.gotoCreateProduct(merchantId);
    await productPage.fillProductName(`prod-${faker.string.alphanumeric(6)}`);
    await productPage.fillSKU(faker.string.alphanumeric(6).toUpperCase());
    await productPage.fillLocationFields(0, {
      location: "Main",
      cost: "5.00",
      price: "10.00",
    });
    await productPage.createProduct();
  });
});
