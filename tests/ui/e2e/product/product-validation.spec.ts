import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Product: Validation", { tag: [TAGS.regression] }, () => {
  test.skip(!process.env["RUN_FULL_E2E"]);

  test("placeholder", async ({}) => {});
});
