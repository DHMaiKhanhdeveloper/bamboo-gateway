import type { APIResponse } from "@playwright/test";
import type { z } from "zod";
import type { HttpClient } from "~/core/http/http-client";
import { ApiError, ValidationError } from "~/core/http/http-errors";
import { Logger } from "~/core/logger/logger";

/**
 * Foundation for API services.
 *
 * Each service wraps an `HttpClient` and exposes domain-specific operations
 * (createSale, capture, void, ...). It also handles schema validation of
 * responses via Zod, ensuring runtime-validated typed objects are returned.
 */
export abstract class BaseApiService {
  protected readonly log: Logger;

  constructor(protected readonly http: HttpClient) {
    this.log = new Logger({ scope: this.constructor.name });
  }

  /**
   * Parse JSON body and validate with Zod schema.
   * Throws ValidationError on schema mismatch, ApiError on HTTP failure.
   */
  protected async parseJson<S extends z.ZodTypeAny>(
    response: APIResponse,
    schema: S,
    context: string
  ): Promise<z.infer<S>> {
    const status = response.status();
    let body: unknown;
    try {
      body = await response.json();
    } catch (err) {
      throw new ApiError(
        `Failed to parse response JSON for ${context}: ${(err as Error).message}`,
        status,
        response.url(),
        await response.text().catch(() => undefined)
      );
    }

    if (!response.ok()) {
      throw new ApiError(`${context} failed`, status, response.url(), body);
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(`${context}: response did not match schema`, parsed.error.issues);
    }
    return parsed.data;
  }

  /**
   * Validate request payload before sending. Throws ValidationError on mismatch.
   */
  protected validatePayload<S extends z.ZodTypeAny>(
    schema: S,
    payload: unknown,
    context: string
  ): z.infer<S> {
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(`${context}: payload did not match schema`, parsed.error.issues);
    }
    return parsed.data;
  }
}
