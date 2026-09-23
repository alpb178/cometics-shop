import { PricingService } from "./pricing.service";

describe("PricingService", () => {
  const prismaMock = { pricing_settings: { findFirst: jest.fn() } };
  const service = new PricingService(prismaMock as never);

  beforeEach(() => prismaMock.pricing_settings.findFirst.mockReset());

  it("uses defaults when there is no settings row", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null);
    const settings = await service.getSettings();
    expect(settings.markupPercent).toBe(10);
    expect(settings.provinceShippingCost).toBe(17);
    expect(settings.scRadiusKm).toBe(15);
  });

  it("applies the markup always rounding up to the whole boliviano", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null); // markup 10%
    const settings = await service.getSettings();
    expect(service.applyMarkup(100, settings)).toBe(110); // already whole
    expect(service.applyMarkup(33.33, settings)).toBe(37); // 36.66 → 37
    expect(service.applyMarkup(0.01, settings)).toBe(1); // 0.011 → 1
    expect(service.applyMarkup(0, settings)).toBe(0);
  });

  it("doesn't overcharge a boliviano because of floating point", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue({
      markup_percent: 12,
    });
    const settings = await service.getSettings();
    // 25 × 1.12 is 28.000000000000004 in floating point: without rounding to
    // 2 decimals first, a direct ceil would charge 29.
    expect(service.applyMarkup(25, settings)).toBe(28);
    expect(service.applyMarkup(50, settings)).toBe(56);
    expect(service.applyMarkup(100, settings)).toBe(112);
    // And the case that prompted the change: 36.71 + 12% = 41.1152
    expect(service.applyMarkup(36.71, settings)).toBe(42);
  });

  it("isProvince is tri-state: null without coordinates", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null);
    const settings = await service.getSettings();
    expect(service.isProvince(settings, null, null)).toBeNull();
    expect(service.isProvince(settings, "abc", -63)).toBeNull();
    // Santa Cruz center: inside the radius
    expect(service.isProvince(settings, -17.7833, -63.1821)).toBe(false);
    // Cochabamba: clearly outside the 15 km radius
    expect(service.isProvince(settings, -17.3895, -66.1568)).toBe(true);
  });
});
