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
 * Revalida la autorización del panel. No se confía solo en el middleware (que
 * únicamente comprueba la presencia de la cookie de sesión): aquí se verifica
 * contra la API que el JWT siga siendo válido (cubre tokens expirados o
 * revocados) y que el usuario sea staff. Se usa como guarda del layout de
 * `/admin` y al inicio de cada Server Action.
 *
 * Login unificado con el storefront: sin sesión válida redirige a `/sign-in`
 * (con `redirect` para volver al panel); si la cuenta no es staff redirige a la
 * home (fail-closed) en vez de mostrar el panel.
 */
export async function requireStaff(): Promise<Me> {
  const token = await getSessionToken();
  if (!token) redirect("/sign-in?redirect=/admin");

  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) redirect("/sign-in?redirect=/admin");

  const me = (await res.json()) as Me;
  if (!isStaffUser(me)) {
    redirect("/");
  }
  return me;
}
