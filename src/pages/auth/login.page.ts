import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";
import { ROUTES } from "~/config/constants";
import { generateTotp } from "~/helpers/otp.helper";

/**
 * Login + 2-step verification page.
 * Uses role-based locators where the source provides accessible names.
 */
export class LoginPage extends BasePage {
  protected override get urlPath(): string {
    return ROUTES.login;
  }

  protected override readyLocator(): Locator {
    return this.usernameInput;
  }

  // ---------------------------------------------------------------------------
  // Locators
  // ---------------------------------------------------------------------------
  get usernameInput(): Locator {
    return this.page.getByRole("textbox", { name: "username" });
  }

  get passwordInput(): Locator {
    return this.page.getByRole("textbox", { name: "password" });
  }

  get loginButton(): Locator {
    return this.page.getByRole("button", { name: "Login" });
  }

  get authCodeInput(): Locator {
    return this.page.locator('input[name="authCode"]');
  }

  get twoFactorButton(): Locator {
    return this.page.getByTestId("verify-button");
  }

  get twoStepVerificationText(): Locator {
    return this.page.getByText("2-Step Verification");
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  async fillCredentials(username: string, password: string): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async waitForTwoFactorPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/two-factor/, { timeout: 30_000 });
    await this.page.waitForLoadState("networkidle");
    await expect(this.twoStepVerificationText).toBeVisible();
  }

  async fillTwoFactorCode(totpSecret: string): Promise<void> {
    const authCode = generateTotp(totpSecret);
    await this.authCodeInput.fill(authCode);
  }

  async submitTwoFactor(): Promise<void> {
    await this.twoFactorButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    const errorMessages = this.page.locator('[class*="error"], [class*="alert"], .error, .alert');
    await expect(errorMessages).toHaveCount(0);
    await expect(this.page).not.toHaveURL(/.*\/two-factor/);
  }

  /**
   * Complete end-to-end login flow including TOTP.
   */
  async login(username: string, password: string, totpSecret: string): Promise<void> {
    this.log.info(`Login attempt for ${username}`);
    await this.goto();
    await this.fillCredentials(username, password);
    await this.clickLogin();
    await this.waitForTwoFactorPage();
    await this.fillTwoFactorCode(totpSecret);
    await this.submitTwoFactor();
    await this.verifySuccessfulLogin();
    this.log.info("Login successful");
  }
}
