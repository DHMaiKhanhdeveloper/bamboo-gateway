import type { APIRequestContext, APIResponse } from "@playwright/test";
import { Logger } from "~/core/logger/logger";
import { ApiError } from "~/core/http/http-errors";
import { RETRY } from "~/config/constants";
import { sleep } from "~/helpers/retry.helper";

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  form?: Record<string, string>;
  multipart?: Record<string, string | { name: string; mimeType: string; buffer: Buffer }>;
  timeout?: number;
  retry?: boolean | number;
  ignoreHTTPErrors?: boolean;
}

export interface HttpClientOptions {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  bearerToken?: string;
  logger?: Logger;
}

/**
 * Wrapper around Playwright's APIRequestContext.
 *
 * Adds:
 *   - Authorization header injection
 *   - Structured logging per request (method, url, status, duration)
 *   - Retry with exponential backoff on transient failures (5xx, network errors)
 */
export class HttpClient {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private bearerToken: string | undefined;
  private readonly log: Logger;

  constructor(request: APIRequestContext, opts: HttpClientOptions = {}) {
    this.request = request;
    this.baseURL = opts.baseURL ?? "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...opts.defaultHeaders,
    };
    this.bearerToken = opts.bearerToken;
    this.log = opts.logger ?? new Logger({ scope: "http" });
  }

  setBearerToken(token: string | undefined): void {
    this.bearerToken = token;
  }

  getBearerToken(): string | undefined {
    return this.bearerToken;
  }

  async get(path: string, opts: HttpRequestOptions = {}): Promise<APIResponse> {
    return this.send("GET", path, opts);
  }

  async post(path: string, opts: HttpRequestOptions = {}): Promise<APIResponse> {
    return this.send("POST", path, opts);
  }

  async put(path: string, opts: HttpRequestOptions = {}): Promise<APIResponse> {
    return this.send("PUT", path, opts);
  }

  async patch(path: string, opts: HttpRequestOptions = {}): Promise<APIResponse> {
    return this.send("PATCH", path, opts);
  }

  async delete(path: string, opts: HttpRequestOptions = {}): Promise<APIResponse> {
    return this.send("DELETE", path, opts);
  }

  async head(path: string, opts: HttpRequestOptions = {}): Promise<APIResponse> {
    return this.send("HEAD", path, opts);
  }

  private async send(
    method: string,
    path: string,
    opts: HttpRequestOptions
  ): Promise<APIResponse> {
    const url = this.buildUrl(path, opts.params);
    const headers = this.buildHeaders(opts.headers);
    const maxAttempts = opts.retry === false ? 1 : typeof opts.retry === "number" ? opts.retry : RETRY.attempts;

    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const start = Date.now();
      try {
        const response = await this.request.fetch(url, {
          method,
          headers,
          data: opts.data,
          form: opts.form,
          multipart: opts.multipart as never,
          timeout: opts.timeout,
          ignoreHTTPErrors: opts.ignoreHTTPErrors,
        });
        const duration = Date.now() - start;
        const status = response.status();
        this.log.debug(`${method} ${url} → ${status} (${duration}ms, attempt ${attempt})`);

        if (this.shouldRetry(status) && attempt < maxAttempts) {
          await this.backoff(attempt);
          continue;
        }
        return response;
      } catch (err) {
        lastError = err;
        this.log.warn(`${method} ${url} failed (attempt ${attempt}/${maxAttempts})`, err);
        if (attempt < maxAttempts) {
          await this.backoff(attempt);
          continue;
        }
        throw new ApiError(`Request failed: ${(err as Error).message}`, 0, url, undefined, {
          cause: err as Error,
        });
      }
    }
    throw new ApiError("Exhausted retries", 0, url, undefined, { cause: lastError as Error });
  }

  private buildUrl(path: string, params?: HttpRequestOptions["params"]): string {
    const base = path.startsWith("http") ? path : `${this.baseURL}${path}`;
    if (!params) return base;
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) qs.append(k, String(v));
    return `${base}${base.includes("?") ? "&" : "?"}${qs.toString()}`;
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { ...this.defaultHeaders, ...extra };
    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }
    return headers;
  }

  private shouldRetry(status: number): boolean {
    return status >= 500 && status !== 501;
  }

  private async backoff(attempt: number): Promise<void> {
    const ms = RETRY.backoffMs * Math.pow(RETRY.backoffMultiplier, attempt - 1);
    await sleep(ms);
  }
}
