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
 * Re-validates panel authorization. The middleware alone is not trusted (it
 * only checks that the session cookie is present): here we verify against the
 * API that the JWT is still valid (covers expired or revoked tokens) and that
 * the user is staff. Used as the guard of the `/admin` layout and at the start
 * of every Server Action.
 *
 * Login is shared with the storefront: without a valid session it redirects to
 * `/sign-in` (with `redirect` to come back to the panel); if the account is not
 * staff it redirects to the home page (fail-closed) instead of showing the panel.
 */
// The panel is Spanish-only, so its sign-in hop goes straight to `/es`.
const SIGN_IN = "/es/sign-in?redirect=/admin";

export async function requireStaff(): Promise<Me> {
  const token = await getSessionToken();
  if (!token) redirect(SIGN_IN);

  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) redirect(SIGN_IN);

  const me = (await res.json()) as Me;
  if (!isStaffUser(me)) {
    redirect("/es");
  }
  return me;
}
