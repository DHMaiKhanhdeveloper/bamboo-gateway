import { expect, type Locator } from "@playwright/test";
import { BasePage } from "~/core/base/base.page";

export type DiscountType = "None" | "Amount" | "Percentage";

export interface LocationFieldsData {
  location: string;
  cost: string;
  price: string;
  taxRate?: string;
  discountType?: DiscountType;
  discount?: string;
  inventory?: {
    enabled: boolean;
    onHand?: string;
    onOrder?: string;
    alertLevel?: string;
  };
}

export class ProductPage extends BasePage {
  protected override get urlPath(): string { return "/products"; }
  protected override readyLocator(): Locator { return this.productsListHeading; }

  // ---------------------------------------------------------------------------
  // Headings
  // ---------------------------------------------------------------------------
  get createProductHeading(): Locator { return this.page.getByRole("heading", { name: "Create Product" }); }
  get updateProductHeading(): Locator { return this.page.getByRole("heading", { name: "Update Product" }); }
  get productsListHeading(): Locator { return this.page.getByRole("heading", { name: "Products" }); }

  // ---------------------------------------------------------------------------
  // Basic fields
  // ---------------------------------------------------------------------------
  get productNameInput(): Locator { return this.page.getByTestId("product-name-input"); }
  get categorySelect(): Locator { return this.page.getByTestId("product-category-select"); }
  get addCategoryButton(): Locator { return this.page.getByTestId("add-category-button"); }
  get descriptionTextarea(): Locator { return this.page.getByTestId("product-description-textarea"); }
  get imageInput(): Locator { return this.page.getByTestId("product-image-input"); }
  get skuInput(): Locator { return this.page.getByTestId("product-sku-input"); }
  get upcInput(): Locator { return this.page.getByTestId("product-upc-input"); }
  get commodityCodeSelect(): Locator { return this.page.getByTestId("product-commodity-code-select"); }
  get unitSelect(): Locator { return this.page.getByTestId("product-unit-select"); }

  // Submit
  get submitButton(): Locator { return this.page.getByTestId("product-submit-button"); }
  get createProductButton(): Locator { return this.page.getByRole("button", { name: "Create Product" }); }
  get updateProductButton(): Locator { return this.page.getByRole("button", { name: "Update Product" }); }

  // Location-indexed
  getLocationSelect(i: number): Locator { return this.page.getByTestId(`product-location-select-${i}`); }
  getAddLocationButton(i: number): Locator { return this.page.getByTestId(`add-location-button-${i}`); }
  getLocationCostInput(i: number): Locator { return this.page.getByTestId(`product-location-cost-input-${i}`); }
  getLocationPriceInput(i: number): Locator { return this.page.getByTestId(`product-location-price-input-${i}`); }
  getLocationTaxRateInput(i: number): Locator { return this.page.getByTestId(`product-location-tax-rate-input-${i}`); }
  getLocationDiscountInput(i: number): Locator { return this.page.getByTestId(`product-location-discount-input-${i}`); }
  getLocationDiscountRateInput(i: number): Locator { return this.page.getByTestId(`product-location-discount-rate-input-${i}`); }
  getLocationNonInventoryCheckbox(i: number): Locator { return this.page.getByTestId(`product-location-non-inventory-checkbox-${i}`); }
  getLocationOnHandInput(i: number): Locator { return this.page.getByTestId(`product-location-on-hand-input-${i}`); }
  getLocationOnOrderInput(i: number): Locator { return this.page.getByTestId(`product-location-on-order-input-${i}`); }
  getLocationAlertLevelInput(i: number): Locator { return this.page.getByTestId(`product-location-alert-level-input-${i}`); }
  getLocationRow(i: number): Locator { return this.page.getByTestId(`product-location-row-${i}`); }
  getLocationName(i: number): Locator { return this.page.getByTestId(`product-location-name-${i}`); }

  get addLocationButton(): Locator { return this.page.getByTestId("add-location-button"); }

  getLocationDiscountTypeCombobox(i: number): Locator {
    return this.page
      .getByTestId(`product-location-row-${i}`)
      .getByRole("combobox")
      .filter({ hasText: /None|Amount|Percentage/i });
  }

  getLocationCurrencyCombobox(i: number): Locator {
    return this.page
      .getByTestId(`product-location-row-${i}`)
      .getByRole("combobox")
      .filter({ hasText: /USD/i });
  }

