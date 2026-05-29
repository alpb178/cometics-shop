import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "./session";
import type { User } from "@/definitions/User";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!res.ok) return null;
    return (await res.json()) as User;
  } catch {
    return null;
  }
}

export async function requireUser(redirectTo: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const target = `/sign-in?redirect=${encodeURIComponent(redirectTo)}`;
    redirect(target);
  }
  return user;
}
