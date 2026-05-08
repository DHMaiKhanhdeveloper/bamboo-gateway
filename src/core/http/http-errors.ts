/**
 * Typed error hierarchy for HTTP / API failures.
 * Replaces ad-hoc thrown strings in the old codebase.
 */

export class FrameworkError extends Error {
  override readonly name: string = "FrameworkError";
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class ApiError extends FrameworkError {
  override readonly name = "ApiError";
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    public readonly body?: unknown,
    options?: ErrorOptions
  ) {
    super(`${message} [${status}] ${url}`, options);
  }
}

export class AuthError extends FrameworkError {
  override readonly name = "AuthError";
  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message, { cause });
  }
}

export class ValidationError extends FrameworkError {
  override readonly name = "ValidationError";
  constructor(
    message: string,
    public readonly issues: unknown
  ) {
    super(message);
  }
}

export class TimeoutError extends FrameworkError {
  override readonly name = "TimeoutError";
  constructor(
    message: string,
    public readonly timeoutMs: number
  ) {
    super(`${message} (after ${timeoutMs}ms)`);
  }
}
