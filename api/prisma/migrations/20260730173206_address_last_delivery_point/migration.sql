-- Último punto de entrega por dirección.
--
-- El checkout pre-centraba el pin en el centro de Santa Cruz, así que un cliente
-- que no tocaba el mapa guardaba una ubicación que no eligió. Ahora el pin
-- arranca en el último punto que marcó para esa dirección (y, si no hay
-- ninguno, en su ubicación real), para lo que hace falta guardarlo.
--
-- Misma precisión que orders.dest_lat/lng: 7 decimales ≈ 1 cm.

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "lat" DECIMAL(10,7),
ADD COLUMN     "lng" DECIMAL(10,7);
