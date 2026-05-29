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
    throw new Error(data?.error || "Algo salió mal. Intenta de nuevo.");
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
