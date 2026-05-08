import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";
import { getSelectedMerchantIdSync } from "~/config/env";

export interface ProcessorDetailsData {
  mid?: string;
  tid?: string;
  bin?: string;
  applicationId?: string;
  /** Older naming (terminal.page.ts) */
  deviceId?: string;
  /** Newer naming (terminal1.page.ts) */
  developerId?: string;
  vitalNumber?: string;
  agent?: string;
  chain?: string;
  locationNumber?: string;
  storeNumber?: string;
  debitSharingGroup?: string;
  debitSettlementAgentNumber?: string;
  debitReimbursementAttribute?: string;
  debitAmericanBankers?: string;
}

export interface TerminalFormData {
  device: string;
  name: string;
  /** Optional because some devices like Virtual don't have a serial number field */
  serialNumber?: string;
  processor?: string;
  processorDetails?: ProcessorDetailsData;
}

export interface MultipleProcessorEntry {
  processor: string;
  details: ProcessorDetailsData;
}

/**
 * Unified TerminalPage. Merges the old `terminal.page.ts` and `terminal1.page.ts`
 * — supports both the legacy `deviceId` ("Device ID *") and the newer
 * `developerId` ("Developer ID *") field names. Serial number is treated as
 * optional to handle the Virtual device flow.
 */
export class TerminalPage extends BasePage {
  protected override get urlPath(): string {
    return `/${getSelectedMerchantIdSync()}/terminals`;
  }

  protected override readyLocator(): Locator {
    return this.terminalsPageTitle;
  }

  // ---------------------------------------------------------------------------
  // List section
  // ---------------------------------------------------------------------------
  get terminalsPageTitle(): Locator {
    return this.page.getByRole("heading", { name: "Terminals" });
  }
  get newTerminalButton(): Locator {
    return this.page.getByRole("link", { name: "New Terminal" });
  }
  get terminalNameFilter(): Locator {
    return this.page.getByRole("combobox", { name: "Filter by Terminal Name" });
  }
  get serialNumberFilter(): Locator {
    return this.page.getByRole("combobox", { name: "Filter by Serial Number" });
  }
  get deviceFilter(): Locator {
    return this.page.getByRole("combobox", { name: "Filter by Device" });
  }
  get resetFiltersButton(): Locator {
    return this.page.getByRole("button", { name: "Reset filters" });
  }
  get terminalTable(): Locator {
    return this.page.getByRole("table");
  }
  get terminalRows(): Locator {
    return this.page.getByRole("row");
  }

  // ---------------------------------------------------------------------------
  // Add section
  // ---------------------------------------------------------------------------
  get addTerminalText(): Locator {
    return this.page.getByRole("heading", { name: "Add New Terminal" });
  }
  get deviceSelect(): Locator {
    return this.page.getByTestId("terminals-form-device");
  }
  get deviceSelectDetails(): Locator {
    return this.page.getByText("- Select Device");
  }
  get terminalNameInput(): Locator {
    return this.page.getByTestId("terminals-form-name");
  }
  get serialNumberInput(): Locator {
    return this.page.getByTestId("terminals-form-serial-number");
  }

