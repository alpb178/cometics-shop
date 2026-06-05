import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken } from "./session";
import { STRAPI_URL } from "./env";
import { isStaffUser, type StaffCheckUser } from "./staff";

type Me = StaffCheckUser & {
  id?: number;
  username?: string;
};

/**
 * Revalida la autorización en cada Server Action. No se confía solo en el
 * middleware (que únicamente comprueba la presencia de la cookie): aquí se
 * verifica contra Strapi que el JWT siga siendo válido (cubre tokens expirados
 * o revocados) y que el usuario sea staff. Redirige a /login si no hay sesión
 * válida y lanza si la cuenta no es staff.
 */
export async function requireStaff(): Promise<Me> {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) redirect("/login");

  const me = (await res.json()) as Me;
  if (!isStaffUser(me)) {
    throw new Error("No autorizado: tu cuenta no tiene acceso de staff.");
  }
  return me;
}
