import { mergeTests } from "@playwright/test";
import { authTest, type AuthFixtures } from "~/fixtures/auth.fixture";
import { pagesTest, type PageFixtures } from "~/fixtures/pages.fixture";
import { apiTest, type ApiFixtures } from "~/fixtures/api.fixture";
import { dataTest, type DataFixtures } from "~/fixtures/data.fixture";

export type AllFixtures = AuthFixtures & PageFixtures & ApiFixtures & DataFixtures;

/**
 * Composed test object for all UI + API + data + auth fixtures.
 *
 * Usage:
 *   import { test, expect } from "~/fixtures";
 *
 *   test("login flow", async ({ loginPage, userManager }) => {
 *     const admin = userManager.getAdminUser();
 *     await loginPage.login(admin.username, admin.password, admin.totpSecret);
 *   });
 */
export const test = mergeTests(authTest, pagesTest, apiTest, dataTest);

export { expect } from "@playwright/test";
