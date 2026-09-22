// URL pública de la API (NestJS, contrato compatible con Strapi v5). Se unifica
// con la del storefront: el panel comparte backend, endpoints y JWT con la web.
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
