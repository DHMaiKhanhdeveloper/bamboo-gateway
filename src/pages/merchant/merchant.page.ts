import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";

export type AccountType = "R" | "D" | "E";
export type DDAAccountType = "C" | "S";

export interface MerchantInfoData {
  merchantName: string;
  accountType?: AccountType;
  country?: string;
  timezone: string;
  batchCloseTime?: string;
  ddaAccountType?: DDAAccountType;
  categorySearch?: string;
  categoryName: string;
}

export interface ContactInfoData {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
}

export interface BusinessInfoData {
  phone: string;
  state: string;
  city: string;
  zipCode: string;
  areaCode: string;
  address: string;
}

export interface TerminalInfoData {
  name: string;
  status: string;
  device: string;
  serialNumber?: string;
}

export interface TSYSProcessorInfoData {
  mid: string;
  terminalNumber: string;
  bin: string;
  vNumber: string;
  agent: string;
  chain: string;
  storeNumber: string;
  debitSharingGroup: string;
  debitSettlementAgentNumber?: string;
  device: string;
  debitReimbursementAttribute: string;
  debitAmericanBankers?: string;
}

export class MerchantPage extends BasePage {
  protected override get urlPath(): string { return "/merchants"; }
  protected override readyLocator(): Locator {
    return this.page.getByRole("heading", { name: "Merchants" });
  }

  // ---------------------------------------------------------------------------
  // Merchant info locators
  // ---------------------------------------------------------------------------
  get merchantNameInput(): Locator { return this.page.getByTestId("merchant-name-input"); }
  get accountDropdown(): Locator { return this.page.getByTestId("account-type-select"); }
  get countryDropdown(): Locator { return this.page.getByTestId("countryCode"); }
  get timezoneDropdown(): Locator { return this.page.getByTestId("timezone"); }
  get batchCloseTimeInput(): Locator { return this.page.getByTestId("batch-close-time-input"); }
  get demandDepositAccountDropdown(): Locator { return this.page.getByTestId("dda-account-type-select"); }
  get categoryDropdown(): Locator { return this.page.getByTestId("categoryCode"); }

  // Contact
  get contactNameInput(): Locator { return this.page.getByTestId("conName-input"); }
  get contactPhoneInput(): Locator { return this.page.getByTestId("conPhone"); }
  get contactEmailInput(): Locator { return this.page.getByTestId("conEmail-input"); }
  get contactCityInput(): Locator { return this.page.getByTestId("conCity"); }
  get contactStateDropdown(): Locator { return this.page.getByTestId("conState"); }
  get contactZipCodeInput(): Locator { return this.page.getByTestId("conZip"); }
  get contactAddressInput(): Locator { return this.page.getByTestId("conAddress"); }

  // Business
  get businessPhoneInput(): Locator { return this.page.getByTestId("businessPhone"); }
  get businessStateDropdown(): Locator { return this.page.getByTestId("businessState"); }
  get businessCityInput(): Locator { return this.page.getByTestId("businessCity"); }
  get businessZipCodeInput(): Locator { return this.page.getByTestId("businessZip"); }
  get businessAreaCodeInput(): Locator { return this.page.getByTestId("businessAreaCode-input"); }
  get businessAddressInput(): Locator { return this.page.getByTestId("businessAddress"); }

  // Terminal
  get terminalNameInput(): Locator { return this.page.getByTestId("terminals-form-name"); }
  get terminalStatusDropdown(): Locator { return this.page.getByTestId("terminals-form-status"); }
  get terminalDeviceDropdown(): Locator { return this.page.getByTestId("terminals-form-device"); }
  get terminalSerialNumberInput(): Locator { return this.page.getByTestId("terminals-form-serial-number"); }

  processorDropdown(terminalIndex: number = 0, processorIndex: number = 0): Locator {
    return this.page.locator(
      `button[name="terminals[${terminalIndex}].processorSettings[${processorIndex}].config.processor"]`
    );
  }

