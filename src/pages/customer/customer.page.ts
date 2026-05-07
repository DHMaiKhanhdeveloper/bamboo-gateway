import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";

export interface CustomerInfoData {
  customerId?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
}

export interface PaymentInfoData {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface AddressData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface BillingAddressData extends AddressData {
  email: string;
}

export interface ShippingAddressData extends AddressData {
  sameAsBilling?: boolean;
}

export interface CustomerFormData {
  customerInfo?: CustomerInfoData;
  paymentInfo: PaymentInfoData;
  billingAddress: BillingAddressData;
  shippingAddress?: ShippingAddressData;
}

export class CustomerPage extends BasePage {
  protected override get urlPath(): string { return "/customers/add"; }
  protected override readyLocator(): Locator { return this.addCustomerHeading; }

  // ---------------------------------------------------------------------------
  // Locators
  // ---------------------------------------------------------------------------
  get addCustomerHeading(): Locator { return this.page.getByRole("heading", { name: "Add New Customer" }); }
  get customerIdInput(): Locator { return this.page.getByTestId("add-customer-customer-id-input"); }
  get firstNameInput(): Locator { return this.page.getByTestId("add-customer-first-name-input"); }
  get lastNameInput(): Locator { return this.page.getByTestId("add-customer-last-name-input"); }
  get descriptionTextarea(): Locator { return this.page.getByTestId("add-customer-description-textarea"); }
  get cardNumberInput(): Locator { return this.page.getByTestId("add-customer-card-number-input"); }
  get expMonthInput(): Locator { return this.page.getByTestId("add-customer-exp-month-input"); }
  get expYearInput(): Locator { return this.page.getByTestId("add-customer-exp-year-input"); }
  get cvvInput(): Locator { return this.page.getByTestId("add-customer-cvv-input"); }
  get sameAsBillingCheckbox(): Locator { return this.page.getByTestId("add-customer-is-same-as-billing-checkbox"); }
  get submitButton(): Locator { return this.page.getByTestId("add-customer-submit-button"); }
  get addCustomerButton(): Locator { return this.page.getByRole("button", { name: "Add Customer" }); }

  // Billing address fields
  getBillingFirstNameInput(): Locator { return this.page.getByTestId("add-customer-billing-first-name-input"); }
  getBillingLastNameInput(): Locator { return this.page.getByTestId("add-customer-billing-last-name-input"); }
  getBillingPhoneInput(): Locator { return this.page.getByTestId("add-customer-billing-phone-input"); }
  getBillingEmailInput(): Locator { return this.page.getByTestId("add-customer-billing-email-input"); }
  getBillingCompanyInput(): Locator { return this.page.getByTestId("add-customer-billing-company-input"); }
  getBillingAddress1Input(): Locator { return this.page.getByTestId("add-customer-billing-address1-input"); }
  getBillingAddress2Input(): Locator { return this.page.getByTestId("add-customer-billing-address2-input"); }
  getBillingCountrySelect(): Locator { return this.page.getByTestId("add-customer-billing-country-select"); }
  getBillingCityInput(): Locator { return this.page.getByTestId("add-customer-billing-city-input"); }
  getBillingStateInput(): Locator { return this.page.getByTestId("add-customer-billing-state-input"); }
  getBillingStateSelect(): Locator { return this.page.getByTestId("add-customer-billing-state-select"); }
  getBillingZipInput(): Locator { return this.page.getByTestId("add-customer-billing-zip-input"); }

