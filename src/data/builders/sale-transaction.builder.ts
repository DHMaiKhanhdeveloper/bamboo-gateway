import { v7 as uuidv7 } from "uuid";
import { faker } from "@faker-js/faker";
import {
  type AmountData,
  type CardData,
  type CardHolderData,
  type MerchantDefinedField,
  type OrderItem,
  type SaleTransactionOptions,
  type SaleTransactionPayload,
} from "~/api/schemas/virtual-terminal.schema";

export function generateRequestId(): string {
  return uuidv7();
}

export function generateDefaultCardData(): CardData {
  return {
    encryptedPan:
      "TxI1E+VTCwi9V4PdDC50l3Rt4e/p21XzOUlZMIHCkU5zqUI3cxn8C32IlTW1fgNVs37QJ2KYrIAGxEGoxYe9pw==",
    cvv2: "999",
    cardType: "CREDIT",
    expMonth: "12",
    expYear: "29",
  };
}

export function generateDefaultCardHolderData(): CardHolderData {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address1: faker.location.streetAddress(),
    address2:
      faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.5 }) || "",
    city: faker.location.city(),
    countryCode: "USA",
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode("#####"),
  };
}

export function generateSaleTransactionPayload(
  amount: string,
  options: SaleTransactionOptions = {}
): SaleTransactionPayload {
  const payload: SaleTransactionPayload = {
    paymentType: "Card",
    cardData: options.cardData ?? generateDefaultCardData(),
    amount: options.amountData ?? { subTotal: amount, total: amount },
    industryCode: options.industryCode ?? "D",
    orderDetail: {
      source: "VT",
      orderItems: options.orderItems ?? [],
    },
    authOnly: options.authOnly ?? false,
    requestId: options.requestId ?? uuidv7(),
  };

  if (options.cardHolderData) payload.cardHolderData = options.cardHolderData;
  if (options.merchantDefinedFields && options.merchantDefinedFields.length > 0) {
    payload.merchantDefinedFields = options.merchantDefinedFields;
  }
  return payload;
}

/**
 * Fluent builder for sale transaction payloads.
 *
 * Example:
 *   const payload = new SaleTransactionBuilder("19.99")
 *     .withDefaultCard()
 *     .withDefaultCardHolder()
 *     .withIndustryCode("D")
 *     .build();
 */
export class SaleTransactionBuilder {
  private cardData?: CardData;
  private cardHolderData?: CardHolderData;
  private amountData?: AmountData;
  private merchantDefinedFields?: MerchantDefinedField[];
  private orderItems?: OrderItem[];
  private authOnly = false;
  private requestId?: string;
  private industryCode = "D";
  private paymentType: "Card" | "Cash" = "Card";

  constructor(private readonly amount: string) {}

  asCash(): this { this.paymentType = "Cash"; return this; }

  withCard(card: CardData): this { this.cardData = card; return this; }
  withDefaultCard(): this { this.cardData = generateDefaultCardData(); return this; }

  withCardHolder(holder: CardHolderData): this { this.cardHolderData = holder; return this; }
  withDefaultCardHolder(): this { this.cardHolderData = generateDefaultCardHolderData(); return this; }

  withAmount(data: AmountData): this { this.amountData = data; return this; }

  withMerchantDefinedFields(fields: MerchantDefinedField[]): this {
    this.merchantDefinedFields = fields;
    return this;
  }

  withOrderItems(items: OrderItem[]): this { this.orderItems = items; return this; }

  withAuthOnly(authOnly = true): this { this.authOnly = authOnly; return this; }

  withRequestId(id: string): this { this.requestId = id; return this; }

  withIndustryCode(code: string): this { this.industryCode = code; return this; }

  build(): SaleTransactionPayload {
    const payload: SaleTransactionPayload = {
      paymentType: this.paymentType,
      amount: this.amountData ?? { subTotal: this.amount, total: this.amount },
      industryCode: this.industryCode,
      orderDetail: { source: "VT", orderItems: this.orderItems ?? [] },
      authOnly: this.authOnly,
      requestId: this.requestId ?? uuidv7(),
    };
    if (this.paymentType === "Card") {
      payload.cardData = this.cardData ?? generateDefaultCardData();
    }
    if (this.cardHolderData) payload.cardHolderData = this.cardHolderData;
    if (this.merchantDefinedFields && this.merchantDefinedFields.length > 0) {
      payload.merchantDefinedFields = this.merchantDefinedFields;
    }
    return payload;
  }
}