  // TSYS processor
  get midInput(): Locator { return this.page.getByRole("textbox", { name: "MID" }); }
  get terminalNumberInput(): Locator { return this.page.getByRole("textbox", { name: "Terminal #" }); }
  get binInput(): Locator { return this.page.getByRole("textbox", { name: "BIN" }); }
  get vNumberInput(): Locator { return this.page.getByPlaceholder("VNumber"); }
  get agentInput(): Locator { return this.page.getByRole("textbox", { name: "Agent", exact: true }); }
  get chainInput(): Locator { return this.page.getByRole("textbox", { name: "Chain" }); }
  get storeNumberInput(): Locator { return this.page.getByPlaceholder("Store Number"); }
  get debitSharingGroupInput(): Locator { return this.page.getByRole("textbox", { name: "Debit Sharing Group" }); }
  get debitSettlementAgentNumberInput(): Locator { return this.page.getByPlaceholder("Debit Settlement Agent Number"); }
  get tsysDeviceDropdown(): Locator { return this.page.locator("button", { hasText: "- Select Device" }); }
  get debitAmericanBankersAssociationNumberInput(): Locator { return this.page.getByPlaceholder("Debit American Bankers"); }

  debitReimbursementAttributeDropdown(terminalIndex: number = 0, processorIndex: number = 0): Locator {
    return this.page.locator(
      `button[name="terminals[${terminalIndex}].processorSettings[${processorIndex}].config.debitReimbursAtt"]`
    );
  }

  // Home screen / settings
  get dualPricingSwitch(): Locator { return this.page.getByRole("switch", { name: "Dual Pricing" }); }
  get cashDiscountPercentageInput(): Locator { return this.page.getByRole("spinbutton", { name: "Cash Discount Percentage" }); }
  get enteredAmountModeDropdown(): Locator { return this.page.getByRole("combobox", { name: "Entered Amount Mode" }); }
  get resellerAccountCombobox(): Locator { return this.page.getByRole("combobox", { name: "Find a reseller" }); }

  // Switches
  get demoMerchantSwitch(): Locator { return this.page.getByTestId("demo-merchant-switch"); }
  get needAgreementSwitch(): Locator { return this.page.getByTestId("need-agreement-switch"); }
  get allowDeferredAuthorizationSwitch(): Locator { return this.page.getByTestId("allow-deferred-authorization-switch"); }
  get allowPartialsSwitch(): Locator { return this.page.getByTestId("allow-partials-switch"); }
  get enabledMerchantSwitch(): Locator { return this.page.getByTestId("enabled-merchant-switch"); }
  get allowDuplicatesSwitch(): Locator { return this.page.getByTestId("allow-duplicates-switch"); }
  get allowPcLvl3Switch(): Locator { return this.page.getByTestId("allow-pc-lvl3-switch"); }
  get manualCloseSwitch(): Locator { return this.page.getByTestId("manual-close-switch"); }

  // Navigation
  get merchantsLink(): Locator { return this.page.getByRole("link", { name: "Merchants" }); }
  get newMerchantLink(): Locator { return this.page.getByRole("link", { name: "New Merchant" }); }

  // Buttons
  get createMerchantButton(): Locator { return this.page.getByRole("button", { name: "Create Merchant" }); }
  get addProcessorButton(): Locator { return this.page.getByRole("button", { name: "Add Processor" }); }
  get viewDetailsButton(): Locator { return this.page.getByRole("button", { name: "View Details" }); }
  get confirmTerminalDetailsButton(): Locator { return this.page.getByRole("button", { name: "Yes, I want" }); }
  get editProcessorButton(): Locator { return this.page.getByRole("button", { name: "Edit" }); }
  get searchMerchantAccountIdInput(): Locator { return this.page.getByRole("combobox", { name: "Filter by Merchant Account ID" }); }
  get merchantAccountIdInput(): Locator { return this.page.getByRole("textbox", { name: "Search merchant account id" }); }
  get applyFilterButton(): Locator { return this.page.getByRole("button", { name: "Apply" }); }

  deleteProcessorButton(processorName: string): Locator {
    return this.page.locator("div").filter({ hasText: new RegExp(`^${processorName}`) }).getByRole("button");
  }

  // ---------------------------------------------------------------------------
  // Navigation actions
  // ---------------------------------------------------------------------------
  async gotoAddMerchant(): Promise<void> {
    await this.page.goto("/merchants/add");
    await expect(this.page.getByRole("heading", { name: "Add Merchant" })).toBeVisible();
  }

  async gotoMerchantsList(): Promise<void> {
    await this.page.goto("/merchants");
    await expect(this.page.getByRole("heading", { name: "Merchants" })).toBeVisible();
  }

  async clickMerchantsLink(): Promise<void> { await this.merchantsLink.click(); }

