-- Collapses the draft & publish inherited from Strapi into ONE row per product.
--
-- Survivor per document_id = the one with the most recent updated_at (the last
-- edited); tie-break: prefer the draft (published_at NULL), then the higher id.
-- Rows without a document_id are left untouched.
--
-- DESTRUCTIVE: take a backup first and run it on develop first.
--   pg_dump of: products, files_related_mph, products_categories_lnk,
--   components_dynamic_zone_related_products_products_lnk
--
-- Recommended order: deploy the code first (it already dedupes in findMany
-- and no longer filters by published_at) and THEN run this cleanup.

-- ─────────────────────────── PRE-FLIGHT (read-only) ───────────────────────────
-- Run and review BEFORE the cleanup.

-- 1) Orphans without a document_id (left untouched):
--   SELECT count(*) FROM products WHERE document_id IS NULL;

-- 2) Documents with more than one row (to collapse):
--   SELECT document_id, count(*) FROM products WHERE document_id IS NOT NULL
--     GROUP BY 1 HAVING count(*) > 1 ORDER BY 2 DESC;

-- 3) Does any "related products" link point to a LOSING row?
--    If it returns > 0, re-point those links to the surviving id BEFORE deleting
--    (that FK is onDelete Cascade and the association would be lost).
--   SELECT count(*) FROM components_dynamic_zone_related_products_products_lnk
--   WHERE product_id IN (
--     SELECT id FROM (
--       SELECT id, row_number() OVER (
--         PARTITION BY document_id
--         ORDER BY updated_at DESC NULLS LAST, (published_at IS NULL) DESC, id DESC
--       ) AS rn
--       FROM products WHERE document_id IS NOT NULL
--     ) x WHERE rn > 1);

-- ──────────────────────────────── CLEANUP ────────────────────────────────
BEGIN;

CREATE TEMP TABLE product_losers ON COMMIT DROP AS
SELECT id FROM (
  SELECT id,
         row_number() OVER (
           PARTITION BY document_id
           ORDER BY updated_at DESC NULLS LAST,
                    (published_at IS NULL) DESC,
                    id DESC
         ) AS rn
  FROM products
  WHERE document_id IS NOT NULL       -- excludes orphans: they aren't collapsed
) r
WHERE rn > 1;

-- Media morph of the losers (this table has no cascading FK).
DELETE FROM files_related_mph
WHERE related_type = 'api::product.product'
  AND related_id IN (SELECT id FROM product_losers);

-- Losing rows (cascade: products_categories_lnk and the related_products lnk).
DELETE FROM products
WHERE id IN (SELECT id FROM product_losers);

-- Survivors are always left published (the front sees them right away).
UPDATE products
SET published_at = now()
WHERE published_at IS NULL
  AND document_id IS NOT NULL;

COMMIT;

-- ─────────────────────────── VERIFICATION (post) ───────────────────────────
-- Must return 0 rows:
--   SELECT document_id, count(*) FROM products WHERE document_id IS NOT NULL
--     GROUP BY 1 HAVING count(*) > 1;
