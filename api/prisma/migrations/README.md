# Migraciones de Prisma

Este proyecto usa **migraciones formales de Prisma**. La primera migración
(`0_init`) es un **baseline**: representa el esquema completo que Strapi dejó en
la base de datos (generado con `prisma migrate diff --from-empty`). No debe
ejecutarse sobre las BD que ya existían — solo marcarse como aplicada.

## Onboarding de una BD existente (local, develop, prod) — UNA sola vez

Las BD ya tienen todas las tablas (las creó Strapi), así que el baseline se
marca como aplicado **sin ejecutarlo**:

```bash
# Con DATABASE_URL apuntando a la BD correspondiente:
npx prisma migrate resolve --applied 0_init
npx prisma migrate status   # debe decir "Database schema is up to date!"
```

⚠️ **Producción**: antes de resolver el baseline, la BD debe coincidir con el
esquema. Si le falta alguna columna reciente (p. ej. `products.visible`),
aplícala primero (ver `../scripts/align-prod-schema.sql`) para que el estado
real coincida con `0_init`. Si no, `migrate resolve` afirmaría un estado falso.

## Crear una nueva migración (a partir de ahora)

```bash
# Edita prisma/schema.prisma y luego:
npx prisma migrate dev --name descripcion_del_cambio
```

Esto crea `prisma/migrations/<timestamp>_descripcion/` y la aplica en tu BD
local. Commitea la carpeta generada.

## Aplicar migraciones en el deploy

```bash
npm run db:migrate   # = prisma migrate deploy
```

`migrate deploy` aplica solo las migraciones pendientes. Es seguro en cada
despliegue una vez que todas las BD tienen el baseline resuelto.

### Cambio del deploy (pendiente hasta baselinar develop y prod)

Hoy el deploy usa el puente idempotente `db:align` (ver `build:render` en
`package.json` y `../scripts/align-prod-schema.sql`). **Cuando develop y prod
tengan el baseline resuelto** (`migrate resolve --applied 0_init`), cambiar
`build:render` para que use `npm run db:migrate` en vez de `db:align`, y retirar
`db:align`/`align-prod-schema.sql`. Hasta entonces se mantienen ambos para no
romper despliegues.
