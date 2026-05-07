import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Smoke: User critical path", { tag: [TAGS.smoke, TAGS.critical] }, () => {
  test("Users list page loads", async ({ authenticatedPage, userPage }) => {
    void authenticatedPage;
    await userPage.gotoUsersList();
  });
});
