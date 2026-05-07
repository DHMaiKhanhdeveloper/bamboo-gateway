import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("Smoke: Create Terminal", { tag: [TAGS.smoke] }, () => {
  test("creates a new terminal via the UI", async ({ authenticatedPage, terminalPage }) => {
    test.skip(!process.env["RUN_FULL_SMOKE"], "Full smoke disabled — set RUN_FULL_SMOKE=1 to run");
    void authenticatedPage;

    await terminalPage.gotoAddTerminalDirect();
    await terminalPage.fillTerminalForm({
      device: "Virtual",
      name: `term-smoke-${Date.now()}`,
      processor: "DEMO",
      processorDetails: { mid: "12345", tid: "12345", bin: "00000000" },
    });
    await terminalPage.submitTerminalForm();
    await terminalPage.verifyTerminalCreationSuccess();
  });
});
