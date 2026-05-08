import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("POR-345: User management", { tag: [TAGS.ticket] }, () => {
  test.skip(!process.env["RUN_TICKETS"]);

  test("placeholder", async ({}) => {});
});
