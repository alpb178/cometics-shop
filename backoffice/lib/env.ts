// URL pública del backend Strapi. Disponible en cliente y servidor porque usa
// el prefijo NEXT_PUBLIC_ (Next la inyecta en el bundle del cliente).
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
