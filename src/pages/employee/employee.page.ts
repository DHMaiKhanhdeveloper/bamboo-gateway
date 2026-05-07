import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  passCode: string;
}

export class EmployeePage extends BasePage {
  private static readonly DEFAULT_MERCHANT = "01995b0a-c4b6-79a8-84ea-bcdf4cb78e48";

  protected override get urlPath(): string {
    return `/${EmployeePage.DEFAULT_MERCHANT}/employees`;
  }

  protected override readyLocator(): Locator {
    return this.listEmployeesText;
  }

  // ---------------------------------------------------------------------------
  // Locators
  // ---------------------------------------------------------------------------
  get createEmployeeText(): Locator { return this.page.getByText("Create Employee"); }
  get listEmployeesText(): Locator { return this.page.getByText("Employees"); }
  get nameInput(): Locator { return this.page.locator('input[data-testid="employee-name-input"]'); }
  get emailInput(): Locator { return this.page.locator('input[data-testid="employee-email-input"]'); }
  get phoneInput(): Locator { return this.page.locator('input[data-testid="employee-phone-input"]'); }
  get countrySelector(): Locator {
    return this.page.locator("button").filter({ hasText: /\+/ }).first();
  }
  get countrySearchInput(): Locator { return this.page.getByPlaceholder("Search country..."); }
  get countryDropdown(): Locator { return this.page.locator('[role="listbox"]'); }
  get roleSelect(): Locator { return this.page.getByTestId("employee-role-select"); }
  get statusSelect(): Locator { return this.page.getByTestId("employee-status-select"); }
  get passCodeInput(): Locator { return this.page.locator('input[data-testid="employee-passcode-input"]'); }
  get createButton(): Locator { return this.page.getByRole("button", { name: "Create" }); }

  // Search-related locators
  get employeeIDText(): Locator { return this.page.getByText("Employee ID").first(); }
  get searchEmployeeID(): Locator { return this.page.getByPlaceholder("Search Employee ID").first(); }
  get applyButton(): Locator { return this.page.getByRole("button", { name: "Apply" }); }
  get employeeNameText(): Locator { return this.page.getByText("Name").first(); }
  get placeholderSearchName(): Locator { return this.page.getByPlaceholder("Search name").first(); }
  get employeeEmailText(): Locator { return this.page.getByText("Email").first(); }
  get placeholderSearchEmail(): Locator { return this.page.getByPlaceholder("Search email").first(); }
  get employeePhoneText(): Locator { return this.page.getByText("Phone").first(); }
  get placeholderSearchPhone(): Locator { return this.page.getByPlaceholder("Search phone").first(); }
  get employeeRoleText(): Locator { return this.page.getByText("Role").first(); }
  get employeeStatusText(): Locator { return this.page.getByText("Status").first(); }
  get employeeDateEnteredText(): Locator { return this.page.getByText("Date Entered").first(); }

  getEmployeeRow(employeeId: string): Locator {
    return this.page.getByRole("row", { name: new RegExp(employeeId) });
  }

  getEmployeeRowByName(name: string): Locator {
    return this.page.locator("tr").filter({ hasText: name }).first();
  }

  getRoleOption(role: string): Locator { return this.page.locator(`[data-value="${role}"]`); }
  getStatusOption(status: string): Locator { return this.page.locator(`[data-value="${status}"]`); }