  async clickNewMerchantLink(): Promise<void> {
    await this.newMerchantLink.click();
    await expect(this.page.getByRole("heading", { name: "Add Merchant" })).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Processor management
  // ---------------------------------------------------------------------------
  async addProcessor(): Promise<void> { await this.addProcessorButton.click(); }
  async deleteProcessor(processorName: string): Promise<void> { await this.deleteProcessorButton(processorName).click(); }

  async selectDropdownOption(dropdownLocator: Locator, optionText: string): Promise<void> {
    await dropdownLocator.click();
    const option = this.page.getByRole("option", { name: optionText }).first();
    await option.waitFor({ state: "visible" });
    await option.click();
  }

  // Verifications for popups
  async verifyPopupTerminal(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Information for redirecting" })).toBeVisible();
  }

  async verifyTerminalDetails(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Terminal Details" })).toBeVisible();
  }

  async verifyEditTerminalDetails(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Edit Terminal" })).toBeVisible();
  }

  async verifyProcessorDetails(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Processor Settings" })).toBeVisible();
  }

  async gotoTerminalDetails(): Promise<void> {
    await this.viewDetailsButton.click();
    await this.verifyPopupTerminal();
    await this.confirmTerminalDetailsButton.click();
    await this.verifyEditTerminalDetails();
  }

  async clickEditTerminalDetails(): Promise<void> {
    await this.editProcessorButton.click();
    await this.verifyProcessorDetails();
  }

  async clickConfirmTerminalDetails(): Promise<void> { await this.confirmTerminalDetailsButton.click(); }

  // ---------------------------------------------------------------------------
  // Account type helpers
  // ---------------------------------------------------------------------------
  async selectAccountType(accountType: AccountType): Promise<void> {
    await this.accountDropdown.click();
    await this.page.getByTestId(`account-type-option-${accountType}`).click();
  }

  async selectDDAAccountType(accountType: DDAAccountType): Promise<void> {
    await this.demandDepositAccountDropdown.click();
    await this.page.getByTestId(`dda-account-type-option-${accountType}`).click();
  }

  async searchAndSelectCombobox(comboboxLocator: Locator, searchText: string, optionText?: string): Promise<void> {
    await comboboxLocator.click();
    const searchInput = this.page.getByRole("combobox", { expanded: true }).last();
    await searchInput.fill(searchText);
    const target = optionText ?? searchText;
    await this.page.getByRole("option").filter({ hasText: target }).first().click();
  }

  // ---------------------------------------------------------------------------
  // Composite filling
  // ---------------------------------------------------------------------------
  async fillMerchantInfo(data: MerchantInfoData): Promise<void> {
    await this.merchantNameInput.fill(data.merchantName);
    if (data.accountType) await this.selectAccountType(data.accountType);
    if (data.country) await this.selectDropdownOption(this.countryDropdown, data.country);
    await this.selectDropdownOption(this.timezoneDropdown, data.timezone);

    if (data.batchCloseTime) {
      await this.batchCloseTimeInput.click();
      await this.page.keyboard.press("Control+a");
      await this.batchCloseTimeInput.fill(data.batchCloseTime);
    }

    if (data.ddaAccountType) await this.selectDDAAccountType(data.ddaAccountType);

    if (data.categorySearch) {
      await this.searchAndSelectCombobox(this.categoryDropdown, data.categorySearch, data.categoryName);
    } else {
      await this.selectDropdownOption(this.categoryDropdown, data.categoryName);
    }
  }

  async fillContactInfo(data: ContactInfoData): Promise<void> {
    await this.contactNameInput.fill(data.name);
    await this.contactPhoneInput.fill(data.phone);
    await this.contactEmailInput.fill(data.email);
    await this.contactCityInput.fill(data.city);
    await this.selectDropdownOption(this.contactStateDropdown, data.state);
    await this.contactZipCodeInput.fill(data.zipCode);
    await this.contactAddressInput.fill(data.address);
  }

  async fillBusinessInfo(data: BusinessInfoData): Promise<void> {
    await this.businessPhoneInput.fill(data.phone);
    await this.selectDropdownOption(this.businessStateDropdown, data.state);
    await this.businessCityInput.fill(data.city);
    await this.businessZipCodeInput.fill(data.zipCode);
    await this.businessAreaCodeInput.fill(data.areaCode);
    await this.businessAddressInput.fill(data.address);
  }

  async fillTerminalInfo(data: TerminalInfoData): Promise<void> {
    await this.selectDropdownOption(this.terminalDeviceDropdown, data.device);
    await this.selectDropdownOption(this.terminalStatusDropdown, data.status);
    if (data.serialNumber && data.device !== "Virtual") {
      await this.terminalSerialNumberInput.fill(data.serialNumber);
    }
    await this.terminalNameInput.fill(data.name);
  }

  async fillTSYSProcessorInfo(
    data: TSYSProcessorInfoData,
    terminalIndex: number = 0,
    processorIndex: number = 0
  ): Promise<void> {
    await this.selectDropdownOption(this.processorDropdown(terminalIndex, processorIndex), "TSYS");
    await this.midInput.waitFor({ state: "visible" });

    await this.midInput.fill(data.mid);
    await this.terminalNumberInput.fill(data.terminalNumber);
    await this.binInput.fill(data.bin);
    await this.vNumberInput.fill(data.vNumber);
    await this.agentInput.fill(data.agent);
    await this.chainInput.fill(data.chain);
    await this.storeNumberInput.fill(data.storeNumber);
    await this.debitSharingGroupInput.fill(data.debitSharingGroup);
    await this.debitSettlementAgentNumberInput.fill(data.debitSettlementAgentNumber ?? "");
    await this.selectDropdownOption(
      this.debitReimbursementAttributeDropdown(terminalIndex, processorIndex),
      data.debitReimbursementAttribute
    );
    await this.debitAmericanBankersAssociationNumberInput.fill(data.debitAmericanBankers ?? "");
  }

  // ---------------------------------------------------------------------------
  // Reseller
  // ---------------------------------------------------------------------------
  async selectReseller(resellerName: string): Promise<void> {
    await this.resellerAccountCombobox.click();
    await this.page.getByRole("option").filter({ hasText: resellerName }).first().click();
  }

  async selectFirstReseller(): Promise<void> {
    await this.resellerAccountCombobox.click();
    await this.page.getByRole("option").first().click();
  }

  async enableAllToggleOptions(): Promise<void> {
    await this.allowDeferredAuthorizationSwitch.click();
    await this.allowPartialsSwitch.click();
    await this.manualCloseSwitch.click();
    await this.allowPcLvl3Switch.click();
    await this.allowDuplicatesSwitch.click();
  }

  async submitMerchantForm(): Promise<void> { await this.createMerchantButton.click(); }

  // ---------------------------------------------------------------------------
  // Verifications
  // ---------------------------------------------------------------------------
  async verifyCreationSuccess(): Promise<void> {
    const toast = this.page.locator("[data-sonner-toast]").filter({
      hasText: "The merchant has been created successfully",
    });
    await expect(toast).toBeVisible();
  }

  async verifyFieldError(errorMessage: string): Promise<void> {
    await expect(this.page.getByText(errorMessage)).toBeVisible();
  }

  async verifyOnEditPage(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Edit Merchant" })).toBeVisible();
  }

  async verifyMerchantInfoFields(data: {
    merchantName: string;
    accountType?: AccountType;
    timezone?: string;
    batchCloseTime?: string;
    ddaAccountType?: DDAAccountType;
    categoryName?: string;
  }): Promise<void> {
    if (data.merchantName) await expect(this.merchantNameInput).toHaveValue(data.merchantName);
    if (data.accountType) {
      const map: Record<AccountType, string> = { R: "Restaurant", D: "Direct", E: "Enterprise" };
      await expect(this.accountDropdown).toContainText(map[data.accountType]);
    }
    if (data.timezone) await expect(this.timezoneDropdown).toContainText(data.timezone);
    if (data.batchCloseTime) await expect(this.batchCloseTimeInput).toHaveValue(data.batchCloseTime);
    if (data.ddaAccountType) {
      const map: Record<DDAAccountType, string> = { C: "Checking", S: "Savings" };
      await expect(this.demandDepositAccountDropdown).toContainText(map[data.ddaAccountType]);
    }
    if (data.categoryName) await expect(this.categoryDropdown).toContainText(data.categoryName);
  }

  async verifyContactInfoFields(data: {
    name: string; phone: string; email: string; city: string; state?: string; zipCode: string; address: string;
  }): Promise<void> {
    await expect(this.contactNameInput).toHaveValue(data.name);
    await expect(this.contactPhoneInput).toHaveValue(data.phone);
    await expect(this.contactEmailInput).toHaveValue(data.email);
    await expect(this.contactCityInput).toHaveValue(data.city);
    await expect(this.contactZipCodeInput).toHaveValue(data.zipCode);
    await expect(this.contactAddressInput).toHaveValue(data.address);
  }

  async verifyBusinessInfoFields(data: {
    phone: string; city: string; zipCode: string; areaCode: string; address: string;
  }): Promise<void> {
    await expect(this.businessPhoneInput).toHaveValue(data.phone);
    await expect(this.businessCityInput).toHaveValue(data.city);
    await expect(this.businessZipCodeInput).toHaveValue(data.zipCode);
    await expect(this.businessAreaCodeInput).toHaveValue(data.areaCode);
    await expect(this.businessAddressInput).toHaveValue(data.address);
  }

  async verifyTerminalInfoFields(data: TerminalInfoData): Promise<void> {
    await expect(this.terminalNameInput).toHaveValue(data.name);
    await expect(this.terminalStatusDropdown).toContainText(data.status);
    await expect(this.terminalDeviceDropdown).toContainText(data.device);
    if (data.serialNumber && data.device !== "Virtual") {
      await expect(this.terminalSerialNumberInput).toHaveValue(data.serialNumber);
    }
  }

  async verifyTSYSProcessorInfoFields(data: {
    mid: string; terminalNumber: string; bin: string; vNumber: string; agent: string; chain: string;
    storeNumber: string; debitSharingGroup: string; debitSettlementAgentNumber?: string; debitAmericanBankers?: string;
  }): Promise<void> {
    await expect(this.midInput).toHaveValue(data.mid);
    await expect(this.terminalNumberInput).toHaveValue(data.terminalNumber);
    await expect(this.binInput).toHaveValue(data.bin);
    await expect(this.vNumberInput).toHaveValue(data.vNumber);
    await expect(this.agentInput).toHaveValue(data.agent);
    await expect(this.chainInput).toHaveValue(data.chain);
    await expect(this.storeNumberInput).toHaveValue(data.storeNumber);
    await expect(this.debitSharingGroupInput).toHaveValue(data.debitSharingGroup);
    if (data.debitSettlementAgentNumber) {
      await expect(this.debitSettlementAgentNumberInput).toHaveValue(data.debitSettlementAgentNumber);
    }
    if (data.debitAmericanBankers) {
      await expect(this.debitAmericanBankersAssociationNumberInput).toHaveValue(data.debitAmericanBankers);
    }
  }

  async verifyResellerInfo(resellerName: string): Promise<void> {
    await expect(this.resellerAccountCombobox).toContainText(resellerName);
  }

  async verifyAdditionalSettings(): Promise<void> {
    await expect(this.demoMerchantSwitch).toBeChecked();
    await expect(this.enabledMerchantSwitch).toBeChecked();
    await expect(this.allowDuplicatesSwitch).toBeChecked();
    await expect(this.allowDeferredAuthorizationSwitch).toBeChecked();
    await expect(this.allowPcLvl3Switch).toBeChecked();
    await expect(this.allowPartialsSwitch).toBeChecked();
    await expect(this.manualCloseSwitch).toBeChecked();
  }

  // ---------------------------------------------------------------------------
  // URL / search helpers
  // ---------------------------------------------------------------------------
  async getMerchantIdFromURL(): Promise<string> {
    const url = this.page.url();
    const match = url.match(/\/merchants\/([a-f0-9-]+)/);
    if (!match?.[1]) throw new Error(`Could not extract merchant ID from URL: ${url}`);
    return match[1];
  }

  async verifyMerchantIdExists(merchantId: string): Promise<boolean> {
    return new RegExp(`/merchants/${merchantId}`).test(this.page.url());
  }

  async searchMerchantById(merchantId: string): Promise<void> {
    await this.searchMerchantAccountIdInput.click();
    await this.merchantAccountIdInput.click();
    await this.merchantAccountIdInput.fill(merchantId);
    await this.applyFilterButton.click();
  }

  async isMerchantInSearchResults(merchantId: string): Promise<boolean> {
    try {
      const noData = this.page.getByText("No data found");
      if (await noData.isVisible()) return false;
      const row = this.page.locator("table").locator(`text=${merchantId}`).first();
      return row.isVisible();
    } catch (err) {
      this.log.warn("Error checking merchant results", err);
      return false;
    }
  }

  async verifyMerchantExistsInSystem(merchantId: string): Promise<boolean> {
    this.log.info(`Checking merchant ${merchantId} in system`);
    await this.gotoMerchantsList();
    await this.searchMerchantById(merchantId);
    const exists = await this.isMerchantInSearchResults(merchantId);
    this.log.info(exists ? `Merchant ${merchantId} found` : `Merchant ${merchantId} NOT found`);
    return exists;
  }
}
