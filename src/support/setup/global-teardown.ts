import type { FullConfig } from "@playwright/test";
import { Logger } from "~/core/logger/logger";

const log = new Logger({ scope: "global-teardown" });

async function globalTeardown(_config: FullConfig): Promise<void> {
  log.info("🧹 Global teardown starting");
  // Hook point for future cleanup: drop test merchants, clear caches, etc.
  log.info("✅ Global teardown completed");
}

export default globalTeardown;
