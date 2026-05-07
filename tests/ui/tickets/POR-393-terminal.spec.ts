import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("POR-393: Terminal-specific issue", { tag: [TAGS.ticket] }, () => {
  test.skip(!process.env["RUN_TICKETS"]);
  test("placeholder", async ({}) => {});
});
