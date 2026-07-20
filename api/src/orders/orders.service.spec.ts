import { BadRequestException } from "@nestjs/common";
import { PricingService } from "../pricing/pricing.service";
import { OrdersService } from "./orders.service";

describe("OrdersService.buildVerifiedOrderData", () => {
  const prismaMock = {
    products: { findMany: jest.fn() },
    pricing_settings: { findFirst: jest.fn().mockResolvedValue(null) },
  };
  const pricing = new PricingService(prismaMock as never);
  const service = new OrdersService(
    prismaMock as never,
    pricing,
    {} as never,
    {} as never,
  );

  const product = { id: 5, name: "Crema X", slug: "crema-x", price: 120 };

  beforeEach(() => {
    prismaMock.products.findMany.mockReset();
    prismaMock.products.findMany.mockResolvedValue([product]);
  });

  it("recalcula precios server-side con markup (ignora el precio del cliente)", async () => {
    const result = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 2, price: 1 } as never],
      { deliveryMethod: "pickup" },
    );
    expect(result.items[0].price).toBe(132); // 120 × 1.10
    expect(result.subtotal).toBe(264);
    expect(result.shippingCost).toBe(0); // pickup nunca paga envío
    expect(result.total).toBe(264);
  });

  it("cobra envío de provincia cuando las coordenadas caen fuera del radio", async () => {
    const result = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 1 } as never],
      { deliveryMethod: "delivery", lat: -17.3895, lng: -66.1568 },
    );
    expect(result.shippingCost).toBe(17);
    expect(result.total).toBe(149); // 132 + 17
  });

  it("sin coordenadas cae al flag del cliente", async () => {
    const withFlag = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 1 } as never],
      { deliveryMethod: "delivery", clientIsProvince: true },
    );
    expect(withFlag.shippingCost).toBe(17);

    const withoutFlag = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 1 } as never],
      { deliveryMethod: "delivery", clientIsProvince: false },
    );
    expect(withoutFlag.shippingCost).toBe(0);
  });

  it("las coordenadas dentro del radio ganan al flag del cliente", async () => {
    const result = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 1 } as never],
      {
        deliveryMethod: "delivery",
        lat: -17.7833,
        lng: -63.1821,
        clientIsProvince: true,
      },
    );
    expect(result.shippingCost).toBe(0);
  });

  it("rechaza productos no publicados o inexistentes", async () => {
    prismaMock.products.findMany.mockResolvedValue([]);
    await expect(
      service.buildVerifiedOrderData(
        [{ productId: 99, quantity: 1 } as never],
        { deliveryMethod: "pickup" },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it("rechaza pedidos sin items", async () => {
    await expect(
      service.buildVerifiedOrderData([], { deliveryMethod: "pickup" }),
    ).rejects.toThrow(BadRequestException);
  });
});

describe("OrdersService.getStats", () => {
  const prismaMock = {
    orders: { count: jest.fn() },
    pricing_settings: { findFirst: jest.fn() },
    $queryRaw: jest.fn(),
  };
  const pricing = new PricingService(prismaMock as never);
  const service = new OrdersService(
    prismaMock as never,
    pricing,
    {} as never,
    {} as never,
  );

  beforeEach(() => {
    prismaMock.orders.count.mockReset().mockResolvedValue(0);
    prismaMock.pricing_settings.findFirst.mockReset().mockResolvedValue(null);
    // getStats hace dos consultas raw: 1) la ventana de N días, 2) el día de hoy.
    prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
  });

  it("descompone el subtotal en ganancia de productos + plataforma (markup 10%)", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: new Date("2026-07-10"), count: 2, revenue: 264, subtotal: 264 },
      ])
      .mockResolvedValueOnce([{ count: 1, revenue: 132, subtotal: 132 }]);
    const stats = await service.getStats(30);
    // 264 = 240 (precio original) × 1.10 → plataforma se queda con 24
    expect(stats.productProfit).toBe(240);
    expect(stats.platformProfit).toBe(24);
    expect(stats.markupPercent).toBe(10);
    // productos + plataforma reconstruyen el subtotal vendido
    expect(stats.productProfit + stats.platformProfit).toBe(264);
    // el bloque `today` usa solo las ventas del día
    expect(stats.today).toEqual({
      orders: 1,
      revenue: 132,
      productProfit: 120,
      platformProfit: 12,
    });
  });

  it("respeta un markup configurado distinto del 10%", async () => {
    prismaMock.pricing_settings.findFirst.mockResolvedValue({
      markup_percent: 25,
    });
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: new Date("2026-07-10"), count: 1, revenue: 125, subtotal: 125 },
      ])
      .mockResolvedValueOnce([{ count: 1, revenue: 125, subtotal: 125 }]);
    const stats = await service.getStats(30);
    expect(stats.markupPercent).toBe(25);
    expect(stats.productProfit).toBe(100); // 125 / 1.25
    expect(stats.platformProfit).toBe(25);
    expect(stats.today.productProfit).toBe(100);
    expect(stats.today.platformProfit).toBe(25);
  });

  it("sin ventas devuelve ganancias en cero (ventana y hoy)", async () => {
    const stats = await service.getStats(30);
    expect(stats.productProfit).toBe(0);
    expect(stats.platformProfit).toBe(0);
    expect(stats.today).toEqual({
      orders: 0,
      revenue: 0,
      productProfit: 0,
      platformProfit: 0,
    });
  });
});
