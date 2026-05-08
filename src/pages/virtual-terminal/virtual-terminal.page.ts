import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";

export type TransactionType = "sale" | "auth" | "return";
export type PaymentMethod = "manual" | "saved" | "cash";
export type DiscountType = "None" | "Amount" | "Percentage";

export interface NewCustomerData {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  customerId?: number;
  description?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingPhone?: string;
  billingEmail?: string;
  billingCompany?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCountry?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingPhone?: string;
  shippingEmail?: string;
  shippingCompany?: string;
  shippingAddress1?: string;
  shippingAddress2?: string;
  shippingCountry?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
}

export interface CardEntryData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface BillingAddressData {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  address2?: string;
  company?: string;
}

export interface MerchantDefinedFieldsData {
  fieldA?: string;
  fieldB?: boolean;
  fieldC?: boolean;
  fieldD?: string;
}

export interface ProductBasicInfoData {
  name: string;
  category?: string;
  description?: string;
  sku?: string;
  upc?: string;
  commodityCode?: string;
  unit?: string;
}

export interface ProductLocationFieldsData {
  location: string;
  cost?: string;
  price?: string;
  taxRate?: string;
  discountType?: DiscountType;
  discount?: string;
  inventory?: {
    enabled: boolean;
    onHand?: string;
    onOrder?: string;
    alertLevel?: string;
  };
}

export interface AddNewProductData extends ProductBasicInfoData {
  location?: {
    name: string;
    cost?: string;
    price?: string;
    taxRate?: string;
    discountType?: DiscountType;
    discount?: string;
    inventory?: {
      enabled: boolean;
      onHand?: string;
      onOrder?: string;
      alertLevel?: string;
    };
  };
}

/**
 * Virtual Terminal — facade page object covering all sections (transaction
 * type, customer, amount/products, payment, billing, MDF) and their flows.
 *
 * The legacy 1642-line monolith has been preserved here as a single class
 * (BasePage extension, role-based locators where the source provided them).
 * Future refactors can split this file into `sections/*.section.ts` and
 * `flows/*.flow.ts` without breaking existing test imports.
 */
export class VirtualTerminalPage extends BasePage {
  protected override get urlPath(): string {
    return "/virtual-terminal";
  }
  protected override readyLocator(): Locator {
    return this.virtualTerminalHeading;
  }

  // ===========================================================================
  // Navigation
  // ===========================================================================
  override async goto(merchantIdOrQuery: string = ""): Promise<null> {
    if (
      merchantIdOrQuery &&
      !merchantIdOrQuery.startsWith("?") &&
      !merchantIdOrQuery.startsWith("/")
    ) {
      await this.page.goto(`/${merchantIdOrQuery}/virtual-terminal`);
    } else {
      await this.page.goto(`/virtual-terminal${merchantIdOrQuery}`);
    }
    await expect(this.virtualTerminalHeading).toBeVisible();
    return null;
  }

