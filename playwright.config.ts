import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { getBaseURL, isCI } from "~/config/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./src/support/setup/global-setup.ts",
  globalTeardown: "./src/support/setup/global-teardown.ts",
  fullyParallel: true,
  forbidOnly: isCI(),
  retries: isCI() ? 2 : 0,
  workers: isCI() ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 15_000 },

  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/html", open: "never" }],
    ["json", { outputFile: "reports/test-results.json" }],
    ["junit", { outputFile: "reports/junit.xml" }],
    ["blob", { outputDir: "blob-report" }],
    ["allure-playwright", { resultsDir: "reports/allure-results", detail: true }],
    ...(process.env["GITHUB_ACTIONS"] ? [["github"] as const] : []),
  ],

  use: {
    baseURL: getBaseURL(),
    trace: "on",
    video: "on",
    screenshot: "on",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    testIdAttribute: "data-test",
  },

  outputDir: "test-results/",

  projects: [
    {
      name: "chromium-ui",
      testDir: "./tests/ui",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-api",
      testDir: "./tests/api",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
