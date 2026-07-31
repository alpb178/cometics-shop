-- Coordenadas de entrega con precisión real.
--
-- `numeric(10,2)` redondeaba cada punto marcado en el mapa a 2 decimales
-- (~1,1 km), así que el pedido guardaba una ubicación distinta de la que envió
-- el cliente y el admin la mostraba con `.toFixed(6)` fingiendo precisión.
-- 7 decimales ≈ 1 cm. Se amplía también el centro de Santa Cruz, que alimenta
-- el cálculo Haversine del envío a provincia.

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "dest_lat" SET DATA TYPE DECIMAL(10,7),
ALTER COLUMN "dest_lng" SET DATA TYPE DECIMAL(10,7);

-- AlterTable
ALTER TABLE "pricing_settings" ALTER COLUMN "sc_center_lat" SET DATA TYPE DECIMAL(10,7),
ALTER COLUMN "sc_center_lng" SET DATA TYPE DECIMAL(10,7);
