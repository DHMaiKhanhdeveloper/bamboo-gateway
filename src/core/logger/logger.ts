/**
 * Lightweight structured logger.
 * Replaces scattered console.log calls with level-controlled output.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const ICONS: Record<LogLevel, string> = {
  debug: "🔍",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
};

interface LoggerOptions {
  scope?: string;
  level?: LogLevel;
}

export class Logger {
  private readonly scope: string;
  private readonly minLevel: number;

  constructor(options: LoggerOptions = {}) {
    this.scope = options.scope ?? "app";
    const lvl = options.level ?? (process.env["LOG_LEVEL"] as LogLevel | undefined) ?? "info";
    this.minLevel = LEVEL_ORDER[lvl] ?? LEVEL_ORDER.info;
  }

  child(scope: string): Logger {
    return new Logger({ scope: `${this.scope}:${scope}` });
  }

  debug(message: string, meta?: unknown): void {
    this.write("debug", message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.write("info", message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.write("warn", message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.write("error", message, meta);
  }

  private write(level: LogLevel, message: string, meta?: unknown): void {
    if (LEVEL_ORDER[level] < this.minLevel) return;
    const ts = new Date().toISOString();
    const prefix = `${ICONS[level]} [${ts}] [${this.scope}]`;
    const args: unknown[] = [`${prefix} ${message}`];
    if (meta !== undefined) args.push(meta);

    if (level === "error") console.error(...args);
    else if (level === "warn") console.warn(...args);
    else console.info(...args);
  }
}

export const logger = new Logger({ scope: "bamboo" });
