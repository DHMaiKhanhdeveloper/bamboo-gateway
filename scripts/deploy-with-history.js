#!/usr/bin/env node
/**
 * Deploy reports/html → GitHub Pages preserving prior run history.
 *
 * Usage:
 *   node scripts/deploy-with-history.js deploy
 *   node scripts/deploy-with-history.js validate
 *   node scripts/deploy-with-history.js summary
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const command = process.argv[2];
const REPORT_DIR = path.resolve("reports/html");
const HISTORY_DIR = path.resolve("reports/history");

function validate() {
  if (!fs.existsSync(REPORT_DIR)) {
    console.error(`❌ Missing ${REPORT_DIR}. Run tests with HTML reporter first.`);
    process.exit(1);
  }
  console.info("✅ Reports validated.");
}

function summary() {
  validate();
  const indexHtml = path.join(REPORT_DIR, "index.html");
  if (!fs.existsSync(indexHtml)) {
    console.error("❌ index.html missing in HTML report.");
    process.exit(1);
  }
  const stats = fs.statSync(indexHtml);
  console.info(`📄 index.html size: ${(stats.size / 1024).toFixed(1)} KB`);
}

function deploy() {
  validate();

  if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const archive = path.join(HISTORY_DIR, stamp);
  fs.cpSync(REPORT_DIR, archive, { recursive: true });
  console.info(`📦 Archived current run → ${archive}`);

  // Caller is expected to push reports/ to GitHub Pages branch via their CI workflow.
  console.info(`✅ Ready to deploy ${REPORT_DIR} (push to gh-pages branch in your workflow).`);
}

switch (command) {
  case "validate":
    validate();
    break;
  case "summary":
    summary();
    break;
  case "deploy":
    deploy();
    break;
  default:
    console.error(`Unknown command '${command}'. Use: deploy | validate | summary`);
    process.exit(1);
}
