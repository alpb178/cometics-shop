import { ProductsService } from "./products.service";

/**
 * Cubre el modelo de versión única (sin draft & publish):
 *  - create deja la fila publicada (published_at no nulo),
 *  - update edita en sitio y conserva published_at,
 *  - findMany deduplica por document_id (la última editada) y solo filtra por
 *    visibilidad en la vista pública.
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

  it("create deja la fila ya publicada (published_at no nulo)", async () => {
    tx.products.create.mockImplementation((args: { data: Record<string, unknown> }) =>
      Promise.resolve({ ...baseRow, ...args.data }),
    );
    await service.create({ name: "Nuevo", price: 20 });
    const data = tx.products.create.mock.calls[0][0].data;
    expect(data.published_at).toBeInstanceOf(Date);
  });

  it("update edita en sitio y conserva la fila publicada", async () => {
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
    // mantiene la publicación existente (no la vuelve a null)
    expect(data.published_at).toEqual(baseRow.published_at);
  });

  it("findMany deduplica por document_id quedándose con la última editada", async () => {
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
    // vista pública: filtra por visibilidad
    expect(prismaMock.products.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visible: { not: false } }),
      }),
    );
  });

  it("findMany en vista admin (draft) no filtra por visibilidad", async () => {
    prismaMock.products.findMany.mockResolvedValue([]);
    await service.findMany({ status: "draft", pageSize: 200 });
    const where = prismaMock.products.findMany.mock.calls[0][0].where;
    expect(where.visible).toBeUndefined();
  });
});