  // Shipping address fields
  getShippingFirstNameInput(): Locator { return this.page.getByTestId("add-customer-shipping-first-name-input"); }
  getShippingLastNameInput(): Locator { return this.page.getByTestId("add-customer-shipping-last-name-input"); }
  getShippingPhoneInput(): Locator { return this.page.getByTestId("add-customer-shipping-phone-input"); }
  getShippingEmailInput(): Locator { return this.page.getByTestId("add-customer-shipping-email-input"); }
  getShippingCompanyInput(): Locator { return this.page.getByTestId("add-customer-shipping-company-input"); }
  getShippingAddress1Input(): Locator { return this.page.getByTestId("add-customer-shipping-address1-input"); }
  getShippingAddress2Input(): Locator { return this.page.getByTestId("add-customer-shipping-address2-input"); }
  getShippingCountrySelect(): Locator { return this.page.getByTestId("add-customer-shipping-country-select"); }
  getShippingCityInput(): Locator { return this.page.getByTestId("add-customer-shipping-city-input"); }
  getShippingStateInput(): Locator { return this.page.getByTestId("add-customer-shipping-state-input"); }
  getShippingStateSelect(): Locator { return this.page.getByTestId("add-customer-shipping-state-select"); }
  getShippingZipInput(): Locator { return this.page.getByTestId("add-customer-shipping-zip-input"); }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  async gotoAddCustomer(merchantId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/customers/add`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await expect(this.addCustomerHeading).toBeVisible({ timeout: 10_000 });
  }

  // ---------------------------------------------------------------------------
  // Customer info
  // ---------------------------------------------------------------------------
  async fillCustomerId(customerId: string): Promise<void> { await this.customerIdInput.fill(customerId); }
  async fillFirstName(firstName: string): Promise<void> { await this.firstNameInput.fill(firstName); }
  async fillLastName(lastName: string): Promise<void> { await this.lastNameInput.fill(lastName); }
  async fillDescription(description: string): Promise<void> { await this.descriptionTextarea.fill(description); }

  // ---------------------------------------------------------------------------
  // Payment info
  // ---------------------------------------------------------------------------
  async fillCardNumber(cardNumber: string): Promise<void> { await this.cardNumberInput.fill(cardNumber); }
  async fillExpMonth(expMonth: string): Promise<void> { await this.expMonthInput.fill(expMonth); }
  async fillExpYear(expYear: string): Promise<void> { await this.expYearInput.fill(expYear); }
  async fillCvv(cvv: string): Promise<void> { await this.cvvInput.fill(cvv); }

  // ---------------------------------------------------------------------------
  // Billing address
  // ---------------------------------------------------------------------------
  async fillBillingFirstName(v: string): Promise<void> { await this.getBillingFirstNameInput().fill(v); }
  async fillBillingLastName(v: string): Promise<void> { await this.getBillingLastNameInput().fill(v); }
  async fillBillingPhone(v: string): Promise<void> { await this.getBillingPhoneInput().fill(v); }
  async fillBillingEmail(v: string): Promise<void> { await this.getBillingEmailInput().fill(v); }
  async fillBillingCompany(v: string): Promise<void> { await this.getBillingCompanyInput().fill(v); }
  async fillBillingAddress1(v: string): Promise<void> { await this.getBillingAddress1Input().fill(v); }
  async fillBillingAddress2(v: string): Promise<void> { await this.getBillingAddress2Input().fill(v); }
  async fillBillingCity(v: string): Promise<void> { await this.getBillingCityInput().fill(v); }
  async fillBillingZip(v: string): Promise<void> { await this.getBillingZipInput().fill(v); }

  async selectBillingCountry(countryName: string): Promise<void> {
    await this.selectCountry("billing", countryName);
  }

  async fillBillingState(state: string): Promise<void> {
    await this.fillStateField("billing", state);
  }

  // ---------------------------------------------------------------------------
  // Shipping address
  // ---------------------------------------------------------------------------
  async setSameAsBilling(checked: boolean): Promise<void> {
    const isChecked = await this.sameAsBillingCheckbox.isChecked();
    if (checked !== isChecked) {
      await this.sameAsBillingCheckbox.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async fillShippingFirstName(v: string): Promise<void> { await this.getShippingFirstNameInput().fill(v); }
  async fillShippingLastName(v: string): Promise<void> { await this.getShippingLastNameInput().fill(v); }
  async fillShippingPhone(v: string): Promise<void> { await this.getShippingPhoneInput().fill(v); }
  async fillShippingEmail(v: string): Promise<void> { await this.getShippingEmailInput().fill(v); }
  async fillShippingCompany(v: string): Promise<void> { await this.getShippingCompanyInput().fill(v); }
  async fillShippingAddress1(v: string): Promise<void> { await this.getShippingAddress1Input().fill(v); }
  async fillShippingAddress2(v: string): Promise<void> { await this.getShippingAddress2Input().fill(v); }
  async fillShippingCity(v: string): Promise<void> { await this.getShippingCityInput().fill(v); }
  async fillShippingZip(v: string): Promise<void> { await this.getShippingZipInput().fill(v); }

  async selectShippingCountry(countryName: string): Promise<void> {
    await this.selectCountry("shipping", countryName);
  }

  async fillShippingState(state: string): Promise<void> {
    await this.fillStateField("shipping", state);
  }

  // ---------------------------------------------------------------------------
  // Internal: shared country/state logic
  // ---------------------------------------------------------------------------
  private async selectCountry(scope: "billing" | "shipping", countryName: string): Promise<void> {
    const combo = this.page.getByTestId(`add-customer-${scope}-country-select`);
    await combo.click();
    const search = this.page.getByPlaceholder("Find a country");
    await expect(search).toBeVisible({ timeout: 2_000 });
    const term = (countryName.split("(")[0] ?? countryName).trim().split(" ")[0] ?? countryName;
    await search.fill(term);
    await this.page.waitForTimeout(500);
    const escaped = countryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await this.page
      .getByRole("option", { name: new RegExp(`.*${escaped}.*`, "i") })
      .click({ timeout: 2_000 });
    await this.page.waitForTimeout(500);
    const display = (countryName.split("(")[0] ?? countryName).trim();
    await expect(combo).toContainText(new RegExp(display, "i"));
  }

  private async fillStateField(scope: "billing" | "shipping", state: string): Promise<void> {
    const select = scope === "billing" ? this.getBillingStateSelect() : this.getShippingStateSelect();
    const input = scope === "billing" ? this.getBillingStateInput() : this.getShippingStateInput();
    const isSelectVisible = await select.isVisible({ timeout: 1_000 }).catch(() => false);
    if (isSelectVisible) {
      await select.click();
      await this.page.waitForTimeout(1_000);
      await this.page.getByRole("option", { name: state }).click({ timeout: 2_000 });
      await this.page.waitForTimeout(500);
    } else {
      await input.fill(state);
    }
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  async submitForm(): Promise<void> { await this.submitButton.click(); }
  async addCustomer(): Promise<void> { await this.addCustomerButton.click(); }

  // ---------------------------------------------------------------------------
  // Verifications
  // ---------------------------------------------------------------------------
  async verifyCustomerId(v: string): Promise<void> { await expect(this.customerIdInput).toHaveValue(v); }
  async verifyFirstName(v: string): Promise<void> { await expect(this.firstNameInput).toHaveValue(v); }
  async verifyLastName(v: string): Promise<void> { await expect(this.lastNameInput).toHaveValue(v); }
  async verifyDescription(v: string): Promise<void> { await expect(this.descriptionTextarea).toHaveValue(v); }

  async verifyCardNumber(expectedCardNumber: string): Promise<void> {
    const first4 = expectedCardNumber.substring(0, 4);
    const last4 = expectedCardNumber.substring(expectedCardNumber.length - 4);
    await expect(this.cardNumberInput).toHaveValue(new RegExp(`${first4}.*${last4}`));
  }

  async verifyExpMonth(v: string): Promise<void> { await expect(this.expMonthInput).toHaveValue(v); }
  async verifyExpYear(v: string): Promise<void> { await expect(this.expYearInput).toHaveValue(v); }
  async verifyCvv(v: string): Promise<void> { await expect(this.cvvInput).toHaveValue(v); }
  async verifyBillingFirstName(v: string): Promise<void> { await expect(this.getBillingFirstNameInput()).toHaveValue(v); }
  async verifyBillingLastName(v: string): Promise<void> { await expect(this.getBillingLastNameInput()).toHaveValue(v); }
  async verifyBillingEmail(v: string): Promise<void> { await expect(this.getBillingEmailInput()).toHaveValue(v); }

  async verifySameAsBilling(expected: boolean): Promise<void> {
    if (expected) await expect(this.sameAsBillingCheckbox).toBeChecked();
    else await expect(this.sameAsBillingCheckbox).not.toBeChecked();
  }

  // ---------------------------------------------------------------------------
  // Composite fill helpers
  // ---------------------------------------------------------------------------
  async fillCustomerInfo(data: CustomerInfoData): Promise<void> {
    if (data.customerId) await this.fillCustomerId(data.customerId);
    if (data.firstName) await this.fillFirstName(data.firstName);
    if (data.lastName) await this.fillLastName(data.lastName);
    if (data.description) await this.fillDescription(data.description);
  }

  async fillPaymentInfo(data: PaymentInfoData): Promise<void> {
    await this.fillCardNumber(data.cardNumber);
    await this.fillExpMonth(data.expMonth);
    await this.fillExpYear(data.expYear);
    await this.fillCvv(data.cvv);
  }

  async fillBillingAddress(data: BillingAddressData): Promise<void> {
    if (data.firstName) await this.fillBillingFirstName(data.firstName);
    if (data.lastName) await this.fillBillingLastName(data.lastName);
    if (data.phone) await this.fillBillingPhone(data.phone);
    if (data.email) await this.fillBillingEmail(data.email);
    if (data.company) await this.fillBillingCompany(data.company);
    if (data.address1) await this.fillBillingAddress1(data.address1);
    if (data.address2) await this.fillBillingAddress2(data.address2);
    if (data.country) await this.selectBillingCountry(data.country);
    if (data.city) await this.fillBillingCity(data.city);
    if (data.state) await this.fillBillingState(data.state);
    if (data.zip) await this.fillBillingZip(data.zip);
  }

  async fillShippingAddress(data: ShippingAddressData): Promise<void> {
    await this.setSameAsBilling(false);
    if (data.firstName) await this.fillShippingFirstName(data.firstName);
    if (data.lastName) await this.fillShippingLastName(data.lastName);
    if (data.phone) await this.fillShippingPhone(data.phone);
    if (data.email) await this.fillShippingEmail(data.email);
    if (data.company) await this.fillShippingCompany(data.company);
    if (data.address1) await this.fillShippingAddress1(data.address1);
    if (data.address2) await this.fillShippingAddress2(data.address2);
    if (data.country) await this.selectShippingCountry(data.country);
    if (data.city) await this.fillShippingCity(data.city);
    if (data.state) await this.fillShippingState(data.state);
    if (data.zip) await this.fillShippingZip(data.zip);
  }

  async fillCustomerForm(data: CustomerFormData): Promise<void> {
    if (data.customerInfo) await this.fillCustomerInfo(data.customerInfo);
    await this.fillPaymentInfo(data.paymentInfo);
    await this.fillBillingAddress(data.billingAddress);
    if (data.shippingAddress) {
      if (data.shippingAddress.sameAsBilling) {
        await this.setSameAsBilling(true);
      } else {
        await this.fillShippingAddress(data.shippingAddress);
      }
    }
  }
}
