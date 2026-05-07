#!/usr/bin/env tsx
/**
 * Run a custom test suite by path or grep pattern, then aggregate the JSON report.
 *
 * Usage:
 *   npm run test:suite -- tests/ui/smoke
 *   npm run test:suite -- --grep @critical
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: npm run test:suite -- <path|--grep PATTERN>");
    process.exit(1);
  }

  console.info(`▶ Running suite: ${args.join(" ")}`);
  const result = spawnSync("npx", ["playwright", "test", ...args, "--reporter=json"], {
    stdio: "inherit",
    shell: true,
  });

  const reportPath = path.resolve("reports/test-results.json");
  if (fs.existsSync(reportPath)) {
    const raw = fs.readFileSync(reportPath, "utf-8");
    const json = JSON.parse(raw);
    const stats = json.stats ?? {};
    console.info("\n📊 Suite stats:");
    console.info(`   total      : ${stats.expected ?? 0}`);
    console.info(`   unexpected : ${stats.unexpected ?? 0}`);
    console.info(`   skipped    : ${stats.skipped ?? 0}`);
    console.info(`   flaky      : ${stats.flaky ?? 0}`);
  }

  process.exit(result.status ?? 0);
}

main();
