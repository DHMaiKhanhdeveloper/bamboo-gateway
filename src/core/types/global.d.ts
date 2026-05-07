/**
 * Global ambient types.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL?: string;
    API_BASE_URL?: string;
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD?: string;
    TOTP_SECRET?: string;
    CI?: string;
    LOG_LEVEL?: "debug" | "info" | "warn" | "error";
    AUTH_STATE_TTL_MS?: string;
    BYPASS_AUTH_TOKEN?: string;
  }
}
