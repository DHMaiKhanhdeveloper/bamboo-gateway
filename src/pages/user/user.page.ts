import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";
import { getUserIdSync } from "~/config/env";

export interface UserFormData {
  username: string;
  userType: string;
  password: string;
  email: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  phone?: string;
  country?: string;
}

export interface EditUserFormData {
  firstName?: string;
  lastName?: string;
  title?: string;
  phone?: string;
}

export class UserPage extends BasePage {
  protected override get urlPath(): string { return "/users"; }
  protected override readyLocator(): Locator {
    return this.page.getByRole("heading", { name: "Users" });
  }

  // ---------------------------------------------------------------------------
  // Locators — Account Information
  // ---------------------------------------------------------------------------
  get addUserText(): Locator { return this.page.getByRole("heading", { name: "Add User" }); }
  get usernameInput(): Locator { return this.page.getByTestId("username-input"); }
  get userTypeSelect(): Locator { return this.page.getByTestId("user-type-select"); }
  get passwordInput(): Locator { return this.page.getByTestId("password-input"); }
  get emailInput(): Locator { return this.page.getByTestId("email-input"); }
  get managerInput(): Locator { return this.page.getByTestId("manager-select"); }
  get confirmPasswordInput(): Locator { return this.page.getByTestId("confirm-password-input"); }

  // Personal Information
  get firstNameInput(): Locator { return this.page.getByTestId("first-name-input"); }
  get lastNameInput(): Locator { return this.page.getByTestId("last-name-input"); }
  get titleInput(): Locator { return this.page.getByTestId("title-input"); }
  get phoneInput(): Locator { return this.page.getByTestId("phone-input"); }
  get countrySelector(): Locator { return this.page.locator("button").filter({ hasText: /\+/ }).first(); }
  get countrySearchInput(): Locator { return this.page.getByPlaceholder("Search country..."); }

  // Role & Permissions
  get roleTemplateSelect(): Locator { return this.page.getByTestId("permissions-field").getByRole("combobox"); }
  get selectAllPermissionsButton(): Locator { return this.page.getByRole("button", { name: "Select All" }); }
  get clearAllPermissionsButton(): Locator { return this.page.getByRole("button", { name: "Clear All" }); }
  get expandAllLink(): Locator { return this.page.getByRole("button", { name: "Expand All" }); }
  get collapseAllLink(): Locator { return this.page.getByRole("button", { name: "Collapse All" }); }
  get createUserButton(): Locator { return this.page.getByTestId("submit-button"); }
  get permissionsCount(): Locator { return this.page.getByText(/of \d+ permissions selected/); }

  // ---------------------------------------------------------------------------
  // Manager search
  // ---------------------------------------------------------------------------
  async getVisibleManagerSearchInput(): Promise<Locator> {
    await this.managerInput.click();
    const searchInput = this.page.getByPlaceholder("Search username...");
    await searchInput.waitFor({ state: "visible" });
    return searchInput;
  }

  async searchManagerByFullName(fullName: string): Promise<void> {
    const input = await this.getVisibleManagerSearchInput();
    await input.fill(fullName);
  }

  async searchManagerCaseInsensitive(searchTerm: string): Promise<void> {
    const input = await this.getVisibleManagerSearchInput();
    await input.fill(searchTerm);
  }

  async searchManagerByInitials(initials: string): Promise<void> {
    const input = await this.getVisibleManagerSearchInput();
    await input.fill(initials);
  }

  async searchManagerNoResults(searchTerm: string): Promise<void> {
    const input = await this.getVisibleManagerSearchInput();
    await input.fill(searchTerm);
  }

  async clearManagerSearch(): Promise<void> {
    const input = await this.getVisibleManagerSearchInput();
    await input.clear();
  }

  async selectManagerFromSearchResults(managerEmail: string): Promise<void> {
    const managerLocator = this.page.getByTestId("virtuoso-item-list").getByText(managerEmail);
    await managerLocator.waitFor({ state: "visible" });
    await managerLocator.click();
    await expect(this.managerInput).toContainText(managerEmail);
  }

  async verifySearchResultsVisible(): Promise<void> {
    await expect(this.page.getByTestId("virtuoso-item-list")).toBeVisible();
  }

  async verifyNoSearchResults(): Promise<void> {
    await expect(this.page.getByText("No results found")).toBeVisible();
  }

  async verifySearchResultsContain(searchTerm: string): Promise<void> {
    await expect(this.page.getByTestId("virtuoso-item-list")).toContainText(searchTerm);
  }

