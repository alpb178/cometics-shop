import { ProductsService } from "./products.service";

/**
 * Covers the single-version model (no draft & publish):
 *  - create leaves the row published (non-null published_at),
 *  - update edits in place and keeps published_at,
 *  - findMany dedupes by document_id (the last edited one) and only filters by
 *    visibility in the public view.
 */
describe("ProductsService", () => {
  const tx = {
    products: { create: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    products_categories_lnk: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    files_related_mph: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };
  const prismaMock = {
    products: { findMany: jest.fn(), findFirst: jest.fn() },
    products_categories_lnk: { findMany: jest.fn().mockResolvedValue([]) },
    files_related_mph: { findMany: jest.fn().mockResolvedValue([]) },
    $transaction: jest.fn(async (cb: (t: typeof tx) => unknown) => cb(tx)),
  };
  const mediaMock = {
    findRelatedFile: jest.fn().mockResolvedValue(null),
    toMediaFile: jest.fn(),
  };
  const service = new ProductsService(prismaMock as never, mediaMock as never);

  const baseRow = {
    id: 1,
    document_id: "d",
    name: "X",
    price: 10,
    slug: "x",
    currency: "BS",
    description: null,
    visible: true,
    created_at: new Date("2026-01-01"),
    updated_at: new Date("2026-01-01"),
    published_at: new Date("2026-01-01"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tx.products_categories_lnk.findMany.mockResolvedValue([]);
    tx.files_related_mph.findMany.mockResolvedValue([]);
    prismaMock.products_categories_lnk.findMany.mockResolvedValue([]);
    prismaMock.files_related_mph.findMany.mockResolvedValue([]);
    mediaMock.findRelatedFile.mockResolvedValue(null);
  });

  it("create leaves the row already published (non-null published_at)", async () => {
    tx.products.create.mockImplementation((args: { data: Record<string, unknown> }) =>
      Promise.resolve({ ...baseRow, ...args.data }),
    );
    await service.create({ name: "Nuevo", price: 20 });
    const data = tx.products.create.mock.calls[0][0].data;
    expect(data.published_at).toBeInstanceOf(Date);
  });

  it("update edits in place and keeps the row published", async () => {
    prismaMock.products.findFirst.mockResolvedValue(baseRow);
    tx.products.update.mockImplementation((args: { where: { id: number }; data: Record<string, unknown> }) =>
      Promise.resolve({ ...baseRow, ...args.data, id: args.where.id }),
    );

    await service.update("d", { name: "Editado" });

    expect(prismaMock.products.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { document_id: "d" },
        orderBy: { updated_at: "desc" },
      }),
    );
    const data = tx.products.update.mock.calls[0][0].data;
    expect(data.name).toBe("Editado");
    // keeps the existing publication (doesn't reset it to null)
    expect(data.published_at).toEqual(baseRow.published_at);
  });

  it("findMany dedupes by document_id keeping the last edited row", async () => {
    const rows = [
      { ...baseRow, id: 2, document_id: "d", name: "v2", updated_at: new Date("2026-02-02"), created_at: new Date("2026-01-02") },
      { ...baseRow, id: 1, document_id: "d", name: "v1", updated_at: new Date("2026-01-01"), created_at: new Date("2026-01-01") },
      { ...baseRow, id: 3, document_id: "e", name: "otro", updated_at: new Date("2026-01-03"), created_at: new Date("2026-01-03") },
    ];
    prismaMock.products.findMany.mockResolvedValue(rows);

    const res = await service.findMany({ status: "published", pageSize: 100 });

    expect(res.meta.pagination.total).toBe(2);
    expect(res.data).toHaveLength(2);
    expect(res.data.find((p) => p.documentId === "d")?.name).toBe("v2");
    // public view: filters by visibility
    expect(prismaMock.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visible: { not: false } }),
      }),
    );
  });

  it("findMany in the admin view (draft) doesn't filter by visibility", async () => {
    prismaMock.products.findMany.mockResolvedValue([]);
    await service.findMany({ status: "draft", pageSize: 200 });
    const where = prismaMock.products.findMany.mock.calls[0][0].where;
    expect(where.visible).toBeUndefined();
  });

  it("requests twice the pageSize in rows: `take` is spent on duplicates", async () => {
    prismaMock.products.findMany.mockResolvedValue([]);
    await service.findMany({ status: "published", pageSize: 24 });
    expect(prismaMock.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 48 }),
    );
  });

  it("doesn't lose products to duplicates and trims to pageSize", async () => {
    // 8 duplicated documents (draft + published) = 16 rows: with `take` on
    // rows and no headroom, a pageSize of 8 returned only 4 products.
    const rows = Array.from({ length: 8 }).flatMap((_, i) => [
      {
        ...baseRow,
        id: i * 2 + 1,
        document_id: `doc${i}`,
        name: `p${i}`,
        updated_at: new Date(2026, 0, i + 1),
        created_at: new Date(2026, 0, i + 1),
      },
      {
        ...baseRow,
        id: i * 2 + 2,
        document_id: `doc${i}`,
        name: `p${i}`,
        updated_at: new Date(2025, 0, i + 1),
        created_at: new Date(2026, 0, i + 1),
      },
    ]);
    prismaMock.products.findMany.mockResolvedValue(rows);

    const res = await service.findMany({ status: "published", pageSize: 8 });

    expect(res.data).toHaveLength(8);
    expect(new Set(res.data.map((p) => p.documentId)).size).toBe(8);
    // A single page: the endpoint takes no offset, so reporting more pages
    // derived from a division was misleading.
    expect(res.meta.pagination.pageCount).toBe(1);
    expect(res.meta.pagination.total).toBe(8);
  });

  it("trims to pageSize when there are more documents than room", async () => {
    const rows = Array.from({ length: 6 }).map((_, i) => ({
      ...baseRow,
      id: i + 1,
      document_id: `doc${i}`,
      name: `p${i}`,
      updated_at: new Date(2026, 0, i + 1),
      created_at: new Date(2026, 0, i + 1),
    }));
    prismaMock.products.findMany.mockResolvedValue(rows);

    const res = await service.findMany({ status: "published", pageSize: 4 });

    expect(res.data).toHaveLength(4);
    expect(res.meta.pagination.total).toBe(4);
  });
});
