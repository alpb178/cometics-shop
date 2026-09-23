import { randomBytes } from "crypto";

/**
 * Helpers to stay compatible with the conventions Strapi v5 left in the
 * database and in the clients (front/backoffice).
 */

const ALPHANUM = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Generates a documentId that looks like Strapi v5's (24 alphanumeric chars). */
export function generateDocumentId(): string {
  const bytes = randomBytes(24);
  let out = "";
  for (let i = 0; i < 24; i += 1) {
    // The first character is always a letter, like the cuid2 ids Strapi uses
    const pool = i === 0 ? ALPHANUM.slice(0, 26) : ALPHANUM;
    out += pool[bytes[i] % pool.length];
  }
  return out;
}

/** Same rounding the Strapi orders service used. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Order number in the original format: IN-<base36 timestamp><3 random>. */
export function generateOrderNumber(): string {
  const rand = Array.from({ length: 3 })
    .map(() => ALPHANUM[Math.floor(Math.random() * 36)])
    .join("");
  return `IN-${Date.now().toString(36).toUpperCase()}${rand.toUpperCase()}`;
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Clients' pagination[pageSize]; capped to prevent full sweeps. */
export function parsePageSize(raw: unknown, fallback = 50, max = 200): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return fallback;
  return Math.min(n, max);
}

/** Clients' pagination[page]; 1 if missing or invalid. */
export function parsePage(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Reads a Strapi-style query param (`filters[slug]=x`), which Express may
 * deliver as a flat key or as a nested object depending on the parser.
 */
export function nestedQuery(
  query: Record<string, unknown> | undefined,
  group: string,
  key: string,
): string | undefined {
  if (!query) return undefined;
  const flat = query[`${group}[${key}]`];
  if (typeof flat === "string") return flat;
  const nested = query[group];
  if (nested && typeof nested === "object") {
    const value = (nested as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
  }
  return undefined;
}
