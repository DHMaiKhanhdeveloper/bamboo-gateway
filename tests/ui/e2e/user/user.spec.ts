import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("User CRUD", { tag: [TAGS.regression] }, () => {
  test("Users list page loads", async ({ authenticatedPage, userPage }) => {
    void authenticatedPage;
    await userPage.gotoUsersList();
  });
});
