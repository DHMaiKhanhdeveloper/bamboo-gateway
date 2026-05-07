#!/usr/bin/env tsx
/**
 * Aggregate multiple Playwright JSON results into a single summary.
 * Looks at reports/test-results.json + any sharded blob report files.
 */
import fs from "node:fs";
import path from "node:path";

interface AggregateResult {
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  durationMs: number;
}

function aggregate(file: string, agg: AggregateResult): void {
  if (!fs.existsSync(file)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    const stats = raw.stats ?? {};
    agg.passed += (stats.expected ?? 0) - (stats.unexpected ?? 0);
    agg.failed += stats.unexpected ?? 0;
    agg.skipped += stats.skipped ?? 0;
    agg.flaky += stats.flaky ?? 0;
    agg.durationMs += stats.duration ?? 0;
  } catch (err) {
    console.warn(`Could not parse ${file}:`, err);
  }
}

function main(): void {
  const agg: AggregateResult = { passed: 0, failed: 0, skipped: 0, flaky: 0, durationMs: 0 };
  aggregate(path.resolve("reports/test-results.json"), agg);
  fs.writeFileSync(
    path.resolve("test-aggregation.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), ...agg }, null, 2)
  );
  console.info(
    `📊 Aggregate: passed=${agg.passed} failed=${agg.failed} skipped=${agg.skipped} flaky=${agg.flaky} duration=${(agg.durationMs / 1000).toFixed(1)}s`
  );
}

main();
