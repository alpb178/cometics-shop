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

-- Retirar los componentes de la plantilla landing de Strapi que la app NUNCA
-- renderiza (el módulo de contenido solo maneja una lista blanca de tipos y el
-- front usa UI estática). Vacíos y sin referencias en código. Idempotente.
-- Se conservan los componentes SÍ usados (shared.section, navbar, footer,
-- dynamic-zone.faq/how-it-works/story-panel/form-next-to-section, seo, form…).
DROP TABLE IF EXISTS
  components_cards_graph_cards_cmps, components_cards_graph_cards,
  components_cards_ray_cards_cmps, components_cards_ray_cards,
  components_cards_social_media_cards_logos_lnk, components_cards_social_media_cards,
  components_cards_globe_cards, components_calendar_events,
  components_dynamic_zone_brands_logos_lnk, components_dynamic_zone_brands,
  components_dynamic_zone_ctas_cmps, components_dynamic_zone_ctas,
  components_dynamic_zone_features_cmps, components_dynamic_zone_features,
  components_dynamic_zone_heroes_cmps, components_dynamic_zone_heroes,
  components_dynamic_zone_launches_cmps, components_dynamic_zone_launches,
  components_dynamic_zone_pricings,
  components_dynamic_zone_related_products_products_lnk, components_dynamic_zone_related_products,
  components_dynamic_zone_rich_texts_cmps, components_dynamic_zone_rich_texts,
  components_dynamic_zone_testimonials,
  components_items_graph_card_top_items, components_items_left_navbar_items,
  components_items_ray_items,
  components_shared_buttons, components_shared_launches, components_shared_perks,
  components_shared_rich_texts,
  components_shared_social_media_icon_links_cmps, components_shared_social_media_icon_links,
  components_shared_users
CASCADE;

-- Retirar la infraestructura legado de Strapi que la API no usa: content-type
-- product_pages (sin consumidores), i18n_locale, log_products (audit), la
-- librería de carpetas de media (upload_folders + links; los archivos se sirven
-- vía files_related_mph, no por carpetas) y los permisos de users-permissions
-- (up_permissions; el guard de staff va por email, no por estos permisos).
-- Sin FKs entrantes desde tablas conservadas. Idempotente.
DROP TABLE IF EXISTS
  product_pages_cmps, product_pages,
  i18n_locale, log_products,
  files_folder_lnk, upload_folders_parent_lnk, upload_folders,
  up_permissions_role_lnk, up_permissions
CASCADE;

-- Retirar navbar y SEO de la BD: el front usa navbar estática
-- (lib/constants/navbar) y SEO estática (lib/seo-pages), y se quitaron del
-- content module de la API. El footer sí se conserva (sí se renderiza).
DROP TABLE IF EXISTS
  components_global_navbars_cmps, components_global_navbars_logo_lnk,
  components_global_navbars, components_shared_seos
CASCADE;
