import { faker } from "@faker-js/faker";
import testCards from "~/data/seeds/test-cards.json" with { type: "json" };
import type { TestCard } from "~/core/types/domain.types";

export type TestCardType = "valid" | "declined" | "expired" | "insufficient_funds" | "invalid_cvv";

export const TEST_CARDS: TestCard[] = testCards.testCardData as TestCard[];

export function getCardByType(type: TestCardType): TestCard {
  const card = TEST_CARDS.find((c) => c.type === type);
  if (!card) throw new Error(`Test card of type '${type}' not found in seeds`);
  return card;
}

export const CardFactory = {
  valid: (): TestCard => getCardByType("valid"),
  declined: (): TestCard => getCardByType("declined"),
  expired: (): TestCard => getCardByType("expired"),
  insufficientFunds: (): TestCard => getCardByType("insufficient_funds"),
  invalidCvv: (): TestCard => getCardByType("invalid_cvv"),

  /**
   * Random Faker-generated card data for non-payment-flow tests
   * (where the card just needs to look real, not actually be authorized).
   */
  random(): TestCard {
    const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0");
    const yy = String(new Date().getFullYear() + faker.number.int({ min: 1, max: 5 })).slice(-2);
    return {
      type: "valid",
      cardNumber: faker.finance.creditCardNumber("visa"),
      expDate: `${month}/${yy}`,
      cvv: faker.finance.creditCardCVV(),
      description: "Faker-generated test card",
    };
  },
};
