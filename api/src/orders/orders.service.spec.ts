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
