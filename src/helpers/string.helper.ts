const ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomString(length: number, charset: string = ALPHANUM): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return out;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) throw new Error("pickRandom: empty array");
  return items[Math.floor(Math.random() * items.length)] as T;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function maskSecret(value: string, visible = 4): string {
  if (!value) return "";
  if (value.length <= visible) return "*".repeat(value.length);
  return `${value.slice(0, visible)}${"*".repeat(value.length - visible)}`;
}
