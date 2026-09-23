import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { SESSION_COOKIE } from "./session";
import { isStaffUser } from "@/lib/admin/staff";
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
    const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!res.ok) return null;
    const user = (await res.json()) as User;
    // Staff flag based on the role (`role.type` admin/staff). Resolved on the
    // server and exposed as a boolean so the client can decide whether to show
    // the panel link.
    user.isStaff = isStaffUser({ role: user.role });
    return user;
  } catch {
    return null;
  }
}

/**
 * `redirectTo` is an unprefixed path (`/account`); the sign-in page pushes it
 * through the locale-aware router, which adds the prefix back.
 */
export async function requireUser(redirectTo: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const locale = await getLocale();
    return redirect({
      href: { pathname: "/sign-in", query: { redirect: redirectTo } },
      locale
    });
  }
  return user;
}
