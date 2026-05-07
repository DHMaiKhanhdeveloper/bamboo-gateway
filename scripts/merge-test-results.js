#!/usr/bin/env node
/**
 * Merge Playwright blob reports from multiple shards into a single HTML report.
 * Wrapper around `playwright merge-reports`.
 *
 * Usage:
 *   node scripts/merge-test-results.js merge
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const command = process.argv[2] ?? "merge";

if (command !== "merge") {
  console.error(`Unknown command '${command}'. Only 'merge' is supported.`);
  process.exit(1);
}

const blobDir = path.resolve("blob-report");
if (!fs.existsSync(blobDir)) {
  console.error(`No blob-report/ directory found. Run tests with reporter=blob first.`);
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["playwright", "merge-reports", "--reporter=html,json", blobDir],
  { stdio: "inherit", shell: true }
);

process.exit(result.status ?? 0);
