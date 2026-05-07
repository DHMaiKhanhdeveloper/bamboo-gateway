# CI/CD

Three workflows under `.github/workflows/`:

## 1. `e2e.yml` — PR check

Triggered on every PR + manual dispatch.

```
static       → typecheck + ESLint + format check
   ↓
smoke        → @smoke tests (1 worker, blob reporter)
```

Outputs:
- `blob-report-smoke` artifact (always, 7 days)
- `trace-smoke` artifact (only on failure: traces + HTML report)

Must finish in ≤ 25 minutes.

## 2. `nightly.yml` — Full regression

Triggered nightly at 19:00 UTC weekdays + manual dispatch.

```
test (matrix)
  ├ project: [chromium-ui, chromium-api]
  ├ shard:   [1, 2, 3, 4]
  └ → 8 parallel jobs
   ↓
merge-reports
  └ downloads all blob-* artifacts → merges into single HTML
```

Outputs:
- `blob-<project>-<shard>` per job (7 days)
- `merged-html-report` — single Playwright HTML + JSON (14 days)

Manual dispatch supports a custom `--grep` filter (default `@regression`).

## 3. `deploy-report.yml` — Publish to GitHub Pages

Triggered automatically when nightly finishes successfully.

```
workflow_run trigger
  └ download merged-html-report from latest nightly
  └ upload-pages-artifact
  └ deploy-pages
```

Required GitHub repo settings:
- Settings → Pages → Source = "GitHub Actions"
- Add the secrets listed below as repo secrets

## Required secrets

| Secret | Purpose |
|--------|---------|
| `BASE_URL` | Portal URL |
| `API_BASE_URL` | API base URL |
| `ADMIN_USERNAME` | Test admin username |
| `ADMIN_PASSWORD` | Test admin password |
| `TOTP_SECRET` | TOTP base32 secret for 2FA |

Optional:
- `BYPASS_AUTH_TOKEN` — emergency fallback when login API is broken (should never be set in nightly)

## Sharding strategy

We split the suite by Playwright's built-in `--shard=N/M` mechanism. Sharding partitions test files (not individual tests) hashed by name, so any single test file always runs in exactly one shard. With 4 shards × 2 projects we run 8 parallel jobs, keeping wall-clock time roughly equal to the slowest single shard.

Increase `TOTAL_SHARDS` in `nightly.yml` if shards become unbalanced (one shard running 2× longer than others).

## Local CI parity

Reproduce the CI environment locally:

```pwsh
$env:CI = "true"
npm run validate         # typecheck + lint + format
npm run test:smoke       # smoke
npm run test -- --reporter=blob   # full with blob output
npm run report:merge     # merge to HTML
```
