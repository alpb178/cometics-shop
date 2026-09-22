import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    // Marca de staff según el rol (`role.type` admin/staff). Se resuelve en el
    // servidor y se expone como booleano para que el cliente decida si mostrar
    // el acceso al panel.
    user.isStaff = isStaffUser({ role: user.role });
    return user;
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
