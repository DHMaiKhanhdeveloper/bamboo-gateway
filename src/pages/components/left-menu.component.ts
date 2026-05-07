import { expect, type Locator, type Page } from "@playwright/test";
import { BaseComponent } from "~/core/base/base.component";

export class LeftMenuComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator("body"));
  }

  // ---------------------------------------------------------------------------
  // Management section
  // ---------------------------------------------------------------------------
  get managementGroup(): Locator { return this.page.getByTestId("nav-main-group"); }
  get managementLabel(): Locator { return this.page.getByTestId("nav-main-label"); }
  get dashboardLink(): Locator { return this.page.getByTestId("nav-main-link-dashboard"); }
  get usersLink(): Locator { return this.page.getByTestId("nav-main-link-users"); }
  get resellersTrigger(): Locator { return this.page.getByTestId("nav-main-button-resellers"); }
  get resellersApplicationsLink(): Locator { return this.page.getByTestId("nav-main-link-applications"); }
  get resellersAccountsLink(): Locator { return this.page.getByTestId("nav-main-link-accounts"); }
  get merchantsLink(): Locator { return this.page.getByTestId("nav-main-link-merchants"); }
  get employeesLink(): Locator { return this.page.getByTestId("nav-main-link-employees"); }

  // ---------------------------------------------------------------------------
  // Features section
  // ---------------------------------------------------------------------------
  get featuresGroup(): Locator { return this.page.getByTestId("nav-features-label"); }
  get transactionsLink(): Locator { return this.page.getByTestId("nav-features-transactions"); }
  get customersLink(): Locator { return this.page.getByTestId("nav-features-customers"); }
  get virtualTerminalLink(): Locator { return this.page.getByTestId("nav-features-virtual-terminal"); }
  get terminalsLink(): Locator { return this.page.getByTestId("nav-features-terminals"); }
  get recurringTrigger(): Locator { return this.page.getByTestId("nav-features-recurring-trigger"); }
  get recurringPaymentsLink(): Locator { return this.page.getByTestId("nav-features-recurring-payments"); }
  get recurringPlansLink(): Locator { return this.page.getByTestId("nav-features-recurring-plans"); }
  get inventoryTrigger(): Locator { return this.page.getByTestId("nav-features-inventory-trigger"); }
  get inventoryCategoriesLink(): Locator { return this.page.getByTestId("nav-features-inventory-categories"); }
  get inventoryPackagesLink(): Locator { return this.page.getByTestId("nav-features-inventory-packages"); }
  get inventoryLocationsLink(): Locator { return this.page.getByTestId("nav-features-inventory-locations"); }
  get inventoryProductsLink(): Locator { return this.page.getByTestId("nav-features-inventory-products"); }
  get inventoryStockLink(): Locator { return this.page.getByTestId("nav-features-inventory-stock"); }
  get invoicesLink(): Locator { return this.page.getByTestId("nav-features-invoices"); }
  get merchantDefinedFieldsLink(): Locator { return this.page.getByTestId("nav-features-merchant-defined-fields"); }

  // ---------------------------------------------------------------------------
  // Management actions
  // ---------------------------------------------------------------------------
  async navigateToDashboard(): Promise<void> { await this.dashboardLink.click(); }
  async navigateToUsers(): Promise<void> { await this.usersLink.click(); }
  async navigateToMerchants(): Promise<void> { await this.merchantsLink.click(); }
  async navigateToEmployees(): Promise<void> { await this.employeesLink.click(); }

  async expandResellers(): Promise<void> {
    const collapsible = this.page.getByTestId("nav-main-collapsible-resellers");
    if ((await collapsible.getAttribute("data-state")) !== "open") {
      await this.resellersTrigger.click();
      await expect(this.resellersApplicationsLink).toBeVisible();
    }
  }

  async collapseResellers(): Promise<void> {
    const collapsible = this.page.getByTestId("nav-main-collapsible-resellers");
    if ((await collapsible.getAttribute("data-state")) === "open") {
      await this.resellersTrigger.click();
    }
  }

  async navigateToResellersApplications(): Promise<void> {
    await this.expandResellers();
    await this.resellersApplicationsLink.click();
  }

  async navigateToResellersAccounts(): Promise<void> {
    await this.expandResellers();
    await this.resellersAccountsLink.click();
  }

  // ---------------------------------------------------------------------------
  // Features actions
  // ---------------------------------------------------------------------------
  async navigateToTransactions(): Promise<void> { await this.transactionsLink.click(); }
  async navigateToCustomers(): Promise<void> { await this.customersLink.click(); }
  async navigateToVirtualTerminal(): Promise<void> { await this.virtualTerminalLink.click(); }
  async navigateToTerminals(): Promise<void> { await this.terminalsLink.click(); }

  async expandRecurring(): Promise<void> {
    const visible = await this.recurringPaymentsLink.isVisible().catch(() => false);
    if (!visible) {
      await this.recurringTrigger.click();
      await expect(this.recurringPaymentsLink).toBeVisible();
    }
  }

  async collapseRecurring(): Promise<void> {
    const visible = await this.recurringPaymentsLink.isVisible().catch(() => false);
    if (visible) await this.recurringTrigger.click();
  }

  async navigateToRecurringPayments(): Promise<void> {
    await this.expandRecurring();
    await this.recurringPaymentsLink.click();
  }

  async navigateToRecurringPlans(): Promise<void> {
    await this.expandRecurring();
    await this.recurringPlansLink.click();
  }

  async expandInventory(): Promise<void> {
    const visible = await this.inventoryCategoriesLink.isVisible().catch(() => false);
    if (!visible) {
      await this.inventoryTrigger.click();
      await expect(this.inventoryCategoriesLink).toBeVisible();
    }
  }

  async collapseInventory(): Promise<void> {
    const visible = await this.inventoryCategoriesLink.isVisible().catch(() => false);
    if (visible) await this.inventoryTrigger.click();
  }

  async navigateToInventoryCategories(): Promise<void> {
    await this.expandInventory();
    await this.inventoryCategoriesLink.click();
  }

  async navigateToInventoryPackages(): Promise<void> {
    await this.expandInventory();
    await this.inventoryPackagesLink.click();
  }

  async navigateToInventoryLocations(): Promise<void> {
    await this.expandInventory();
    await this.inventoryLocationsLink.click();
  }

  async navigateToInventoryProducts(): Promise<void> {
    await this.expandInventory();
    await this.inventoryProductsLink.click();
  }

  async navigateToInventoryStock(): Promise<void> {
    await this.expandInventory();
    await this.inventoryStockLink.click();
  }

  async navigateToInvoices(): Promise<void> { await this.invoicesLink.click(); }
  async navigateToMerchantDefinedFields(): Promise<void> { await this.merchantDefinedFieldsLink.click(); }

  // ---------------------------------------------------------------------------
  // Verification
  // ---------------------------------------------------------------------------
  async verifyManagementSectionVisible(): Promise<void> {
    await expect(this.managementGroup).toBeVisible();
    await expect(this.managementLabel).toContainText("Management");
  }

  async verifyFeaturesSectionVisible(): Promise<void> {
    await expect(this.featuresGroup).toBeVisible();
    await expect(this.featuresGroup).toContainText("Features");
  }

  async verifyMenuItemVisible(menuItem: Locator): Promise<void> {
    await expect(menuItem).toBeVisible();
  }

  async verifyMenuItemActive(menuItem: Locator): Promise<void> {
    await expect(menuItem).toHaveClass(/bg-primary/);
  }

  async verifyResellersExpanded(): Promise<void> {
    await expect(this.resellersApplicationsLink).toBeVisible();
    await expect(this.resellersAccountsLink).toBeVisible();
  }

  async verifyRecurringExpanded(): Promise<void> {
    await expect(this.recurringPaymentsLink).toBeVisible();
    await expect(this.recurringPlansLink).toBeVisible();
  }

  async verifyInventoryExpanded(): Promise<void> {
    await expect(this.inventoryCategoriesLink).toBeVisible();
    await expect(this.inventoryPackagesLink).toBeVisible();
    await expect(this.inventoryLocationsLink).toBeVisible();
    await expect(this.inventoryProductsLink).toBeVisible();
    await expect(this.inventoryStockLink).toBeVisible();
  }
}
