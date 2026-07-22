// El panel reusa la sesión del storefront: misma cookie (`iris_session`) y mismo
// JWT del backend. Aquí solo se reexportan los helpers server-side del front para
// que la capa de datos del admin (`strapi.ts`, `auth-guard.ts`) y sus layouts los
// consuman sin conocer los detalles de la cookie.
export { getSessionToken, getCurrentUser } from "@/lib/auth/server";
