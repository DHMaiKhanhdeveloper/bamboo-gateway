# Migration from `e2e-bamboopay` (old) → `e2e_bamboo_gateway` (new)

This is a complete file-level mapping for porting the old framework to the new structure. Run with the [Architecture overview](./ARCHITECTURE.md) open.

## Top-level config

| Old path | New path | Action |
|----------|----------|--------|
| `playwright.config.ts` | `playwright.config.ts` | Rewritten — ESM, multi-project (`chromium-ui`, `chromium-api`), reporters: list/html/json/junit/blob/allure |
| `tsconfig.json` | `tsconfig.json` | ESM module/target, single alias `~/*` → `./src/*`, `noUncheckedIndexedAccess`, `noImplicitOverride` |
| `package.json` | `package.json` | `"type": "module"`, deps consolidated, scripts reorganized + lint/typecheck/validate |
| `global-setup.ts` | `src/support/setup/global-setup.ts` | Ported, ESM-friendly, calls per-role auth manager |
| `.env.example` | `.env.example` | Copied, expanded with `LOG_LEVEL`, `AUTH_STATE_TTL_MS`, `BYPASS_AUTH_TOKEN` |
| `.gitignore` | `.gitignore` | Copied + added `.auth/`, `reports/`, `blob-report/` |
| (none) | `eslint.config.js` | New — flat config + typescript-eslint + playwright plugin |
| (none) | `.prettierrc.json` / `.prettierignore` / `.editorconfig` | New |
| (none) | `.vscode/{settings,launch,extensions}.json` | New |

## Foundation

| Old path | New path | Action |
|----------|----------|--------|
| `lib/env.ts` | `src/config/env.ts` | Ported + added `LOG_LEVEL`, `AUTH_STATE_TTL_MS`, `BYPASS_AUTH_TOKEN` |
| `lib/merchantData.ts` | `src/config/merchant-data.ts` | Ported, ESM file resolution |
| (none) | `src/config/constants.ts` | New — timeouts, routes, API endpoints, regex, tags, auth roles |
| (none) | `src/core/base/base.page.ts` | New — abstract POM base |
| (none) | `src/core/base/base.component.ts` | New — abstract component base |
| (none) | `src/core/base/base.api-service.ts` | New — abstract API service base |
| (none) | `src/core/http/http-client.ts` | New — HttpClient with retry + logging |
| (none) | `src/core/http/http-errors.ts` | New — typed error hierarchy |
| (none) | `src/core/logger/logger.ts` | New — leveled logger |

## Pages — UI

All page objects extend `BasePage` and live under `src/pages/<feature>/<feature>.page.ts`.

| Old path | New path | Action |
|----------|----------|--------|
| `pages/login.page.ts` | `src/pages/auth/login.page.ts` | Ported, role-based locators preserved |
| `pages/merchant.page.ts` | `src/pages/merchant/merchant.page.ts` | Ported, all sections preserved as composite methods |
| `pages/customer.page.ts` | `src/pages/customer/customer.page.ts` | Ported with extracted `selectCountry` / `fillStateField` helpers |
| `pages/product.page.ts` | `src/pages/product/product.page.ts` | Ported |
| `pages/category.page.ts` | `src/pages/category/category.page.ts` | Ported, console logs replaced with `this.log` |
| `pages/employee.page.ts` | `src/pages/employee/employee.page.ts` | Ported, all 50+ verifications preserved |
| `pages/user.page.ts` | `src/pages/user/user.page.ts` | Ported, validation messages factored into helper |
| `pages/terminal.page.ts` + `pages/terminal1.page.ts` | `src/pages/terminal/terminal.page.ts` | **Merged**: supports both `deviceId` (legacy) and `developerId` (newer); serial-number is optional for Virtual device |
| `pages/transaction.page.ts` | `src/pages/transaction/transaction.page.ts` | Ported with `resolveBillingField`/`resolveShippingField`/`resolveLevelIIIField` helpers |
| `pages/virtual-terminal.ts` | `src/pages/virtual-terminal/virtual-terminal.page.ts` | Ported as comprehensive facade — locators + flows preserved 1:1; planned future split into `sections/*.section.ts` + `flows/*.flow.ts` |
| `pages/components/header.component.ts` | `src/pages/components/header.component.ts` | Ported, extends `BaseComponent` |
| `pages/components/leftmenu.component.ts` | `src/pages/components/left-menu.component.ts` | Ported, file renamed for kebab-case consistency |
| (none) | `src/pages/components/toast.component.ts` | New — wraps the old `ToastUtils` static class as a component object (static delegates kept for back-compat) |