  // Modals
  get categoryModal(): Locator { return this.page.getByTestId("category-modal"); }
  get locationModal(): Locator { return this.page.getByTestId("location-modal"); }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  async gotoCreateProduct(merchantId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/products/add`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(this.createProductHeading).toBeVisible({ timeout: 10_000 });
  }

  async gotoProductDetail(merchantId: string, productId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/products/${productId}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(this.updateProductHeading).toBeVisible({ timeout: 10_000 });
  }

  async gotoProductsList(merchantId: string): Promise<void> {
    await this.page.goto(`/${merchantId}/products`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(this.productsListHeading).toBeVisible({ timeout: 10_000 });
  }

  // ---------------------------------------------------------------------------
  // Field actions
  // ---------------------------------------------------------------------------
  async fillProductName(name: string): Promise<void> { await this.productNameInput.fill(name); }
  async fillDescription(description: string): Promise<void> { await this.descriptionTextarea.fill(description); }
  async fillSKU(sku: string): Promise<void> { await this.skuInput.fill(sku); }
  async fillUPC(upc: string): Promise<void> { await this.upcInput.fill(upc); }

  async selectCategory(categoryName: string): Promise<void> {
    await this.categorySelect.click();
    await this.page.waitForTimeout(1_000);
    await this.page.getByRole("option", { name: categoryName }).click({ timeout: 2_000 });
    await this.page.waitForTimeout(500);
  }

  async selectCommodityCode(): Promise<void> {
    await this.commodityCodeSelect.click();
    await this.page.waitForTimeout(1_000);
    await this.page.getByRole("option").first().click({ timeout: 2_000 });
    await this.page.waitForTimeout(500);
  }

  async selectUnit(): Promise<void> {
    await this.unitSelect.click();
    await this.page.waitForTimeout(1_000);
    await this.page.getByRole("option").first().click({ timeout: 2_000 });
    await this.page.waitForTimeout(500);
  }

  async selectLocation(index: number, locationName: string): Promise<void> {
    await this.getLocationSelect(index).click();
    await this.page.waitForTimeout(2_000);

    const locationOption = this.page
      .getByRole("option", { name: new RegExp(locationName, "i") })
      .first();

    try {
      const isVisible = await locationOption.isVisible({ timeout: 1_000 });
      if (isVisible) {
        await locationOption.click({ timeout: 2_000 });
        await this.page.waitForTimeout(1_000);
        return;
      }
    } catch {
      // option doesn't exist — create it
    }

    await this.page.keyboard.press("Escape");
    await this.page.waitForTimeout(500);
    await this.getAddLocationButton(index).click();
    await this.page.waitForTimeout(1_000);
    await expect(this.locationModal).toBeVisible({ timeout: 5_000 });

    const locationInput = this.locationModal.getByPlaceholder("Enter Location Name");
    await locationInput.fill(locationName);
    await this.page.waitForTimeout(500);

    await this.locationModal.getByRole("button", { name: "Create" }).click();
    await this.page.waitForTimeout(2_000);
    await expect(this.locationModal).not.toBeVisible({ timeout: 5_000 });

    await this.getLocationSelect(index).click();
    await this.page.waitForTimeout(2_000);
    await this.page
      .getByRole("option", { name: new RegExp(locationName, "i") })
      .first()
      .click({ timeout: 2_000 });
    await this.page.waitForTimeout(1_000);
  }

  async fillLocationCost(i: number, cost: string): Promise<void> { await this.getLocationCostInput(i).fill(cost); }
  async fillLocationPrice(i: number, price: string): Promise<void> { await this.getLocationPriceInput(i).fill(price); }
  async fillLocationTaxRate(i: number, taxRate: string): Promise<void> { await this.getLocationTaxRateInput(i).fill(taxRate); }

  async selectDiscountType(index: number, type: DiscountType): Promise<void> {
    const combobox = this.getLocationDiscountTypeCombobox(index);
    await combobox.click();
    await this.page.waitForTimeout(1_000);
    await this.page.getByRole("option", { name: type }).click({ timeout: 2_000 });
    await this.page.waitForTimeout(1_000);
  }

  async fillLocationDiscount(i: number, discount: string): Promise<void> {
    await this.getLocationDiscountInput(i).fill(discount);
  }

  async fillLocationDiscountRate(i: number, discountRate: string): Promise<void> {
    await this.getLocationDiscountRateInput(i).fill(discountRate);
  }

  async setInventoryEnabled(i: number, enabled: boolean): Promise<void> {
    const checkbox = this.getLocationNonInventoryCheckbox(i);
    const isChecked = await checkbox.isChecked();
    if ((enabled && isChecked) || (!enabled && !isChecked)) {
      await checkbox.click();
      await this.page.waitForTimeout(1_000);
    }
  }

  async fillLocationOnHand(i: number, onHand: string): Promise<void> { await this.getLocationOnHandInput(i).fill(onHand); }
  async fillLocationOnOrder(i: number, onOrder: string): Promise<void> { await this.getLocationOnOrderInput(i).fill(onOrder); }
  async fillLocationAlertLevel(i: number, alertLevel: string): Promise<void> { await this.getLocationAlertLevelInput(i).fill(alertLevel); }

  async expandLocationRow(index: number): Promise<void> {
    const row = this.page.getByTestId(`product-location-row-${index}`);
    const header = row.getByRole("heading", { level: 4 });
    const clickableContainer = header
      .locator("xpath=ancestor::div[contains(@class, 'cursor-pointer')]")
      .first();
    await clickableContainer.click();
    await this.page.waitForTimeout(1_000);
  }

  async addNewLocation(): Promise<void> {
    await this.addLocationButton.click();
    await this.page.waitForTimeout(1_000);
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  async submitForm(): Promise<void> { await this.submitButton.click(); }
  async createProduct(): Promise<void> { await this.createProductButton.click(); }
  async updateProduct(): Promise<void> { await this.updateProductButton.click(); }

  // ---------------------------------------------------------------------------
  // Verifications
  // ---------------------------------------------------------------------------
  async verifyProductName(v: string): Promise<void> { await expect(this.productNameInput).toHaveValue(v); }
  async verifyCategory(v: string): Promise<void> { await expect(this.categorySelect).toContainText(v); }
  async verifyDescription(v: string): Promise<void> { await expect(this.descriptionTextarea).toHaveValue(v); }
  async verifySKU(v: string): Promise<void> { await expect(this.skuInput).toHaveValue(v); }
  async verifyUPC(v: string): Promise<void> { await expect(this.upcInput).toHaveValue(v); }

  async verifyLocationCost(i: number, cost: string): Promise<void> {
    await expect(this.getLocationCostInput(i)).toHaveValue(`$${cost}`);
  }

  async verifyLocationPrice(i: number, price: string): Promise<void> {
    await expect(this.getLocationPriceInput(i)).toHaveValue(`$${price}`);
  }

  async verifyLocationTaxRate(i: number, taxRate: string): Promise<void> {
    const value = await this.getLocationTaxRateInput(i).inputValue();
    expect(parseFloat(value)).toBeCloseTo(parseFloat(taxRate), 1);
  }

  async verifyLocationDiscount(i: number, discount: string): Promise<void> {
    await expect(this.getLocationDiscountInput(i)).toHaveValue(`$${discount}`);
  }

  async verifyLocationDiscountRate(i: number, discountRate: string): Promise<void> {
    const value = await this.getLocationDiscountRateInput(i).inputValue();
    expect(parseFloat(value)).toBeCloseTo(parseFloat(discountRate), 1);
  }

  async verifyInventoryEnabled(i: number, enabled: boolean): Promise<void> {
    const checkbox = this.getLocationNonInventoryCheckbox(i);
    if (enabled) await expect(checkbox).not.toBeChecked();
    else await expect(checkbox).toBeChecked();
  }

  async verifyLocationOnHand(i: number, onHand: string): Promise<void> {
    const value = await this.getLocationOnHandInput(i).inputValue();
    expect(parseFloat(value)).toBeCloseTo(parseFloat(onHand), 0);
  }

  async verifyLocationOnOrder(i: number, onOrder: string): Promise<void> {
    const value = await this.getLocationOnOrderInput(i).inputValue();
    expect(parseFloat(value)).toBeCloseTo(parseFloat(onOrder), 0);
  }

  async verifyLocationAlertLevel(i: number, alertLevel: string): Promise<void> {
    await expect(this.getLocationAlertLevelInput(i)).toHaveValue(alertLevel);
  }

  async verifyLocationName(i: number, name: string): Promise<void> {
    await expect(this.getLocationSelect(i)).toContainText(name);
  }

  // ---------------------------------------------------------------------------
  // Composite filling
  // ---------------------------------------------------------------------------
  async fillLocationFields(index: number, data: LocationFieldsData): Promise<void> {
    await this.selectLocation(index, data.location);
    await this.fillLocationCost(index, data.cost);
    await this.fillLocationPrice(index, data.price);

    if (data.taxRate) {
      await this.fillLocationTaxRate(index, data.taxRate);
    }

    if (data.discountType && data.discountType !== "None") {
      await this.selectDiscountType(index, data.discountType);
      if (data.discount) {
        if (data.discountType === "Percentage") {
          await this.fillLocationDiscountRate(index, data.discount);
        } else {
          await this.fillLocationDiscount(index, data.discount);
        }
      }
    }

    if (data.inventory) {
      await this.setInventoryEnabled(index, data.inventory.enabled);
      if (data.inventory.enabled) {
        if (data.inventory.onHand) await this.fillLocationOnHand(index, data.inventory.onHand);
        if (data.inventory.onOrder) await this.fillLocationOnOrder(index, data.inventory.onOrder);
        if (data.inventory.alertLevel) await this.fillLocationAlertLevel(index, data.inventory.alertLevel);
      }
    }
  }
}
