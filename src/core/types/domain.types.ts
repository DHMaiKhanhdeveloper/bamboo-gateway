/**
 * Domain types shared across the framework.
 * Specific request/response shapes live in `src/api/schemas/*` (Zod).
 */

export type Uuid = string;

export type Role =
  | "admin"
  | "support"
  | "master_merchant"
  | "merchant"
  | "reseller"
  | "master_reseller";

export interface User {
  id: Uuid;
  username: string;
  password: string;
  terminals: Uuid[];
  totpSecret: string;
}

export interface TestCard {
  type: "valid" | "declined" | "expired" | "insufficient_funds" | "invalid_cvv";
  cardNumber: string;
  expDate: string;
  cvv: string;
  description: string;
}

export type CardType = "CREDIT" | "DEBIT";
export type PaymentType = "Card" | "Cash";
export type IndustryCode = "D" | "H" | "R" | "T";
export type DiscountType = "A" | "P";

export type TransactionStatus =
  | "APPROVED"
  | "DECLINED"
  | "PENDING"
  | "VOIDED"
  | "RETURNED"
  | "CAPTURED"
  | "REVERSED";

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