  async getSearchResultsCount(): Promise<number> {
    return this.page.getByTestId("virtuoso-item-list").locator("*").count();
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  async gotoAddUser(): Promise<void> {
    await this.page.getByRole("link", { name: "New User" }).click();
    await expect(this.addUserText).toBeVisible();
  }

  async gotoUsersList(): Promise<void> {
    await this.page.goto("/users");
    await expect(this.page.getByRole("heading", { name: "Users" })).toBeVisible();
  }

  async gotoAddUserLink(): Promise<void> {
    await this.page.goto("/users/add");
    await expect(this.page.getByRole("heading", { name: "Add User" })).toBeVisible();
  }

  async gotoEditUserLink(): Promise<void> {
    await this.page.goto(`/users/${getUserIdSync()}`);
    await expect(this.page.getByRole("heading", { name: "Edit User" })).toBeVisible();
  }

  async submitUserCreationForm(): Promise<void> {
    await this.createUserButton.click();
  }

  // ---------------------------------------------------------------------------
  // Account Information actions
  // ---------------------------------------------------------------------------
  async fillUsername(username: string): Promise<void> { await this.usernameInput.fill(username); }
  async fillPassword(password: string): Promise<void> { await this.passwordInput.fill(password); }
  async fillEmail(email: string): Promise<void> { await this.emailInput.fill(email); }
  async fillConfirmPassword(password: string): Promise<void> { await this.confirmPasswordInput.fill(password); }

  async selectUserType(userType: string): Promise<void> {
    await this.userTypeSelect.click();
    await this.page.getByTestId(`user-type-option-${userType.toLowerCase()}`).click();
  }

  async selectManager(managerName?: string): Promise<void> {
    await this.managerInput.click();
    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible();
    if (managerName) {
      await options.filter({ hasText: managerName }).click();
    } else {
      await options.first().click();
    }
  }

  // Personal Information
  async fillFirstName(firstName: string): Promise<void> { await this.firstNameInput.fill(firstName); }
  async fillLastName(lastName: string): Promise<void> { await this.lastNameInput.fill(lastName); }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.clear();
    await this.titleInput.fill(title);
    await expect(this.titleInput).toHaveValue(title);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.clear();
    await this.phoneInput.fill(phone);
  }

  async selectCountry(countryName: string): Promise<void> {
    const button = this.page.locator("button").filter({ hasText: /\+/ }).first();
    await button.waitFor({ state: "visible" });
    await button.click();
    await this.countrySearchInput.waitFor({ state: "visible" });
    await this.countrySearchInput.clear();
    await this.countrySearchInput.fill(countryName);
    await this.page.waitForTimeout(500);
    await this.page.getByText(countryName).first().click();
  }

  // ---------------------------------------------------------------------------
  // Role / Permissions actions
  // ---------------------------------------------------------------------------
  async selectRoleTemplate(templateName: string): Promise<void> {
    await this.roleTemplateSelect.click();
    const templateMap: Record<string, string> = {
      Administrator: "Applicable all permissions",
      Merchant: "Read-only access",
      Staff: "Read-only access",
    };
    const optionName = templateMap[templateName] ?? templateName;
    await this.page.getByRole("option", { name: optionName, exact: true }).click();
  }

  async selectAllPermissions(): Promise<void> { await this.selectAllPermissionsButton.click(); }
  async clearAllPermissions(): Promise<void> { await this.clearAllPermissionsButton.click(); }
  async expandAllPermissions(): Promise<void> { await this.expandAllLink.click(); }
  async collapseAllPermissions(): Promise<void> { await this.collapseAllLink.click(); }

  async selectPermissionCategoryByCheckbox(): Promise<void> {
    await this.page.locator(".peer.border-input").first().click();
    for (let i = 2; i <= 8; i++) {
      await this.page.locator(`div:nth-child(${i}) > .relative > .peer`).click();
    }
  }

  async selectSpecificPermission(permissionName: string): Promise<void> {
    await this.page.getByRole("switch", { name: permissionName }).click();
  }

  async submitUserForm(): Promise<void> { await this.createUserButton.click(); }

  // ---------------------------------------------------------------------------
  // Form composition
  // ---------------------------------------------------------------------------
  async fillUserForm(data: UserFormData): Promise<void> {
    await this.fillUsername(data.username);
    await this.selectUserType(data.userType);
    await this.fillPassword(data.password);
    await this.fillEmail(data.email);
    await this.fillConfirmPassword(data.confirmPassword);
    if (data.firstName) await this.fillFirstName(data.firstName);
    if (data.lastName) await this.fillLastName(data.lastName);
    if (data.title) {
      await this.page.waitForTimeout(500);
      await this.fillTitle(data.title);
    }
    if (data.phone) await this.fillPhone(data.phone);
  }

  async fillEditUserForm(data: EditUserFormData): Promise<void> {
    if (data.firstName) await this.fillFirstName(data.firstName);
    if (data.lastName) await this.fillLastName(data.lastName);
    if (data.title) await this.fillTitle(data.title);
    if (data.phone) await this.fillPhone(data.phone);
  }

