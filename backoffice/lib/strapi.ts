import "server-only";
import { getSessionToken } from "./session";
import type { AuthUser, StrapiMedia } from "./types";

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export class StrapiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiError";
    this.status = status;
  }
}

async function authHeaders(extra?: HeadersInit): Promise<Headers> {
  const token = await getSessionToken();
  const headers = new Headers(extra);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function parseError(res: Response): Promise<never> {
  let message = `${res.status} ${res.statusText}`;
  try {
    const data = await res.json();
    message = data?.error?.message || message;
  } catch {
    // ignore non-json bodies
  }
  throw new StrapiError(message, res.status);
}

/** GET a Strapi REST path (e.g. "/api/products?populate=*"). */
export async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: await authHeaders(),
    cache: "no-store"
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as T;
}

/** POST/PUT with a JSON body. Strapi wraps payloads in `{ data: ... }`. */
export async function strapiSend<T>(
  method: "POST" | "PUT",
  path: string,
  data: unknown
): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method,
    headers: await authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ data }),
    cache: "no-store"
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as T;
}

export async function strapiDelete(path: string): Promise<void> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store"
  });
  if (!res.ok) await parseError(res);
}

/** Sube uno o varios ficheros a /api/upload y devuelve los media creados. */
export async function uploadFiles(files: File[]): Promise<StrapiMedia[]> {
  const valid = files.filter((f) => f && f.size > 0);
  if (valid.length === 0) return [];

  const form = new FormData();
  for (const file of valid) form.append("files", file, file.name);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: await authHeaders(),
    body: form,
    cache: "no-store"
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as StrapiMedia[];
}

/** Login contra users-permissions. No requiere token previo. */
export async function strapiLogin(
  identifier: string,
  password: string
): Promise<{ jwt: string; user: AuthUser }> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    cache: "no-store"
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as { jwt: string; user: AuthUser };
}
