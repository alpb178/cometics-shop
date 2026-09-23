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

  it("recomputes prices server-side with markup (ignores the client price)", async () => {
    const result = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 2, price: 1 } as never],
      { deliveryMethod: "pickup" },
    );
    expect(result.items[0].price).toBe(132); // 120 × 1.10
    expect(result.subtotal).toBe(264);
    expect(result.shippingCost).toBe(0); // pickup never pays shipping
    expect(result.total).toBe(264);
  });

  it("charges province shipping when the coordinates fall outside the radius", async () => {
    const result = await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 1 } as never],
      { deliveryMethod: "delivery", lat: -17.3895, lng: -66.1568 },
    );
    expect(result.shippingCost).toBe(17);
    expect(result.total).toBe(149); // 132 + 17
  });

  it("falls back to the client flag without coordinates", async () => {
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

  it("coordinates inside the radius win over the client flag", async () => {
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

  it("filters by visible, not by published_at (single version)", async () => {
    await service.buildVerifiedOrderData(
      [{ productId: 5, quantity: 1 } as never],
      { deliveryMethod: "pickup" },
    );
    const where = prismaMock.products.findMany.mock.calls[0][0].where;
    expect(where).toEqual({ id: { in: [5] }, visible: { not: false } });
    // published_at ended up null on legacy rows and on the version-collapse
    // survivor: filtering on it rejected products that are for sale.
    expect(where).not.toHaveProperty("published_at");
  });

  it("rejects hidden or missing products", async () => {
    prismaMock.products.findMany.mockResolvedValue([]);
    await expect(
      service.buildVerifiedOrderData(
        [{ productId: 99, quantity: 1 } as never],
        { deliveryMethod: "pickup" },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it("rejects orders without items", async () => {
    await expect(
      service.buildVerifiedOrderData([], { deliveryMethod: "pickup" }),
    ).rejects.toThrow(BadRequestException);
  });
});

describe("OrdersService: per-user scope", () => {
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
    // isStaffUser reads STAFF_EMAILS on every call: pin it so the tests don't
    // depend on the environment they run in.
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
    it("a customer only gets their own orders (in the count too)", async () => {
      await service.findMany(customer, 50);
      expect(prismaMock.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: ownedBy(customer.id) }),
      );
      expect(prismaMock.orders.count).toHaveBeenCalledWith({
        where: ownedBy(customer.id),
      });
    });

    it("staff without scope sees every order", async () => {
      await service.findMany(staff, 50);
      expect(prismaMock.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
      expect(prismaMock.orders.count).toHaveBeenCalledWith({ where: {} });
    });

    it("scope=mine filters by ownership even when the user is staff", async () => {
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
    it("404 (not 403) when the order isn't the customer's", async () => {
      await expect(service.findOneOrThrow("42", customer)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("returns the order when the customer owns it", async () => {
      prismaMock.orders_user_lnk.findFirst.mockResolvedValue({
        order_id: 42,
        user_id: customer.id,
      });
      await expect(service.findOneOrThrow("42", customer)).resolves.toEqual(
        orderRow,
      );
    });

    it("staff without scope opens other people's orders", async () => {
      await expect(service.findOneOrThrow("42", staff)).resolves.toEqual(orderRow);
      expect(prismaMock.orders_user_lnk.findFirst).not.toHaveBeenCalled();
    });

    it("scope=mine returns 404 to staff on other people's orders", async () => {
      await expect(
        service.findOneOrThrow("42", staff, { onlyOwn: true }),
      ).rejects.toThrow(NotFoundException);
      expect(prismaMock.orders_user_lnk.findFirst).toHaveBeenCalledWith({
        where: { order_id: 42, user_id: staff.id },
      });
    });

    it("accepts a documentId as well as a numeric id", async () => {
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
    // getStats runs two raw queries: 1) the N-day window, 2) today.
    prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
  });

  it("splits the subtotal into product + platform profit (10% markup)", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: new Date("2026-07-10"), count: 2, revenue: 264, subtotal: 264 },
      ])
      .mockResolvedValueOnce([{ count: 1, revenue: 132, subtotal: 132 }]);
    const stats = await service.getStats(30);
    // 264 = 240 (original price) × 1.10 → the platform keeps 24
    expect(stats.productProfit).toBe(240);
    expect(stats.platformProfit).toBe(24);
    expect(stats.markupPercent).toBe(10);
    // products + platform add back up to the sold subtotal
    expect(stats.productProfit + stats.platformProfit).toBe(264);
    // the `today` block only uses the day's sales
    expect(stats.today).toEqual({
      orders: 1,
      revenue: 132,
      productProfit: 120,
      platformProfit: 12,
    });
  });

  it("honors a configured markup other than 10%", async () => {
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

  it("returns zero profit without sales (window and today)", async () => {
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
