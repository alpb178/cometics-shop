# Iris Natural — API (NestJS)

API propia de Iris Natural, destinada a reemplazar por completo al backend Strapi (`back/`) de forma incremental (patrón strangler). Mientras dura la migración, Strapi sigue sirviendo todo lo que aún no se ha migrado; los clientes (`front/`, `backoffice/`, `mobile/`) van apuntando endpoint a endpoint a esta API.

## Stack

- NestJS 10 + TypeScript
- PostgreSQL (Supabase) — la misma base de datos que usa Strapi; no hay migración de datos
- Swagger en `/docs`
- Prisma (a partir de la fase 1)

## Arranque

```bash
cp .env.example .env   # rellenar DATABASE_URL con la cadena de Supabase
npm install
npm run start:dev      # http://localhost:4000, docs en http://localhost:4000/docs
```

## Endpoints

Réplica 1:1 del contrato que los clientes ya usan contra Strapi (paths, query params, envoltorio `{ data }`, respuestas planas v5). Documentación completa en `/docs` (Swagger). Dominios:

- **health**: `/health`, `/health/db`
- **auth** (users-permissions): `/auth/local`, `/auth/local/register`, `/auth/forgot-password`, `/auth/reset-password`, `/connect/google`, `/auth/google/callback`, `/users/me`
- **users** (staff): `/users`, `/users/:id`, `/users-permissions/roles`
- **orders**: CRUD con recálculo server-side (markup + envío Haversine), acepta id numérico o documentId
- **addresses**: CRUD con ownership (404 si no es tuya)
- **payment-info** y **pricing-setting**: single types (GET/PUT)
- **products**: draft & publish completo (`?status=draft`, `POST /:documentId/publish|unpublish`), **categories**, **faqs**, **social-networks**, **logs**
- **pages** y **global**: contenido CMS con dynamic zones serializados (ver `src/content/components.service.ts`)
- **upload**: `POST /upload` multipart → Cloudinary (compatible con el plugin de Strapi)
- **tracking**: `/page-visits/{track,stats,top,sources}`, `/store-events/{track,recent}`

## Despliegue (Render)

- **Build command**: `npm install && npm run build:render` (el `postinstall` ejecuta `prisma generate` automáticamente; `build:render` amplía el heap de Node a 2 GB porque el type-check del cliente Prisma con 121 modelos supera los ~256 MB por defecto del contenedor de build)
- **Start command**: `npm run start:prod`
- **NUNCA ejecutar `prisma migrate deploy`**: no hay migraciones a propósito — el esquema lo gestiona Strapi hasta la fase 5 y la API solo lo introspecciona. Ejecutar migrate falla con P3005 y no debe "arreglarse" con un baseline.
- `DATABASE_URL`: el pooler de Supabase en puerto 5432 (modo sesión) funciona tal cual; si se usara el puerto 6543 (modo transacción) habría que añadir `?pgbouncer=true&connection_limit=1`.
- Variables requeridas: ver `.env.example` (`DATABASE_URL`, `JWT_SECRET` — el mismo de Strapi —, `CLOUDINARY_*`, `STAFF_EMAILS`, `CORS_ORIGINS`, `PUBLIC_URL`, `CLIENT_URL`, `GOOGLE_CLIENT_*`, `SMTP_*`).

## Plan de migración

1. ~~**Fase 0** — esqueleto NestJS con health, Swagger y config por env~~ ✅
2. ~~**Fase 1** — Prisma: introspección del esquema existente de Strapi (`prisma db pull` + `prisma/fix-schema.js`, encadenados en `npm run prisma:pull`)~~ ✅
3. ~~**Fase 2** — pedidos y checkout (`orders`, `addresses`, `payment-info`, `pricing-setting`)~~ ✅
4. ~~**Fase 3** — auth compatible con users-permissions (JWT compartido, bcrypt, Google OAuth, reset)~~ ✅
5. ~~**Fase 4** — catálogo, contenido CMS, uploads a Cloudinary y tracking~~ ✅
6. ~~**Fase 5** — repuntar clientes y retirar `back/` (Strapi)~~ ✅ (julio 2026)

Esta API es ahora el **único backend** del proyecto. El código de Strapi se eliminó del repo (recuperable en el historial de git, hasta el merge de esta fase). El esquema de la base de datos conserva las convenciones que Strapi generó (tablas `*_lnk`, `*_cmps`, `files_related_mph`, `document_id`); cualquier cambio de esquema a partir de ahora es responsabilidad de este proyecto — antes de la primera migración habrá que hacer un baseline de Prisma (`prisma migrate diff` / `migrate resolve`).
