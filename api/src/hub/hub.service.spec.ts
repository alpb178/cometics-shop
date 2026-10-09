import { HubService } from "./hub.service";

describe("HubService.buildPayload", () => {
  const prismaMock = { $queryRaw: jest.fn() };
  const service = new HubService(prismaMock as never, {
    get: () => undefined,
  } as never);

  beforeEach(() => {
    prismaMock.$queryRaw.mockReset();
  });

  it("only declares business + signup metrics, never traffic", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-02");
    const keys = payload.definitions.map((d) => d.key);
    expect(keys).toEqual([
      "orders",
      "orders_paid",
      "revenue",
      "signups",
      "users_total",
    ]);
    expect(keys).not.toContain("visits");
    expect(keys).not.toContain("page_views");
  });

  it("declares revenue in BOB", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-02");
    const revenue = payload.definitions.find((d) => d.key === "revenue");
    expect(revenue).toMatchObject({ unit: "currency", currency: "BOB" });
  });

  it("declares users_total as a point-in-time snapshot (aggregation: last)", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-02");
    const usersTotal = payload.definitions.find((d) => d.key === "users_total");
    expect(usersTotal).toMatchObject({ unit: "count", aggregation: "last" });
  });

  it("counts every status into `orders`, only verified ones into `orders_paid`/`revenue`", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: "2026-03-01", status: "confirmed", count: 2, revenue: 200 },
        { day: "2026-03-01", status: "pending_verification", count: 3, revenue: 150 },
        { day: "2026-03-01", status: "cancelled", count: 1, revenue: 80 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-01");
    const day = payload.days.find((d) => d.date === "2026-03-01")!;
    expect(day.metrics).toEqual({
      orders: 6,
      orders_paid: 2,
      revenue: 200,
      signups: 0,
      users_total: 0,
    });
    const statusBreakdown = day.breakdowns.find((b) => b.metric === "orders")!;
    expect(statusBreakdown.values).toEqual({
      confirmed: 2,
      pending_verification: 3,
      cancelled: 1,
    });
  });

  it("treats shipped and delivered as paid too", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: "2026-03-01", status: "shipped", count: 1, revenue: 50 },
        { day: "2026-03-01", status: "delivered", count: 1, revenue: 70 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-01");
    const day = payload.days.find((d) => d.date === "2026-03-01")!;
    expect(day.metrics.orders_paid).toBe(2);
    expect(day.metrics.revenue).toBe(120);
  });

  it("maps the signup provider to a readable method, breakdown sums to the total", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { day: "2026-03-01", provider: "local", count: 4 },
        { day: "2026-03-01", provider: "google", count: 3 },
        { day: "2026-03-01", provider: null, count: 1 },
      ])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-01");
    const day = payload.days.find((d) => d.date === "2026-03-01")!;
    expect(day.metrics.signups).toBe(8);
    const signupBreakdown = day.breakdowns.find((b) => b.metric === "signups")!;
    expect(signupBreakdown.values).toEqual({ email: 4, google: 3, unknown: 1 });
  });

  it("never carries a personal identifier in a breakdown value", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: "2026-03-01", status: "confirmed", count: 1, revenue: 10 },
      ])
      .mockResolvedValueOnce([
        { day: "2026-03-01", provider: "local", count: 1 },
      ])
      .mockResolvedValueOnce([]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-01");
    const allValueKeys = payload.days.flatMap((d) =>
      d.breakdowns.flatMap((b) => Object.keys(b.values)),
    );
    expect(allValueKeys).toEqual(
      expect.arrayContaining(["confirmed", "email"]),
    );
    expect(allValueKeys.join(",")).not.toMatch(/@|cliente|customer/i);
  });

  it("declares the whole requested range, including days without activity", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([
        { day: "2026-03-01", status: "confirmed", count: 1, revenue: 10 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { day: "2026-03-01", total: 10 },
        { day: "2026-03-02", total: 10 },
      ]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-02");
    expect(payload.range).toEqual({ from: "2026-03-01", to: "2026-03-02" });
  });

  it("carries the cumulative users_total per day, excluding users created after that day", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { day: "2026-03-01", total: 10 },
        { day: "2026-03-02", total: 12 },
      ]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-02");
    const day1 = payload.days.find((d) => d.date === "2026-03-01")!;
    const day2 = payload.days.find((d) => d.date === "2026-03-02")!;
    // day1's total (10) must not include the 2 users counted in day2's total
    // (12) — the cumulative count as of day1 excludes anyone who signed up
    // after it, even though they're still in the window being sent.
    expect(day1.metrics.users_total).toBe(10);
    expect(day2.metrics.users_total).toBe(12);
  });

  it("creates a day bucket for every row the users_total query returns, even without orders/signups", async () => {
    prismaMock.$queryRaw
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ day: "2026-03-02", total: 5 }]);
    const payload = await service.buildPayload("2026-03-01", "2026-03-02");
    const day = payload.days.find((d) => d.date === "2026-03-02")!;
    expect(day.metrics).toEqual({
      orders: 0,
      orders_paid: 0,
      revenue: 0,
      signups: 0,
      users_total: 5,
    });
  });
});

describe("HubService.push", () => {
  const prismaMock = { $queryRaw: jest.fn().mockResolvedValue([]) };
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("is a no-op without HUB_URL/HUB_API_KEY configured", async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as never;
    const service = new HubService(prismaMock as never, {
      get: () => undefined,
    } as never);
    await service.push();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the payload to /api/ingest/metrics with the project's key", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rowsWritten: 2, warnings: [] }),
    });
    global.fetch = fetchMock as never;
    const config = {
      get: (k: string) =>
        ({ HUB_URL: "https://hub.corpsc.com", HUB_API_KEY: "secret" })[k],
    };
    const service = new HubService(prismaMock as never, config as never);
    await service.push();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://hub.corpsc.com/api/ingest/metrics",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-Api-Key": "secret" }),
      }),
    );
  });

  it("swallows a failed push instead of throwing (the hub being down can't break this project)", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("network down"));
    global.fetch = fetchMock as never;
    const config = {
      get: (k: string) =>
        ({ HUB_URL: "https://hub.corpsc.com", HUB_API_KEY: "secret" })[k],
    };
    const service = new HubService(prismaMock as never, config as never);
    await expect(service.push()).resolves.toBeUndefined();
  });
});
