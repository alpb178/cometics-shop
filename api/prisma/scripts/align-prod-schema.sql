-- Alinea el esquema de la base de datos con el modelo Prisma.
-- IDEMPOTENTE: seguro de correr en cada despliegue (no falla si ya está aplicado).
--
-- SE EJECUTA SOLO en cada deploy: `build:render` corre `node
-- prisma/scripts/align-schema.cjs`, que aplica este archivo contra DATABASE_URL.
-- Para futuras migraciones de esquema: añade aquí sentencias IDEMPOTENTES
-- (ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS, etc.) y se aplicarán
-- automáticamente en el siguiente despliegue. Mantenlas siempre idempotentes.
--
-- Contexto: `schema.prisma` solo cambió en dos commits desde que se retiró
-- Strapi: #45 (baseline del `db pull` de Strapi — esas columnas ya existen en
-- prod) y #73, que añadió `products.visible`. Esa columna se aplicó en la BD de
-- develop pero nunca en producción, así que la API crasheaba con:
--   "The column `products.visible` does not exist in the current database".
--
-- Desfases aplicados aquí: (1) `products.visible` (columna nueva de #73), y
-- (2) el retiro de las tablas legado de Strapi (admin_*/strapi_*) que la API no
-- usa y que ya no declara `schema.prisma`.
--
-- Comprobación autoritativa de que no falta nada más (read-only, genera SQL):
--   cd api && npx prisma migrate diff \
--     --from-url "$PROD_DATABASE_URL" \
--     --to-schema-datamodel prisma/schema.prisma --script
-- Si imprime más sentencias, añádelas aquí (idempotentes).

-- products.visible: Boolean? @default(true)
ALTER TABLE products ADD COLUMN IF NOT EXISTS visible boolean DEFAULT true;

-- Retirar las tablas legado de Strapi que la API no usa (admin_* y strapi_*).
-- CASCADE elimina también las FKs created_by_id/updated_by_id que apuntaban a
-- admin_users desde las tablas de negocio (las columnas se conservan, sin
-- constraint; la API no las usa). Idempotente (IF EXISTS). Ver schema.prisma
-- (ya no declara estos modelos).
DROP TABLE IF EXISTS
  admin_permissions_role_lnk, admin_users_roles_lnk, admin_permissions,
  admin_roles, admin_users,
  strapi_api_token_permissions_token_lnk, strapi_api_token_permissions,
  strapi_api_tokens, strapi_core_store_settings, strapi_database_schema,
  strapi_history_versions, strapi_migrations, strapi_migrations_internal,
  strapi_release_actions_release_lnk, strapi_release_actions, strapi_releases,
  strapi_transfer_token_permissions_token_lnk, strapi_transfer_token_permissions,
  strapi_transfer_tokens, strapi_webhooks,
  strapi_workflows_stage_required_to_publish_lnk,
  strapi_workflows_stages_permissions_lnk, strapi_workflows_stages_workflow_lnk,
  strapi_workflows_stages, strapi_workflows
CASCADE;
