#!/usr/bin/env node
/**
 * Download a previously-published GitHub Pages report locally for inspection.
 * Configure GH_PAGES_URL via env var.
 *
 * Usage:
 *   GH_PAGES_URL=https://owner.github.io/repo node scripts/download-github-pages.js download
 */
import fs from "node:fs";
import path from "node:path";

const command = process.argv[2];
const target = path.resolve("reports/_published");

async function download() {
  const url = process.env.GH_PAGES_URL;
  if (!url) {
    console.error("GH_PAGES_URL is not set.");
    process.exit(1);
  }

  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

  const indexUrl = `${url.replace(/\/$/, "")}/index.html`;
  const response = await fetch(indexUrl);
  if (!response.ok) {
    console.error(`❌ Failed to fetch ${indexUrl}: ${response.status}`);
    process.exit(1);
  }
  const html = await response.text();
  fs.writeFileSync(path.join(target, "index.html"), html);
  console.info(`📥 Downloaded index.html → ${target}`);
}

if (command === "download") {
  await download();
} else {
  console.error(`Unknown command '${command}'. Use: download`);
  process.exit(1);
}
