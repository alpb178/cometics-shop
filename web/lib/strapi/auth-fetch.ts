import { getSessionToken } from "@/lib/auth/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getSessionToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });
}

export async function authFetchJSON<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await authFetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Strapi ${path} failed: ${res.status} ${res.statusText} — ${text}`
    );
  }
  return (await res.json()) as T;
}
