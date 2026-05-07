import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Product: Update", { tag: [TAGS.regression] }, () => {
  test.skip(!process.env["RUN_FULL_E2E"], "Requires existing product ID");
  test("placeholder", async ({}) => {});
});
