# Fixtures

Tests import a single composed `test` from `~/fixtures`. Internally that's a `mergeTests(...)` of four smaller fixture modules so each concern stays in its own file and is independently testable.

## Composition

```
~/fixtures (index.ts)
  ├─ authTest          (auth.fixture.ts)
  │    ├─ authenticatedPage
  │    └─ apiBearerToken
  ├─ pagesTest         (pages.fixture.ts)
  │    ├─ loginPage, merchantPage, customerPage, productPage,
  │    │  categoryPage, employeePage, userPage, terminalPage,
  │    │  transactionPage, virtualTerminalPage
  │    └─ headerComponent, leftMenuComponent, toastComponent
  ├─ apiTest           (api.fixture.ts) — extends authTest
  │    ├─ httpClient
  │    ├─ merchantId
  │    ├─ virtualTerminalService
  │    └─ transactionService
  └─ dataTest          (data.fixture.ts)
       ├─ dataGenerator, userManager
       └─ cardFactory, customerFactory, merchantFactory, transactionFactory
```

## Why split

| Old | Problem | New |
|-----|---------|-----|
| `custom.fixtures.ts` (161 lines) | Mixes auth + pages + data + api in one file. Adding a new page required touching the same monolith. | One file per concern; `mergeTests` gives back a single composed `test`. |
| Hard-coded `auth-state.json` | Single file, no role separation. | `AuthStateManager` writes per-role files in `.auth/`. |
| API auth split across 2 utils + 2 page classes | Tight coupling, no schema validation. | `AuthApiClient` (HTTP) + `AuthService` (orchestration) + Zod schemas. |

## Examples

### UI test
```ts
import { test, expect } from "~/fixtures";

test("creates a customer", async ({ authenticatedPage, customerPage, customerFactory }) => {
  void authenticatedPage; // ensures we're logged in
  const data = customerFactory.build();
  await customerPage.gotoAddCustomer(merchantId);
  await customerPage.fillCustomerForm({ ... });
});
```

### API test
```ts
import { test, expect } from "~/fixtures";

test("creates a sale", async ({ virtualTerminalService, request }) => {
  const response = await virtualTerminalService.createSale(request, "100.00");
  const result = await virtualTerminalService.verifySaleResponse(response);
  expect(result.isSuccess).toBeTruthy();
});
```

### Mixed test (rare — UI + API in one spec)
```ts
import { test, expect } from "~/fixtures";

test("creates merchant via UI then verifies via API", async ({
  authenticatedPage, merchantPage, transactionService, request,
}) => { ... });
```

## Adding a new fixture

1. Pick the right file based on concern:
   - new page → `pages.fixture.ts`
   - new service → `api.fixture.ts`
   - new factory → `data.fixture.ts`
2. Add the fixture entry + extend the typed `Fixtures` interface in that file.
3. No changes to `index.ts` needed — it picks up everything via `mergeTests`.
