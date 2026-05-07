/**
 * Format a Date as `MM/YY`. Used for card expiration fields.
 */
export function formatExpDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
}

/**
 * Future expiration date `yearsFromNow` years out (default 2).
 */
export function futureExpDate(yearsFromNow = 2): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + yearsFromNow);
  return formatExpDate(d);
}

/**
 * Past expiration date `yearsAgo` years back (default 5).
 */
export function pastExpDate(yearsAgo = 5): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  return formatExpDate(d);
}

/**
 * ISO timestamp without milliseconds (e.g. `2026-05-03T10:15:30Z`).
 */
export function isoTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Unix timestamp in milliseconds.
 */
export function nowMs(): number {
  return Date.now();
}
