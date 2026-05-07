import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Terminal CRUD", { tag: [TAGS.regression] }, () => {
  test("Terminals page renders all filters", async ({ authenticatedPage, terminalPage }) => {
    void authenticatedPage;
    await terminalPage.gotoTerminals();
    await terminalPage.verifyFiltersVisible();
  });
});
