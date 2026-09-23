import { Injectable } from "@nestjs/common";
import { round2, toNumber } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

export interface PricingSettings {
  id: number | null;
  documentId: string | null;
  markupPercent: number;
  provinceShippingCost: number;
  scCenterLat: number;
  scCenterLng: number;
  scRadiusKm: number;
}

/** Same defaults as back/src/api/pricing-setting/services/pricing-setting.ts */
const DEFAULTS = {
  markupPercent: 10,
  provinceShippingCost: 17,
  scCenterLat: -17.7833,
  scCenterLng: -63.1821,
  scRadiusKm: 15,
};

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<PricingSettings> {
    const row = await this.prisma.pricing_settings.findFirst({
      orderBy: { id: "asc" },
    });
    return {
      id: row?.id ?? null,
      documentId: row?.document_id ?? null,
      markupPercent: toNumber(row?.markup_percent) ?? DEFAULTS.markupPercent,
      provinceShippingCost:
        toNumber(row?.province_shipping_cost) ?? DEFAULTS.provinceShippingCost,
      scCenterLat: toNumber(row?.sc_center_lat) ?? DEFAULTS.scCenterLat,
      scCenterLng: toNumber(row?.sc_center_lng) ?? DEFAULTS.scCenterLng,
      scRadiusKm: toNumber(row?.sc_radius_km) ?? DEFAULTS.scRadiusKm,
    };
  }

  /**
   * Sale price: base + markup, ALWAYS rounded up to the whole boliviano
   * (41.12 → 42). It's the price shown and the price charged: same calculation
   * here and in `front/lib/pricing.ts`.
   *
   * The preceding `round2` isn't decorative: in floating point 25 × 1.12 gives
   * 28.000000000000004, and a direct `ceil` would charge 29.
   */
  applyMarkup(basePrice: number, settings: PricingSettings): number {
    return Math.ceil(round2(basePrice * (1 + settings.markupPercent / 100)));
  }

  /**
   * Tri-state as in Strapi: true/false when there are valid coordinates,
   * null when there aren't (the caller falls back to the client's flag).
   */
  isProvince(
    settings: PricingSettings,
    lat: unknown,
    lng: unknown,
  ): boolean | null {
    const latN = toNumber(lat);
    const lngN = toNumber(lng);
    if (latN === null || lngN === null) return null;
    const distance = this.distanceKm(
      latN,
      lngN,
      settings.scCenterLat,
      settings.scCenterLng,
    );
    return distance > settings.scRadiusKm;
  }

  /** Haversine, R = 6371 km — identical to the original service. */
  private distanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