  async gotoSaleMode(merchantId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/virtual-terminal?type=sale`);
    await expect(this.virtualTerminalHeading).toBeVisible();
  }

  async gotoAuthMode(merchantId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/virtual-terminal?type=auth`);
    await expect(this.virtualTerminalHeading).toBeVisible();
  }

  async gotoReturnMode(merchantId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/virtual-terminal?type=return`);
    await expect(this.virtualTerminalHeading).toBeVisible();
  }

  async gotoWithMerchant(merchantId: string): Promise<void> {
    await this.gotoSaleMode(merchantId.replace("?type=sale", ""));
  }
  async gotoSaleModeWithMerchant(merchantId: string): Promise<void> {
    await this.gotoSaleMode(merchantId);
  }
  async gotoAuthModeWithMerchant(merchantId: string): Promise<void> {
    await this.gotoAuthMode(merchantId);
  }
  async gotoReturnModeWithMerchant(merchantId: string): Promise<void> {
    await this.gotoReturnMode(merchantId);
  }

  // ===========================================================================
  // Headings & transaction type radios
  // ===========================================================================
  get virtualTerminalHeading(): Locator {
    return this.page.getByRole("heading", { name: "Virtual Terminal" });
  }
  get saleRadio(): Locator {
    return this.page.getByTestId("transaction-type-sale-radio");
  }
  get saleLabel(): Locator {
    return this.page.getByTestId("transaction-type-sale-label");
  }
  get authorizePaymentRadio(): Locator {
    return this.page.getByTestId("transaction-type-auth-radio");
  }
  get authorizePaymentLabel(): Locator {
    return this.page.getByTestId("transaction-type-auth-label");
  }
  get returnRadio(): Locator {
    return this.page.getByTestId("transaction-type-return-radio");
  }
  get returnLabel(): Locator {
    return this.page.getByTestId("transaction-type-return-label");
  }

  // ===========================================================================
  // Customer
  // ===========================================================================
  get customerSelect(): Locator {
    return this.page.getByTestId("customer-selector");
  }
  get customerSearchInput(): Locator {
    return this.page.getByPlaceholder("Search...");
  }
  get addNewCustomerOption(): Locator {
    return this.page.getByText("Add new customer");
  }
  get removeCustomerButton(): Locator {
    return this.page
      .getByRole("button")
      .filter({ has: this.page.locator('[data-testid="remove-customer"]') });
  }

  get newCustomerCustomerId(): Locator {
    return this.page.getByTestId("add-customer-customer-id-input");
  }
  get newCustomerFirstName(): Locator {
    return this.page.getByTestId("add-customer-first-name-input");
  }
  get newCustomerLastName(): Locator {
    return this.page.getByTestId("add-customer-last-name-input");
  }
  get newCustomerDescription(): Locator {
    return this.page.getByTestId("add-customer-description-textarea");
  }
  get newCustomerCardNumber(): Locator {
    return this.page.getByTestId("add-customer-card-number-input");
  }
  get newCustomerExpiryMonth(): Locator {
    return this.page.getByTestId("add-customer-exp-month-input");
  }
  get newCustomerExpiryYear(): Locator {
    return this.page.getByTestId("add-customer-exp-year-input");
  }
  get newCustomerCVV(): Locator {
    return this.page.getByTestId("add-customer-cvv-input");
  }
  get newCustomerBillingFirstName(): Locator {
    return this.page.getByTestId("add-customer-billing-first-name-input");
  }
  get newCustomerBillingLastName(): Locator {
    return this.page.getByTestId("add-customer-billing-last-name-input");
  }
  get newCustomerBillingPhone(): Locator {
    return this.page.getByTestId("add-customer-billing-phone-input");
  }
  get newCustomerBillingEmail(): Locator {
    return this.page.getByTestId("add-customer-billing-email-input");
  }
  get newCustomerBillingCompany(): Locator {
    return this.page.getByTestId("add-customer-billing-company-input");
  }
  get newCustomerBillingAddress1(): Locator {
    return this.page.getByTestId("add-customer-billing-address1-input");
  }
  get newCustomerBillingAddress2(): Locator {
    return this.page.getByTestId("add-customer-billing-address2-input");
  }
  get newCustomerBillingCountry(): Locator {
    return this.page.getByTestId("add-customer-billing-country-select");
  }
  get newCustomerBillingCity(): Locator {
    return this.page.getByTestId("add-customer-billing-city-input");
  }
  get newCustomerBillingState(): Locator {
    return this.page.getByTestId("add-customer-billing-state-select");
  }
  get newCustomerBillingZip(): Locator {
    return this.page.getByTestId("add-customer-billing-zip-input");
  }
  get newCustomerShippingFirstName(): Locator {
    return this.page.getByTestId("add-customer-shipping-first-name-input");
  }
  get newCustomerShippingLastName(): Locator {
    return this.page.getByTestId("add-customer-shipping-last-name-input");
  }
  get newCustomerShippingPhone(): Locator {
    return this.page.getByTestId("add-customer-shipping-phone-input");
  }
  get newCustomerShippingEmail(): Locator {
    return this.page.getByTestId("add-customer-shipping-email-input");
  }
  get newCustomerShippingCompany(): Locator {
    return this.page.getByTestId("add-customer-shipping-company-input");
  }
  get newCustomerShippingAddress1(): Locator {
    return this.page.getByTestId("add-customer-shipping-address1-input");
  }
  get newCustomerShippingAddress2(): Locator {
    return this.page.getByTestId("add-customer-shipping-address2-input");
  }
  get newCustomerShippingCountry(): Locator {
    return this.page.getByTestId("add-customer-shipping-country-select");
  }
  get newCustomerShippingCity(): Locator {
    return this.page.getByTestId("add-customer-shipping-city-input");
  }
  get newCustomerShippingState(): Locator {
    return this.page.getByTestId("add-customer-shipping-state-select");
  }
  get newCustomerShippingZip(): Locator {
    return this.page.getByTestId("add-customer-shipping-zip-input");
  }
  get addCustomerButton(): Locator {
    return this.page.getByTestId("add-customer-submit-button");
  }

  // ===========================================================================
  // Payment detail
  // ===========================================================================
  get manualAmountEntryRadio(): Locator {
    return this.page.getByRole("group").filter({ hasText: /^Manual Amount Entry$/ });
  }
  get selectProductsRadio(): Locator {
    return this.page.getByRole("group").filter({ hasText: /^Select Products$/ });
  }
  get amountInput(): Locator {
    return this.page.getByTestId("amount-subTotal-input");
  }
  get subtotalDisplay(): Locator {
    return this.page
      .getByText(/Subtotal/)
      .locator("..")
      .getByText(/\$/);
  }
  get discountDisplay(): Locator {
    return this.page
      .getByText(/Discount/)
      .locator("..")
      .getByText(/\$/);
  }
  get taxDisplay(): Locator {
    return this.page.getByText(/Tax/).locator("..").getByText(/\$/);
  }
  get totalAmountDisplay(): Locator {
    return this.page
      .getByText(/Total Amount/)
      .locator("..")
      .getByText(/\$/);
  }

  get productSearchInput(): Locator {
    return this.page.getByTestId("product-search-input");
  }
  get addNewProductOption(): Locator {
    return this.page.getByText("Add new product");
  }

  // ===========================================================================
  // Payment methods
  // ===========================================================================
  get manualCardEntryRadio(): Locator {
    return this.page.getByRole("group").filter({ hasText: "Manual Card Entry" }).nth(1);
  }
  get savedCardRadio(): Locator {
    return this.page.getByRole("group").filter({ hasText: "Saved Card" }).nth(1);
  }
  get cashRadio(): Locator {
    return this.page.getByRole("group").filter({ hasText: "Cash" }).nth(1);
  }

  get cardNumberInput(): Locator {
    return this.page.getByTestId("card-number-input");
  }
  get expiryDateInput(): Locator {
    return this.page.getByTestId("expiry-date-input");
  }
  get cvvInput(): Locator {
    return this.page.getByTestId("cvv-input");
  }
  get cashReceivedInput(): Locator {
    return this.page.getByLabel(/Cash Received.*\*/);
  }

  // Billing
  get addBillingButton(): Locator {
    return this.page.getByRole("button", { name: "Add Billing" });
  }
  get hideBillingButton(): Locator {
    return this.page.getByRole("button", { name: "Hide Billing" });
  }
  get billingFirstName(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("First Name");
  }
  get billingLastName(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("Last Name");
  }
  get billingAddress1(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("Address 1");
  }
  get billingAddress2(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("Address 2");
  }
  get billingCity(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("City");
  }
  get billingState(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("State/Province");
  }
  get billingZip(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("ZIP/Postal Code");
  }
  get billingCountry(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("Country");
  }
  get billingCompany(): Locator {
    return this.page.getByTestId("billing-section").getByLabel("Company");
  }

  // MDF
  get merchantDefinedFieldsButton(): Locator {
    return this.page.getByRole("button").filter({ hasText: "Merchant Defined Fields" });
  }
  get mdfFieldA(): Locator {
    return this.page.getByLabel("A");
  }
  get mdfFieldBCheckbox(): Locator {
    return this.page.getByLabel("B");
  }
  get mdfFieldCRadio(): Locator {
    return this.page.getByLabel("C").first();
  }
  get mdfFieldDSelect(): Locator {
    return this.page.getByLabel("D");
  }

  // Buttons
  get processPaymentButton(): Locator {
    return this.page.getByTestId("submit-payment-button");
  }
  get confirmSaleButton(): Locator {
    return this.page.getByRole("button", { name: "Process Sale" });
  }
  get confirmAuthButton(): Locator {
    return this.page.getByRole("button", { name: "Process Authorization" });
  }
  get confirmReturnButton(): Locator {
    return this.page.getByRole("button", { name: "Process Return" });
  }
  get confirmPaymentButton(): Locator {
    return this.page.getByRole("button", { name: "Process Payment" });
  }
  get cancelButton(): Locator {
    return this.page.getByRole("button", { name: "Cancel" });
  }

  // Add new product locators
  get addNewProductOptionButton(): Locator {
    return this.page.getByTestId("add-new-product-option");
  }
  get productNameInput(): Locator {
    return this.page.getByTestId("product-name-input");
  }
  get productCategorySelect(): Locator {
    return this.page.getByTestId("product-category-select");
  }
  get addCategoryButton(): Locator {
    return this.page.getByTestId("add-category-button");
  }
  get productDescriptionTextarea(): Locator {
    return this.page.getByTestId("product-description-textarea");
  }
  get productSkuInput(): Locator {
    return this.page.getByTestId("product-sku-input");
  }
  get productUpcInput(): Locator {
    return this.page.getByTestId("product-upc-input");
  }
  get productCommodityCodeSelect(): Locator {
    return this.page.getByTestId("product-commodity-code-select");
  }
  get productUnitSelect(): Locator {
    return this.page.getByTestId("product-unit-select");
  }
  get productSubmitButton(): Locator {
    return this.page.getByTestId("product-submit-button");
  }

  getProductLocationSelect(i: number): Locator {
    return this.page.getByTestId(`product-location-select-${i}`);
  }
  getProductLocationCostInput(i: number): Locator {
    return this.page.getByTestId(`product-location-cost-input-${i}`);
  }
  getProductLocationPriceInput(i: number): Locator {
    return this.page.getByTestId(`product-location-price-input-${i}`);
  }
  getProductLocationTaxRateInput(i: number): Locator {
    return this.page.getByTestId(`product-location-tax-rate-input-${i}`);
  }
  getProductLocationDiscountInput(i: number): Locator {
    return this.page.getByTestId(`product-location-discount-input-${i}`);
  }
  getProductLocationDiscountRateInput(i: number): Locator {
    return this.page.getByTestId(`product-location-discount-rate-input-${i}`);
  }
  getProductLocationNonInventoryCheckbox(i: number): Locator {
    return this.page.getByTestId(`product-location-non-inventory-checkbox-${i}`);
  }
  getProductLocationOnHandInput(i: number): Locator {
    return this.page.getByTestId(`product-location-on-hand-input-${i}`);
  }
  getProductLocationOnOrderInput(i: number): Locator {
    return this.page.getByTestId(`product-location-on-order-input-${i}`);
  }
  getProductLocationAlertLevelInput(i: number): Locator {
    return this.page.getByTestId(`product-location-alert-level-input-${i}`);
  }
  getProductLocationRow(i: number): Locator {
    return this.page.getByTestId(`product-location-row-${i}`);
  }

  getProductLocationDiscountTypeCombobox(i: number): Locator {
    return this.getProductLocationRow(i)
      .getByRole("combobox")
      .filter({ hasText: /None|Amount|Percentage/i });
  }

  // Return form
  get returnTransactionIdInput(): Locator {
    return this.page.getByLabel(/Transaction ID/);
  }
  get returnAmountInput(): Locator {
    return this.page.getByLabel(/Amount to Refund/);
  }

  // ===========================================================================
  // Transaction type
  // ===========================================================================
  async selectTransactionType(type: TransactionType): Promise<void> {
    if (type === "sale") {
      await this.saleLabel.click();
      await expect(this.saleRadio).toBeChecked();
    } else if (type === "auth") {
      await this.authorizePaymentLabel.click();
      await expect(this.authorizePaymentRadio).toBeChecked();
    } else {
      await this.returnLabel.click();
      await expect(this.returnRadio).toBeChecked();
    }
  }

  // ===========================================================================
  // Customer methods
  // ===========================================================================
  async openCustomerDropdown(): Promise<void> {
    await this.customerSelect.click();
    await expect(this.customerSearchInput).toBeVisible();
  }

  async selectExistingCustomer(customerName: string): Promise<void> {
    await this.openCustomerDropdown();
    await this.page.getByText(customerName).first().click();
  }

  async selectFirstCustomer(customerName: string): Promise<void> {
    await this.openCustomerDropdown();
    await this.page.locator('[role="option"]').filter({ hasText: customerName }).first().click();
  }

  async addNewCustomer(data: NewCustomerData): Promise<void> {
    await this.openCustomerDropdown();
    await this.addNewCustomerOption.click();

    if (data.customerId) await this.newCustomerCustomerId.fill(data.customerId.toString());
    await this.newCustomerFirstName.fill(data.firstName);
    await this.newCustomerLastName.fill(data.lastName);
    if (data.description) await this.newCustomerDescription.fill(data.description);

    await this.newCustomerCardNumber.fill(data.cardNumber);
    await this.newCustomerExpiryMonth.fill(data.expiryMonth);
    await this.newCustomerExpiryYear.fill(data.expiryYear);
    await this.newCustomerCVV.fill(data.cvv);

    if (data.billingFirstName) await this.newCustomerBillingFirstName.fill(data.billingFirstName);
    if (data.billingLastName) await this.newCustomerBillingLastName.fill(data.billingLastName);
    if (data.billingPhone) await this.newCustomerBillingPhone.fill(data.billingPhone);
    if (data.billingEmail) await this.newCustomerBillingEmail.fill(data.billingEmail);
    if (data.billingCompany) await this.newCustomerBillingCompany.fill(data.billingCompany);
    if (data.billingAddress1) await this.newCustomerBillingAddress1.fill(data.billingAddress1);
    if (data.billingAddress2) await this.newCustomerBillingAddress2.fill(data.billingAddress2);
    if (data.billingCountry) {
      await this.newCustomerBillingCountry.click();
      await this.page.getByRole("option", { name: data.billingCountry }).click();
    }
    if (data.billingCity) await this.newCustomerBillingCity.fill(data.billingCity);
    if (data.billingState) {
      await this.newCustomerBillingState.click();
      await this.page.getByRole("option", { name: data.billingState }).first().click();
    }
    if (data.billingZip) await this.newCustomerBillingZip.fill(data.billingZip);

    if (data.shippingFirstName)
      await this.newCustomerShippingFirstName.fill(data.shippingFirstName);
    if (data.shippingLastName) await this.newCustomerShippingLastName.fill(data.shippingLastName);
    if (data.shippingPhone) await this.newCustomerShippingPhone.fill(data.shippingPhone);
    if (data.shippingEmail) await this.newCustomerShippingEmail.fill(data.shippingEmail);
    if (data.shippingCompany) await this.newCustomerShippingCompany.fill(data.shippingCompany);
    if (data.shippingAddress1) await this.newCustomerShippingAddress1.fill(data.shippingAddress1);
    if (data.shippingAddress2) await this.newCustomerShippingAddress2.fill(data.shippingAddress2);
    if (data.shippingCountry) {
      await this.newCustomerShippingCountry.click();
      await this.page.getByRole("option", { name: data.shippingCountry }).click();
    }
    if (data.shippingCity) await this.newCustomerShippingCity.fill(data.shippingCity);
    if (data.shippingState) {
      await this.newCustomerShippingState.click();
      await this.page.getByRole("option", { name: data.shippingState }).first().click();
    }
    if (data.shippingZip) await this.newCustomerShippingZip.fill(data.shippingZip);

    await this.addCustomerButton.click();
  }

  async removeCustomer(): Promise<void> {
    await this.removeCustomerButton.click();
  }

  // ===========================================================================
  // Payment detail methods
  // ===========================================================================
  async selectPaymentDetailType(type: "manual" | "products"): Promise<void> {
    if (type === "manual") {
      await this.manualAmountEntryRadio.click();
      await expect(this.amountInput).toBeVisible();
    } else {
      await this.selectProductsRadio.click();
      await expect(this.productSearchInput).toBeVisible();
    }
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.click();
    await this.amountInput.fill(amount);
  }

  async selectProduct(productName: string): Promise<void> {
    await this.productSearchInput.click();
    await this.page.getByText(productName).first().click();
    await this.page.keyboard.press("Escape");
  }

  // ===========================================================================
  // Add new product flow
  // ===========================================================================
  async openAddNewProductDialog(): Promise<void> {
    await this.productSearchInput.click();
    await this.addNewProductOptionButton.click();
    await expect(this.productNameInput).toBeVisible();
  }

  async fillProductBasicInfo(data: ProductBasicInfoData): Promise<void> {
    await this.productNameInput.fill(data.name);
    if (data.category) {
      await this.productCategorySelect.click();
      await this.page.getByRole("option", { name: data.category }).click();
    }
    if (data.description) await this.productDescriptionTextarea.fill(data.description);
    if (data.sku) await this.productSkuInput.fill(data.sku);
    if (data.upc) await this.productUpcInput.fill(data.upc);
    if (data.commodityCode) {
      await this.productCommodityCodeSelect.click();
      await this.page.getByRole("option", { name: new RegExp(data.commodityCode, "i") }).click();
    }
    if (data.unit) {
      await this.productUnitSelect.click();
      await this.page.getByRole("option", { name: new RegExp(data.unit, "i") }).click();
    }
  }

  async selectProductDiscountType(index: number, type: DiscountType): Promise<void> {
    const combobox = this.getProductLocationDiscountTypeCombobox(index);
    await combobox.click();
    await this.page.getByRole("option", { name: type }).click();
  }

  async fillProductLocationFields(index: number, data: ProductLocationFieldsData): Promise<void> {
    await this.getProductLocationSelect(index).click();
    const option = data.location
      ? this.page.getByRole("option", { name: new RegExp(data.location, "i") }).first()
      : this.page.getByRole("option").first();
    await option.waitFor({ state: "visible" });
    await option.click();

    if (data.cost) await this.getProductLocationCostInput(index).fill(data.cost);
    if (data.price) await this.getProductLocationPriceInput(index).fill(data.price);
    if (data.taxRate) await this.getProductLocationTaxRateInput(index).fill(data.taxRate);

    if (data.discountType && data.discountType !== "None") {
      await this.selectProductDiscountType(index, data.discountType);
      if (data.discount) {
        if (data.discountType === "Percentage") {
          await this.getProductLocationDiscountRateInput(index).fill(data.discount);
        } else {
          await this.getProductLocationDiscountInput(index).fill(data.discount);
        }
      }
    }

    if (data.inventory) {
      const checkbox = this.getProductLocationNonInventoryCheckbox(index);
      const isChecked = await checkbox.isChecked();
      if ((data.inventory.enabled && isChecked) || (!data.inventory.enabled && !isChecked)) {
        await checkbox.click();
      }
      if (data.inventory.enabled) {
        if (data.inventory.onHand)
          await this.getProductLocationOnHandInput(index).fill(data.inventory.onHand);
        if (data.inventory.onOrder)
          await this.getProductLocationOnOrderInput(index).fill(data.inventory.onOrder);
        if (data.inventory.alertLevel)
          await this.getProductLocationAlertLevelInput(index).fill(data.inventory.alertLevel);
      }
    }
  }

  async submitNewProduct(): Promise<void> {
    await this.productSubmitButton.click();
  }

  async addNewProduct(data: AddNewProductData): Promise<void> {
    await this.openAddNewProductDialog();
    await this.fillProductBasicInfo({
      name: data.name,
      category: data.category,
      description: data.description,
      sku: data.sku,
      upc: data.upc,
      commodityCode: data.commodityCode,
      unit: data.unit,
    });
    await this.fillProductLocationFields(0, {
      location: data.location?.name ?? "",
      cost: data.location?.cost,
      price: data.location?.price,
      taxRate: data.location?.taxRate,
      discountType: data.location?.discountType,
      discount: data.location?.discount,
      inventory: data.location?.inventory,
    });
    await this.submitNewProduct();
  }

  async createNewCategory(categoryName: string): Promise<void> {
    await this.productCategorySelect.click();
    await this.addCategoryButton.click();
    await this.page.getByRole("textbox", { name: "Category Name" }).fill(categoryName);
    await this.page.getByRole("button", { name: "Create" }).click();
    await this.page.getByRole("button", { name: "Close" }).click();
  }

  // ===========================================================================
  // Payment methods
  // ===========================================================================
  async selectPaymentMethod(method: PaymentMethod): Promise<void> {
    if (method === "manual") {
      await this.manualCardEntryRadio.click();
      await expect(this.cardNumberInput).toBeVisible();
    } else if (method === "saved") {
      await this.savedCardRadio.click();
    } else {
      await this.cashRadio.click();
      await expect(this.cashReceivedInput).toBeVisible();
    }
  }

  async enterCardDetails(data: CardEntryData): Promise<void> {
    await this.cardNumberInput.click();
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expiryDateInput.click();
    await this.expiryDateInput.fill(data.expiryDate);
    await this.cvvInput.click();
    await this.cvvInput.fill(data.cvv);
  }

  async enterCashReceived(amount: string): Promise<void> {
    await this.cashReceivedInput.fill(amount);
  }

  // ===========================================================================
  // Billing
  // ===========================================================================
  async addBillingAddress(data: BillingAddressData): Promise<void> {
    await this.addBillingButton.click();
    await expect(this.billingFirstName).toBeVisible();
    await this.billingFirstName.fill(data.firstName);
    await this.billingLastName.fill(data.lastName);
    await this.billingAddress1.fill(data.address1);
    await this.billingCity.fill(data.city);
    await this.billingState.fill(data.state);
    await this.billingZip.fill(data.zip);
    if (data.address2) await this.billingAddress2.fill(data.address2);
    if (data.company) await this.billingCompany.fill(data.company);
  }

  async hideBillingAddress(): Promise<void> {
    await this.hideBillingButton.click();
  }

  // ===========================================================================
  // Merchant defined fields
  // ===========================================================================
  async expandMerchantDefinedFields(): Promise<void> {
    await this.merchantDefinedFieldsButton.click();
    await expect(this.mdfFieldA).toBeVisible();
  }

  async fillMerchantDefinedFields(data: MerchantDefinedFieldsData): Promise<void> {
    await this.expandMerchantDefinedFields();
    if (data.fieldA) await this.mdfFieldA.fill(data.fieldA);
    if (data.fieldB) await this.mdfFieldBCheckbox.check();
    if (data.fieldC) await this.mdfFieldCRadio.click();
    if (data.fieldD) {
      await this.mdfFieldDSelect.click();
      await this.page.getByText(data.fieldD).first().click();
    }
  }

  // ===========================================================================
  // Transaction processing
  // ===========================================================================
  async processPayment(): Promise<void> {
    await this.processPaymentButton.waitFor({ state: "visible" });
    await expect(this.processPaymentButton).toBeEnabled();
    await this.processPaymentButton.click();
  }

  async confirmPayment(): Promise<void> {
    await this.confirmPaymentButton.waitFor({ state: "visible" });
    await expect(this.confirmPaymentButton).toBeEnabled();
    await this.confirmPaymentButton.click();
  }

  async confirmTransaction(type: TransactionType = "sale"): Promise<void> {
    if (type === "sale") await this.confirmSaleButton.click();
    else if (type === "auth") await this.confirmAuthButton.click();
    else await this.confirmReturnButton.click();
  }

  async processAndConfirm(type: TransactionType = "sale"): Promise<void> {
    await this.processPayment();
    await this.confirmTransaction(type);
  }

  async processAndConfirmPayment(type: TransactionType = "sale"): Promise<void> {
    await this.processPayment();
    await this.confirmPayment();
    await this.confirmTransaction(type);
  }

  // ===========================================================================
  // Composite flows
  // ===========================================================================
  async createSaleWithManualCard(data: {
    amount: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    customer?: string;
  }): Promise<void> {
    if (data.customer) await this.selectExistingCustomer(data.customer);
    await this.enterAmount(data.amount);
    await this.enterCardDetails({
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
      cvv: data.cvv,
    });
    await this.processAndConfirm("sale");
  }

  async createSaleWithSavedCard(data: { customer: string; amount: string }): Promise<void> {
    await this.selectExistingCustomer(data.customer);
    await this.enterAmount(data.amount);
    await this.selectPaymentMethod("saved");
    await this.processAndConfirm("sale");
  }

  async createCashSale(data: {
    customer?: string;
    amount: string;
    cashReceived: string;
  }): Promise<void> {
    if (data.customer) await this.selectExistingCustomer(data.customer);
    await this.enterAmount(data.amount);
    await this.selectPaymentMethod("cash");
    await this.enterCashReceived(data.cashReceived);
    await this.processAndConfirm("sale");
  }

  async createAuthWithManualCard(data: {
    amount: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    customer?: string;
  }): Promise<void> {
    await this.selectTransactionType("auth");
    if (data.customer) await this.selectExistingCustomer(data.customer);
    await this.enterAmount(data.amount);
    await this.enterCardDetails({
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
      cvv: data.cvv,
    });
    await this.processAndConfirm("auth");
  }

  async createAuthWithSavedCard(data: { customer: string; amount: string }): Promise<void> {
    await this.selectTransactionType("auth");
    await this.selectExistingCustomer(data.customer);
    await this.enterAmount(data.amount);
    await this.selectPaymentMethod("saved");
    await this.processAndConfirm("auth");
  }

  async createSaleWithProduct(data: {
    customer: string;
    productName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }): Promise<void> {
    await this.selectExistingCustomer(data.customer);
    await this.selectPaymentDetailType("products");
    await this.selectProduct(data.productName);
    await this.enterCardDetails({
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
      cvv: data.cvv,
    });
    await this.processAndConfirm("sale");
  }

  async createReturn(data: { transactionId: string; refundAmount: string }): Promise<void> {
    await this.selectTransactionType("return");
    await this.returnTransactionIdInput.fill(data.transactionId);
    await this.returnAmountInput.fill(data.refundAmount);
    await this.processAndConfirm("return");
  }

  // ===========================================================================
  // Verifications
  // ===========================================================================
  async verifySuccessToast(message?: string): Promise<void> {
    const toast = this.page.locator('[data-sonner-toast][data-type="success"]');
    await expect(toast).toBeVisible();
    if (message) await expect(toast).toContainText(message);
  }

  async verifyErrorToast(message?: string): Promise<void> {
    const toast = this.page.locator('[data-sonner-toast][data-type="error"]');
    await expect(toast).toBeVisible();
    if (message) await expect(toast).toContainText(message);
  }

  async verifyTransactionDetailPage(): Promise<void> {
    await expect(
      this.page.locator("#content").getByRole("main").getByText("Transaction Detail")
    ).toBeVisible();
  }

  async verifyTransactionStatus(status: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-status-badge")).toContainText(status);
  }

  async verifyTransactionType(type: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-type-value")).toContainText(type);
  }

  async verifyTransactionAmount(amount: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-amount-value")).toContainText(amount);
  }

  async verifyApprovedAmount(amount: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-approved-amount-value")).toContainText(amount);
  }

  async verifyTipAmount(amount: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-tip-value")).toContainText(amount);
  }

  async verifyTaxAmount(amount: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-tax-value")).toContainText(amount);
  }

  async verifyDiscountAmount(amount: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-discount-value")).toContainText(amount);
  }

  async verifyShippingAmount(amount: string): Promise<void> {
    await expect(this.page.getByTestId("transaction-shipping-value")).toContainText(amount);
  }

  async verifyCardNumber(cardNumber: string): Promise<void> {
    await expect(this.page.getByTestId("card-number-value")).toContainText(cardNumber);
  }

  async verifyCardExpiration(expiration: string): Promise<void> {
    await expect(this.page.getByTestId("card-expiration-value")).toContainText(expiration);
  }

  async verifyCardType(cardType: string): Promise<void> {
    await expect(this.page.getByTestId("card-type-value")).toContainText(cardType);
  }

  async verifyCVVStatus(status: string): Promise<void> {
    await expect(this.page.getByTestId("cvv-status-value")).toContainText(status);
  }

  async verifyEntryMethod(method: string): Promise<void> {
    await expect(this.page.getByTestId("entry-method-value")).toContainText(method);
  }

  async verifyResponseCode(code: string): Promise<void> {
    await expect(this.page.getByTestId("response-code-value")).toContainText(code);
  }

  async verifyPaymentType(type: string): Promise<void> {
    await expect(
      this.page
        .getByText(/Payment type/)
        .locator("..")
        .getByText(type)
    ).toBeVisible();
  }

  async verifyChangeAmount(change: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(`CHANGE: ${change}`))).toBeVisible();
  }

  async verifyBillingAddress(data: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    country: string;
    city: string;
    state: string;
    zip: string;
  }): Promise<void> {
    await expect(
      this.page
        .getByText(/First Name/)
        .locator("..")
        .getByText(data.firstName)
    ).toBeVisible();
    await expect(
      this.page
        .getByText(/Last Name/)
        .locator("..")
        .getByText(data.lastName)
    ).toBeVisible();
    await expect(
      this.page
        .getByText(/Address 1/)
        .locator("..")
        .getByText(data.address1)
    ).toBeVisible();
    await expect(
      this.page
        .getByText(/Address 2/)
        .locator("..")
        .getByText(data.address2)
    ).toBeVisible();
    await expect(
      this.page
        .getByText(/Country/)
        .locator("..")
        .getByText(data.country)
    ).toBeVisible();
    await expect(this.page.getByText(/City/).locator("..").getByText(data.city)).toBeVisible();
    await expect(this.page.getByText(/State/).locator("..").getByText(data.state)).toBeVisible();
    await expect(this.page.getByText(/Zip/).locator("..").getByText(data.zip)).toBeVisible();
  }

  async verifyMerchantDefinedFields(data: {
    fieldA?: string;
    fieldB?: string;
    fieldC?: string;
    fieldD?: string;
  }): Promise<void> {
    const mdf = this.page.getByRole("heading", { name: "Merchant Defined Fields" }).locator("..");
    if (data.fieldA)
      await expect(mdf.getByText(/A/).locator("..").getByText(data.fieldA)).toBeVisible();
    if (data.fieldB)
      await expect(mdf.getByText(/B/).locator("..").getByText(data.fieldB)).toBeVisible();
    if (data.fieldC)
      await expect(mdf.getByText(/C/).locator("..").getByText(data.fieldC)).toBeVisible();
    if (data.fieldD)
      await expect(mdf.getByText(/D/).locator("..").getByText(data.fieldD)).toBeVisible();
  }

  async verifyProductInCart(productName: string): Promise<void> {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async verifyProductPricing(data: {
    subtotal: string;
    discount?: string;
    tax: string;
    total: string;
  }): Promise<void> {
    await expect(
      this.page
        .getByText(/Subtotal/)
        .locator("..")
        .getByText(data.subtotal)
    ).toBeVisible();
    await expect(this.page.getByText(/Tax/).locator("..").getByText(data.tax)).toBeVisible();
    await expect(this.page.getByText(/Total/).locator("..").getByText(data.total)).toBeVisible();
    if (data.discount) {
      await expect(
        this.page
          .getByText(/Discount/)
          .locator("..")
          .getByText(data.discount)
      ).toBeVisible();
    }
  }

  async verifySavedCardEnabled(): Promise<void> {
    await expect(this.savedCardRadio).toBeEnabled();
  }
  async verifySavedCardDisabled(): Promise<void> {
    await expect(this.savedCardRadio).toBeDisabled();
  }
  async verifyCashPaymentNotAvailable(): Promise<void> {
    await expect(this.cashRadio).not.toBeVisible();
  }

  async verifyAuthorizationCode(code: string): Promise<void> {
    await expect(this.page.getByTestId("authorization-code-value")).toContainText(code);
  }

  async verifyAVSStatus(status: string): Promise<void> {
    await expect(this.page.getByTestId("avs-status-value")).toContainText(status);
  }

  async verifyActionButtonsAvailable(buttons: string[]): Promise<void> {
    for (const name of buttons) {
      await expect(this.page.getByRole("button", { name })).toBeVisible();
    }
  }

  async verifyActionButtonsNotAvailable(buttons: string[]): Promise<void> {
    for (const name of buttons) {
      await expect(this.page.getByRole("button", { name })).not.toBeVisible();
    }
  }

  // ===========================================================================
  // Field validation
  // ===========================================================================
  async verifyFieldRequired(fieldLabel: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(`${fieldLabel}.*required`, "i"))).toBeVisible();
  }

  async verifyInvalidCardNumber(): Promise<void> {
    await expect(this.page.getByText(/Invalid card number|Card number must be/)).toBeVisible();
  }

  async verifyExpiredCard(): Promise<void> {
    await expect(this.page.getByText(/Card is expired|Invalid expiration/)).toBeVisible();
  }

  async verifyInsufficientCash(): Promise<void> {
    await expect(
      this.page.getByText(/Cash received must be equal to or greater than/)
    ).toBeVisible();
  }

  async verifyTransactionNotFound(): Promise<void> {
    await expect(this.page.getByText(/Item not found|Transaction not found/)).toBeVisible();
  }

  async verifyTransactionAlreadyReturned(): Promise<void> {
    await expect(this.page.getByText(/Transaction was already returned/)).toBeVisible();
  }

  async verifyOverRefundError(): Promise<void> {
    await expect(
      this.page.getByText(/Refund amount exceeds|must be less than or equal to/)
    ).toBeVisible();
  }

  async verifySKUTooLong(): Promise<void> {
    await expect(this.page.getByText(/SKU.*should have 8 characters or less/)).toBeVisible();
  }

  async verifyDuplicateUPC(): Promise<void> {
    await expect(this.page.getByText(/UPC is already in use/)).toBeVisible();
  }

  async verifyCompanyFieldError(): Promise<void> {
    await expect(this.page.getByText(/Extra attributes are not allowed.*company/)).toBeVisible();
  }

  // ===========================================================================
  // Misc navigation / utilities
  // ===========================================================================
  async navigateToTransactions(): Promise<void> {
    await this.page.getByRole("link", { name: "Transactions" }).click();
    await expect(this.page.getByRole("heading", { name: "Transactions" })).toBeVisible();
  }

  async navigateToCustomers(): Promise<void> {
    await this.page.getByRole("link", { name: "Customers" }).click();
    await expect(this.page.getByRole("heading", { name: "Customers" })).toBeVisible();
  }

  async clickDownloadReceipt(): Promise<void> {
    await this.page.getByRole("button", { name: /Download/ }).click();
  }

  async clickSendEmail(): Promise<void> {
    await this.page.getByRole("button", { name: /Send.*Email/ }).click();
  }

  async waitForTransactionToProcess(): Promise<void> {
    // Backwards-compat shim — the original implementation was a no-op.
  }

  async getTransactionId(): Promise<string> {
    const elem = this.page
      .getByText(/Transaction ID/)
      .locator("..")
      .locator("div")
      .last();
    return (await elem.textContent()) ?? "";
  }

  async copyTransactionId(): Promise<void> {
    await this.page.getByRole("button", { name: "Copy to clipboard" }).first().click();
  }
}
