import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Employee: Search", { tag: [TAGS.regression] }, () => {
  test("can filter employees by name", async ({ authenticatedPage, employeePage }) => {
    void authenticatedPage;
    await employeePage.gotoEmployeesList();
    await employeePage.searchByName("admin");
  });
});
