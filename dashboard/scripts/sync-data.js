#!/usr/bin/env node
/**
 * Sync test data from the parent Playwright project into the dashboard.
 *
 * Copies:
 *   ../test-aggregation.json     → public/test-aggregation.json
 *   ../test-suites-manifest.json → public/test-suites-manifest.json
 *   ../reports/html              → public/reports
 *   ../reports/allure-report     → public/allure-report (if exists)
 *   ../test-results              → public/test-artifacts (screenshots/videos)
 *
 * Builds (from ../reports/test-results.json):
 *   public/test-suites.json   — list view (suite-level summary)
 *   public/suite-details.json — detail view (per-test results, errors, attachments)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DASHBOARD_ROOT = path.resolve(__dirname, "..");
const PARENT_ROOT = path.resolve(DASHBOARD_ROOT, "..");
const PUBLIC_DIR = path.join(DASHBOARD_ROOT, "public");
const ARTIFACTS_DIR = path.join(PUBLIC_DIR, "test-artifacts");

function copyIfExists(src, dest, label) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Skip ${label}: source not found (${src})`);
    return false;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  console.info(`✅ Copied ${label}: ${src} → ${dest}`);
  return true;
}

// Strip ANSI escape codes (color formatting) from Playwright error messages
function stripAnsi(s) {
  if (!s) return s;
  // eslint-disable-next-line no-control-regex
  return s.replace(/\[[0-9;]*m/g, "");
}

function toRelArtifactUrl(absPath) {
  if (!absPath) return null;
  const TEST_RESULTS = path.join(PARENT_ROOT, "test-results");
  const norm = path.resolve(absPath);
  if (!norm.startsWith(TEST_RESULTS)) return null;
  const rel = path.relative(TEST_RESULTS, norm).split(path.sep).join("/");
  return `/test-artifacts/${rel}`;
}

function statusFromTest(t) {
  if (t.status === "expected") return "passed";
  if (t.status === "unexpected") return "failed";
  if (t.status === "skipped") return "skipped";
  if (t.status === "flaky") return "flaky";
  return t.status ?? "unknown";
}

function build() {
  const playwrightJsonPath = path.join(PARENT_ROOT, "reports", "test-results.json");
  if (!fs.existsSync(playwrightJsonPath)) {
    console.warn(`⚠️  Skip build: ${playwrightJsonPath} not found`);
    return;
  }

  const raw = JSON.parse(fs.readFileSync(playwrightJsonPath, "utf-8"));
  const suiteMap = new Map();

  function walk(node) {
    if (!node) return;
    for (const child of node.suites ?? []) walk(child);
    for (const spec of node.specs ?? []) {
      const file = spec.file ?? node.file ?? "unknown";
      const parts = file.split(/[\\/]/);
      const fileName = parts[parts.length - 1].replace(/\.spec\.ts$/, "");
      const category = parts.length > 1 ? parts[parts.length - 2] : "uncategorized";
      const key = fileName;
      if (!suiteMap.has(key)) {
        suiteMap.set(key, {
          suiteName: fileName,
          category,
          file,
          counts: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
          tests: [],
          lastRun: raw.stats?.startTime ?? new Date().toISOString(),
        });
      }
      const entry = suiteMap.get(key);
      for (const test of spec.tests ?? []) {
        const status = statusFromTest(test);
        entry.counts.total += 1;
        if (status === "passed") entry.counts.passed += 1;
        else if (status === "failed") entry.counts.failed += 1;
        else if (status === "skipped") entry.counts.skipped += 1;
        else if (status === "flaky") entry.counts.flaky += 1;

        const lastResult = test.results?.[test.results.length - 1] ?? {};
        const errorRaw = lastResult.error;
        const error = errorRaw
          ? {
              message: stripAnsi(errorRaw.message),
              snippet: stripAnsi(errorRaw.snippet),
              location: errorRaw.location
                ? `${path
                    .relative(PARENT_ROOT, errorRaw.location.file)
                    .split(path.sep)
                    .join("/")}:${errorRaw.location.line}:${errorRaw.location.column}`
                : null,
            }
          : null;

        const annotations = (test.annotations ?? []).map((a) => ({
          type: a.type,
          description: a.description ?? null,
        }));

        const attachments = (lastResult.attachments ?? [])
          .map((a) => ({
            name: a.name,
            contentType: a.contentType,
            url: toRelArtifactUrl(a.path),
          }))
          .filter((a) => a.url);

        const stdout = (lastResult.stdout ?? [])
          .map((s) => stripAnsi(s.text ?? ""))
          .join("");

        entry.tests.push({
          title: spec.title,
          status,
          duration: lastResult.duration ?? 0,
          startTime: lastResult.startTime ?? null,
          retry: lastResult.retry ?? 0,
          tags: spec.tags ?? [],
          line: spec.line ?? null,
          error,
          annotations,
          attachments,
          stdout: stdout.length > 0 ? stdout : null,
          projectName: test.projectName ?? null,
        });
      }
    }
  }
  walk(raw);

  // Build summary list (suites)
  const suites = Array.from(suiteMap.values()).map((s) => {
    const { passed, failed, flaky, total } = s.counts;
    const status = failed > 0 ? "failed" : flaky > 0 ? "flaky" : "passed";
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    return {
      suiteName: s.suiteName,
      category: s.category,
      status,
      lastRun: s.lastRun,
      successRate,
      healthScore: successRate,
      testCounts: s.counts,
    };
  });

  const summary = {
    suites,
    lastUpdated: new Date().toISOString(),
    totalSuites: suites.length,
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, "test-suites.json"),
    JSON.stringify(summary, null, 2)
  );
  console.info(`✅ Built test-suites.json: ${suites.length} suites`);

  // Build details (per-test)
  const detailsMap = {};
  for (const s of suiteMap.values()) {
    detailsMap[s.suiteName] = {
      suiteName: s.suiteName,
      category: s.category,
      file: s.file,
      counts: s.counts,
      lastRun: s.lastRun,
      tests: s.tests,
    };
  }
  fs.writeFileSync(
    path.join(PUBLIC_DIR, "suite-details.json"),
    JSON.stringify(
      { suites: detailsMap, lastUpdated: new Date().toISOString() },
      null,
      2
    )
  );
  const totalTests = Object.values(detailsMap).reduce(
    (sum, s) => sum + s.tests.length,
    0
  );
  console.info(
    `✅ Built suite-details.json: ${Object.keys(detailsMap).length} suites, ${totalTests} tests`
  );
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  copyIfExists(
    path.join(PARENT_ROOT, "test-aggregation.json"),
    path.join(PUBLIC_DIR, "test-aggregation.json"),
    "test-aggregation.json"
  );

  copyIfExists(
    path.join(PARENT_ROOT, "test-suites-manifest.json"),
    path.join(PUBLIC_DIR, "test-suites-manifest.json"),
    "test-suites-manifest.json"
  );

  copyIfExists(
    path.join(PARENT_ROOT, "reports", "html"),
    path.join(PUBLIC_DIR, "reports"),
    "Playwright HTML report"
  );

  copyIfExists(
    path.join(PARENT_ROOT, "reports", "allure-report"),
    path.join(PUBLIC_DIR, "allure-report"),
    "Allure report"
  );

  // Wipe + recopy artifacts so removed files don't linger
  if (fs.existsSync(ARTIFACTS_DIR)) {
    fs.rmSync(ARTIFACTS_DIR, { recursive: true, force: true });
  }
  copyIfExists(
    path.join(PARENT_ROOT, "test-results"),
    ARTIFACTS_DIR,
    "Test artifacts (screenshots/videos)"
  );

  build();

  console.info("\n📦 Sync complete.");
}

main();
