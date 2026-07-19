# CLAUDE.md — api/

API NestJS 10 + TypeScript que reemplaza incrementalmente al backend Strapi (`back/`). Ver el plan de fases en `README.md`.

## Reglas

- Un módulo por dominio (`health/`, y en el futuro `orders/`, `auth/`, `products/`…), siguiendo la estructura estándar de Nest: `*.module.ts`, `*.controller.ts`, `*.service.ts`, DTOs con `class-validator`.
- La base de datos es la misma de Supabase que usa Strapi — **no** crear tablas ni modificar el esquema hasta la fase 5; hasta entonces la API solo lee/escribe sobre el esquema que Strapi gestiona.
- Peculiaridades del esquema Strapi a respetar: draft & publish (dos filas por entrada compartiendo `document_id`; filtrar por `published_at IS NOT NULL`), relaciones vía tablas de enlace `*_lnk`, componentes en tablas `components_*`.
- Documentar cada endpoint con decoradores de Swagger (`@ApiTags`, `@ApiOperation`).
- Tests unitarios junto al código (`*.spec.ts`), ejecutados con `npm test`.
- Secretos solo por variables de entorno (`.env`, nunca commiteado); mantener `.env.example` al día.
- El stack replica deliberadamente el de otro proyecto del autor (NestJS + Prisma + Passport-JWT + Swagger); mantener esa coherencia al añadir dependencias.