  async createUser(data: UserFormData): Promise<void> {
    await this.fillUserForm(data);
    await this.submitUserForm();
  }

  // ---------------------------------------------------------------------------
  // Validations
  // ---------------------------------------------------------------------------
  async verifyFieldError(
    field: "email" | "password" | "confirmPassword" | "userType" | "manager" | "phone" | "username"
  ): Promise<void> {
    const ids: Record<typeof field, string> = {
      email: "email-error",
      password: "password-error",
      confirmPassword: "confirm-password-error",
      userType: "user-type-error",
      manager: "manager-error",
      phone: "phone-error",
      username: "username-error",
    };
    await expect(this.page.getByTestId(ids[field])).toBeVisible();
  }

  private async expectText(text: string): Promise<void> {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }

  async verifyPasswordRequired(): Promise<void> { await this.expectText("Password is required"); }
  async verifyFirstNameTooLong(): Promise<void> { await this.expectText("First name must be less than 50 characters"); }
  async verifyFirstNameContainingSpecialCharacters(): Promise<void> {
    await this.expectText("The first name can only contain letters, periods, hyphens, and apostrophes.");
  }
  async verifyLastNameTooLong(): Promise<void> { await this.expectText("Last name must be less than 50 characters"); }
  async verifyLastNameContainingSpecialCharacters(): Promise<void> {
    await this.expectText("The last name can only contain letters, periods, hyphens, and apostrophes.");
  }
  async verifyTitleTooLong(): Promise<void> { await this.expectText("Title must be less than 255 characters"); }
  async verifyConfirmPasswordRequired(): Promise<void> { await this.expectText("Confirm password is required"); }
  async verifyUserWithUnicodeCharacters(): Promise<void> {
    await this.expectText("Username can only contain letters, numbers and underscores");
  }
  async verifyPasswordMismatch(): Promise<void> { await this.expectText("Password and confirm password must be the same"); }

  async verifyInvalidEmailFormat(): Promise<void> {
    await expect(this.page.locator('input[type="email"]')).toHaveJSProperty(
      "validationMessage",
      "Please include an '@' in the email address."
    );
  }

  async verifyUsernameTooShort(): Promise<void> { await this.expectText("Username must be at least 4 characters"); }
  async verifyUsernameTooLong(): Promise<void> { await this.expectText("Username must be less than 64 characters"); }
  async verifyPasswordTooShort(): Promise<void> { await this.expectText("Password must be at least 12 characters long."); }
  async verifyPasswordMissingNumber(): Promise<void> { await this.expectText("Password must contain at least one number"); }
  async verifyPasswordMissingSpecialChar(): Promise<void> { await this.expectText("Password must contain at least one special character"); }
  async verifyPasswordMissingUppercase(): Promise<void> { await this.expectText("Password must contain at least one uppercase letter"); }
  async verifyDuplicateUsername(): Promise<void> { await this.expectText("This username is already in use"); }
  async verifyDuplicateEmail(): Promise<void> { await this.expectText("This email is already in use"); }
  async verifyClearAllPermissions(): Promise<void> { await this.expectText("At least one permission is required"); }
  async verifyInvalidUsernameFormat(): Promise<void> {
    await this.expectText("Username can only contain letters, numbers, ., -, +, _, and @");
  }
  async verifyUsernameRequired(): Promise<void> { await this.expectText("Username is required"); }
  async verifyUsernameWhitespace(): Promise<void> { await this.expectText("Username is required"); }

  async editUserSuccess(): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="success"]')).toBeVisible();
  }

  async verifyActionSuccess(expectedMessage: string): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="success"]')).toContainText(expectedMessage);
  }

  async verifyUpdateSuccess(): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="success"]')).toBeVisible();
  }

  async verifyActionError(): Promise<void> {
    await expect(this.page.locator('[data-sonner-toast][data-type="error"]')).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Permission verifications
  // ---------------------------------------------------------------------------
  async verifyPermissionsCount(expectedCount: number): Promise<void> {
    await expect(this.page.getByText(`${expectedCount} of  permissions selected`)).toBeVisible();
  }

  async verifyPermissionSelected(permissionName: string): Promise<void> {
    await expect(this.page.getByRole("switch", { name: permissionName })).toBeChecked();
  }

  async verifyPermissionNotSelected(permissionName: string): Promise<void> {
    await expect(this.page.getByRole("switch", { name: permissionName })).not.toBeChecked();
  }

  // ---------------------------------------------------------------------------
  // Form visibility
  // ---------------------------------------------------------------------------
  async verifyFormElementsVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.userTypeSelect).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.titleInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.createUserButton).toBeVisible();
  }

  async verifyCreateButtonEnabled(): Promise<void> {
    await expect(this.createUserButton).toBeVisible();
    await expect(this.createUserButton).toBeEnabled();
  }
}
