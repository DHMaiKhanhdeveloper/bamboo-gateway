import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Transaction Detail (POR-559)", { tag: [TAGS.regression, TAGS.ticket] }, () => {
  test.skip(!process.env["RUN_FULL_E2E"], "Requires existing transaction ID");
  test("placeholder for transaction detail rendering", async ({}) => {});
});
