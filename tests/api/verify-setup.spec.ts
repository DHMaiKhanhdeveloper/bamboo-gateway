import { test, expect } from "@playwright/test";
import { getApiBaseURL, getCommonMerchantIdSync, getTsysMerchantIdSync } from "~/config/env";
import { TAGS } from "~/config/constants";

test.describe("Setup verification", { tag: [TAGS.smoke, TAGS.api] }, () => {
  test("required env vars and merchant seeds are present", () => {
    expect(getApiBaseURL()).toMatch(/^https?:\/\//);
    expect(getCommonMerchantIdSync()).toMatch(/^[0-9a-f-]{36}$/);
    expect(getTsysMerchantIdSync()).toMatch(/^[0-9a-f-]{36}$/);
  });
});
