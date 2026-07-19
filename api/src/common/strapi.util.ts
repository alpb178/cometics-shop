import { randomBytes } from "crypto";

/**
 * Utilidades para mantener compatibilidad con las convenciones que Strapi v5
 * dejó en la base de datos y en los clientes (front/backoffice).
 */

const ALPHANUM = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Genera un documentId con el mismo aspecto que los de Strapi v5 (24 chars alfanuméricos). */
export function generateDocumentId(): string {
  const bytes = randomBytes(24);
  let out = "";
  for (let i = 0; i < 24; i += 1) {
    // El primer carácter siempre letra, como los cuid2 que usa Strapi
    const pool = i === 0 ? ALPHANUM.slice(0, 26) : ALPHANUM;
    out += pool[bytes[i] % pool.length];
  }
  return out;
}

/** Mismo redondeo que usaba el servicio de pedidos de Strapi. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Número de pedido con el formato original: IN-<timestamp base36><3 random>. */
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

/** pagination[pageSize] de los clientes; acotado para no permitir barridos. */
export function parsePageSize(raw: unknown, fallback = 50, max = 200): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return fallback;
  return Math.min(n, max);
}

export function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Lee un query param estilo Strapi (`filters[slug]=x`), que Express puede
 * entregar como clave plana o como objeto anidado según el parser.
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
