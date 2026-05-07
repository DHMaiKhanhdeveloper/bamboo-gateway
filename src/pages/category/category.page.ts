import { expect, type Locator } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { BasePage } from "~/core/base/base.page";

export class CategoryPage extends BasePage {
  // Default merchant scope used when no merchantId is supplied
  private static readonly DEFAULT_MERCHANT = "0195a866-8ac7-7f85-ab69-b124567b42e1";

  protected override get urlPath(): string {
    return `/${CategoryPage.DEFAULT_MERCHANT}/categories`;
  }

  protected override readyLocator(): Locator {
    return this.createCategoryText;
  }

  // Locators
  get nameInput(): Locator {
    return this.page.locator('input[name="name"]');
  }

  get successMessage(): Locator {
    return this.page.getByText("The category has been created successfully");
  }

  get deleteSuccessMessage(): Locator {
    return this.page.getByText("Category has been successfully deleted");
  }

  get createCategoryText(): Locator {
    return this.page.getByRole("heading", { name: "Categories", level: 2 });
  }

  // Actions
  async categoryDeleteButton(): Promise<void> {
    const menuFirstAction = this.page
      .locator('table button[data-slot="dropdown-menu-trigger"]')
      .first();
    await expect(menuFirstAction).toBeVisible();
    await menuFirstAction.click();
    await this.page.waitForTimeout(1000);
    const deleteButton = this.page.locator('div[data-slot="dropdown-menu-item"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  }

  async gotoCategoryList(merchantId: string = CategoryPage.DEFAULT_MERCHANT): Promise<void> {
    this.log.info("Navigating to category list");
    await this.page.goto(`/${merchantId}/categories`, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await expect(this.createCategoryText).toBeVisible();
  }

  async createCategory(): Promise<string> {
    this.log.info("Creating new category");
    await this.page.getByRole("button", { name: "Add Category" }).click();
    const newCategoryName = faker.internet.username();
    await this.nameInput.fill(newCategoryName);
    await this.page.getByRole("button", { name: "Create" }).click();
    await expect(this.successMessage).toBeVisible();
    this.log.info(`Category created: ${newCategoryName}`);
    return newCategoryName;
  }

  async removeCategoryFirst(): Promise<void> {
    await this.categoryDeleteButton();
    const category = this.page.locator("tbody tr:first-child td:first-child div").first();
    const categoryName = await category.innerText({ timeout: 3000 });
    this.log.info(`Removing category: ${categoryName}`);
    await this.page.getByRole("button", { name: "Delete" }).click();
    await expect(this.deleteSuccessMessage).toBeVisible();
  }
}
