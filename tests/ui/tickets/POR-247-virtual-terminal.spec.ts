import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("POR-247: Virtual Terminal", { tag: [TAGS.ticket] }, () => {
  test.skip(!process.env["RUN_TICKETS"], "Ticket tests run on demand — set RUN_TICKETS=1");
  test("placeholder for POR-247 reproduction", async ({}) => {});
});
