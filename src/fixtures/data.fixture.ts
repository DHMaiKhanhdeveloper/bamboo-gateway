import { test as base } from "@playwright/test";
import { DataGenerator } from "~/support/data-generator";
import { UserManager } from "~/support/managers/user-manager";
import { CardFactory } from "~/data/factories/card.factory";
import { CustomerFactory } from "~/data/factories/customer.factory";
import { MerchantFactory } from "~/data/factories/merchant.factory";
import { TransactionFactory } from "~/data/factories/transaction.factory";

export interface DataFixtures {
  dataGenerator: typeof DataGenerator;
  userManager: typeof UserManager;
  cardFactory: typeof CardFactory;
  customerFactory: typeof CustomerFactory;
  merchantFactory: typeof MerchantFactory;
  transactionFactory: typeof TransactionFactory;
}

export const dataTest = base.extend<DataFixtures>({
  dataGenerator: async ({}, use) => { await use(DataGenerator); },
  userManager: async ({}, use) => { await use(UserManager); },
  cardFactory: async ({}, use) => { await use(CardFactory); },
  customerFactory: async ({}, use) => { await use(CustomerFactory); },
  merchantFactory: async ({}, use) => { await use(MerchantFactory); },
  transactionFactory: async ({}, use) => { await use(TransactionFactory); },
});
