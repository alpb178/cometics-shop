/**
 * Configuración de precios/envío del storefront.
 *
 * - `markupPercent`: recargo global (invisible) que se aplica a TODO precio de
 *   producto mostrado. El servidor lo re-aplica al crear el pedido sobre el
 *   precio base real, así que display y cobro siempre coinciden.
 * - `provinceShippingCost`: costo fijo de envío a provincia (fuera de SC).
 *
 * Se lee del endpoint público `GET /api/pricing-setting`. Si falla, se usan los
 * valores por defecto para no romper la tienda.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PricingSettings {
  markupPercent: number;
  provinceShippingCost: number;
  scCenterLat: number;
  scCenterLng: number;
  scRadiusKm: number;
}

export const PRICING_DEFAULTS: PricingSettings = {
  markupPercent: 10,
  provinceShippingCost: 17,
  scCenterLat: -17.7833,
  scCenterLng: -63.1821,
  scRadiusKm: 15
};

/** Distancia Haversine en km. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** ¿La coordenada está fuera del área de Santa Cruz? (=> provincia) */
export function isProvinceCoords(
  settings: PricingSettings,
  lat: number,
  lng: number
): boolean {
  return (
    distanceKm(settings.scCenterLat, settings.scCenterLng, lat, lng) >
    settings.scRadiusKm
  );
}

/**
 * Precio de venta: base + markup, redondeado SIEMPRE hacia arriba al boliviano
 * (41,12 → 42). Debe dar exactamente lo mismo que `PricingService.applyMarkup`
 * de la API, que es quien recalcula los importes al crear el pedido.
 *
 * El redondeo a 2 decimales previo evita la trampa de la coma flotante: 25 ×
 * 1.12 da 28.000000000000004, y un `ceil` directo cobraría 29.
 */
export function applyMarkup(
  price: number | null | undefined,
  markupPercent: number
): number {
  const base = Number(price) || 0;
  return Math.ceil(Math.round(base * (1 + markupPercent / 100) * 100) / 100);
}

/**
 * Precio con la oferta aplicada, con el mismo redondeo hacia arriba. Se calcula
 * sobre el precio de venta (que ya trae el markup).
 */
export function applyDiscount(
  price: number | null | undefined,
  discountPercent: number | null | undefined
): number {
  const base = Number(price) || 0;
  const pct = Number(discountPercent) || 0;
  if (pct <= 0) return base;
  return Math.ceil(Math.round(base * (1 - pct / 100) * 100) / 100);
}

export async function getPricingSettings(): Promise<PricingSettings> {
  try {
    const res = await fetch(`${API_URL}/api/pricing-setting`, {
      cache: "no-store"
    });
    if (!res.ok) return { ...PRICING_DEFAULTS };
    const json = await res.json();
    const d = json?.data;
    if (!d) return { ...PRICING_DEFAULTS };
    return {
      markupPercent: Number(d.markupPercent ?? PRICING_DEFAULTS.markupPercent),
      provinceShippingCost: Number(
        d.provinceShippingCost ?? PRICING_DEFAULTS.provinceShippingCost
      ),
      scCenterLat: Number(d.scCenterLat ?? PRICING_DEFAULTS.scCenterLat),
      scCenterLng: Number(d.scCenterLng ?? PRICING_DEFAULTS.scCenterLng),
      scRadiusKm: Number(d.scRadiusKm ?? PRICING_DEFAULTS.scRadiusKm)
    };
  } catch {
    return { ...PRICING_DEFAULTS };
  }
}
