import type { User } from "@/definitions/User";

async function postJSON<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Empty message when the API gives none: the UI shows its own localized
    // fallback (see `errorMessage` below).
    throw new Error(data?.error || "");
  }
  return data as T;
}

export function loginRequest(email: string, password: string) {
  return postJSON<{ user: User }>("/api/auth/login", {
    identifier: email,
    password
  });
}

export function registerRequest(payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  return postJSON<{ user: User }>("/api/auth/register", payload);
}

export function logoutRequest() {
  return postJSON<{ ok: true }>("/api/auth/logout");
}

export async function meRequest(): Promise<User | null> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store"
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { user: User | null };
  return data.user;
}

/** Message of a caught error, or `fallback` when it has none. */
export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

/**
 * The `redirect` query param of sign-in/sign-up: an unprefixed same-site path
 * (`/checkout`). Anything else (absolute URLs, `//host`) falls back to `/`.
 * A locale prefix, if present, is dropped: the locale-aware router adds the
 * current one back.
 */
export function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/";
  }
  const rest = raw.replace(/^\/(es|en)(?=\/|\?|$)/, "");
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/** True for the staff panel, which lives outside the locale-prefixed tree. */
export function isAdminPath(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/") || path.startsWith("/admin?");
}
