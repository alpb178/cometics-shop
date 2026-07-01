/**
 * pricing-setting service
 */

import { factories } from "@strapi/strapi";

const UID = "api::pricing-setting.pricing-setting";

export type PricingSettings = {
  markupPercent: number;
  provinceShippingCost: number;
  scCenterLat: number;
  scCenterLng: number;
  scRadiusKm: number;
};

const DEFAULTS: PricingSettings = {
  markupPercent: 10,
  provinceShippingCost: 17,
  scCenterLat: -17.7833,
  scCenterLng: -63.1821,
  scRadiusKm: 15
};

/** Distancia Haversine en km entre dos coordenadas. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371; // radio terrestre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default factories.createCoreService(UID, ({ strapi }) => ({
  /** Devuelve la configuración vigente, o los valores por defecto si no existe. */
  async getSettings(): Promise<PricingSettings> {
    const row = (await strapi.db.query(UID).findOne({})) as Partial<
      PricingSettings
    > | null;
    if (!row) return { ...DEFAULTS };
    return {
      markupPercent: Number(row.markupPercent ?? DEFAULTS.markupPercent),
      provinceShippingCost: Number(
        row.provinceShippingCost ?? DEFAULTS.provinceShippingCost
      ),
      scCenterLat: Number(row.scCenterLat ?? DEFAULTS.scCenterLat),
      scCenterLng: Number(row.scCenterLng ?? DEFAULTS.scCenterLng),
      scRadiusKm: Number(row.scRadiusKm ?? DEFAULTS.scRadiusKm)
    };
  },

  /**
   * ¿La coordenada está FUERA del área de Santa Cruz? (=> envío a provincia).
   * Si no hay coordenadas válidas, devuelve null (indeterminado).
   */
  isProvince(
    settings: PricingSettings,
    lat: unknown,
    lng: unknown
  ): boolean | null {
    const la = Number(lat);
    const ln = Number(lng);
    if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
    const d = distanceKm(settings.scCenterLat, settings.scCenterLng, la, ln);
    return d > settings.scRadiusKm;
  }
}));
