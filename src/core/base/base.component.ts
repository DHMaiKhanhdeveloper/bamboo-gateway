import type { Locator, Page } from "@playwright/test";
import { Logger } from "~/core/logger/logger";

/**
 * Foundation for component / section objects.
 *
 * A component is a reusable UI unit (header, sidebar, modal, card)
 * scoped to a root `Locator`. All child queries should resolve through
 * `this.root` so the component composes cleanly inside any parent page.
 */
export abstract class BaseComponent {
  protected readonly log: Logger;

  constructor(
    public readonly page: Page,
    public readonly root: Locator
  ) {
    this.log = new Logger({ scope: this.constructor.name });
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async waitForVisible(): Promise<void> {
    await this.root.waitFor({ state: "visible" });
  }

  async waitForHidden(): Promise<void> {
    await this.root.waitFor({ state: "hidden" });
  }
}
