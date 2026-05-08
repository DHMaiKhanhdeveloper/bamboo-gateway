#!/usr/bin/env tsx
/**
 * CLI tool for managing authentication state.
 *
 * Usage:
 *   npm run auth login   - Generate fresh auth state (admin role by default)
 *   npm run auth clear   - Clear all cached auth states
 *   npm run auth status  - Show current state validity
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import dotenv from "dotenv";
import { AuthStateManager } from "~/support/auth/auth-state-manager";
import { getAuthCredentials, getBaseURL } from "~/config/env";
import { LoginPage } from "~/pages/auth/login.page";
import { AUTH_ROLES, type AuthRole } from "~/config/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

type Command = "login" | "clear" | "status";

async function login(role: AuthRole): Promise<void> {
  console.info(`🔐 Performing fresh login for role '${role}'...`);
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: getBaseURL() });
  try {
    const credentials = getAuthCredentials();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(credentials.username, credentials.password, credentials.totpSecret);
    await AuthStateManager.saveAuthState(context, role);
    console.info(`✅ Auth state saved for '${role}'`);
  } finally {
    await context.close();
    await browser.close();
  }
}

function clear(role?: AuthRole): void {
  AuthStateManager.clearAuthState(role);
  console.info(role ? `🧹 Cleared auth state for '${role}'` : "🧹 Cleared all auth states");
}

function status(): void {
  for (const role of Object.values(AUTH_ROLES) as AuthRole[]) {
    const valid = AuthStateManager.isAuthStateValid(role);
    const file = AuthStateManager.getAuthStateFilePath(role);
    console.info(
      `  ${role.padEnd(20)} ${valid ? "✅ valid" : "❌ missing/expired"}${file ? ` (${file})` : ""}`
    );
  }
}

async function main(): Promise<void> {
  const [command = "status", roleArg] = process.argv.slice(2);
  const role = (roleArg as AuthRole | undefined) ?? AUTH_ROLES.admin;

  switch (command as Command) {
    case "login":
      await login(role);
      break;
    case "clear":
      clear(roleArg ? (roleArg as AuthRole) : undefined);
      break;
    case "status":
      status();
      break;
    default:
      console.error(`Unknown command '${command}'. Use: login | clear | status`);
      process.exit(1);
  }
}

await main();
