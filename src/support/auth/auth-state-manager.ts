import fs from "node:fs";
import path from "node:path";
import type { BrowserContext, Page } from "@playwright/test";
import {
  type AuthCredentials,
  getApiBaseURL,
  getAuthCredentials,
  getAuthStateTtlMs,
} from "~/config/env";
import { AUTH_ROLES, AUTH_STATE_DIR, type AuthRole, getAuthStateFile } from "~/config/constants";
import { Logger } from "~/core/logger/logger";

interface AuthStateMeta {
  role: AuthRole;
  timestamp: number;
  expiresAt: number;
}

const META_FILE = path.join(AUTH_STATE_DIR, ".meta.json");
type MetaIndex = Record<string, AuthStateMeta>;

/**
 * Per-role storage state manager.
 *
 * Each role (admin, merchant, support, ...) gets its own Playwright
 * `storageState` JSON file under `.auth/<role>.json`. Metadata (TTL,
 * timestamp) is tracked in `.auth/.meta.json`.
 *
 * Backward compatible API:
 *   - `loadAuthState()` / `saveAuthState()` / `applyAuthState()` operate on
 *     the default role (admin) when role is omitted.
 *   - `validateAuthentication()` calls /users/me to verify the session.
 */
export class AuthStateManager {
  private static readonly log = new Logger({ scope: "auth-state" });

  // ---------------------------------------------------------------------------
  // Init / cleanup
  // ---------------------------------------------------------------------------

  static initializeAuthState(): void {
    this.ensureDir();
    if (!fs.existsSync(META_FILE)) {
      fs.writeFileSync(META_FILE, JSON.stringify({}, null, 2));
    }
    this.log.info("Auth state initialized");
  }

  static clearAuthState(role?: AuthRole): void {
    if (role) {
      const file = getAuthStateFile(role);
      if (fs.existsSync(file)) fs.unlinkSync(file);
      this.updateMeta((m) => {
        delete m[role];
        return m;
      });
      this.log.info(`Auth state cleared for role '${role}'`);
      return;
    }
    if (fs.existsSync(AUTH_STATE_DIR)) {
      fs.rmSync(AUTH_STATE_DIR, { recursive: true, force: true });
    }
    this.log.info("All auth states cleared");
  }

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------

  static isAuthStateValid(role: AuthRole = AUTH_ROLES.admin): boolean {
    try {
      const file = getAuthStateFile(role);
      if (!fs.existsSync(file)) return false;
      const meta = this.readMeta()[role];
      if (!meta) return false;
      if (Date.now() > meta.expiresAt) {
        this.log.info(`Auth state for '${role}' expired`);
        return false;
      }
      return true;
    } catch (err) {
      this.log.warn(`Failed to validate auth state for '${role}'`, err);
      return false;
    }
  }

  static getAuthStateFilePath(role: AuthRole = AUTH_ROLES.admin): string | null {
    const file = getAuthStateFile(role);
    return fs.existsSync(file) ? file : null;
  }

  static loadAuthState(role: AuthRole = AUTH_ROLES.admin): unknown | null {
    try {
      const file = getAuthStateFile(role);
      if (!fs.existsSync(file)) return null;
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      this.log.error(`Failed to load auth state for '${role}'`, err);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Write
  // ---------------------------------------------------------------------------

  static async saveAuthState(
    context: BrowserContext,
    role: AuthRole = AUTH_ROLES.admin
  ): Promise<void> {
    this.ensureDir();
    const file = getAuthStateFile(role);
    await context.storageState({ path: file });
    this.recordMeta(role);
    this.log.info(`Auth state saved for role '${role}' → ${file}`);
  }

  static async applyAuthState(
    context: BrowserContext,
    _state: unknown,
    role: AuthRole = AUTH_ROLES.admin
  ): Promise<void> {
    // Note: prefer creating contexts with `storageState: <file>`. This method
    // is kept for backward compatibility — it injects cookies only.
    const file = getAuthStateFile(role);
    if (!fs.existsSync(file)) return;
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as { cookies?: unknown[] };
    if (Array.isArray(raw.cookies) && raw.cookies.length > 0) {
      // Playwright's BrowserContext.addCookies expects a specific Cookie shape.
      // The storage-state file conforms to that shape.
      await context.addCookies(raw.cookies as never);
    }
    this.log.info(`Applied cookies for role '${role}'`);
  }

  // ---------------------------------------------------------------------------
  // Auth flow helpers
  // ---------------------------------------------------------------------------

  static getCredentialsFromEnv(): AuthCredentials {
    return getAuthCredentials();
  }

  /**
   * Validate that a bearer cookie / session is still valid by hitting /users/me.
   */
  static async validateAuthentication(page: Page): Promise<boolean> {
    try {
      const apiBaseUrl = getApiBaseURL();
      const response = await page.request.get(`${apiBaseUrl}/users/me`);
      const ok = response.status() === 200;
      this.log.info(ok ? "Auth validated via /users/me" : `Auth invalid (${response.status()})`);
      return ok;
    } catch (err) {
      this.log.warn("Auth validation error", err);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Meta index
  // ---------------------------------------------------------------------------

  private static ensureDir(): void {
    if (!fs.existsSync(AUTH_STATE_DIR)) fs.mkdirSync(AUTH_STATE_DIR, { recursive: true });
  }

  private static readMeta(): MetaIndex {
    try {
      if (!fs.existsSync(META_FILE)) return {};
      return JSON.parse(fs.readFileSync(META_FILE, "utf8")) as MetaIndex;
    } catch {
      return {};
    }
  }

  private static updateMeta(mutator: (m: MetaIndex) => MetaIndex): void {
    this.ensureDir();
    const next = mutator(this.readMeta());
    fs.writeFileSync(META_FILE, JSON.stringify(next, null, 2));
  }

  private static recordMeta(role: AuthRole): void {
    const now = Date.now();
    const meta: AuthStateMeta = {
      role,
      timestamp: now,
      expiresAt: now + getAuthStateTtlMs(),
    };
    this.updateMeta((m) => ({ ...m, [role]: meta }));
  }
}
