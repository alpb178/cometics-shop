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

## Endpoints actuales

- `GET /health` — estado del servicio
- `GET /health/db` — comprueba la conexión a la base de datos (503 si no hay conexión o falta `DATABASE_URL`)

## Plan de migración

1. ~~**Fase 0** — esqueleto NestJS con health, Swagger y config por env~~ ✅
2. ~~**Fase 1** — Prisma: introspección del esquema existente de Strapi (`prisma db pull` + `prisma/fix-schema.js`, encadenados en `npm run prisma:pull`)~~ ✅
3. **Fase 2** — pedidos y checkout (`orders`, `payments`)
4. **Fase 3** — auth con Passport-JWT (los hashes bcrypt de Strapi son compatibles)
5. **Fase 4** — catálogo, contenido y uploads a Cloudinary
6. **Fase 5** — retirada de `back/` (Strapi)
