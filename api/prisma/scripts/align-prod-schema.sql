-- Aligns the database schema with the Prisma model.
--
-- ADDITIVE AND IDEMPOTENT ONLY: safe to run on every deploy. No DROP and no
-- destructive DDL — this file is on the deploy's critical path, and a DROP here
-- would silently delete a table someone had recreated. Retiring the legacy
-- Strapi tables now lives in `retire-cms-tables.sql`, which is run by hand once
-- per DB.
--
-- ⚠️ UNTIL THE CUTOVER TO `migrate deploy`: the deploy does NOT apply Prisma
-- migrations (`build:render` only runs this script). Every new migration must
-- ALSO be reflected here, or its change will not reach staging or production.
-- See `../migrations/README.md` § "Corte a migrate deploy".
--
-- RUNS AUTOMATICALLY on every deploy: `build:render` runs `node
-- prisma/scripts/align-schema.cjs`, which applies this file against DATABASE_URL.
-- For future schema migrations: add IDEMPOTENT statements here
-- (ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS, etc.) and they will be
-- applied automatically on the next deploy. Always keep them idempotent.
--
-- Context: `schema.prisma` only changed in two commits since Strapi was
-- retired: #45 (baseline from Strapi's `db pull` — those columns already exist
-- in prod) and #73, which added `products.visible`. That column was applied to
-- the develop DB but never to production, so the API crashed with:
--   "The column `products.visible` does not exist in the current database".
--
-- Drifts applied here: (1) `products.visible` (new column from #73), and
-- (2) retiring the legacy Strapi tables (admin_*/strapi_*) that the API doesn't
-- use and that `schema.prisma` no longer declares.
--
-- Authoritative check that nothing else is missing (read-only, prints SQL):
--   cd api && npx prisma migrate diff \
--     --from-url "$PROD_DATABASE_URL" \
--     --to-schema-datamodel prisma/schema.prisma --script
-- If it prints more statements, add them here (idempotent).

-- products.visible: Boolean? @default(true)
ALTER TABLE products ADD COLUMN IF NOT EXISTS visible boolean DEFAULT true;

-- products.discount: Int? — discount percentage (sale). NULL/0 = no sale.
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount integer;


-- Delivery coordinates with real precision: numeric(10,2) rounded every point
-- picked on the map to ~1.1 km, so the admin showed a different location from
-- the one the customer sent. 7 decimals ≈ 1 cm. Idempotent: repeating the
-- ALTER on columns that are already numeric(10,7) is a no-op.
ALTER TABLE orders
  ALTER COLUMN dest_lat TYPE numeric(10,7),
  ALTER COLUMN dest_lng TYPE numeric(10,7);

ALTER TABLE pricing_settings
  ALTER COLUMN sc_center_lat TYPE numeric(10,7),
  ALTER COLUMN sc_center_lng TYPE numeric(10,7);

-- Last delivery point per address (the checkout pin starts there instead of
-- the city center). Idempotent thanks to IF NOT EXISTS.
ALTER TABLE addresses
  ADD COLUMN IF NOT EXISTS lat numeric(10,7),
  ADD COLUMN IF NOT EXISTS lng numeric(10,7);
