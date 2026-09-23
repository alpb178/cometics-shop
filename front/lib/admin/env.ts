// Public API URL (NestJS, Strapi v5-compatible contract). Shared with the
// storefront: the panel uses the same backend, endpoints and JWT as the site.
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