## Pages — API → Services

The old `pages/api/*-api.page.ts` files split into a 3-layer API stack:

| Old path | New path | Action |
|----------|----------|--------|
| `utils/api-client.ts` + `utils/api-auth.helpers.ts` | `src/api/clients/auth.client.ts` + `src/api/services/auth.service.ts` | Merged + split: client = HTTP, service = orchestration |
| `pages/api/transaction-api.page.ts` | `src/api/services/transaction.service.ts` + `src/api/schemas/transaction.schema.ts` | Logic ported, response shape now Zod-validated |
| `pages/api/virtual-terminal-api.page.ts` | `src/api/services/virtual-terminal.service.ts` + `src/api/schemas/virtual-terminal.schema.ts` | Same — service + schema split |
| `utils/virtual-terminal-api.helpers.ts` | `src/api/schemas/virtual-terminal.schema.ts` (types) + `src/data/builders/sale-transaction.builder.ts` (generators) | Types → Zod schemas; generators → fluent builder |

## Fixtures

| Old path | New path | Action |
|----------|----------|--------|
| `fixtures/custom.fixtures.ts` | `src/fixtures/{auth,pages,data}.fixture.ts` | **Split** into 3 files |
| `fixtures/api.fixtures.ts` | `src/fixtures/{auth,api}.fixture.ts` | **Split** + composed |
| (none) | `src/fixtures/index.ts` | New — `mergeTests(authTest, pagesTest, apiTest, dataTest)` |

## Utils → Support / Helpers

| Old path | New path | Action |
|----------|----------|--------|
| `utils/auth-state-manager.ts` | `src/support/auth/auth-state-manager.ts` | **Upgraded** — per-role storage state, TTL via env var |
| `utils/data-generator.ts` | `src/support/data-generator.ts` + `src/data/factories/*.factory.ts` | Static class kept; richer Faker-based factories added |
| `utils/user-manager.ts` | `src/support/managers/user-manager.ts` | Ported, requires-helpers added |
| `utils/toast-utils.ts` | `src/pages/components/toast.component.ts` | Refactored to a component class with static delegates |
| (none) | `src/helpers/otp.helper.ts` | New — wraps `otplib.authenticator` |
| (none) | `src/helpers/retry.helper.ts` | New — `sleep`, `retry`, `waitUntil` |
| (none) | `src/helpers/date.helper.ts` | New |
| (none) | `src/helpers/string.helper.ts` | New |

## Data

| Old path | New path | Action |
|----------|----------|--------|
| `data/users.json` | `src/data/seeds/users.json` + `src/data/seeds/test-cards.json` | **Split** — `testCardData` extracted to `test-cards.json` |
| `data/merchant.json` | `src/data/seeds/merchant.json` | Copied |
| `data/products.csv` | `src/data/seeds/products.csv` | Copied |
| (none) | `src/data/factories/{card,customer,merchant,transaction}.factory.ts` | New — Faker factories |
| (none) | `src/data/builders/sale-transaction.builder.ts` | New — fluent builder for SaleTransactionPayload |

## Tests

42 spec files port 1:1 to the new tree, with these changes:

- Imports change from `@/fixtures/custom.fixtures` → `~/fixtures`
- Imports change from `@/fixtures/api.fixtures` → `~/fixtures`
- API spec usage changes from `virtualTerminalApiPage` → `virtualTerminalService`
- Each `test.describe` gains a `tag:` array using constants from `~/config/constants`
- Tickets renamed from `tests/e2e/tickets/POR-XXX/file.spec.ts` to `tests/ui/tickets/POR-XXX-name.spec.ts`

