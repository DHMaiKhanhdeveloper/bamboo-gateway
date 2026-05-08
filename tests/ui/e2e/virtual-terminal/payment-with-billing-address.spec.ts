import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Virtual Terminal: Sale with billing address", { tag: [TAGS.regression] }, () => {
  test.skip(!process.env["RUN_FULL_E2E"]);

  test("placeholder", async ({}) => {});
});
