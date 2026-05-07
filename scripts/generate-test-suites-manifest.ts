#!/usr/bin/env tsx
/**
 * Walk the tests/ tree and emit a manifest of suites.
 * Useful for CI dashboards and shard distribution.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

interface SuiteEntry {
  path: string;
  category: "smoke" | "e2e" | "tickets" | "api" | "other";
  name: string;
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && full.endsWith(".spec.ts")) acc.push(full);
  }
  return acc;
}

function categorize(rel: string): SuiteEntry["category"] {
  if (rel.includes("/smoke/")) return "smoke";
  if (rel.includes("/tickets/")) return "tickets";
  if (rel.startsWith("tests/api/") || rel.includes("/api/")) return "api";
  if (rel.includes("/e2e/")) return "e2e";
  return "other";
}

function main(): void {
  const all = walk(path.resolve(ROOT, "tests"));
  const entries: SuiteEntry[] = all.map((abs) => {
    const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
    return {
      path: rel,
      category: categorize(rel),
      name: path.basename(rel, ".spec.ts"),
    };
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: entries.length,
    byCategory: entries.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + 1;
      return acc;
    }, {}),
    entries,
  };

  const out = path.resolve(ROOT, "test-suites-manifest.json");
  fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
  console.info(`📄 Wrote ${entries.length} suites to ${out}`);
}

main();
