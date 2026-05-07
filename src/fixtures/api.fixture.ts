import { test as base, type APIRequestContext } from "@playwright/test";
import { authTest } from "~/fixtures/auth.fixture";
import { TransactionApiService } from "~/api/services/transaction.service";
import { VirtualTerminalApiService } from "~/api/services/virtual-terminal.service";
import { HttpClient } from "~/core/http/http-client";
import { getApiBaseURL, getCommonMerchantIdSync } from "~/config/env";

export interface ApiFixtures {
  /** Pre-authenticated APIRequestContext (Playwright handles cookie reuse). */
  authenticatedApiRequest: APIRequestContext;

  /** Generic HTTP client wrapper around the request context. */
  httpClient: HttpClient;

  /** Common merchant ID for the bulk of tests. */
  merchantId: string;

  /** API service for sale operations only (Virtual Terminal). */
  virtualTerminalService: VirtualTerminalApiService;

  /** API service for the full transaction lifecycle. */
  transactionService: TransactionApiService;
}

export const apiTest = authTest.extend<ApiFixtures>({
  authenticatedApiRequest: async ({ request }, use) => {
    await use(request);
  },

  httpClient: async ({ request, apiBearerToken }, use) => {
    const client = new HttpClient(request, {
      baseURL: getApiBaseURL(),
      bearerToken: apiBearerToken,
    });
    await use(client);
  },

  merchantId: async ({}, use) => {
    await use(getCommonMerchantIdSync());
  },

  virtualTerminalService: async ({ apiBearerToken, merchantId }, use) => {
    await use(new VirtualTerminalApiService(merchantId, apiBearerToken));
  },

  transactionService: async ({ apiBearerToken, merchantId }, use) => {
    await use(new TransactionApiService(merchantId, apiBearerToken));
  },
});

// Stand-alone version (no auth dependency) — useful for tests that mock auth.
export const apiTestRaw = base.extend<Pick<ApiFixtures, "merchantId">>({
  merchantId: async ({}, use) => {
    await use(getCommonMerchantIdSync());
  },
});
