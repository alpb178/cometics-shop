import { PricingService } from "./pricing.service";

describe("PricingService", () => {
  const prismaMock = { pricing_settings: { findFirst: jest.fn() } };
  const service = new PricingService(prismaMock as never);

  beforeEach(() => prismaMock.pricing_settings.findFirst.mockReset());

  it("usa defaults si no hay fila de settings", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null);
    const settings = await service.getSettings();
    expect(settings.markupPercent).toBe(10);
    expect(settings.provinceShippingCost).toBe(17);
    expect(settings.scRadiusKm).toBe(15);
  });

  it("aplica el markup con redondeo a 2 decimales", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null);
    const settings = await service.getSettings();
    expect(service.applyMarkup(100, settings)).toBe(110);
    expect(service.applyMarkup(33.33, settings)).toBe(36.66);
  });

  it("isProvince es tri-estado: null sin coordenadas", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null);
    const settings = await service.getSettings();
    expect(service.isProvince(settings, null, null)).toBeNull();
    expect(service.isProvince(settings, "abc", -63)).toBeNull();
    // Centro de Santa Cruz: dentro del radio
    expect(service.isProvince(settings, -17.7833, -63.1821)).toBe(false);
    // Cochabamba: claramente fuera del radio de 15 km
    expect(service.isProvince(settings, -17.3895, -66.1568)).toBe(true);
  });
});
