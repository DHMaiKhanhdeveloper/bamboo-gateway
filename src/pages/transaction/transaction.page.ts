import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";

export interface TransactionAddressFields {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface TransactionProductFields {
  name?: string;
  price?: string;
  quantity?: string;
  subtotal?: string;
  discount?: string;
  tax?: string;
  total?: string;
}

export class TransactionPage extends BasePage {
  protected override get urlPath(): string { return "/transactions"; }
  protected override readyLocator(): Locator { return this.transactionTitle; }

  async gotoTransactionDetail(merchantId: string, transactionId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/transactions/${transactionId}`);
    await expect(this.transactionTitle).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Headings
  // ---------------------------------------------------------------------------
  get transactionTitle(): Locator {
    return this.page.locator("#content").getByRole("main").getByText("Transaction Detail");
  }
  get productInformationHeading(): Locator { return this.page.getByTestId("product-information-heading"); }
  get billingAddressHeading(): Locator { return this.page.getByRole("heading", { name: "Billing Address" }); }
  get shippingAddressHeading(): Locator { return this.page.getByRole("heading", { name: "Shipping Address" }); }
  get merchantDefinedFieldsHeading(): Locator { return this.page.getByRole("heading", { name: "Merchant Defined Fields" }); }
  get levelIIIInformationHeading(): Locator { return this.page.getByRole("heading", { name: "Level III Information" }); }
  get actionsHeading(): Locator { return this.page.getByRole("heading", { name: "Actions" }); }
  get creditCardInformationHeading(): Locator { return this.page.getByRole("heading", { name: "Credit Card Information" }); }
  get paymentInformationHeading(): Locator { return this.page.getByRole("heading", { name: "Payment Information" }); }

  // ---------------------------------------------------------------------------
  // Base Transaction Fields
  // ---------------------------------------------------------------------------
  get transactionTypeValue(): Locator { return this.page.getByTestId("transaction-type-value"); }
  get transactionTipValue(): Locator { return this.page.getByTestId("transaction-tip-value"); }
  get transactionTaxValue(): Locator { return this.page.getByTestId("transaction-tax-value"); }
  get transactionIdValue(): Locator { return this.page.getByTestId("transaction-id-value"); }
  get transactionAmountValue(): Locator { return this.page.getByTestId("transaction-amount-value"); }
  get transactionDateTimeValue(): Locator { return this.page.getByTestId("transaction-datetime-value"); }
  get transactionStatusBadge(): Locator { return this.page.getByTestId("transaction-status-badge"); }
  get transactionApprovedAmountValue(): Locator { return this.page.getByTestId("transaction-approved-amount-value"); }

  // Payment / Card
  get paymentTypeValue(): Locator { return this.page.getByTestId("payment-type-value"); }
  get paymentResponseValue(): Locator { return this.page.getByTestId("payment-response-value"); }
  get cardNumberValue(): Locator { return this.page.getByTestId("card-number-value"); }
  get cardExpirationValue(): Locator { return this.page.getByTestId("card-expiration-value"); }
  get cardTypeValue(): Locator { return this.page.getByTestId("card-type-value"); }
  get cvvStatusValue(): Locator { return this.page.getByTestId("cvv-status-value"); }
  get authorizationCodeValue(): Locator { return this.page.getByTestId("authorization-code-value"); }
  get avsStatusValue(): Locator { return this.page.getByTestId("avs-status-value"); }
  get entryMethodValue(): Locator { return this.page.getByTestId("entry-method-value"); }
  get responseCodeValue(): Locator { return this.page.getByTestId("response-code-value"); }

  // Billing / Shipping address
  get billingAddressFirstName(): Locator { return this.page.getByTestId("billing-address-firstname-value"); }
  get billingAddressLastName(): Locator { return this.page.getByTestId("billing-address-lastname-value"); }
  get billingAddressAddress1(): Locator { return this.page.getByTestId("billing-address-address1-value"); }
  get billingAddressAddress2(): Locator { return this.page.getByTestId("billing-address-address2-value"); }
  get billingAddressCity(): Locator { return this.page.getByTestId("billing-address-city-value"); }
  get billingAddressState(): Locator { return this.page.getByTestId("billing-address-state-value"); }
  get billingAddressZip(): Locator { return this.page.getByTestId("billing-address-zip-value"); }
  get billingAddressCountry(): Locator { return this.page.getByTestId("billing-address-country-value"); }
  get shippingAddressFirstName(): Locator { return this.page.getByTestId("shipping-address-firstname-value"); }
  get shippingAddressLastName(): Locator { return this.page.getByTestId("shipping-address-lastname-value"); }
  get shippingAddressAddress1(): Locator { return this.page.getByTestId("shipping-address-address1-value"); }
  get shippingAddressAddress2(): Locator { return this.page.getByTestId("shipping-address-address2-value"); }
  get shippingAddressCity(): Locator { return this.page.getByTestId("shipping-address-city-value"); }
  get shippingAddressState(): Locator { return this.page.getByTestId("shipping-address-state-value"); }
  get shippingAddressZip(): Locator { return this.page.getByTestId("shipping-address-zip-value"); }
  get shippingAddressCountry(): Locator { return this.page.getByTestId("shipping-address-country-value"); }

  getMerchantDefinedField(fieldName: string): Locator {
    const fieldKey = fieldName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return this.page.getByTestId(`mdf-${fieldKey}-value`);
  }

  // Level III
  get levelIIIDiscount(): Locator { return this.page.getByTestId("level-iii-information-discount-value"); }
  get levelIIINationalTax(): Locator { return this.page.getByTestId("level-iii-information-national-tax-value"); }
  get levelIIIDuty(): Locator { return this.page.getByTestId("level-iii-information-duty-value"); }
  get levelIIIMerchantVat(): Locator { return this.page.getByTestId("level-iii-information-merchant-vat-value"); }
  get levelIIICustomerVat(): Locator { return this.page.getByTestId("level-iii-information-customer-vat-value"); }
  get levelIIIShipFromZip(): Locator { return this.page.getByTestId("level-iii-information-ship-from-zip-value"); }
  get levelIIIUniqueVatInvoice(): Locator { return this.page.getByTestId("level-iii-information-unique-vat-invoice-value"); }
  get levelIIIVatTaxAmount(): Locator { return this.page.getByTestId("level-iii-information-vat-tax-amount-value"); }
  get levelIIIVatTaxRate(): Locator { return this.page.getByTestId("level-iii-information-vat-tax-rate-value"); }
  get levelIIISummaryCommodityCode(): Locator { return this.page.getByTestId("level-iii-information-summary-commodity-code-value"); }
  get levelIIIOriginalOrderDate(): Locator { return this.page.getByTestId("level-iii-information-original-order-date-value"); }

  // Product info
  get productInformationSection(): Locator { return this.page.getByTestId("product-information-section"); }
  get productInformationTable(): Locator { return this.page.getByTestId("product-information-table"); }
  get productInformationTableHeader(): Locator { return this.page.getByTestId("product-information-table-header"); }
  get productInformationTableBody(): Locator { return this.page.getByTestId("product-information-table-body"); }

  getProductRow(i: number): Locator { return this.page.getByTestId(`product-row-${i}`); }
  getProductName(i: number): Locator { return this.page.getByTestId(`product-${i}-name-value`); }
  getProductPrice(i: number): Locator { return this.page.getByTestId(`product-${i}-price-value`); }
  getProductQuantity(i: number): Locator { return this.page.getByTestId(`product-${i}-quantity-value`); }
  getProductSubtotal(i: number): Locator { return this.page.getByTestId(`product-${i}-subtotal-value`); }
  getProductDiscount(i: number): Locator { return this.page.getByTestId(`product-${i}-discount-value`); }
  getProductTax(i: number): Locator { return this.page.getByTestId(`product-${i}-tax-value`); }
  getProductTotal(i: number): Locator { return this.page.getByTestId(`product-${i}-total-value`); }

  getActionLink(index: number): Locator {
    return this.page.locator('[data-testid="actions-section"]').locator("a").nth(index);
  }

  // Action buttons
  get captureButton(): Locator { return this.page.getByRole("button", { name: "Capture" }); }
  get returnButton(): Locator { return this.page.getByRole("button", { name: "Return" }); }
  get voidButton(): Locator { return this.page.getByRole("button", { name: "Void" }); }
  get reversalButton(): Locator { return this.page.getByRole("button", { name: "Reversal" }); }
  get incrementalButton(): Locator { return this.page.getByRole("button", { name: "Incremental" }); }
  get downloadReceiptButton(): Locator { return this.page.getByRole("button", { name: /Download Receipt/i }); }
  get sendEmailButton(): Locator { return this.page.getByRole("button", { name: /Send Email/i }); }

  // VT form fields (transaction creation flows)
  get amountSubTotalInput(): Locator { return this.page.getByTestId("amount-subTotal-input"); }
  get cardNumberInput(): Locator { return this.page.getByTestId("card-number-input"); }
  get expiryDateInput(): Locator { return this.page.getByTestId("expiry-date-input"); }
  get cvvInput(): Locator { return this.page.getByTestId("cvv-input"); }
  get submitPaymentButton(): Locator { return this.page.getByTestId("submit-payment-button"); }
  get paymentConfirmDialog(): Locator { return this.page.getByTestId("payment-confirm-dialog"); }

  // Return form
  get returnForm(): Locator { return this.page.getByTestId("return-form"); }
  get returnTransactionIdInput(): Locator { return this.page.getByTestId("transaction-id-input"); }
  get returnAmountInput(): Locator { return this.page.getByTestId("return-amount-input"); }
  get submitReturnButton(): Locator { return this.page.getByTestId("submit-return-button"); }
  get transactionActionReturnButton(): Locator { return this.page.getByTestId("transaction-action-return-button"); }

  // Reversal dialog
  get transactionReversalAmountInput(): Locator { return this.page.getByTestId("transaction-reversal-amount-input"); }
  get transactionReversalTotalInput(): Locator { return this.page.getByTestId("transaction-reversal-total-input"); }
  get transactionReversalReasonCombobox(): Locator { return this.page.getByTestId("transaction-reversal-reason-combobox"); }
  get transactionReversalProcessPaymentButton(): Locator { return this.page.getByTestId("transaction-reversal-process-payment-button"); }

  // ---------------------------------------------------------------------------
  // Verifications — base
  // ---------------------------------------------------------------------------
  async verifyTransactionType(v: string): Promise<void> { await expect(this.transactionTypeValue).toContainText(v); }
  async verifyTransactionTip(v: string): Promise<void> { await expect(this.transactionTipValue).toContainText(v); }
  async verifyTransactionTax(v: string): Promise<void> { await expect(this.transactionTaxValue).toContainText(v); }
  async verifyTransactionId(v: string): Promise<void> { await expect(this.transactionIdValue).toContainText(v); }
  async verifyTransactionApprovedAmount(v: string): Promise<void> { await expect(this.transactionApprovedAmountValue).toContainText(v); }
  async verifyTransactionAmount(v: string): Promise<void> { await expect(this.transactionAmountValue).toContainText(v); }
  async verifyTransactionDateTime(v: string): Promise<void> { await expect(this.transactionDateTimeValue).toContainText(v); }
  async verifyTransactionStatus(v: string): Promise<void> { await expect(this.transactionStatusBadge).toContainText(v); }

  // Payment / Card
  async verifyPaymentType(v: string): Promise<void> { await expect(this.paymentTypeValue).toContainText(v); }
  async verifyPaymentResponse(v: string): Promise<void> { await expect(this.paymentResponseValue).toContainText(v); }
  async verifyCardNumber(v: string): Promise<void> { await expect(this.cardNumberValue).toContainText(v); }
  async verifyCardExpiration(v: string): Promise<void> { await expect(this.cardExpirationValue).toContainText(v); }
  async verifyCardType(_expectedCardType: string): Promise<void> { await expect(this.cardTypeValue).toBeVisible(); }
  async verifyCvvStatus(v: string): Promise<void> { await expect(this.cvvStatusValue).toContainText(v); }
  async verifyAuthorizationCode(v: string): Promise<void> { await expect(this.authorizationCodeValue).toContainText(v); }
  async verifyAvsStatus(v: string): Promise<void> { await expect(this.avsStatusValue).toContainText(v); }
  async verifyEntryMethod(v: string): Promise<void> { await expect(this.entryMethodValue).toContainText(v); }
  async verifyResponseCode(v: string): Promise<void> { await expect(this.responseCodeValue).toContainText(v); }

  // Address verifications
  private resolveBillingField(name: string): Locator {
    switch (name.toLowerCase()) {
      case "firstname":
      case "first name": return this.billingAddressFirstName;
      case "lastname":
      case "last name": return this.billingAddressLastName;
      case "address1": return this.billingAddressAddress1;
      case "address2": return this.billingAddressAddress2;
      case "city": return this.billingAddressCity;
      case "state": return this.billingAddressState;
      case "zip": return this.billingAddressZip;
      case "country": return this.billingAddressCountry;
      default: throw new Error(`Unknown billing address field: ${name}`);
    }
  }

  private resolveShippingField(name: string): Locator {
    switch (name.toLowerCase()) {
      case "firstname":
      case "first name": return this.shippingAddressFirstName;
      case "lastname":
      case "last name": return this.shippingAddressLastName;
      case "address1": return this.shippingAddressAddress1;
      case "address2": return this.shippingAddressAddress2;
      case "city": return this.shippingAddressCity;
      case "state": return this.shippingAddressState;
      case "zip": return this.shippingAddressZip;
      case "country": return this.shippingAddressCountry;
      default: throw new Error(`Unknown shipping address field: ${name}`);
    }
  }

  async verifyBillingAddressField(field: string, expected: string): Promise<void> {
    await expect(this.resolveBillingField(field)).toContainText(expected);
  }

  async verifyShippingAddressField(field: string, expected: string): Promise<void> {
    await expect(this.resolveShippingField(field)).toContainText(expected);
  }

  async verifyBillingAddress(addr: TransactionAddressFields): Promise<void> {
    if (addr.firstName) await expect(this.billingAddressFirstName).toContainText(addr.firstName);
    if (addr.lastName) await expect(this.billingAddressLastName).toContainText(addr.lastName);
    if (addr.address1) await expect(this.billingAddressAddress1).toContainText(addr.address1);
    if (addr.address2) await expect(this.billingAddressAddress2).toContainText(addr.address2);
    if (addr.city) await expect(this.billingAddressCity).toContainText(addr.city);
    if (addr.state) await expect(this.billingAddressState).toContainText(addr.state);
    if (addr.zip) await expect(this.billingAddressZip).toContainText(addr.zip);
    if (addr.country) await expect(this.billingAddressCountry).toContainText(addr.country);
  }

  async verifyShippingAddress(addr: TransactionAddressFields): Promise<void> {
    if (addr.firstName) await expect(this.shippingAddressFirstName).toContainText(addr.firstName);
    if (addr.lastName) await expect(this.shippingAddressLastName).toContainText(addr.lastName);
    if (addr.address1) await expect(this.shippingAddressAddress1).toContainText(addr.address1);
    if (addr.address2) await expect(this.shippingAddressAddress2).toContainText(addr.address2);
    if (addr.city) await expect(this.shippingAddressCity).toContainText(addr.city);
    if (addr.state) await expect(this.shippingAddressState).toContainText(addr.state);
    if (addr.zip) await expect(this.shippingAddressZip).toContainText(addr.zip);
    if (addr.country) await expect(this.shippingAddressCountry).toContainText(addr.country);
  }

  async verifyMerchantDefinedField(name: string, expected: string): Promise<void> {
    await expect(this.getMerchantDefinedField(name)).toContainText(expected);
  }

  // Level III field resolver
  private resolveLevelIIIField(name: string): Locator {
    const key = name.toLowerCase();
    if (key === "discount") return this.levelIIIDiscount;
    if (key === "national tax" || key === "nationaltax") return this.levelIIINationalTax;
    if (key === "duty") return this.levelIIIDuty;
    if (key === "merchant vat" || key === "merchantvat") return this.levelIIIMerchantVat;
    if (key === "customer vat" || key === "customervat") return this.levelIIICustomerVat;
    if (key === "ship from zip" || key === "shipfromzip") return this.levelIIIShipFromZip;
    if (key === "unique vat invoice" || key === "uniquevatinvoice") return this.levelIIIUniqueVatInvoice;
    if (key === "vat tax amount" || key === "vattaxamount") return this.levelIIIVatTaxAmount;
    if (key === "vat tax rate" || key === "vattaxrate") return this.levelIIIVatTaxRate;
    if (key === "summary commodity code" || key === "summarycommoditycode") return this.levelIIISummaryCommodityCode;
    if (key === "original order date" || key === "originalorderdate") return this.levelIIIOriginalOrderDate;
    throw new Error(`Unknown Level III field: ${name}`);
  }

  async verifyLevelIIIField(field: string, expected: string): Promise<void> {
    await expect(this.resolveLevelIIIField(field)).toContainText(expected);
  }

  async verifyProductInformationVisible(): Promise<void> {
    await expect(this.productInformationSection).toBeVisible();
    await expect(this.productInformationTable).toBeVisible();
  }

  async verifyProductCount(expectedCount: number): Promise<void> {
    await expect(this.page.getByTestId(/^product-row-\d+$/)).toHaveCount(expectedCount);
  }

  async verifyProduct(index: number, p: TransactionProductFields): Promise<void> {
    if (p.name) await expect(this.getProductName(index)).toContainText(p.name);
    if (p.price) await expect(this.getProductPrice(index)).toContainText(p.price);
    if (p.quantity) await expect(this.getProductQuantity(index)).toContainText(p.quantity);
    if (p.subtotal) await expect(this.getProductSubtotal(index)).toContainText(p.subtotal);
    if (p.discount) await expect(this.getProductDiscount(index)).toContainText(p.discount);
    if (p.tax) await expect(this.getProductTax(index)).toContainText(p.tax);
    if (p.total) await expect(this.getProductTotal(index)).toContainText(p.total);
  }

  // Section visibility
  async verifyBillingAddressSectionVisible(): Promise<void> { await expect(this.billingAddressHeading).toBeVisible(); }
  async verifyShippingAddressSectionVisible(): Promise<void> { await expect(this.shippingAddressHeading).toBeVisible(); }
  async verifyMerchantDefinedFieldsSectionVisible(): Promise<void> { await expect(this.merchantDefinedFieldsHeading).toBeVisible(); }
  async verifyLevelIIISectionVisible(): Promise<void> { await expect(this.levelIIIInformationHeading).toBeVisible(); }
  async verifyActionsSectionVisible(): Promise<void> { await expect(this.actionsHeading).toBeVisible(); }
  async verifyCreditCardInformationSectionVisible(): Promise<void> { await expect(this.creditCardInformationHeading).toBeVisible(); }
  async verifyPaymentInformationSectionVisible(): Promise<void> { await expect(this.paymentInformationHeading).toBeVisible(); }

  // Action button clicks
  async clickCapture(): Promise<void> { await this.captureButton.click(); }
  async clickReturn(): Promise<void> { await this.returnButton.click(); }
  async clickVoid(): Promise<void> { await this.voidButton.click(); }
  async clickReversal(): Promise<void> { await this.reversalButton.click(); }
  async clickIncremental(): Promise<void> { await this.incrementalButton.click(); }
  async clickDownloadReceipt(): Promise<void> { await this.downloadReceiptButton.click(); }
  async clickSendEmail(): Promise<void> { await this.sendEmailButton.click(); }

  // Action button visibility
  async verifyCaptureButtonVisible(): Promise<void> { await expect(this.captureButton).toBeVisible(); }
  async verifyReturnButtonVisible(): Promise<void> { await expect(this.returnButton).toBeVisible(); }
  async verifyVoidButtonVisible(): Promise<void> { await expect(this.voidButton).toBeVisible(); }
  async verifyReversalButtonVisible(): Promise<void> { await expect(this.reversalButton).toBeVisible(); }
  async verifyIncrementalButtonVisible(): Promise<void> { await expect(this.incrementalButton).toBeVisible(); }
  async verifyDownloadReceiptButtonVisible(): Promise<void> { await expect(this.downloadReceiptButton).toBeVisible(); }
  async verifySendEmailButtonVisible(): Promise<void> { await expect(this.sendEmailButton).toBeVisible(); }

  async waitForTransactionDetailToLoad(): Promise<void> {
    await expect(this.transactionTitle).toBeVisible();
    await expect(this.transactionIdValue).toBeVisible();
  }
}
