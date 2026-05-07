import { authenticator } from "otplib";

/**
 * Generate a TOTP code from a base32-encoded secret.
 * Uses the standard 30-second window per RFC 6238.
 */
export function generateTotp(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Time remaining in the current TOTP window (in seconds).
 */
export function totpTimeRemaining(): number {
  return authenticator.timeRemaining();
}

/**
 * Generate a TOTP and ensure at least `minSecondsLeft` seconds remain in the window.
 * If less, wait until the next window starts.
 */
export async function generateFreshTotp(secret: string, minSecondsLeft = 5): Promise<string> {
  const remaining = totpTimeRemaining();
  if (remaining < minSecondsLeft) {
    await new Promise((r) => setTimeout(r, (remaining + 1) * 1000));
  }
  return generateTotp(secret);
}
