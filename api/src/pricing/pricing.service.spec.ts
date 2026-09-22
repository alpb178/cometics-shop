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

  it("aplica el markup redondeando siempre hacia arriba al boliviano", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue(null); // markup 10%
    const settings = await service.getSettings();
    expect(service.applyMarkup(100, settings)).toBe(110); // ya entero
    expect(service.applyMarkup(33.33, settings)).toBe(37); // 36,66 → 37
    expect(service.applyMarkup(0.01, settings)).toBe(1); // 0,011 → 1
    expect(service.applyMarkup(0, settings)).toBe(0);
  });

  it("no cobra un boliviano de más por la coma flotante", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue({
      markup_percent: 12,
    });
    const settings = await service.getSettings();
    // 25 × 1.12 vale 28.000000000000004 en coma flotante: sin el redondeo
    // previo a 2 decimales, un ceil directo cobraría 29.
    expect(service.applyMarkup(25, settings)).toBe(28);
    expect(service.applyMarkup(50, settings)).toBe(56);
    expect(service.applyMarkup(100, settings)).toBe(112);
    // Y el caso que motivó el cambio: 36,71 + 12% = 41,1152
    expect(service.applyMarkup(36.71, settings)).toBe(42);
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
