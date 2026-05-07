import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Category CRUD", { tag: [TAGS.regression] }, () => {
  test("creates a category", async ({ authenticatedPage, categoryPage }) => {
    void authenticatedPage;
    await categoryPage.gotoCategoryList();
    await categoryPage.createCategory();
  });

  test("removes a category", async ({ authenticatedPage, categoryPage }) => {
    void authenticatedPage;
    await categoryPage.gotoCategoryList();
    await categoryPage.removeCategoryFirst();
  });
});
