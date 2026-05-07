import { test } from "~/fixtures";
import { TAGS } from "~/config/constants";
import { faker } from "@faker-js/faker";

test.describe("Employee: Create", { tag: [TAGS.regression] }, () => {
  test("creates a new employee", async ({ authenticatedPage, employeePage }) => {
    void authenticatedPage;
    await employeePage.gotoCreateEmployee();
    await employeePage.createEmployee({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number({ style: "international" }),
      role: "Cashier",
      status: "Active",
      passCode: faker.string.numeric(4),
    });
    await employeePage.verifyCreationSuccess();
  });
});