  // Processor settings
  get processorSettingsHeading(): Locator {
    return this.page.getByRole("heading", { name: "Processor Settings" });
  }
  get addProcessorButton(): Locator {
    return this.page.getByRole("button", { name: "Add Processor" });
  }
  get processorSelect(): Locator {
    return this.page.getByRole("combobox", { name: "Processor *" });
  }
  get processorSearchInput(): Locator {
    return this.page.getByPlaceholder("Search processor...");
  }
  get midInput(): Locator {
    return this.page.getByRole("textbox", { name: "MID *" });
  }
  get tidInput(): Locator {
    return this.page.getByRole("textbox", { name: "TID *" });
  }
  get binInput(): Locator {
    return this.page.getByRole("textbox", { name: "BIN *" });
  }
  get applicationIdInput(): Locator {
    return this.page.getByRole("textbox", { name: "Application ID *" });
  }
  get deviceIdInput(): Locator {
    return this.page.getByRole("textbox", { name: "Device ID *" });
  }
  get developerIdInput(): Locator {
    return this.page.getByRole("textbox", { name: "Developer ID *" });
  }
  get vitalNumberInput(): Locator {
    return this.page.getByRole("textbox", { name: "Vital Number *" });
  }
  get agentInput(): Locator {
    return this.page.getByRole("textbox", { name: "Agent *" });
  }
  get chainInput(): Locator {
    return this.page.getByRole("textbox", { name: "Chain *" });
  }
  get locationNumberInput(): Locator {
    return this.page.getByRole("textbox", { name: "Location Number *" });
  }
  get storeNumberInput(): Locator {
    return this.page.getByRole("textbox", { name: "Store Number *" });
  }
  get debitSharingGroupInput(): Locator {
    return this.page.getByRole("textbox", { name: "Debit Sharing Group" });
  }
  get debitSettlementAgentNumberInput(): Locator {
    return this.page.getByRole("textbox", { name: "Debit Settlement Agent Number" });
  }
  get debitReimbursementAttributeSelect(): Locator {
    return this.page.getByRole("combobox", { name: "Debit Reimbursement Attribute" });
  }
  get debitAmericanBankersInput(): Locator {
    return this.page.getByRole("textbox", { name: "Debit American Bankers" });
  }
  get createTerminalButton(): Locator {
    return this.page.getByTestId("terminals-form-create-button");
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  async gotoTerminals(): Promise<void> {
    await this.page.goto(`/${getSelectedMerchantIdSync()}/terminals`);
    await expect(this.terminalsPageTitle).toBeVisible();
  }

  async gotoAddTerminal(): Promise<void> {
    await this.newTerminalButton.click();
    await expect(this.addTerminalText).toBeVisible();
  }

  async gotoAddTerminalDirect(): Promise<void> {
    await this.page.goto(`/${getSelectedMerchantIdSync()}/terminals/add`);
    await expect(this.addTerminalText).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------
  async filterByTerminalName(name: string): Promise<void> {
    await this.terminalNameFilter.click();
    await this.page.getByRole("textbox", { name: "Search terminal name" }).fill(name);
    await this.page.getByRole("button", { name: "Apply" }).first().click();
  }

  async filterBySerialNumber(serialNumber: string): Promise<void> {
    await this.serialNumberFilter.click();
    await this.page.getByRole("textbox", { name: "Search serial number" }).fill(serialNumber);
    await this.page.getByRole("button", { name: "Apply" }).first().click();
  }

  async filterByDevice(deviceName: string): Promise<void> {
    await this.deviceFilter.click();
    await this.page.getByText("DeviceSelect").click();
    await this.page.getByRole("option", { name: deviceName, exact: true }).click();
    await this.page.getByRole("button", { name: "Apply" }).first().click();
  }

  async resetFilters(): Promise<void> {
    await this.resetFiltersButton.click();
  }

  async selectDevice(deviceName: string): Promise<void> {
    await this.deviceSelect.click();
    await this.page.getByRole("option", { name: deviceName, exact: true }).click();
  }

  async selectDeviceDetails(deviceName: string): Promise<void> {
    await this.deviceSelectDetails.click();
    await this.page.getByRole("option", { name: deviceName, exact: true }).click();
  }

  async getAvailableDevices(): Promise<string[]> {
    await this.deviceSelect.click();
    const options = await this.page.getByRole("option").all();
    const names: string[] = [];
    for (const opt of options) {
      const text = await opt.textContent();
      if (text && text.trim() !== "") names.push(text.trim());
    }
    return names;
  }

  // ---------------------------------------------------------------------------
  // Processor management
  // ---------------------------------------------------------------------------
  async addProcessor(): Promise<void> {
    await this.addProcessorButton.click();
  }

  async selectProcessor(processorName: string, processorIndex: number = 0): Promise<void> {
    await this.page.getByRole("combobox", { name: "Processor *" }).nth(processorIndex).click();
    await this.page.getByRole("option", { name: processorName, exact: true }).click();
  }

  async selectProcessorDevice(deviceName: string, processorIndex: number = 0): Promise<void> {
    await this.page.getByRole("combobox", { name: "Device *" }).nth(processorIndex).click();
    await this.page.getByRole("option", { name: deviceName, exact: true }).click();
  }

  async selectDebitReimbursementAttribute(
    attribute: string,
    _processorIndex: number = 0
  ): Promise<void> {
    await this.page.getByRole("combobox", { name: "Debit Reimbursement Attribute" }).click();
    await this.page.getByRole("option", { name: attribute, exact: true }).click();
  }

  async searchProcessor(searchTerm: string, processorIndex: number = 0): Promise<void> {
    await this.page.getByRole("combobox", { name: "Processor *" }).nth(processorIndex).click();
    await this.processorSearchInput.fill(searchTerm);
  }

  async getAvailableProcessors(processorIndex: number = 0): Promise<string[]> {
    const selector = this.page.getByRole("combobox", { name: "Processor *" }).nth(processorIndex);
    await selector.click();
    const options = await this.page.getByRole("option").all();
    const names: string[] = [];
    for (const opt of options) {
      const text = await opt.textContent();
      if (text && text.trim() !== "") names.push(text.trim());
    }
    await selector.click();
    return names;
  }

  // ---------------------------------------------------------------------------
  // Form filling
  // ---------------------------------------------------------------------------
  async fillTerminalName(name: string): Promise<void> {
    await this.terminalNameInput.fill(name);
  }

  async fillSerialNumber(serialNumber?: string): Promise<void> {
    if (!serialNumber) return;
    const visible = await this.serialNumberInput.isVisible().catch(() => false);
    if (visible) await this.serialNumberInput.fill(serialNumber);
  }

  async fillProcessorDetails(
    data: ProcessorDetailsData,
    processorIndex: number = 0
  ): Promise<void> {
    const idx = (name: string) => this.page.getByRole("textbox", { name }).nth(processorIndex);
    if (data.mid) await idx("MID *").fill(data.mid);
    if (data.tid) await idx("TID *").fill(data.tid);
    if (data.bin) await idx("BIN *").fill(data.bin);
    if (data.applicationId)
      await this.page.getByRole("textbox", { name: "Application ID *" }).fill(data.applicationId);
    if (data.deviceId)
      await this.page.getByRole("textbox", { name: "Device ID *" }).fill(data.deviceId);
    if (data.developerId)
      await this.page.getByRole("textbox", { name: "Developer ID *" }).fill(data.developerId);
    if (data.vitalNumber)
      await this.page.getByRole("textbox", { name: "Vital Number *" }).fill(data.vitalNumber);
    if (data.agent) await this.page.getByRole("textbox", { name: "Agent *" }).fill(data.agent);
    if (data.chain) await this.page.getByRole("textbox", { name: "Chain *" }).fill(data.chain);
    if (data.locationNumber)
      await this.page.getByRole("textbox", { name: "Location Number *" }).fill(data.locationNumber);
    if (data.storeNumber)
      await this.page.getByRole("textbox", { name: "Store Number *" }).fill(data.storeNumber);
    if (data.debitSharingGroup)
      await this.page
        .getByRole("textbox", { name: "Debit Sharing Group" })
        .fill(data.debitSharingGroup);
    if (data.debitSettlementAgentNumber)
      await this.page
        .getByRole("textbox", { name: "Debit Settlement Agent Number" })
        .fill(data.debitSettlementAgentNumber);
    if (data.debitAmericanBankers)
      await this.page
        .getByRole("textbox", { name: "Debit American Bankers Association Number" })
        .fill(data.debitAmericanBankers);
  }

  async fillProcessorDetailsNoIndex(data: ProcessorDetailsData): Promise<void> {
    if (data.mid) await this.page.getByRole("textbox", { name: "MID *" }).fill(data.mid);
    if (data.tid) await this.page.getByRole("textbox", { name: "TID *" }).fill(data.tid);
    if (data.bin) await this.page.getByRole("textbox", { name: "BIN *" }).fill(data.bin);
    if (data.applicationId)
      await this.page.getByRole("textbox", { name: "Application ID *" }).fill(data.applicationId);
    if (data.deviceId)
      await this.page.getByRole("textbox", { name: "Device ID *" }).fill(data.deviceId);
    if (data.developerId)
      await this.page.getByRole("textbox", { name: "Developer ID *" }).fill(data.developerId);
    if (data.vitalNumber)
      await this.page.getByRole("textbox", { name: "Vital Number *" }).fill(data.vitalNumber);
    if (data.agent) await this.page.getByRole("textbox", { name: "Agent *" }).fill(data.agent);
    if (data.chain) await this.page.getByRole("textbox", { name: "Chain *" }).fill(data.chain);
    if (data.locationNumber)
      await this.page.getByRole("textbox", { name: "Location Number *" }).fill(data.locationNumber);
    if (data.storeNumber)
      await this.page.getByRole("textbox", { name: "Store Number *" }).fill(data.storeNumber);
    if (data.debitSharingGroup)
      await this.page
        .getByRole("textbox", { name: "Debit Sharing Group" })
        .fill(data.debitSharingGroup);
    if (data.debitSettlementAgentNumber)
      await this.page
        .getByRole("textbox", { name: "Debit Settlement Agent Number" })
        .fill(data.debitSettlementAgentNumber);
    if (data.debitAmericanBankers)
      await this.page
        .getByRole("textbox", { name: "Debit American Bankers Association Number" })
        .fill(data.debitAmericanBankers);
  }

  // ---------------------------------------------------------------------------
  // Verifications
  // ---------------------------------------------------------------------------
  async verifyProcessorDetails(
    data: ProcessorDetailsData,
    _processorIndex: number = 0
  ): Promise<void> {
    const expectValue = async (name: string, expected?: string) => {
      if (!expected) return;
      const value = await this.page.getByRole("textbox", { name }).inputValue();
      expect(value).toBe(expected);
    };
    await expectValue("MID *", data.mid);
    await expectValue("TID *", data.tid);
    await expectValue("BIN *", data.bin);
    await expectValue("Application ID *", data.applicationId);
    await expectValue("Device ID *", data.deviceId);
    await expectValue("Developer ID *", data.developerId);
    await expectValue("Vital Number *", data.vitalNumber);
    await expectValue("Agent *", data.agent);
    await expectValue("Chain *", data.chain);
    await expectValue("Location Number *", data.locationNumber);
    await expectValue("Store Number *", data.storeNumber);
    await expectValue("Debit Sharing Group", data.debitSharingGroup);
    await expectValue("Debit Settlement Agent Number", data.debitSettlementAgentNumber);
    await expectValue("Debit American Bankers Association Number", data.debitAmericanBankers);
  }

  async verifyDEMOProcessorDetails(
    data: { mid?: string; tid?: string; bin?: string },
    _processorIndex: number = 0
  ): Promise<void> {
    if (data.mid) {
      const v = await this.page.getByRole("textbox", { name: "MID *" }).inputValue();
      expect(v).toBe(data.mid);
    }
    if (data.tid) {
      const v = await this.page.getByRole("textbox", { name: "TID *" }).inputValue();
      expect(v).toBe(data.tid);
    }
    if (data.bin) {
      const v = await this.page.getByRole("textbox", { name: "BIN *" }).inputValue();
      expect(v).toBe(data.bin);
    }
  }

  async verifyDEMOProcessorData(
    terminalData: {
      device: string;
      name: string;
      serialNumber: string;
      processor: string;
      processorDetails: { mid: string; tid: string; bin: string };
    },
    processorIndex: number = 0
  ): Promise<void> {
    await this.verifyDEMOProcessorDetails(terminalData.processorDetails, processorIndex);
  }

  async closeButton(): Promise<void> {
    await this.page.getByRole("button", { name: "Close" }).click();
  }

  async verifyProcessorDevice(deviceName: string, _processorIndex: number = 0): Promise<void> {
    const v = await this.page.getByRole("combobox", { name: "Device *" }).inputValue();
    expect(v).toBe(deviceName);
  }

  async verifyDebitReimbursementAttribute(
    attributeName: string,
    _processorIndex: number = 0
  ): Promise<void> {
    const v = await this.page
      .getByRole("combobox", { name: "Debit Reimbursement Attribute" })
      .inputValue();
    expect(v).toBe(attributeName);
  }

  // ---------------------------------------------------------------------------
  // Composite form filling
  // ---------------------------------------------------------------------------
  async fillTerminalForm(data: TerminalFormData): Promise<void> {
    await this.selectDevice(data.device);
    await this.fillTerminalName(data.name);
    await this.fillSerialNumber(data.serialNumber);

    if (data.processor) {
      await this.selectProcessor(data.processor);
      if (data.processorDetails) {
        await this.fillProcessorDetails(data.processorDetails);
        if (data.processorDetails.debitReimbursementAttribute) {
          await this.selectDebitReimbursementAttribute(
            data.processorDetails.debitReimbursementAttribute
          );
        }
      }
    }
  }

  async fillTerminalRequiredFields(data: {
    device: string;
    name: string;
    serialNumber?: string;
  }): Promise<void> {
    await this.selectDevice(data.device);
    await this.fillTerminalName(data.name);
    await this.fillSerialNumber(data.serialNumber);
  }

  async submitTerminalForm(): Promise<void> {
    await this.createTerminalButton.click();
  }

  async createTerminal(data: TerminalFormData): Promise<void> {
    await this.fillTerminalForm(data);
    await this.submitTerminalForm();
  }

  // ---------------------------------------------------------------------------
  // Validations
  // ---------------------------------------------------------------------------
  async verifyFieldError(
    field: "device" | "name" | "serialNumber" | "processor" | "mid" | "tid" | "bin"
  ): Promise<void> {
    const ids: Record<typeof field, string> = {
      device: "device-error",
      name: "name-error",
      serialNumber: "serial-number-error",
      processor: "processor-error",
      mid: "mid-error",
      tid: "tid-error",
      bin: "bin-error",
    };
    await expect(this.page.getByTestId(ids[field])).toBeVisible();
  }

  async verifyTerminalCreationSuccess(): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="success"]')).toBeVisible();
  }

