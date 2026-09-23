// The panel reuses the storefront session: same cookie (`iris_session`) and same
// backend JWT. This file only re-exports the front's server-side helpers so the
// admin data layer (`strapi.ts`, `auth-guard.ts`) and its layouts can use them
// without knowing the cookie details.
export { getSessionToken, getCurrentUser } from "@/lib/auth/server";
