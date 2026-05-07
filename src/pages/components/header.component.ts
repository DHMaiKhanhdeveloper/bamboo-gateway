import { expect, type Locator, type Page } from "@playwright/test";
import { BaseComponent } from "~/core/base/base.component";

export class HeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator("body"));
  }

  // Locators
  get logo(): Locator {
    return this.page.locator('[data-testid="logo"]');
  }

  get userMenu(): Locator {
    return this.page.locator('[data-testid="user-menu"]');
  }

  get logoutButton(): Locator {
    return this.page.locator('[data-testid="logout-button"]');
  }

  get navigationMenu(): Locator {
    return this.page.locator('[data-testid="navigation-menu"]');
  }

  // Actions
  async verifyHeaderVisible(): Promise<void> {
    await expect(this.logo).toBeVisible();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
  }

  async navigateToSection(sectionName: string): Promise<void> {
    await this.navigationMenu.getByText(sectionName).click();
  }
}
