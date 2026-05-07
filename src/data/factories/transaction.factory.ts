import { faker } from "@faker-js/faker";
import { CardFactory } from "~/data/factories/card.factory";
import { SaleTransactionBuilder } from "~/data/builders/sale-transaction.builder";
import type { SaleTransactionPayload } from "~/api/schemas/virtual-terminal.schema";

export interface SaleTransactionFactoryOutput {
  amount: string;
  payload: SaleTransactionPayload;
}

export const TransactionFactory = {
  /**
   * Random sale with default card and Faker-generated cardholder.
   */
  randomSale(overrides: { amount?: string; authOnly?: boolean } = {}): SaleTransactionFactoryOutput {
    const amount =
      overrides.amount ?? faker.number.float({ min: 10, max: 999, fractionDigits: 2 }).toFixed(2);

    const payload = new SaleTransactionBuilder(amount)
      .withDefaultCard()
      .withDefaultCardHolder()
      .withAuthOnly(overrides.authOnly ?? false)
      .build();

    return { amount, payload };
  },

  /**
   * Sale with a specific test card type (declined, expired, etc.).
   * Uses default encrypted PAN — the type is only meta info for assertions.
   */
  saleWithCardType(type: Parameters<typeof CardFactory.valid>[0] | "valid", amount?: string): SaleTransactionFactoryOutput {
    const card = type === "valid" ? CardFactory.valid() : CardFactory.valid();
    const amt = amount ?? faker.number.float({ min: 10, max: 999, fractionDigits: 2 }).toFixed(2);
    const payload = new SaleTransactionBuilder(amt)
      .withDefaultCard()
      .withDefaultCardHolder()
      .build();
    void card;
    return { amount: amt, payload };
  },

  cashSale(overrides: { amount?: string } = {}): SaleTransactionFactoryOutput {
    const amount =
      overrides.amount ?? faker.number.float({ min: 10, max: 999, fractionDigits: 2 }).toFixed(2);
    const payload = new SaleTransactionBuilder(amount).asCash().build();
    return { amount, payload };
  },
};
