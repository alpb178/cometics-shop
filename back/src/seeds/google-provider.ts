import type { Core } from "@strapi/strapi";

/**
 * Configura el proveedor OAuth de Google de users-permissions de forma
 * reproducible, leyendo las credenciales del entorno.
 *
 * Flujo:
 *   1. Front → GET {STRAPI}/api/connect/google
 *   2. Google → GET {STRAPI}/api/connect/google/callback   (redirect_uri; regístralo
 *      en Google Cloud, lo construye Strapi con server.url)
 *   3. Strapi → redirige a `callback` (front) con ?access_token=<token_google>
 *   4. Front → GET {STRAPI}/api/auth/google/callback?access_token=... → { jwt, user }
 *
 * Los usuarios nuevos reciben el rol por defecto del registro ("client").
 *
 * Variables de entorno:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET  (si faltan, el proveedor queda deshabilitado)
 *   CLIENT_URL                              (base del front para el callback)
 */
export async function seedGoogleProvider(strapi: Core.Strapi): Promise<void> {
  const key = process.env.GOOGLE_CLIENT_ID || "";
  const secret = process.env.GOOGLE_CLIENT_SECRET || "";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const store = strapi.store({ type: "plugin", name: "users-permissions" });
  const grant = ((await store.get({ key: "grant" })) || {}) as Record<
    string,
    Record<string, unknown>
  >;

  const enabled = Boolean(key && secret);

  grant.google = {
    ...(grant.google || {}),
    enabled,
    icon: "google",
    key,
    secret,
    callback: `${clientUrl}/api/auth/google`,
    scope: ["email", "profile"],
  };

  await store.set({ key: "grant", value: grant });

  if (enabled) {
    strapi.log.info(
      "[seed:google] Proveedor Google habilitado. " +
        `redirect_uri a registrar en Google Cloud: ${strapi.config.get(
          "server.url",
        )}/api/connect/google/callback`,
    );
  } else {
    strapi.log.warn(
      "[seed:google] Proveedor Google deshabilitado (falta GOOGLE_CLIENT_ID/SECRET en .env).",
    );
  }
}
