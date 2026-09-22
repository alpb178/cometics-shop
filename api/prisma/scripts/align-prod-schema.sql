-- Alinea el esquema de la base de datos con el modelo Prisma.
--
-- SOLO ADITIVO E IDEMPOTENTE: seguro de correr en cada despliegue. Nada de
-- DROP ni de DDL destructivo — este archivo está en el camino crítico del
-- deploy, y un DROP aquí borraría en silencio una tabla que alguien hubiera
-- recreado. El retiro de las tablas legado de Strapi vive ahora en
-- `retire-cms-tables.sql`, que se corre a mano una sola vez por BD.
--
-- ⚠️ HASTA EL CORTE A `migrate deploy`: el deploy NO aplica las migraciones de
-- Prisma (`build:render` corre solo este script). Toda migración nueva debe
-- reflejarse TAMBIÉN aquí, o su cambio no llegará a staging ni a producción.
-- Ver `../migrations/README.md` § "Corte a migrate deploy".
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

-- products.discount: Int? — porcentaje de descuento (oferta). NULL/0 = sin oferta.
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount integer;


-- Coordenadas de entrega con precisión real: numeric(10,2) redondeaba cada
-- punto marcado en el mapa a ~1,1 km, así que el admin mostraba una ubicación
-- distinta de la que envió el cliente. 7 decimales ≈ 1 cm. Idempotente: repetir
-- el ALTER sobre columnas que ya son numeric(10,7) es un no-op.
ALTER TABLE orders
  ALTER COLUMN dest_lat TYPE numeric(10,7),
  ALTER COLUMN dest_lng TYPE numeric(10,7);

ALTER TABLE pricing_settings
  ALTER COLUMN sc_center_lat TYPE numeric(10,7),
  ALTER COLUMN sc_center_lng TYPE numeric(10,7);

-- Último punto de entrega por dirección (el pin del checkout arranca ahí en
-- vez del centro de la ciudad). Idempotente por IF NOT EXISTS.
ALTER TABLE addresses
  ADD COLUMN IF NOT EXISTS lat numeric(10,7),
  ADD COLUMN IF NOT EXISTS lng numeric(10,7);
