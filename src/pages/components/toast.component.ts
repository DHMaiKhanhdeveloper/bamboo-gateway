import { expect, type Locator, type Page } from "@playwright/test";
import { BaseComponent } from "~/core/base/base.component";

export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Sonner toast notifications. Replaces the old `ToastUtils` static class with a
 * proper component object that can be reused as `toast.dismissError()` etc.
 *
 * For convenience, all original `ToastUtils.*` static methods are kept on this
 * class as static delegates so existing tests can be ported by changing only
 * imports.
 */
export class ToastComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator("[data-sonner-toast]"));
  }

  // ---------------------------------------------------------------------------
  // Locators
  // ---------------------------------------------------------------------------
  byType(type: ToastType): Locator {
    return this.page.locator(`[data-sonner-toast][data-type="${type}"]`);
  }

  get closeButton(): Locator {
    return this.page.locator("[data-sonner-toast] [data-close-button]");
  }

  // ---------------------------------------------------------------------------
  // Instance API
  // ---------------------------------------------------------------------------
  async waitForVisibleByType(type: ToastType): Promise<void> {
    await expect(this.byType(type).first()).toBeVisible();
  }

  async dismissOne(): Promise<void> {
    await this.closeButton.first().click();
  }

  async waitAndDismiss(type: ToastType): Promise<void> {
    await this.waitForVisibleByType(type);
    await this.dismissOne();
    await expect(this.byType(type)).not.toBeVisible();
  }

  async dismissAll(): Promise<void> {
    const toasts = this.root;
    const count = await toasts.count();
    for (let i = 0; i < count; i++) {
      await toasts.nth(i).locator("[data-close-button]").click();
    }
    await expect(toasts).not.toBeVisible();
  }

  async verifyNoneVisible(): Promise<void> {
    await expect(this.root).not.toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Static delegates (back-compat with old ToastUtils)
  // ---------------------------------------------------------------------------
  static async dismissErrorToast(page: Page): Promise<void> {
    await new ToastComponent(page).dismissOne();
    await expect(page.locator('[data-sonner-toast][data-type="error"]')).not.toBeVisible();
  }

  static async waitForAndDismissErrorToast(page: Page): Promise<void> {
    await new ToastComponent(page).waitAndDismiss("error");
  }

  static async waitForAndDismissSuccessToast(page: Page): Promise<void> {
    await new ToastComponent(page).waitAndDismiss("success");
  }

  static async waitForAndDismissWarningToast(page: Page): Promise<void> {
    await new ToastComponent(page).waitAndDismiss("warning");
  }

  static async waitForAndDismissInfoToast(page: Page): Promise<void> {
    await new ToastComponent(page).waitAndDismiss("info");
  }

  static async dismissAllToasts(page: Page): Promise<void> {
    await new ToastComponent(page).dismissAll();
  }

  static async verifyNoToastsVisible(page: Page): Promise<void> {
    await new ToastComponent(page).verifyNoneVisible();
  }
}