  async verifyActionSuccess(message: string): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="success"]')).toContainText(
      message
    );
  }

  async verifyActionError(): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="error"]')).toBeVisible();
  }

  async verifyFormElementsVisible(): Promise<void> {
    await expect(this.deviceSelect).toBeVisible();
    await expect(this.terminalNameInput).toBeVisible();
    const serialVisible = await this.serialNumberInput.isVisible().catch(() => false);
    if (serialVisible) await expect(this.serialNumberInput).toBeVisible();
    await expect(this.addProcessorButton).toBeVisible();
    await expect(this.createTerminalButton).toBeVisible();
  }

  async verifyCreateButtonEnabled(): Promise<void> {
    await expect(this.createTerminalButton).toBeVisible();
    await expect(this.createTerminalButton).toBeEnabled();
  }

  async verifyProcessorSettingsVisible(): Promise<void> {
    await expect(this.processorSettingsHeading).toBeVisible();
    await expect(this.addProcessorButton).toBeVisible();
  }

  async verifyTerminalsListVisible(): Promise<void> {
    await expect(this.terminalsPageTitle).toBeVisible();
    await expect(this.newTerminalButton).toBeVisible();
    await expect(this.terminalTable).toBeVisible();
  }

  async verifyFiltersVisible(): Promise<void> {
    await expect(this.terminalNameFilter).toBeVisible();
    await expect(this.serialNumberFilter).toBeVisible();
    await expect(this.deviceFilter).toBeVisible();
  }

  // Required-field validators
  async verifyDeviceRequired(): Promise<void> {
    await expect(this.page.locator(`text=Device is required`)).toBeVisible();
  }
  async verifyNameRequired(): Promise<void> {
    await expect(this.page.locator(`text=Name is required`)).toBeVisible();
  }
  async verifySerialNumberRequired(): Promise<void> {
    await expect(this.page.locator(`text=Serial Number is required`)).toBeVisible();
  }

  async verifyProcessorRequired(): Promise<void> {
    await expect(this.page.locator('text="MID is required"')).toBeVisible();
    await expect(this.page.locator('text="TID is required"')).toBeVisible();
    await expect(this.page.locator('text="BIN is required"')).toBeVisible();
  }

  async verifyMidRequired(): Promise<void> {
    await expect(this.page.locator('text="MID is required"')).toBeVisible();
  }
  async verifyTidRequired(): Promise<void> {
    await expect(this.page.locator('text="TID is required"')).toBeVisible();
  }
  async verifyBinRequired(): Promise<void> {
    await expect(this.page.locator('text="BIN is required"')).toBeVisible();
  }

  // Length / type validation
  async verifyMidTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 20 characters or less."')
    ).toBeVisible();
  }
  async verifyMidInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyTidTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 10 characters or less."')
    ).toBeVisible();
  }
  async verifyBinTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 8 characters or less."')
    ).toBeVisible();
  }
  async verifyTidInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyBinInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }

  // TSYS field validation
  async verifyApplicationIdTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 15 characters or less."')
    ).toBeVisible();
  }
  async verifyDeviceIdTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 15 characters or less."')
    ).toBeVisible();
  }
  async verifyVitalNumberTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 15 characters or less."')
    ).toBeVisible();
  }
  async verifyVitalNumberInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyAgentTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 6 characters or less."')
    ).toBeVisible();
  }
  async verifyAgentInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyChainTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 6 characters or less."')
    ).toBeVisible();
  }
  async verifyChainInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyLocationNumberTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 5 characters or less."')
    ).toBeVisible();
  }
  async verifyLocationNumberInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyStoreNumberTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 4 characters or less."')
    ).toBeVisible();
  }
  async verifyStoreNumberInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyDebitSharingGroupTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 30 characters or less."')
    ).toBeVisible();
  }
  async verifyDebitSettlementAgentNumberTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 4 characters or less."')
    ).toBeVisible();
  }
  async verifyDebitSettlementAgentNumberInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }
  async verifyDebitAmericanBankersTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 9 characters or less."')
    ).toBeVisible();
  }
  async verifyDebitAmericanBankersInvalidType(): Promise<void> {
    await expect(this.page.locator('text="This value should be of type digit."')).toBeVisible();
  }

  // TSYS required validations
  async verifyApplicationIdRequired(): Promise<void> {
    await expect(this.page.locator('text="Application ID is required"')).toBeVisible();
  }
  async verifyDeviceIdRequired(): Promise<void> {
    await expect(this.page.locator('text="Device ID is required"')).toBeVisible();
  }
  async verifyDeveloperIdRequired(): Promise<void> {
    await expect(this.page.locator('text="Developer ID is required"')).toBeVisible();
  }
  async verifyVitalNumberRequired(): Promise<void> {
    await expect(this.page.locator('text="Vital number is required"')).toBeVisible();
  }
  async verifyAgentRequired(): Promise<void> {
    await expect(this.page.locator('text="Agent is required"')).toBeVisible();
  }
  async verifyChainRequired(): Promise<void> {
    await expect(this.page.locator('text="Chain is required"')).toBeVisible();
  }
  async verifyLocationNumberRequired(): Promise<void> {
    await expect(this.page.locator('text="Location number is required"')).toBeVisible();
  }
  async verifyStoreNumberRequired(): Promise<void> {
    await expect(this.page.locator('text="Store number is required"')).toBeVisible();
  }

  async verifyDuplicateProcessors(): Promise<void> {
    await expect(this.page.locator('text="Duplicate processors!"')).toBeVisible();
  }
  async verifyDefaultProcessorRequired(): Promise<void> {
    await expect(this.page.locator('text="At least one processor must be default"')).toBeVisible();
  }

  async disableDefault(): Promise<void> {
    await this.page.getByRole("switch", { name: "Default" }).click();
  }

  async editProcessor(processorIndex: number = 0): Promise<void> {
    if (processorIndex === 0) {
      await this.page
        .locator("div")
        .filter({ hasText: /^Edit$/ })
        .getByRole("button")
        .click();
    } else {
      await this.page.getByRole("button", { name: "Edit" }).nth(processorIndex).click();
    }
  }

  async confirmSetDefaultProcessor(): Promise<void> {
    await this.page.getByRole("heading", { name: "Set Default Processor" }).click();
    await this.page.getByRole("button", { name: "Set Default Processor" }).click();
  }

  async fillProcessorDetailsForIndex(index: number, details: ProcessorDetailsData): Promise<void> {
    const section = this.page
      .locator(`[data-testid="processor-section-${index}"]`)
      .or(this.page.locator(`div:has-text("${index}")`).locator(".."));

    if (details.mid) await section.locator('input[name*="mid"]').fill(details.mid);
    if (details.tid) await section.locator('input[name*="tid"]').fill(details.tid);
    if (details.bin) await section.locator('input[name*="bin"]').fill(details.bin);
    if (details.applicationId)
      await section.locator('input[name*="applicationId"]').fill(details.applicationId);
    if (details.deviceId) await section.locator('input[name*="deviceId"]').fill(details.deviceId);
    if (details.developerId)
      await section.locator('input[name*="developerId"]').fill(details.developerId);
    if (details.vitalNumber)
      await section.locator('input[name*="vitalNumber"]').fill(details.vitalNumber);
    if (details.agent) await section.locator('input[name*="agent"]').fill(details.agent);
    if (details.chain) await section.locator('input[name*="chain"]').fill(details.chain);
    if (details.locationNumber)
      await section.locator('input[name*="locationNumber"]').fill(details.locationNumber);
    if (details.storeNumber)
      await section.locator('input[name*="storeNumber"]').fill(details.storeNumber);
    if (details.debitSharingGroup)
      await section.locator('input[name*="debitSharingGroup"]').fill(details.debitSharingGroup);
    if (details.debitSettlementAgentNumber)
      await section
        .locator('input[name*="debitSettlementAgentNumber"]')
        .fill(details.debitSettlementAgentNumber);
    if (details.debitAmericanBankers)
      await section
        .locator('input[name*="debitAmericanBankers"]')
        .fill(details.debitAmericanBankers);
  }

  async setProcessorAsDefault(index: number): Promise<void> {
    const section = this.page
      .locator(`[data-testid="processor-section-${index}"]`)
      .or(this.page.locator(`div:has-text("${index}")`).locator(".."));
    const toggle = section
      .locator('input[type="checkbox"]')
      .or(section.locator('button:has-text("Default")'));
    await toggle.click();
  }

  async removeProcessor(index: number): Promise<void> {
    const section = this.page
      .locator(`[data-testid="processor-section-${index}"]`)
      .or(this.page.locator(`div:has-text("${index}")`).locator(".."));
    const removeBtn = section
      .locator('button[aria-label*="delete"]')
      .or(section.locator("button:has(svg)").last());
    await removeBtn.click();
  }

  async removeSecondProcessor(): Promise<void> {
    await this.page
      .locator("div")
      .filter({ hasText: /^2DEMODefaultProcessor \*DEMOMID \*TID \*BIN \*$/ })
      .getByRole("button")
      .click();
  }

  // Field validation - name & serial
  async verifyNameTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 50 characters or less."')
    ).toBeVisible();
  }

  async verifyNameTooShort(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too short. It should have 5 characters or more."')
    ).toBeVisible();
  }

  async verifyNameInvalidCharacters(): Promise<void> {
    // Both legacy and updated copies are checked for resilience.
    const legacy = this.page.locator('text="Name can only contain letters and numbers"');
    const updated = this.page.locator('text="Name can only contain letters, numbers."');
    const legacyVisible = await legacy.isVisible().catch(() => false);
    if (legacyVisible) await expect(legacy).toBeVisible();
    else await expect(updated).toBeVisible();
  }

  async verifySerialNumberTooShort(): Promise<void> {
    const legacy = this.page.locator('text="Serial number is too short"');
    const updated = this.page.locator(
      'text="This value is too short. It should have 10 characters or more."'
    );
    const legacyVisible = await legacy.isVisible().catch(() => false);
    if (legacyVisible) await expect(legacy).toBeVisible();
    else await expect(updated).toBeVisible();
  }

  async verifySerialNumberTooLong(): Promise<void> {
    await expect(
      this.page.locator('text="This value is too long. It should have 50 characters or less."')
    ).toBeVisible();
  }

  async verifySerialNumberInvalidCharacters(): Promise<void> {
    await expect(
      this.page.locator(
        'text="Serial Number can only contain letters and numbers, and cannot contain spaces"'
      )
    ).toBeVisible();
  }

  // Field value verifications
  async verifyDeviceValue(v: string): Promise<void> {
    await expect(this.deviceSelect).toContainText(v);
  }
  async verifyTerminalNameValue(v: string): Promise<void> {
    await expect(this.terminalNameInput).toHaveValue(v);
  }
  async verifySerialNumberValue(v: string): Promise<void> {
    await expect(this.serialNumberInput).toHaveValue(v);
  }

  async verifyProcessorValue(v: string, processorIndex: number = 0): Promise<void> {
    await expect(
      this.page.getByRole("combobox", { name: "Processor *" }).nth(processorIndex)
    ).toHaveValue(v);
  }

  // ---------------------------------------------------------------------------
  // Multiple processors
  // ---------------------------------------------------------------------------
  async addMultipleProcessors(processors: MultipleProcessorEntry[]): Promise<void> {
    for (let i = 0; i < processors.length; i++) {
      const entry = processors[i];
      if (!entry) continue;
      if (i > 0) await this.addProcessor();
      await this.selectProcessor(entry.processor);
      await this.fillProcessorDetails(entry.details);
      if (entry.details.debitReimbursementAttribute) {
        await this.selectDebitReimbursementAttribute(entry.details.debitReimbursementAttribute);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Clearing
  // ---------------------------------------------------------------------------
  async clearTerminalForm(): Promise<void> {
    await this.terminalNameInput.clear();
    const serialVisible = await this.serialNumberInput.isVisible().catch(() => false);
    if (serialVisible) await this.serialNumberInput.clear();
  }

  async clearProcessorDetails(): Promise<void> {
    await this.midInput.clear();
    await this.tidInput.clear();
    await this.binInput.clear();
    await this.applicationIdInput.clear();
    const dvIdVisible = await this.deviceIdInput.isVisible().catch(() => false);
    if (dvIdVisible) await this.deviceIdInput.clear();
    const devIdVisible = await this.developerIdInput.isVisible().catch(() => false);
    if (devIdVisible) await this.developerIdInput.clear();
    await this.vitalNumberInput.clear();
    await this.agentInput.clear();
    await this.chainInput.clear();
    await this.locationNumberInput.clear();
    await this.storeNumberInput.clear();
    await this.debitSharingGroupInput.clear();
    await this.debitSettlementAgentNumberInput.clear();
    await this.debitAmericanBankersInput.clear();
  }

  // ---------------------------------------------------------------------------
  // Table verifications
  // ---------------------------------------------------------------------------
  async verifyTerminalNameInTable(name: string): Promise<boolean> {
    await expect(this.terminalTable).toBeVisible();
    return this.terminalRows.filter({ hasText: name }).first().isVisible();
  }

  async verifySerialNumberInTable(serialNumber: string): Promise<boolean> {
    await expect(this.terminalTable).toBeVisible();
    return this.terminalRows.filter({ hasText: serialNumber }).isVisible();
  }

  async verifyDeviceInTable(device: string): Promise<boolean> {
    await expect(this.terminalTable).toBeVisible();
    return this.terminalRows.filter({ hasText: device }).first().isVisible();
  }

  async verifyTerminalWithAllFilters(
    name: string,
    serialNumber: string,
    device: string
  ): Promise<boolean> {
    await expect(this.terminalTable).toBeVisible();
    try {
      const matching = this.terminalRows
        .filter({ hasText: name })
        .filter({ hasText: serialNumber })
        .filter({ hasText: device })
        .first();
      await expect(matching).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}
