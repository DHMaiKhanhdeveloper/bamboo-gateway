# Writing tests

## Imports

Always import from `~/fixtures`:
```ts
import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";
```

Never import directly from `@playwright/test` for spec files — you'd lose access to the composed fixtures and the `~/*` path alias makes refactoring trivial.

## Tags (required)

Every `test.describe` MUST carry at least one tag from `~/config/constants`:

| Tag | Use it for |
|-----|-----------|
| `@smoke` | Fast must-pass checks (run on every PR) |
| `@critical` | Subset of smoke covering the golden payment path |
| `@regression` | Full feature suites (run nightly) |
| `@ticket` | JIRA ticket reproductions (`POR-XXX`) |
| `@api` | API-only specs (skip the browser) |
| `@ui` | UI-specific specs |
| `@flaky` | Known-flaky — quarantined from default runs |

Example:
```ts
test.describe("Virtual Terminal: Sale", { tag: [TAGS.regression, TAGS.api] }, () => {
  test("...", async () => { ... });
});
```

## File naming

| Path | Convention | Example |
|------|-----------|---------|
| `tests/ui/smoke/` | `<NNN>-<feature>.spec.ts` for ordered flows | `001-create-merchant.spec.ts` |
| `tests/ui/e2e/<feature>/` | `<verb>-<noun>.spec.ts` | `create-customer.spec.ts` |
| `tests/ui/tickets/` | `<JIRA>-<short-name>.spec.ts` | `POR-372-verify-callback-url.spec.ts` |
| `tests/api/<feature>/` | `<verb>.spec.ts` | `sale.spec.ts` |

## Test data

- **Static seeds** for deterministic facts (test users, merchant IDs, fixture cards) → `src/data/seeds/`
- **Faker factories** for varied data each run (customers, merchants, products) → `src/data/factories/`
- **Builders** for compositional payloads → `src/data/builders/`

```ts
const data = customerFactory.build();          // varies each run
const card = cardFactory.valid();              // deterministic seed
const payload = new SaleTransactionBuilder("19.99")
  .withDefaultCard()
  .withDefaultCardHolder()
  .build();
```

## Assertions

Prefer Playwright's auto-retrying assertions (`expect(locator).toBeVisible()`) over polling loops. For API responses, validate with Zod via `BaseApiService.parseJson(...)` or use the `verifySaleResponse` / `verifyTransactionResponse` helpers on services.

## Locators

When adding new locators in page objects:

1. **Prefer `getByRole`** with an accessible name — survives DOM refactors
2. **Then `getByLabel`** for form fields
3. **Then `getByTestId`** — best when accessibility name is missing
4. **Avoid raw CSS selectors** unless nothing else works

```ts
// Good
this.page.getByRole("button", { name: "Save Customer" });
this.page.getByLabel("Email address");
this.page.getByTestId("merchant-name-input");

// Bad
this.page.locator(".submit-btn");
this.page.locator('button[type="submit"]:nth-child(3)');
```

## Skipping vs fixing

If a test is broken, **fix it or delete it** — don't `.skip()` indefinitely. A `test.skip(condition, "reason")` should always be conditional on real environment state (missing env var, missing data, etc.), never used as a "TODO".

## Don't

- Don't put business logic in spec files. Move it to a page object or service.
- Don't import from `pages/api/*-api.page` (those are gone) — use services from `~/api/services/`.
- Don't `console.log` in tests. Use `logger` from `~/core/logger/logger`.
- Don't depend on test execution order. Each `test()` must work in isolation.