| Old path | New path |
|----------|----------|
| `tests/smoke/critical-path.spec.ts` | `tests/ui/smoke/critical-path.spec.ts` |
| `tests/smoke/001-create-merchant/test.spec.ts` | `tests/ui/smoke/001-create-merchant.spec.ts` |
| `tests/smoke/002-create-terminal/test.spec.ts` | `tests/ui/smoke/002-create-terminal.spec.ts` |
| `tests/smoke/003-payment-by-virtual-terminal/test.spec.ts` | `tests/ui/smoke/003-payment-by-virtual-terminal.spec.ts` |
| `tests/smoke/terminal/terminal-critical.spec.ts` | `tests/ui/smoke/terminal-critical.spec.ts` |
| `tests/smoke/user/user-critical.spec.ts` | `tests/ui/smoke/user-critical.spec.ts` |
| `tests/e2e/features/auth/auth-success.spec.ts` | `tests/ui/e2e/auth/auth-success.spec.ts` |
| `tests/e2e/features/auth/auth-mfa.spec.ts` | `tests/ui/e2e/auth/auth-mfa.spec.ts` |
| `tests/e2e/features/auth/auth-errors.spec.ts` | `tests/ui/e2e/auth/auth-errors.spec.ts` |
| `tests/e2e/features/auth/auth-callback-security.spec.ts` | `tests/ui/e2e/auth/auth-callback-security.spec.ts` |
| `tests/e2e/features/auth/auth-advanced-security.spec.ts` | `tests/ui/e2e/auth/auth-advanced-security.spec.ts` |
| `tests/e2e/features/category/category.spec.ts` | `tests/ui/e2e/category/category.spec.ts` |
| `tests/e2e/features/customer/create-customer.spec.ts` | `tests/ui/e2e/customer/create-customer.spec.ts` |
| `tests/e2e/features/employee/create_employee.spec.ts` | `tests/ui/e2e/employee/create_employee.spec.ts` |
| `tests/e2e/features/employee/search_employee.spec.ts` | `tests/ui/e2e/employee/search_employee.spec.ts` |
| `tests/e2e/features/merchant/merchant.spec.ts` | `tests/ui/e2e/merchant/merchant.spec.ts` |
| `tests/e2e/features/product/create-product.spec.ts` | `tests/ui/e2e/product/create-product.spec.ts` |
| `tests/e2e/features/product/update-product.spec.ts` | `tests/ui/e2e/product/update-product.spec.ts` |
| `tests/e2e/features/product/product-discounts.spec.ts` | `tests/ui/e2e/product/product-discounts.spec.ts` |
| `tests/e2e/features/product/product-inventory.spec.ts` | `tests/ui/e2e/product/product-inventory.spec.ts` |
| `tests/e2e/features/product/product-locations.spec.ts` | `tests/ui/e2e/product/product-locations.spec.ts` |
| `tests/e2e/features/product/product-validation.spec.ts` | `tests/ui/e2e/product/product-validation.spec.ts` |
| `tests/e2e/features/terminal/terminal.spec.ts` | `tests/ui/e2e/terminal/terminal.spec.ts` |
| `tests/e2e/features/transaction/POR-559.spec.ts` | `tests/ui/e2e/transaction/POR-559.spec.ts` |
| `tests/e2e/features/user/user.spec.ts` | `tests/ui/e2e/user/user.spec.ts` |
| `tests/e2e/features/virtual-terminal/test-cases.spec.ts` | `tests/ui/e2e/virtual-terminal/test-cases.spec.ts` |
| `tests/e2e/features/virtual-terminal/payment-with-billing-address.spec.ts` | `tests/ui/e2e/virtual-terminal/payment-with-billing-address.spec.ts` |
| `tests/e2e/features/virtual-terminal/with-cash/payment-with-cash.spec.ts` | `tests/ui/e2e/virtual-terminal/with-cash/payment-with-cash.spec.ts` |
| `tests/e2e/features/virtual-terminal/with-product-selection/*.spec.ts` | `tests/ui/e2e/virtual-terminal/with-product-selection/*.spec.ts` |
| `tests/e2e/tickets/POR-247/virtual-terminal.spec.ts` | `tests/ui/tickets/POR-247-virtual-terminal.spec.ts` |
| `tests/e2e/tickets/POR-344/iframe.spec.ts` | `tests/ui/tickets/POR-344-iframe.spec.ts` |
| `tests/e2e/tickets/POR-345/user.spec.ts` | `tests/ui/tickets/POR-345-user.spec.ts` |
| `tests/e2e/tickets/POR-372/verify-callback-url.spec.ts` | `tests/ui/tickets/POR-372-verify-callback-url.spec.ts` |
| `tests/e2e/tickets/POR-393/terminal.spec.ts` | `tests/ui/tickets/POR-393-terminal.spec.ts` |
| `tests/api/auth.api.spec.ts` | `tests/api/auth.spec.ts` |
| `tests/api/verify-setup.spec.ts` | `tests/api/verify-setup.spec.ts` |
| `tests/api/debug-api.spec.ts` | `tests/api/debug.spec.ts` |
| `tests/api/virtual-terminal/sale.spec.ts` | `tests/api/virtual-terminal/sale.spec.ts` |
| `tests/api/virtual-terminal/auth-flows.spec.ts` | `tests/api/virtual-terminal/auth-flows.spec.ts` |
| `tests/api/virtual-terminal/sale-flows.spec.ts` | `tests/api/virtual-terminal/sale-flows.spec.ts` |

