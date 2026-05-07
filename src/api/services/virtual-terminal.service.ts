import type { APIRequestContext, APIResponse } from "@playwright/test";
import { getApiBaseURL } from "~/config/env";
import { Logger } from "~/core/logger/logger";
import { ApiError } from "~/core/http/http-errors";
import {
  generateDefaultCardHolderData,
  generateRequestId,
  generateSaleTransactionPayload,
} from "~/data/builders/sale-transaction.builder";
import {
  SaleTransactionResponseSchema,
  type SaleTransactionOptions,
  type SaleTransactionResponse,
} from "~/api/schemas/virtual-terminal.schema";

export interface VerifiedSaleResponse {
  isSuccess: boolean;
  status: number;
  transactionId?: string | undefined;
  transactionType?: string | undefined;
  processorApproved?: boolean | undefined;
  total?: string | number | undefined;
  subTotal?: string | number | undefined;
  tax?: string | number | undefined;
  discount?: string | number | undefined;
  fullName?: string | undefined;
  body: SaleTransactionResponse;
}

/**
 * Virtual Terminal API service.
 * Replaces the old `VirtualTerminalApiPage`. Uses Zod for response shape
 * validation while remaining permissive (extra fields are passed through).
 */
export class VirtualTerminalApiService {
  private readonly log = new Logger({ scope: "vt-api" });
  private readonly baseURL: string;

  constructor(
    private readonly merchantId: string,
    private readonly bearerToken: string
  ) {
    this.baseURL = getApiBaseURL();
  }

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.bearerToken}`,
    };
  }

  async createSale(
    request: APIRequestContext,
    amount: string,
    options: Partial<SaleTransactionOptions> = {}
  ): Promise<APIResponse> {
    const payload = generateSaleTransactionPayload(amount, {
      requestId: options.requestId ?? generateRequestId(),
      ...options,
    });

    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/sale`,
      { headers: this.getHeaders(), data: payload }
    );
  }

  async createSaleWithCompleteData(
    request: APIRequestContext,
    amount: string,
    options: SaleTransactionOptions
  ): Promise<APIResponse> {
    const payload = generateSaleTransactionPayload(amount, {
      requestId: options.requestId ?? generateRequestId(),
      cardData:
        options.cardData ?? {
          encryptedPan:
            "BN253zh9axn6MrYG0qHZzC3qNW683R9acKsR6NU+7h8gG7ZqyFXfdVAsYUrnzbmdt8ELD3Vn5H3G5MUHwN2mxw==",
          cvv2: "999",
          cardType: "CREDIT",
          expMonth: "12",
          expYear: "29",
        },
      cardHolderData: options.cardHolderData ?? generateDefaultCardHolderData(),
      ...(options.amountData ? { amountData: options.amountData } : {}),
      ...(options.merchantDefinedFields ? { merchantDefinedFields: options.merchantDefinedFields } : {}),
      ...(options.orderItems ? { orderItems: options.orderItems } : {}),
      industryCode: options.industryCode ?? "D",
      authOnly: options.authOnly ?? false,
    });

    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/sale`,
      { headers: this.getHeaders(), data: payload }
    );
  }

  async verifySaleResponse(response: APIResponse): Promise<VerifiedSaleResponse> {
    const status = response.status();
    const contentType = response.headers()["content-type"] ?? "";
    const isJson = contentType.includes("application/json") || contentType.includes("application/ld+json");

    if (!isJson) {
      const text = await response.text();
      this.log.error(`API returned non-JSON response (status ${status}, content-type ${contentType})`);
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        throw new ApiError(
          "API returned HTML instead of JSON. Authentication likely failed or wrong endpoint. " +
            "Check BYPASS_AUTH_TOKEN in .env.local.",
          status,
          response.url(),
          text.substring(0, 300)
        );
      }
    }

    const raw = (await response.json()) as unknown;
    const parsed = SaleTransactionResponseSchema.parse(raw);
    return {
      isSuccess: response.ok(),
      status,
      transactionId: parsed.transactionId,
      transactionType: parsed.transactionType,
      processorApproved: parsed.processorApproved,
      total: parsed.total,
      subTotal: parsed.subTotal,
      tax: parsed.tax,
      discount: parsed.discount,
      fullName: parsed.fullName,
      body: parsed,
    };
  }

  generateRequestId(): string { return generateRequestId(); }
  generateCardHolderData() { return generateDefaultCardHolderData(); }
}
