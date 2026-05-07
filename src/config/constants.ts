/**
 * Centralized constants used across the framework.
 * Keep magic numbers and shared regex here, not in page objects.
 */

// =============================================================================
// Timeouts (milliseconds)
// =============================================================================
export const TIMEOUTS = {
  short: 5_000,
  default: 15_000,
  long: 30_000,
  navigation: 30_000,
  api: 30_000,
  test: 45_000,
} as const;

// =============================================================================
// Retry policy
// =============================================================================
export const RETRY = {
  attempts: 3,
  backoffMs: 1_000,
  backoffMultiplier: 2,
} as const;

// =============================================================================
// Auth state files (per-role)
// =============================================================================
export const AUTH_STATE_DIR = ".auth";

export const AUTH_ROLES = {
  admin: "admin",
  support: "support",
  masterMerchant: "master-merchant",
  merchant: "merchant",
  reseller: "reseller",
  masterReseller: "master-reseller",
} as const;

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export function getAuthStateFile(role: AuthRole = AUTH_ROLES.admin): string {
  return `${AUTH_STATE_DIR}/${role}.json`;
}

// =============================================================================
// Routes (URL paths)
// =============================================================================
export const ROUTES = {
  login: "/login",
  twoFactor: "/2fa",
  dashboard: "/dashboard",
  users: "/users",
  merchants: "/merchants",
  customers: "/customers",
  products: "/products",
  categories: "/categories",
  employees: "/employees",
  terminals: "/terminals",
  transactions: "/transactions",
  virtualTerminal: "/virtual-terminal",
} as const;

// =============================================================================
// API endpoint templates
// =============================================================================
export const API_ENDPOINTS = {
  login: "/login",
  twoFactorCheck: "/2fa_check",
  me: "/users/me",
  merchant: (id: string) => `/merchants/${id}`,
  saleTransaction: (merchantId: string) => `/merchants/${merchantId}/transactions/sale`,
  authTransaction: (merchantId: string) => `/merchants/${merchantId}/transactions/auth`,
  capture: (merchantId: string, txId: string) =>
    `/merchants/${merchantId}/transactions/${txId}/capture`,
  reversal: (merchantId: string, txId: string) =>
    `/merchants/${merchantId}/transactions/${txId}/reversal`,
  void: (merchantId: string, txId: string) =>
    `/merchants/${merchantId}/transactions/${txId}/void`,
  incremental: (merchantId: string, txId: string) =>
    `/merchants/${merchantId}/transactions/${txId}/incremental`,
  return: (merchantId: string, txId: string) =>
    `/merchants/${merchantId}/transactions/${txId}/return`,
  batchClose: (merchantId: string) => `/merchants/${merchantId}/transactions/batch-close`,
  getTransaction: (merchantId: string, txId: string) =>
    `/merchants/${merchantId}/transactions/${txId}`,
} as const;

// =============================================================================
// Regex patterns
// =============================================================================
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  uuidV7: /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  cardNumber: /^\d{13,19}$/,
  cvv: /^\d{3,4}$/,
  expDate: /^(0[1-9]|1[0-2])\/\d{2}$/,
} as const;

// =============================================================================
// Test tags
// =============================================================================
export const TAGS = {
  smoke: "@smoke",
  regression: "@regression",
  critical: "@critical",
  ticket: "@ticket",
  api: "@api",
  ui: "@ui",
  flaky: "@flaky",
} as const;
