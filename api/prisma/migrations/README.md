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

## Corte a `migrate deploy` (pendiente en develop y prod)

Hoy el deploy **no aplica migraciones**: `build:render` corre solo el puente
`db:align` (`../scripts/align-prod-schema.sql`). De ahí salen dos reglas:

1. **Mientras dure el puente**, toda migración nueva debe reflejarse también en
   `align-prod-schema.sql` (idempotente). Si no, su cambio no llega a staging ni
   a producción — y sin ningún error: simplemente falta la columna.
2. **Antes del corte**, cada BD necesita registrar como aplicadas las
   migraciones cuyo DDL ya metió el puente. Si no, `migrate deploy` intentaría
   re-ejecutarlas y los `ADD COLUMN` fallarían con *column already exists*,
   tumbando el deploy.

El paso 2 es un comando, una vez por base de datos:

```bash
# Con DATABASE_URL apuntando a la BD correspondiente (develop, luego prod):
npm run db:baseline     # marca como aplicadas TODAS las migraciones del repo
npx prisma migrate status   # debe decir "Database schema is up to date!"
```

`db:baseline` no ejecuta SQL: solo escribe en `_prisma_migrations`. Omite las ya
registradas, así que repetirlo es inofensivo. Sustituye al
`migrate resolve --applied 0_init` manual y cubre además las migraciones
posteriores al baseline.

⚠️ Antes de correrlo, la BD debe coincidir de verdad con el esquema (es lo que
garantiza el puente). Comprobación autoritativa, read-only:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
```

Si imprime `ALTER`/`CREATE` de columnas o tablas que faltan, aplícalos primero
(vía `db:align`); si solo imprime renombrados de índices heredados de Strapi,
es drift cosmético y se puede ignorar.

Hecho el paso 2 en las dos BD, cambiar `build:render` para que use
`npm run db:migrate` en vez de `db:align`, y retirar `db:align` y
`align-prod-schema.sql`.

### ⚠️ No editar una migración ya aplicada

Prisma guarda un checksum de cada migración en `_prisma_migrations`. Cambiar el
SQL de una que ya se aplicó hace que `migrate deploy` y `migrate status` fallen
con *migration modified after being applied*. Si hace falta corregir algo,
siempre en una migración nueva.
