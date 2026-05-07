import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Smoke: Terminal critical path", { tag: [TAGS.smoke, TAGS.critical] }, () => {
  test("Terminals list page loads", async ({ authenticatedPage, terminalPage }) => {
    void authenticatedPage;
    await terminalPage.gotoTerminals();
    await terminalPage.verifyTerminalsListVisible();
  });
});
