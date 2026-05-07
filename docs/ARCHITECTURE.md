# Architecture

`e2e_bamboo_gateway` is a layered, ESM-first Playwright + TypeScript framework. Each layer has a single responsibility and depends only on layers below it.

```
tests/                    ← spec files only (no business logic)
  └ depends on
src/fixtures/             ← composed test object (auth × pages × api × data)
  └ depends on
src/pages/  src/api/      ← UI page objects + API services
  └ depend on
src/data/  src/support/   ← factories, builders, seeds, auth state, managers
  └ depend on
src/core/  src/helpers/   ← BasePage/BaseComponent/BaseApiService, HttpClient,
                            Logger, errors, OTP/retry/date/string helpers
  └ depend on
src/config/               ← env (Zod), constants, merchant data accessors
```

## Layer responsibilities

### `src/config/`
- `env.ts` — Zod schema validating env vars at startup; typed accessors (`getBaseURL`, `getApiBaseURL`, `getAuthCredentials`, etc.)
- `constants.ts` — timeouts, routes, API endpoint templates, regex, test tags, auth roles
- `merchant-data.ts` — read/write `src/data/seeds/merchant.json`

### `src/core/`
- `base/base.page.ts` — abstract POM base. Subclasses define `urlPath` + `readyLocator()`; gain `goto()`, `waitForReady()`, `expectUrl()`, `screenshot()`, `reload()`
- `base/base.component.ts` — abstract component scoped to a root `Locator`
- `base/base.api-service.ts` — abstract API service with Zod-validated parsing
- `http/http-client.ts` — wrapper for `APIRequestContext` with retry/logging/Authorization injection
- `http/http-errors.ts` — typed error classes (`ApiError`, `AuthError`, `ValidationError`, `TimeoutError`)
- `logger/logger.ts` — level-controlled structured logger
- `types/` — domain types + ambient declarations

### `src/pages/`
- `auth/`, `merchant/`, `customer/`, `product/`, `category/`, `employee/`, `user/`, `terminal/`, `transaction/`, `virtual-terminal/`
- `components/` — header, left-menu, toast (reusable across pages)

### `src/api/`
- `clients/auth.client.ts` — low-level wrapper for `/login`, `/2fa_check`, `/users/me`
- `services/auth.service.ts` — orchestrates the 2-step login + token extraction
- `services/transaction.service.ts` — full transaction lifecycle (sale, auth+capture, batch close, reversal/void/incremental, return + return-reversal)
- `services/virtual-terminal.service.ts` — VT-specific high-level wrapper
- `schemas/*.ts` — Zod schemas for request payloads + response shapes

### `src/fixtures/`
- `auth.fixture.ts` — `authenticatedPage`, `apiBearerToken`
- `pages.fixture.ts` — every UI page object as a fixture
- `api.fixture.ts` — services + `httpClient` + `merchantId`
- `data.fixture.ts` — `dataGenerator`, `userManager`, factory fixtures
- `index.ts` — `mergeTests(authTest, pagesTest, apiTest, dataTest)` for the unified `test` export

### `src/data/`
- `seeds/` — static JSON/CSV (`users.json`, `merchant.json`, `test-cards.json`, `products.csv`)
- `factories/` — Faker-based generators (CardFactory, CustomerFactory, MerchantFactory, TransactionFactory)
- `builders/` — fluent API like `SaleTransactionBuilder`

### `src/support/`
- `auth/auth-state-manager.ts` — per-role storage states (`.auth/<role>.json`) with TTL
- `managers/user-manager.ts` — typed accessors over `users.json`
- `data-generator.ts` — static random data helpers (legacy compatibility)
- `setup/global-setup.ts` — runs before all tests (validate merchants, perform admin login, validate seeds)
- `setup/global-teardown.ts` — cleanup hook

### `src/helpers/`
- `otp.helper.ts` — wraps `otplib.authenticator`
- `retry.helper.ts` — generic exponential-backoff retry + `waitUntil`
- `date.helper.ts` — exp-date formatting
- `string.helper.ts` — random strings, slugify, mask secrets

## Test segmentation

| Path | Tag | Purpose |
|------|-----|---------|
| `tests/ui/smoke/` | `@smoke` `@critical` | Fast, must-pass-on-every-PR checks |
| `tests/ui/e2e/` | `@regression` | Feature-level UI flows |
| `tests/ui/tickets/` | `@ticket` | Issue reproductions / regressions for specific JIRA tickets |
| `tests/api/` | `@api` | API-only suites (no browser) |

Tags are first-class — every Playwright project + CI workflow filters by tag, not by folder.

## Data flow examples

### UI test (full stack)
```
test                   ← imports
  └ ~/fixtures         ← merged test object
      └ pagesTest      ← provides VirtualTerminalPage
      └ authTest       ← provides authenticatedPage (saved storage state)
      └ dataTest       ← provides cardFactory
          └ CardFactory.valid()
              └ src/data/seeds/test-cards.json
```

### API test (no browser)
```
test
  └ ~/fixtures
      └ apiTest        ← provides transactionService
          └ TransactionApiService(merchantId, bearerToken)
              └ HttpClient ← Zod schemas for response validation
      └ authTest       ← apiBearerToken
          └ AuthService → AuthApiClient → /login + /2fa_check
              └ generateTotp(secret) ← otplib
```
