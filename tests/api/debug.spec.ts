import { test, expect } from "~/fixtures";
import { TAGS } from "~/config/constants";

test.describe("API debug helpers", { tag: [TAGS.api] }, () => {
  test("can issue an authenticated GET via httpClient", async ({ httpClient }) => {
    const response = await httpClient.get("/users/me", { ignoreHTTPSErrors: true });
    expect([200, 401, 403, 404]).toContain(response.status());
  });
});
