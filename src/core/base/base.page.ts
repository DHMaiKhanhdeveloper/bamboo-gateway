import type { Page, Response, Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { Logger } from "~/core/logger/logger";

/**
 * Abstract foundation for all UI page objects.
 *
 * Subclasses must define:
 *   - `urlPath`  — relative path used by goto()
 *   - `readyLocator()` — element that signals the page has finished loading
 *
 * Design contract:
 *   - Page Objects expose locators via getter properties (lazy, no constructor work)
 *   - Public methods are user-actions: `clickX()`, `fillY()`, `verifyZ()`
 *   - Avoid leaking raw `Locator` objects across module boundaries
 */
export abstract class BasePage {
  protected readonly log: Logger;

  constructor(public readonly page: Page) {
    this.log = new Logger({ scope: this.constructor.name });
  }

  /** Relative URL path (e.g. `/login`). Subclasses override. */
  protected abstract get urlPath(): string;

  /** Element that signals the page has finished loading. */
  protected abstract readyLocator(): Locator;

  /**
   * Navigate to this page (relative to baseURL) and wait until ready.
   */
  async goto(query: string = ""): Promise<Response | null> {
    const target = this.urlPath + query;
    this.log.info(`goto ${target}`);
    const response = await this.page.goto(target);
    await this.waitForReady();
    return response;
  }

  /**
   * Block until the page is interactive (network idle + ready locator visible).
   */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.readyLocator()).toBeVisible();
  }

  /**
   * Assert the current URL matches a substring or regex.
   */
  async expectUrl(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }

  /**
   * Capture a screenshot to the configured output directory.
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Reload and re-await readiness.
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForReady();
  }
}
