# CLAUDE.md — api/

API NestJS 10 + TypeScript que reemplaza incrementalmente al backend Strapi (`back/`). Ver el plan de fases en `README.md`.

## Reglas

- Un módulo por dominio (`health/`, y en el futuro `orders/`, `auth/`, `products/`…), siguiendo la estructura estándar de Nest: `*.module.ts`, `*.controller.ts`, `*.service.ts`, DTOs con `class-validator`.
- La base de datos de Supabase conserva el esquema que generó Strapi (retirado en julio de 2026). Esta API es ahora su único dueño, pero **no hay migraciones de Prisma todavía**: antes del primer cambio de esquema hay que crear un baseline (`prisma migrate diff` + `migrate resolve`). Hasta entonces, no ejecutar nunca `prisma migrate deploy`.
- Peculiaridades del esquema heredado a respetar: draft & publish (dos filas por entrada compartiendo `document_id`; filtrar por `published_at IS NOT NULL`), relaciones vía tablas de enlace `*_lnk`, componentes en tablas `components_*` y media en `files_related_mph`.
- Documentar cada endpoint con decoradores de Swagger (`@ApiTags`, `@ApiOperation`).
- Tests unitarios junto al código (`*.spec.ts`), ejecutados con `npm test`.
- Secretos solo por variables de entorno (`.env`, nunca commiteado); mantener `.env.example` al día.
- El stack replica deliberadamente el de otro proyecto del autor (NestJS + Prisma + Passport-JWT + Swagger); mantener esa coherencia al añadir dependencias.
