/**
 * Storefront pricing/shipping settings.
 *
 * - `markupPercent`: global (invisible) surcharge applied to EVERY product
 *   price shown. The server re-applies it to the real base price when the order
 *   is created, so displayed and charged amounts always match.
 * - `provinceShippingCost`: flat shipping cost to the provinces (outside SC).
 *
 * Read from the public `GET /api/pricing-setting` endpoint. If it fails, the
 * defaults are used so the store doesn't break.
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

/** Haversine distance in km. */
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

/** Is the coordinate outside the Santa Cruz area? (=> province) */
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
 * Sale price: base + markup, ALWAYS rounded up to the whole boliviano
 * (41.12 → 42). Must match the API's `PricingService.applyMarkup` exactly,
 * since that is what recalculates the amounts when the order is created.
 *
 * Rounding to 2 decimals first avoids the floating-point trap: 25 × 1.12 gives
 * 28.000000000000004, and a direct `ceil` would charge 29.
 */
export function applyMarkup(
  price: number | null | undefined,
  markupPercent: number
): number {
  const base = Number(price) || 0;
  return Math.ceil(Math.round(base * (1 + markupPercent / 100) * 100) / 100);
}

/**
 * Price with the discount applied, with the same upward rounding. Computed on
 * the sale price (which already includes the markup).
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
