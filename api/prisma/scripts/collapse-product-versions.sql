-- Colapsa el draft & publish heredado de Strapi a UNA sola fila por producto.
--
-- Superviviente por document_id = la de updated_at más reciente (la última
-- editada); desempate: preferir borrador (published_at NULL) y luego id mayor.
-- Las filas sin document_id se dejan intactas.
--
-- DESTRUCTIVO: hacer backup antes y ejecutar primero en develop.
--   pg_dump de: products, files_related_mph, products_categories_lnk,
--   components_dynamic_zone_related_products_products_lnk
--
-- Orden recomendado: desplegar primero el código (que ya deduplica en
-- findMany y ya no filtra por published_at) y DESPUÉS correr esta limpieza.

-- ─────────────────────────── PRE-FLIGHT (read-only) ───────────────────────────
-- Ejecutar y revisar ANTES de la limpieza.

-- 1) Huérfanos sin document_id (no se tocan):
--   SELECT count(*) FROM products WHERE document_id IS NULL;

-- 2) Documentos con más de una fila (a colapsar):
--   SELECT document_id, count(*) FROM products WHERE document_id IS NOT NULL
--     GROUP BY 1 HAVING count(*) > 1 ORDER BY 2 DESC;

-- 3) ¿Algún link de "productos relacionados" apunta a una fila PERDEDORA?
--    Si devuelve > 0, re-apuntar esos links al id superviviente ANTES de borrar
--    (esa FK es onDelete Cascade y se perdería la asociación).
--   SELECT count(*) FROM components_dynamic_zone_related_products_products_lnk
--   WHERE product_id IN (
--     SELECT id FROM (
--       SELECT id, row_number() OVER (
--         PARTITION BY document_id
--         ORDER BY updated_at DESC NULLS LAST, (published_at IS NULL) DESC, id DESC
--       ) AS rn
--       FROM products WHERE document_id IS NOT NULL
--     ) x WHERE rn > 1);

-- ──────────────────────────────── LIMPIEZA ────────────────────────────────
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
  WHERE document_id IS NOT NULL       -- excluye huérfanos: no se colapsan
) r
WHERE rn > 1;

-- Media morph de los perdedores (esta tabla no tiene FK con cascade).
DELETE FROM files_related_mph
WHERE related_type = 'api::product.product'
  AND related_id IN (SELECT id FROM product_losers);

-- Filas perdedoras (cascade: products_categories_lnk y el lnk de related_products).
DELETE FROM products
WHERE id IN (SELECT id FROM product_losers);

-- Los supervivientes quedan siempre publicados (el front los ve al instante).
UPDATE products
SET published_at = now()
WHERE published_at IS NULL
  AND document_id IS NOT NULL;

COMMIT;

-- ─────────────────────────── VERIFICACIÓN (post) ───────────────────────────
-- Debe devolver 0 filas:
--   SELECT document_id, count(*) FROM products WHERE document_id IS NOT NULL
--     GROUP BY 1 HAVING count(*) > 1;
