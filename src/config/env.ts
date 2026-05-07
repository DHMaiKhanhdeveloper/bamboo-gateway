import { z } from "zod";
import { readMerchantData } from "~/config/merchant-data";

/**
 * Environment variable schema with validation and defaults.
 * Throws at startup if required variables are missing.
 */
export const envSchema = z.object({
  BASE_URL: z.url().default("https://portal.bamboopay-stage.com"),
  API_BASE_URL: z.url().default("https://api.bamboopay-stage.com"),
  ADMIN_USERNAME: z.string().min(1, "ADMIN_USERNAME is required"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD is required"),
  TOTP_SECRET: z.string().min(1, "TOTP_SECRET is required"),
  CI: z.string().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  AUTH_STATE_TTL_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  BYPASS_AUTH_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}

export function resetEnvCache(): void {
  _env = null;
}

export function getEnvVar(key: keyof Env, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback !== undefined) return fallback;
  if (!value) throw new Error(`Environment variable ${key} is required`);
  return value;
}

export function isCI(): boolean {
  return Boolean(process.env["CI"]);
}

export function getBaseURL(): string {
  return getEnv().BASE_URL;
}

export function getApiBaseURL(): string {
  return getEnv().API_BASE_URL;
}

export function getLogLevel(): Env["LOG_LEVEL"] {
  return getEnv().LOG_LEVEL;
}

export function getAuthStateTtlMs(): number {
  return getEnv().AUTH_STATE_TTL_MS;
}

export function getBypassAuthToken(): string | undefined {
  return getEnv().BYPASS_AUTH_TOKEN;
}

export interface AuthCredentials {
  username: string;
  password: string;
  totpSecret: string;
}

export function getAuthCredentials(): AuthCredentials {
  const env = getEnv();
  return {
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
    totpSecret: env.TOTP_SECRET,
  };
}

/**
 * Synchronous merchant ID accessors. Read from `src/data/seeds/merchant.json`.
 */
function readMerchantField(key: string, label: string): string {
  const data = readMerchantData();
  const value = data[key];
  if (!value) {
    throw new Error(`${label} is not defined in merchant.json (key: ${key})`);
  }
  return value;
}

export function getTsysMerchantIdSync(): string {
  return readMerchantField("tsysMerchant", "TSYS merchant ID");
}

export function getDemoMerchantIdSync(): string {
  return readMerchantField("demoMerchant", "Demo merchant ID");
}

export function getSelectedMerchantIdSync(): string {
  return readMerchantField("selectedMerchantId", "Selected merchant ID");
}

export function getCommonMerchantIdSync(): string {
  return readMerchantField("commonMerchantId", "Common merchant ID");
}

export function getUserIdSync(): string {
  return readMerchantField("userId", "User ID");
}
