import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium, type FullConfig } from "@playwright/test";
import dotenv from "dotenv";
import {
  getApiBaseURL,
  getAuthCredentials,
  getBaseURL,
  getDemoMerchantIdSync,
  getTsysMerchantIdSync,
} from "~/config/env";
import { AuthStateManager } from "~/support/auth/auth-state-manager";
import { LoginPage } from "~/pages/auth/login.page";
import { Logger } from "~/core/logger/logger";
import { AUTH_ROLES } from "~/config/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");

dotenv.config({ path: path.resolve(ROOT, ".env") });
dotenv.config({ path: path.resolve(ROOT, ".env.local") });

const log = new Logger({ scope: "global-setup" });
const validatedMerchants = new Set<string>();

async function checkMerchantExists(merchantId: string): Promise<boolean> {
  if (validatedMerchants.has(merchantId)) return true;
  try {
    const apiBaseUrl = getApiBaseURL();
    const response = await fetch(`${apiBaseUrl}/merchants/${merchantId}`, { method: "HEAD" });
    const exists = response.status !== 404;
    if (exists) validatedMerchants.add(merchantId);
    return exists;
  } catch (err) {
    log.warn(
      `Could not validate merchant ${merchantId}`,
      err instanceof Error ? err.message : "unknown"
    );
    validatedMerchants.add(merchantId);
    return true;
  }
}

async function validateMerchants(): Promise<void> {
  log.info("Validating merchant configurations");
  const tsysId = getTsysMerchantIdSync();
  if (!(await checkMerchantExists(tsysId))) {
    throw new Error(`TSYS merchant ID ${tsysId} does not exist`);
  }
  log.info(`TSYS merchant: ${tsysId}`);

  const demoId = getDemoMerchantIdSync();
  if (!(await checkMerchantExists(demoId))) {
    throw new Error(`Demo merchant ID ${demoId} does not exist`);
  }
  log.info(`Demo merchant: ${demoId}`);
}

async function performGlobalAuthentication(): Promise<void> {
  log.info("Starting global authentication");

  if (AuthStateManager.isAuthStateValid(AUTH_ROLES.admin)) {
    log.info("Valid admin auth state found — skipping fresh login");
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: getBaseURL() });
  try {
    const credentials = getAuthCredentials();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(credentials.username, credentials.password, credentials.totpSecret);
    await AuthStateManager.saveAuthState(context, AUTH_ROLES.admin);
    log.info("Global authentication completed");
  } catch (err) {
    log.error("Global authentication failed", err);
    throw err;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function setupTestData(): Promise<void> {
  log.info("Validating seed data files");
  const required = [
    path.resolve(ROOT, "src/data/seeds/users.json"),
    path.resolve(ROOT, "src/data/seeds/merchant.json"),
    path.resolve(ROOT, "src/data/seeds/products.csv"),
  ];
  for (const file of required) {
    if (!fs.existsSync(file)) throw new Error(`Required seed file not found: ${file}`);
  }
  log.info("Seed data validated");
}

async function globalSetup(_config: FullConfig): Promise<void> {
  log.info("🚀 Global setup starting");
  AuthStateManager.initializeAuthState();
  await validateMerchants();
  await performGlobalAuthentication();
  await setupTestData();
  log.info("✅ Global setup completed");
}

export default globalSetup;
