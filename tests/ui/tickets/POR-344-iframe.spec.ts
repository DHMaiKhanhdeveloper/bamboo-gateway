import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("POR-344: iframe handling", { tag: [TAGS.ticket] }, () => {
  test.skip(!process.env["RUN_TICKETS"]);

  test("placeholder", async ({}) => {});
});
