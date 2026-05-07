#!/usr/bin/env node
import { spawnSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");

const C = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

const TOTAL = 8;

function header(step, label) {
  process.stdout.write(`\n${C.cyan}${C.bold}🔵 [${step}/${TOTAL}] ${label}${C.reset}\n`);
}

function ok(msg) {
  process.stdout.write(`${C.green}✅ ${msg}${C.reset}\n`);
}

function warn(msg) {
  process.stdout.write(`${C.yellow}⚠️  ${msg}${C.reset}\n`);
}

function fail(msg) {
  process.stdout.write(`${C.red}❌ ${msg}${C.reset}\n`);
}

function run(cmd, args, { abortOnFail = true, label } = {}) {
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: true, cwd: ROOT });
  const code = result.status ?? 1;
  if (code !== 0) {
    if (abortOnFail) {
      fail(`${label} failed (exit ${code}). Aborting.`);
      process.exit(code);
    } else {
      warn(`${label} returned exit ${code}, continuing.`);
    }
  } else {
    ok(`${label} done.`);
  }
  return code;
}

header(1, "Cài đặt dependencies (root)");
run("npm", ["install"], { label: "npm install (root)" });

header(2, "Cài đặt Playwright browser (chromium)");
run("npx", ["playwright", "install", "chromium"], { label: "playwright install chromium" });

header(3, "Cài đặt dependencies (dashboard)");
run("npm", ["--prefix", "dashboard", "install"], { label: "npm install (dashboard)" });

header(4, "Chạy login test cases (smoke + auth)");
run(
  "npx",
  [
    "playwright",
    "test",
    "tests/ui/smoke/critical-path.spec.ts",
    "tests/ui/e2e/auth",
  ],
  { abortOnFail: false, label: "playwright test login suite" }
);

header(5, "Aggregate kết quả test → test-aggregation.json");
run(
  "npx",
  ["tsx", "scripts/generate-suite-aggregation.ts"],
  { abortOnFail: false, label: "generate-suite-aggregation" }
);

header(6, "Generate manifest → test-suites-manifest.json");
run(
  "npx",
  ["tsx", "scripts/generate-test-suites-manifest.ts"],
  { abortOnFail: false, label: "generate-test-suites-manifest" }
);

header(7, "Sync data sang dashboard/public");
run("npm", ["--prefix", "dashboard", "run", "sync-data"], { label: "sync-data" });

header(8, "Khởi động dashboard dev server (Vite)");
process.stdout.write(
  `\n${C.green}${C.bold}✅ Pipeline complete.${C.reset}\n` +
    `   Dashboard sẽ start tại ${C.cyan}http://localhost:5173${C.reset}\n` +
    `   Mở browser thủ công nếu chưa tự mở.\n` +
    `   Nhấn ${C.bold}Ctrl+C${C.reset} để dừng.\n\n`
);

const dev = spawn("npm", ["--prefix", "dashboard", "run", "dev"], {
  stdio: "inherit",
  shell: true,
  cwd: ROOT,
});

dev.on("exit", (code) => process.exit(code ?? 0));

const forward = (sig) => () => dev.kill(sig);
process.on("SIGINT", forward("SIGINT"));
process.on("SIGTERM", forward("SIGTERM"));
