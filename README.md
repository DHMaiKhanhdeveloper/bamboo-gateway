# e2e_bamboo_gateway

Enterprise-grade end-to-end + API automated testing framework for the **BambooPay** payment gateway, built on Playwright + TypeScript (ESM).

## Highlights

- **ESM + TypeScript strict** with single path alias `~/*` → `./src/*`
- **Layered architecture**: `config` → `core` → `pages` / `api` → `fixtures` → `tests`
- **POM upgrade**: abstract `BasePage` / `BaseComponent` + role-based locators
- **API service layer**: `HttpClient` → `services/` → Zod `schemas/` (request + response validation)
- **Composed fixtures**: `auth` × `pages` × `api` × `data` merged via `mergeTests`
- **Per-role auth state**: `.auth/admin.json`, `.auth/merchant.json`, ...
- **Faker-based factories** + fluent builders alongside static seeds
- **GitHub Actions CI/CD**: PR check, sharded nightly matrix, blob report merge → GitHub Pages
- **Multi-reporter**: HTML, JSON, JUnit, Blob, Allure, GitHub annotations
- **Test tags**: `@smoke @regression @critical @ticket` for fine-grained filtering

## Quick start

```pwsh
# 1. Install
npm install
npx playwright install chromium

# 2. Configure
cp .env.example .env.local
# edit .env.local with real credentials

# 3. Run
npm run test:smoke         # smoke suite only
npm run test:ui            # all UI tests
npm run test:api           # all API tests
npm run test               # everything
npm run ui                 # Playwright UI mode
```

## Project layout

```
src/
├── config/         # env (Zod), constants, merchant data
├── core/           # base classes, http client, errors, logger, types
├── pages/          # POM (UI), components, virtual-terminal sections + flows
├── api/            # clients, services, Zod schemas
├── fixtures/       # auth / pages / api / data / index (composed)
├── data/           # seeds, factories (Faker), builders
├── helpers/        # otp, retry, date, string
└── support/        # auth state, managers, reporters, setup
tests/
├── ui/{smoke,e2e,tickets}/
└── api/
dashboard/        # React 19 + Vite 7 + Tailwind 4 — visualizes test results
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for details. The dashboard is a self-contained sub-project — see [`dashboard/README.md`](dashboard/README.md).

## Dashboard

```pwsh
cd dashboard
npm install
npm run sync-data    # pull latest test-aggregation.json + reports from parent
npm run dev          # http://localhost:5173
```

## Available scripts

| Script | Purpose |
|--------|---------|
| `npm test` | Run all tests |
| `npm run test:ui` | UI tests only (project `chromium-ui`) |
| `npm run test:api` | API tests only (project `chromium-api`) |
| `npm run test:smoke` | `@smoke` tagged tests |
| `npm run test:regression` | `@regression` tagged tests |
| `npm run test:tickets` | `@ticket` tagged tests |
| `npm run test:allure` | Run with Allure reporter |
| `npm run ui` | Open Playwright UI |
| `npm run auth:login` | Generate fresh auth states |
| `npm run auth:status` | Show current auth state validity |
| `npm run auth:clear` | Clear cached auth states |
| `npm run lint` | ESLint check |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run validate` | typecheck + lint + format |
| `npm run report:merge` | Merge blob reports → HTML |
| `npm run allure:serve` | Generate + open Allure report |

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — layered design overview
- [`docs/FIXTURES.md`](docs/FIXTURES.md) — composed fixture pattern
- [`docs/WRITING_TESTS.md`](docs/WRITING_TESTS.md) — conventions, tags, file naming
- [`docs/CI_CD.md`](docs/CI_CD.md) — workflows + sharding strategy
- [`docs/MIGRATION_FROM_OLD.md`](docs/MIGRATION_FROM_OLD.md) — mapping from old `e2e-bamboopay`