## Scripts

| Old path | New path | Action |
|----------|----------|--------|
| `scripts/auth-manager.ts` | `scripts/auth-manager.ts` | Ported, ESM (`tsx`), per-role login support |
| `scripts/run-test-suite.ts` | `scripts/run-test-suite.ts` | Ported |
| `scripts/generate-test-suites-manifest.ts` | `scripts/generate-test-suites-manifest.ts` | Ported, walks new tests/ tree |
| `scripts/generate-suite-aggregation.ts` | `scripts/generate-suite-aggregation.ts` | Ported |
| `scripts/merge-test-results.js` | `scripts/merge-test-results.js` | New — wraps `playwright merge-reports` for blob → HTML |
| `scripts/deploy-with-history.js` | `scripts/deploy-with-history.js` | Ported |
| `scripts/download-github-pages.js` | `scripts/download-github-pages.js` | Ported |

## Dashboard

Faithful port of the React 19 + Vite 7 + Tailwind 4 + shadcn dashboard.

| Old path | New path | Action |
|----------|----------|--------|
| `dashboard/{vite,tsconfig*,eslint,components,index,package}.{ts,json,html}` | `dashboard/...` | Copied verbatim |
| `dashboard/.gitignore` | `dashboard/.gitignore` | Copied verbatim |
| `dashboard/src/{App,main}.tsx` + `index.css` | `dashboard/src/...` | Copied verbatim |
| `dashboard/src/pages/*.tsx` (3 files) | `dashboard/src/pages/...` | Copied verbatim |
| `dashboard/src/components/*.tsx` (9 files) | `dashboard/src/components/...` | Copied verbatim |
| `dashboard/src/components/ui/*.tsx` (16 shadcn primitives) | `dashboard/src/components/ui/...` | Copied verbatim |
| `dashboard/src/{lib,types,data}/*` | `dashboard/src/...` | Copied verbatim |
| `dashboard/public/*` | `dashboard/public/...` | Copied verbatim |
| `dashboard/README.md` + `IMPLEMENTATION_SUMMARY.md` | `dashboard/...` | Copied verbatim |
| (missing in source — broken `npm run sync-data`) | `dashboard/scripts/sync-data.js` | **New** — works against the new `reports/` layout |

The dashboard remains a standalone sub-project with its own `node_modules` and build pipeline. It's referenced from the root [`README.md`](../README.md) but kept logically isolated.

## Things explicitly removed

- `pages/terminal1.page.ts` — merged into `terminal.page.ts`
- `auth-state.json` (root) — replaced by `.auth/<role>.json`
- `.cursor/`, `.idea/`, `.playwright-mcp/` — IDE/tooling specific, not framework code
- `tests/api/virtual-terminal/sale-with-auth.example.ts` — example only, not a test
- `tests/api/virtual-terminal/test-data.helpers.ts` — replaced by builders/factories
- All `*.md` companion files inside test folders — relocated to `docs/`
