import { z } from "zod";

// =============================================================================
// Domain enums
// =============================================================================
export const CardTypeSchema = z.enum(["CREDIT", "DEBIT"]);
export type CardType = z.infer<typeof CardTypeSchema>;

export const PaymentTypeSchema = z.enum(["Card", "Cash"]);
export type PaymentType = z.infer<typeof PaymentTypeSchema>;

export const IndustryCodeSchema = z.enum(["D", "H", "R", "T"]);
export type IndustryCode = z.infer<typeof IndustryCodeSchema>;

export const DiscountTypeSchema = z.enum(["A", "P"]);
export type DiscountType = z.infer<typeof DiscountTypeSchema>;

// =============================================================================
// Request building blocks
// =============================================================================
export const CardDataSchema = z.object({
  encryptedPan: z.string(),
  cvv2: z.string(),
  cardType: CardTypeSchema,
  expMonth: z.string(),
  expYear: z.string(),
});
export type CardData = z.infer<typeof CardDataSchema>;

export const CardHolderDataSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  countryCode: z.string(),
  state: z.string(),
  zip: z.string(),
});
export type CardHolderData = z.infer<typeof CardHolderDataSchema>;

export const AmountDataSchema = z.object({
  subTotal: z.string(),
  total: z.string(),
  tax: z.string().optional(),
  tip: z.string().optional(),
  discount: z.string().optional(),
});
export type AmountData = z.infer<typeof AmountDataSchema>;

export const MerchantDefinedFieldSchema = z.object({
  merchantDefinedField: z.string(),
});
export type MerchantDefinedField = z.infer<typeof MerchantDefinedFieldSchema>;

export const OrderItemSchema = z.object({
  productDetailByLocation: z.string().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  price: z.string().optional(),
  quantity: z.string().optional(),
  discount: z.string().optional(),
  taxRate: z.string().optional(),
  currency: z.string().optional(),
  discountType: DiscountTypeSchema.optional(),
  totalDiscount: z.string().optional(),
  tax: z.string().optional(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderDetailSchema = z.object({
  source: z.string(),
  orderItems: z.array(OrderItemSchema),
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;

// =============================================================================
// Sale transaction payload (request)
// =============================================================================
export const SaleTransactionPayloadSchema = z.object({
  paymentType: PaymentTypeSchema,
  cardData: CardDataSchema.optional(),
  cardHolderData: CardHolderDataSchema.optional(),
  amount: AmountDataSchema,
  industryCode: z.string(),
  merchantDefinedFields: z.array(MerchantDefinedFieldSchema).optional(),
  orderDetail: OrderDetailSchema,
  authOnly: z.boolean(),
  requestId: z.string(),
});
export type SaleTransactionPayload = z.infer<typeof SaleTransactionPayloadSchema>;

// =============================================================================
// Options DTO (for builders)
// =============================================================================
export interface SaleTransactionOptions {
  cardData?: CardData;
  cardHolderData?: CardHolderData;
  amountData?: AmountData;
  merchantDefinedFields?: MerchantDefinedField[];
  orderItems?: OrderItem[];
  authOnly?: boolean;
  requestId?: string;
  industryCode?: string;
}

// =============================================================================
// Response shape (permissive — passes through unknown fields)
// =============================================================================
export const SaleTransactionResponseSchema = z
  .object({
    transactionId: z.string().optional(),
    transactionType: z.string().optional(),
    processorApproved: z.boolean().optional(),
    total: z.union([z.string(), z.number()]).optional(),
    subTotal: z.union([z.string(), z.number()]).optional(),
    tax: z.union([z.string(), z.number()]).optional(),
    discount: z.union([z.string(), z.number()]).optional(),
    fullName: z.string().optional(),
    status: z.string().optional(),
    transactionStatus: z.string().optional(),
    authCode: z.string().optional(),
  })
  .passthrough();
export type SaleTransactionResponse = z.infer<typeof SaleTransactionResponseSchema>;