  getDateInputs(): Locator {
    return this.page.locator('[role="dialog"], .popup-container').getByRole("textbox");
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  async gotoCreateEmployee(employeeId: string = EmployeePage.DEFAULT_MERCHANT): Promise<void> {
    await this.page.goto(`/${employeeId}/employees/add`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await expect(this.createEmployeeText).toBeVisible();
  }

  async gotoEmployeesList(employeeId: string = EmployeePage.DEFAULT_MERCHANT): Promise<void> {
    await this.page.goto(`/${employeeId}/employees`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await expect(this.page.getByRole("heading", { name: "Employees" })).toBeVisible({
      timeout: 15_000,
    });
  }

  // ---------------------------------------------------------------------------
  // Field actions
  // ---------------------------------------------------------------------------
  async fillName(name: string): Promise<void> { await this.nameInput.fill(name); }
  async fillEmail(email: string): Promise<void> { await this.emailInput.fill(email); }
  async fillPhone(phone: string): Promise<void> { await this.phoneInput.fill(phone); }
  async fillPassCode(passCode: string): Promise<void> { await this.passCodeInput.fill(passCode); }

  async selectCountry(countryName: string): Promise<void> {
    try {
      const countryButton = this.page.locator("button").filter({ hasText: /\+/ }).first();
      await countryButton.waitFor({ state: "visible", timeout: 10_000 });
      await countryButton.click();
      await this.countrySearchInput.waitFor({ state: "visible", timeout: 10_000 });
      await this.countrySearchInput.clear();
      await this.countrySearchInput.fill(countryName);
      await this.page.waitForTimeout(500);
      await this.page.getByText(countryName).first().click();
    } catch (err) {
      this.log.warn(`Country selection failed`, err);
    }
  }

  async searchCountry(searchTerm: string): Promise<void> {
    try {
      const countryButton = this.page.locator("button").filter({ hasText: /\+/ }).first();
      await countryButton.waitFor({ state: "visible", timeout: 10_000 });
      await countryButton.click();
      await this.countrySearchInput.waitFor({ state: "visible", timeout: 10_000 });
      await this.countrySearchInput.clear();
      await this.countrySearchInput.fill(searchTerm);
      await this.page.waitForTimeout(500);
    } catch (err) {
      this.log.warn(`Country search failed`, err);
    }
  }

  async verifyCountrySelected(countryName: string): Promise<void> {
    await expect(this.countrySelector).toContainText(countryName);
  }

  async verifyCountrySearchResults(searchTerm: string): Promise<void> {
    const results = this.page.locator('[role="option"]');
    expect(await results.count()).toBeGreaterThan(0);
    await expect(results.first()).toContainText(searchTerm, { ignoreCase: true });
  }

  async selectRole(roleName: string): Promise<void> {
    await this.roleSelect.click();
    await this.page.getByRole("option", { name: roleName, exact: true }).click();
  }

  async selectStatus(status: string): Promise<void> {
    await this.statusSelect.click();
    await this.page.getByRole("option", { name: status, exact: true }).click();
  }

  async submitEmployeeForm(): Promise<void> {
    await this.createButton.click();
  }

  async fillEmployeeForm(data: EmployeeFormData): Promise<void> {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    await this.selectRole(data.role);
    await this.selectStatus(data.status);
    await this.fillPassCode(data.passCode);
  }

  async createEmployee(data: EmployeeFormData): Promise<void> {
    await this.fillEmployeeForm(data);
    await this.submitEmployeeForm();
  }

  // ---------------------------------------------------------------------------
  // Search methods
  // ---------------------------------------------------------------------------
  async fillEmployeeId(id: string): Promise<void> { await this.searchEmployeeID.fill(id); }
  async fillEmployeeName(name: string): Promise<void> { await this.placeholderSearchName.fill(name); }
  async fillEmployeeEmail(email: string): Promise<void> { await this.placeholderSearchEmail.fill(email); }
  async fillEmployeePhone(phone: string): Promise<void> { await this.placeholderSearchPhone.fill(phone); }

  async selectRoleOption(role: string): Promise<void> {
    const opt = this.getRoleOption(role);
    await expect(opt).toBeVisible({ timeout: 5_000 });
    await opt.click();
  }

  async selectStatusOption(status: string): Promise<void> {
    const opt = this.getStatusOption(status);
    await expect(opt).toBeVisible({ timeout: 5_000 });
    await opt.click();
  }

  async fillDateRange(startDate: string, endDate: string): Promise<void> {
    const inputs = this.getDateInputs();
    const start = inputs.first();
    const end = inputs.nth(1);
    await expect(start).toBeVisible();
    await expect(end).toBeVisible();
    await start.fill(startDate);
    await end.fill(endDate);
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.employeeIDText.click();
    await this.fillEmployeeId(employeeId);
    await this.applyButton.click();
  }

  async searchByName(name: string): Promise<void> {
    await this.employeeNameText.click();
    await this.fillEmployeeName(name);
    await this.applyButton.click();
  }

  async searchByEmail(email: string): Promise<void> {
    await this.employeeEmailText.click();
    await this.fillEmployeeEmail(email);
    await this.applyButton.click();
  }

  async searchByPhone(phone: string): Promise<void> {
    await this.employeePhoneText.click();
    await this.fillEmployeePhone(phone);
    await this.applyButton.click();
  }

  async searchByRole(role: string): Promise<void> {
    await this.employeeRoleText.click();
    await this.selectRoleOption(role);
    await this.applyButton.click();
  }

  async searchByStatus(status: string): Promise<void> {
    await this.employeeStatusText.click();
    await this.selectStatusOption(status);
    await this.applyButton.click();
  }

  async searchByDateRange(startDate: string, endDate: string): Promise<void> {
    await this.employeeDateEnteredText.click();
    await this.fillDateRange(startDate, endDate);
    await this.applyButton.click();
  }

  // ---------------------------------------------------------------------------
  // Verifications
  // ---------------------------------------------------------------------------
  async verifyActionSuccess(expectedMessage: string): Promise<void> {
    await expect(
      this.page.locator('[data-sonner-toast][data-type="success"]')
    ).toContainText(expectedMessage, { timeout: 10_000 });
  }

  async verifyActionError(): Promise<void> {
    await expect(
      this.page.locator('[data-sonner-toast][data-type="error"]')
    ).toBeVisible({ timeout: 10_000 });
  }

  async verifySpecialCharactersInName(): Promise<void> {
    const expected = "The name can only contain letters, periods, hyphens, and apostrophes.";
    await expect(this.page.locator(`text=${expected}`)).toHaveText(expected, { timeout: 10_000 });
  }

  async verifyNameTooLong(): Promise<void> {
    await expect(this.page.locator(`text=Name is too long`).first()).toBeVisible({ timeout: 10_000 });
  }

  async verifyFieldError(field: "name" | "email" | "phone" | "role" | "passcode"): Promise<void> {
    const errors: Record<typeof field, string> = {
      name: "Name is required",
      email: "Enter a valid email address",
      phone: "Phone is required",
      role: "Role is required",
      passcode: "Passcode is required",
    };
    const expected = errors[field];
    await expect(this.page.locator(`text=${expected}`)).toHaveText(expected, { timeout: 5_000 });
  }

  async verifyFieldTooLong(field: "name" | "email" | "phone" | "role" | "passcode"): Promise<void> {
    const errors: Record<typeof field, string> = {
      name: "Name is too long",
      email: "Email is too long",
      phone: "The string supplied was too long to parse.",
      role: "Role is required",
      passcode: "Passcode is required",
    };
    await expect(this.page.locator(`text=${errors[field]}`).first()).toBeVisible({ timeout: 10_000 });
  }

  async verifyInvalidEmailFormat(): Promise<void> {
    await expect(this.page.locator('input[type="email"]')).toHaveJSProperty(
      "validationMessage",
      "Please include an '@' in the email address. 'invalid-email-format' is missing an '@'.",
      { timeout: 10_000 }
    );
  }

  async verifyValidPhoneNumber(): Promise<void> {
    await expect(
      this.page.locator(`text=This value is not a valid phone number `).first()
    ).toBeVisible({ timeout: 10_000 });
  }

  async verifyShortPasscode(): Promise<void> {
    await expect(
      this.page.locator(`text=The passcode must contain exactly 4 characters.`).first()
    ).toBeVisible({ timeout: 10_000 });
  }

  async verifyCreationSuccess(): Promise<void> {
    await expect(
      this.page.locator(`text=The employee has been created successfully!`).first()
    ).toBeVisible({ timeout: 10_000 });
  }

  async verifyPhoneTooLongError(): Promise<void> {
    await expect(this.page.getByText("The string supplied was too long to parse.")).toBeVisible({
      timeout: 10_000,
    });
  }

  async verifyInvalidPhoneFormat(): Promise<void> {
    await expect(this.page.getByText("This value is not a valid phone number")).toBeVisible({
      timeout: 10_000,
    });
  }

  async verifyPhoneRequired(): Promise<void> {
    await expect(this.page.getByText("Phone is required")).toBeVisible({ timeout: 10_000 });
  }

  async verifyDoubleEmail(): Promise<void> {
    await expect(
      this.page.locator(`text=This email is already in use.`).first()
    ).toBeVisible({ timeout: 10_000 });
  }

  async verifyEmployeeInResults(name: string): Promise<void> {
    await expect(
      this.page.locator("tr").filter({ hasText: name }).first()
    ).toBeVisible({ timeout: 10_000 });
  }

  async verifyNoResultsFound(): Promise<void> {
    await expect(
      this.page.getByText(/No records found|No data available|No employees found/)
    ).toBeVisible();
  }
}
