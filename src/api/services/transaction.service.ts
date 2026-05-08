import type { APIRequestContext, APIResponse } from "@playwright/test";
import { getApiBaseURL } from "~/config/env";
import { generateRequestId } from "~/data/builders/sale-transaction.builder";
import { Logger } from "~/core/logger/logger";
import { ApiError } from "~/core/http/http-errors";
import {
  TransactionResponseSchema,
  type TransactionResponse,
  type VerifiedTransactionResponse,
} from "~/api/schemas/transaction.schema";

export interface CardDataLike {
  encryptedPan: string;
  cvv2: string;
  cardType: "CREDIT" | "DEBIT";
  expMonth: string;
  expYear: string;
}

export interface TransactionAmountOptions {
  amountData?: {
    subTotal?: string;
    total?: string;
    tax?: string;
    tip?: string;
    discount?: string;
  };
  industryCode?: string;
  orderItems?: unknown[];
  requestId?: string;
}

/**
 * Comprehensive transaction service.
 * Replaces the old `TransactionApiPage` and exposes:
 * Sale, Auth+Capture, Batch Close, Reversal, Void, Incremental,
 * Return, Return Reversal, Void Return, Get/Status query.
 */
export class TransactionApiService {
  private readonly log = new Logger({ scope: "transaction-api" });
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
      "X-Merchant-Account-Id": this.merchantId,
    };
  }

  // ===========================================================================
  // Sale operations
  // ===========================================================================
  async createSale(
    request: APIRequestContext,
    amount: string,
    cardData: CardDataLike,
    options: TransactionAmountOptions = {}
  ): Promise<APIResponse> {
    const payload = {
      paymentType: "Card",
      cardData,
      amount: { subTotal: amount, total: amount, ...options.amountData },
      industryCode: options.industryCode ?? "D",
      orderDetail: { source: "VT", orderItems: options.orderItems ?? [] },
      authOnly: false,
      requestId: options.requestId ?? generateRequestId(),
    };
    return request.post(`${this.baseURL}/merchants/${this.merchantId}/transactions/sale`, {
      headers: this.getHeaders(),
      data: payload,
    });
  }

  async createSaleCash(
    request: APIRequestContext,
    amount: string,
    options: TransactionAmountOptions = {}
  ): Promise<APIResponse> {
    const payload = {
      paymentType: "Cash",
      amount: { subTotal: amount, total: amount, ...options.amountData },
      industryCode: options.industryCode ?? "D",
      orderDetail: { source: "VT", orderItems: options.orderItems ?? [] },
      requestId: options.requestId ?? generateRequestId(),
    };
    return request.post(`${this.baseURL}/merchants/${this.merchantId}/transactions/sale`, {
      headers: this.getHeaders(),
      data: payload,
    });
  }

  // ===========================================================================
  // Auth + Capture
  // ===========================================================================
  async createAuthOnly(
    request: APIRequestContext,
    amount: string,
    cardData: CardDataLike,
    options: TransactionAmountOptions = {}
  ): Promise<APIResponse> {
    const payload = {
      paymentType: "Card",
      cardData,
      amount: { subTotal: amount, total: amount, ...options.amountData },
      industryCode: options.industryCode ?? "D",
      orderDetail: { source: "VT", orderItems: options.orderItems ?? [] },
      authOnly: true,
      requestId: options.requestId ?? generateRequestId(),
    };
    return request.post(`${this.baseURL}/merchants/${this.merchantId}/transactions/sale`, {
      headers: this.getHeaders(),
      data: payload,
    });
  }

  async captureAuth(
    request: APIRequestContext,
    transactionId: string,
    amount?: string
  ): Promise<APIResponse> {
    const payload: Record<string, string> = { requestId: generateRequestId() };
    if (amount) payload["amount"] = amount;
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${transactionId}/capture`,
      { headers: this.getHeaders(), data: payload }
    );
  }

  // ===========================================================================
  // Settlement
  // ===========================================================================
  async batchClose(request: APIRequestContext): Promise<APIResponse> {
    return request.post(`${this.baseURL}/merchants/${this.merchantId}/transactions/batch-close`, {
      headers: this.getHeaders(),
      data: { requestId: generateRequestId() },
    });
  }

  // ===========================================================================
  // Pre-settlement cancellation
  // ===========================================================================
  async reversal(
    request: APIRequestContext,
    transactionId: string,
    amount?: string
  ): Promise<APIResponse> {
    const payload: Record<string, string> = { requestId: generateRequestId() };
    if (amount) payload["amount"] = amount;
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${transactionId}/reversal`,
      { headers: this.getHeaders(), data: payload }
    );
  }

  async void(request: APIRequestContext, transactionId: string): Promise<APIResponse> {
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${transactionId}/void`,
      { headers: this.getHeaders(), data: { requestId: generateRequestId() } }
    );
  }

  // ===========================================================================
  // Incremental
  // ===========================================================================
  async incremental(
    request: APIRequestContext,
    transactionId: string,
    additionalAmount: string
  ): Promise<APIResponse> {
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${transactionId}/incremental`,
      {
        headers: this.getHeaders(),
        data: { amount: additionalAmount, requestId: generateRequestId() },
      }
    );
  }

  // ===========================================================================
  // Return / refund
  // ===========================================================================
  async return(
    request: APIRequestContext,
    transactionId: string,
    amount?: string
  ): Promise<APIResponse> {
    const payload: Record<string, string> = { requestId: generateRequestId() };
    if (amount) payload["amount"] = amount;
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${transactionId}/return`,
      { headers: this.getHeaders(), data: payload }
    );
  }

  async returnReversal(
    request: APIRequestContext,
    returnTransactionId: string,
    amount?: string
  ): Promise<APIResponse> {
    const payload: Record<string, string> = { requestId: generateRequestId() };
    if (amount) payload["amount"] = amount;
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${returnTransactionId}/reversal`,
      { headers: this.getHeaders(), data: payload }
    );
  }

  async voidReturn(request: APIRequestContext, returnTransactionId: string): Promise<APIResponse> {
    return request.post(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${returnTransactionId}/void`,
      { headers: this.getHeaders(), data: { requestId: generateRequestId() } }
    );
  }

  // ===========================================================================
  // Query
  // ===========================================================================
  async getTransaction(request: APIRequestContext, transactionId: string): Promise<APIResponse> {
    return request.get(
      `${this.baseURL}/merchants/${this.merchantId}/transactions/${transactionId}`,
      { headers: this.getHeaders() }
    );
  }

  async getTransactionStatus(request: APIRequestContext, transactionId: string): Promise<string> {
    const response = await this.getTransaction(request, transactionId);
    const body = (await response.json()) as TransactionResponse;
    return body.status ?? body.transactionStatus ?? "";
  }

  // ===========================================================================
  // Verification
  // ===========================================================================
  async verifyTransactionResponse(response: APIResponse): Promise<VerifiedTransactionResponse> {
    const status = response.status();
    const contentType = response.headers()["content-type"] ?? "";
    const isJson =
      contentType.includes("application/json") || contentType.includes("application/ld+json");

    if (!response.ok() || !isJson) {
      const text = await response.text();
      this.log.error(`API request failed: status=${status} content-type=${contentType}`);
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        throw new ApiError(
          "API returned HTML instead of JSON. Likely auth failure, wrong endpoint, or 5xx. " +
            "Check API_BASE_URL, BYPASS_AUTH_TOKEN.",
          status,
          response.url(),
          text.substring(0, 300)
        );
      }
      throw new ApiError(
        `API request failed with status ${status}`,
        status,
        response.url(),
        text.substring(0, 500)
      );
    }

    const raw = (await response.json()) as unknown;
    const parsed = TransactionResponseSchema.parse(raw);

    return {
      isSuccess: response.ok(),
      status,
      transactionId: parsed.transactionId,
      transactionType: parsed.transactionType,
      transactionStatus: parsed.status ?? parsed.transactionStatus,
      processorApproved: parsed.processorApproved,
      total: parsed.total,
      authCode: parsed.authCode,
      body: parsed,
    };
  }

  async waitForTransactionStatus(
    request: APIRequestContext,
    transactionId: string,
    expectedStatus: string,
    maxAttempts = 10,
    delayMs = 2000
  ): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      if ((await this.getTransactionStatus(request, transactionId)) === expectedStatus) return true;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return false;
  }

  generateRequestId(): string {
    return generateRequestId();
  }
}
