import { TimeoutError } from "~/core/http/http-errors";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RetryOptions {
  attempts?: number;
  backoffMs?: number;
  multiplier?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Retry an async function with exponential backoff.
 */
export async function retry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const attempts = opts.attempts ?? 3;
  const backoffMs = opts.backoffMs ?? 1_000;
  const multiplier = opts.multiplier ?? 2;
  const shouldRetry = opts.shouldRetry ?? (() => true);

  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts || !shouldRetry(err, i)) throw err;
      opts.onRetry?.(err, i);
      await sleep(backoffMs * Math.pow(multiplier, i - 1));
    }
  }
  throw lastErr;
}

/**
 * Wait until a condition returns truthy or the timeout elapses.
 * Useful for polling readiness/state changes.
 */
export async function waitUntil<T>(
  predicate: () => Promise<T | false | null | undefined>,
  opts: { timeoutMs?: number; intervalMs?: number; message?: string } = {}
): Promise<T> {
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const intervalMs = opts.intervalMs ?? 500;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const result = await predicate();
    if (result) return result;
    await sleep(intervalMs);
  }
  throw new TimeoutError(opts.message ?? "waitUntil timed out", timeoutMs);
}
