import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthenticatedUser } from "../common/staff.util";
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

describe("OrdersService: alcance por usuario", () => {
  const prismaMock = {
    orders: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn() },
    orders_cmps: { findMany: jest.fn() },
    orders_shipping_address_lnk: { findFirst: jest.fn() },
    orders_user_lnk: { findFirst: jest.fn() },
    pricing_settings: { findFirst: jest.fn() },
  };
  const mediaMock = { findRelatedFile: jest.fn() };
  const service = new OrdersService(
    prismaMock as never,
    new PricingService(prismaMock as never) as never,
    mediaMock as never,
    {} as never,
  );

  const baseUser = (over: Partial<AuthenticatedUser>): AuthenticatedUser =>
    ({
      id: 7,
      email: "cliente@example.com",
      roleType: "authenticated",
      ...over,
    }) as AuthenticatedUser;
  const customer = baseUser({});
  const staff = baseUser({ id: 1, email: "admin@example.com", roleType: "admin" });
  const ownedBy = (userId: number) => ({
    orders_user_lnk: { some: { user_id: userId } },
  });

  const orderRow = { id: 42, document_id: "abc", status: "confirmed" };

  beforeEach(() => {
    // isStaffUser lee STAFF_EMAILS en cada llamada: fijarlo para no depender
    // del entorno donde corran los tests.
    process.env.STAFF_EMAILS = "";
    prismaMock.orders.findMany.mockReset().mockResolvedValue([]);
    prismaMock.orders.count.mockReset().mockResolvedValue(0);
    prismaMock.orders.findFirst.mockReset().mockResolvedValue(orderRow);
    prismaMock.orders_cmps.findMany.mockReset().mockResolvedValue([]);
    prismaMock.orders_shipping_address_lnk.findFirst.mockReset().mockResolvedValue(null);
    prismaMock.orders_user_lnk.findFirst.mockReset().mockResolvedValue(null);
    prismaMock.pricing_settings.findFirst.mockReset().mockResolvedValue(null);
    mediaMock.findRelatedFile.mockReset().mockResolvedValue(null);
  });

  describe("findMany", () => {
    it("un cliente solo recibe sus pedidos (también en el count)", async () => {
      await service.findMany(customer, 50);
      expect(prismaMock.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: ownedBy(customer.id) }),
      );
      expect(prismaMock.orders.count).toHaveBeenCalledWith({
        where: ownedBy(customer.id),
      });
    });

    it("staff sin scope ve todos los pedidos", async () => {
      await service.findMany(staff, 50);
      expect(prismaMock.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
      expect(prismaMock.orders.count).toHaveBeenCalledWith({ where: {} });
    });

    it("scope=mine filtra por propiedad aunque el usuario sea staff", async () => {
      await service.findMany(staff, 50, { onlyOwn: true });
      expect(prismaMock.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: ownedBy(staff.id) }),
      );
      expect(prismaMock.orders.count).toHaveBeenCalledWith({
        where: ownedBy(staff.id),
      });
    });
  });

  describe("findOneOrThrow", () => {
    it("404 (no 403) cuando el pedido no es del cliente", async () => {
      await expect(service.findOneOrThrow("42", customer)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("devuelve el pedido cuando el cliente es el dueño", async () => {
      prismaMock.orders_user_lnk.findFirst.mockResolvedValue({
        order_id: 42,
        user_id: customer.id,
      });
      await expect(service.findOneOrThrow("42", customer)).resolves.toEqual(
        orderRow,
      );
    });

    it("staff sin scope abre pedidos ajenos", async () => {
      await expect(service.findOneOrThrow("42", staff)).resolves.toEqual(orderRow);
      expect(prismaMock.orders_user_lnk.findFirst).not.toHaveBeenCalled();
    });

    it("scope=mine devuelve 404 a staff en pedidos ajenos", async () => {
      await expect(
        service.findOneOrThrow("42", staff, { onlyOwn: true }),
      ).rejects.toThrow(NotFoundException);
      expect(prismaMock.orders_user_lnk.findFirst).toHaveBeenCalledWith({
        where: { order_id: 42, user_id: staff.id },
      });
    });

    it("acepta documentId además de id numérico", async () => {
      await service.findOneOrThrow("abc", staff);
      expect(prismaMock.orders.findFirst).toHaveBeenCalledWith({
        where: { document_id: "abc" },
      });
    });
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
