import { z } from "zod";
import { OrderItemSchema } from "~/api/schemas/virtual-terminal.schema";

// =============================================================================
// Reusable request fragments
// =============================================================================
export const TransactionAmountSchema = z
  .object({
    subTotal: z.string(),
    total: z.string(),
    tax: z.string().optional(),
    tip: z.string().optional(),
    discount: z.string().optional(),
  })
  .passthrough();
export type TransactionAmount = z.infer<typeof TransactionAmountSchema>;

// =============================================================================
// Operation requests (passthrough to allow caller-extension)
// =============================================================================
export const SaleRequestSchema = z
  .object({
    paymentType: z.enum(["Card", "Cash"]),
    cardData: z.unknown().optional(),
    amount: TransactionAmountSchema,
    industryCode: z.string(),
    orderDetail: z.object({ source: z.string(), orderItems: z.array(OrderItemSchema) }),
    authOnly: z.boolean(),
    requestId: z.string(),
  })
  .passthrough();
export type SaleRequest = z.infer<typeof SaleRequestSchema>;

export const CaptureRequestSchema = z
  .object({
    amount: z.string().optional(),
    requestId: z.string(),
  })
  .passthrough();
export type CaptureRequest = z.infer<typeof CaptureRequestSchema>;

export const ReversalRequestSchema = z
  .object({
    amount: z.string().optional(),
    requestId: z.string(),
  })
  .passthrough();
export type ReversalRequest = z.infer<typeof ReversalRequestSchema>;

export const VoidRequestSchema = z
  .object({
    requestId: z.string(),
  })
  .passthrough();
export type VoidRequest = z.infer<typeof VoidRequestSchema>;

export const IncrementalRequestSchema = z
  .object({
    amount: z.string(),
    requestId: z.string(),
  })
  .passthrough();
export type IncrementalRequest = z.infer<typeof IncrementalRequestSchema>;

export const ReturnRequestSchema = z
  .object({
    amount: z.string().optional(),
    requestId: z.string(),
  })
  .passthrough();
export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;

export const BatchCloseRequestSchema = z
  .object({
    requestId: z.string(),
  })
  .passthrough();
export type BatchCloseRequest = z.infer<typeof BatchCloseRequestSchema>;

// =============================================================================
// Response (generic shape — services validate as much as they need)
// =============================================================================
export const TransactionResponseSchema = z
  .object({
    transactionId: z.string().optional(),
    transactionType: z.string().optional(),
    transactionStatus: z.string().optional(),
    status: z.string().optional(),
    processorApproved: z.boolean().optional(),
    total: z.union([z.string(), z.number()]).optional(),
    authCode: z.string().optional(),
  })
  .passthrough();
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;

export interface VerifiedTransactionResponse {
  isSuccess: boolean;
  status: number;
  transactionId?: string | undefined;
  transactionType?: string | undefined;
  transactionStatus?: string | undefined;
  processorApproved?: boolean | undefined;
  total?: string | number | undefined;
  authCode?: string | undefined;
  body: TransactionResponse;
}
