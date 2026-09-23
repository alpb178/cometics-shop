import { Injectable, NotFoundException } from "@nestjs/common";
import { generateDocumentId } from "../common/strapi.util";
import { MediaService } from "../media/media.service";
import { PrismaService } from "../prisma/prisma.service";

const RELATED_TYPE = "api::product.product";

export interface ProductInput {
  name?: string;
  price?: number | null;
  currency?: string;
  description?: string | null;
  slug?: string;
  image?: number | null;
  images?: number[];
  categories?: number | number[] | null;
  visible?: boolean;
  /** Discount percentage (sale). null/0 = no sale. */
  discount?: number | null;
}

type Tx = Parameters<Parameters<PrismaService["$transaction"]>[0]>[0];

/**
 * Products has ONE row per document (the draft & publish inherited from
 * Strapi was removed): it's edited in place and the website sees it right
 * away. The row always keeps a non-null `published_at` so the front reads it;
 * store visibility is controlled by the `visible` flag. The `status` param no
 * longer selects a version: 'published' = public view (visible only),
 * 'draft' = admin view (all). The dedupe by `document_id` is defensive in case
 * legacy duplicate rows remain.
 */
/**
 * Row headroom over the requested `pageSize`: while draft & publish
 * duplicates remain there are up to 2 rows per document.
 */
const ROW_BUDGET_FACTOR = 2;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async findMany(opts: { status: "draft" | "published"; slug?: string; pageSize: number }) {
    const where = {
      // The store (status published) only sees products marked as visible;
      // the backoffice (status draft) sees them all. `not: false` also lets
      // legacy `visible = null` rows through.
      ...(opts.status === "published" ? { visible: { not: false } } : {}),
      ...(opts.slug ? { slug: opts.slug } : {}),
    };
    // Ordered by updated_at desc so that, with legacy duplicates, the first
    // row of each document_id is the last edited one (the survivor).
    //
    // `take` applies to ROWS and deduplication comes afterwards, so with the
    // draft & publish duplicates (2 rows per document) half the budget was
    // wasted: asking for 100 returned ~50 products and the rest silently
    // vanished from the catalog. We ask for twice as many and trim after
    // deduplicating. Once `collapse-product-versions.sql` has run the
    // headroom is unnecessary but harmless.
    const rows = await this.prisma.products.findMany({
      where,
      orderBy: { updated_at: "desc" },
      take: opts.pageSize * ROW_BUDGET_FACTOR,
    });
    const seen = new Set<string>();
    const unique = rows.filter((r) => {
      if (!r.document_id) return true; // no document: kept as an individual row
      if (seen.has(r.document_id)) return false;
      seen.add(r.document_id);
      return true;
    });
    // Display order: by creation date, descending.
    unique.sort(
      (a, b) =>
        (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0),
    );
    const page = unique.slice(0, opts.pageSize);
    const data = await Promise.all(page.map((r) => this.serialize(r)));
    // The endpoint returns a single page capped by `pageSize` (the catalog
    // paginates client-side) and takes no offset, so reporting a `pageCount`
    // derived from a division was misleading: there is always one page.
    return {
      data,
      meta: {
        pagination: {
          page: 1,
          pageSize: opts.pageSize,
          pageCount: 1,
          total: data.length,
        },
      },
    };
  }

  async findByDocumentId(documentId: string) {
    const row = await this.getRow(documentId);
    if (!row) throw new NotFoundException();
    return this.serialize(row);
  }

  async create(input: ProductInput) {
    const now = new Date();
    const row = await this.prisma.$transaction(async (tx) => {
      const created = await tx.products.create({
        data: {
          document_id: generateDocumentId(),
          name: input.name,
          price: input.price ?? null,
          currency: input.currency ?? "BS",
          description: input.description ?? null,
          slug: input.slug ?? this.slugify(input.name ?? ""),
          visible: input.visible ?? true,
          discount: input.discount ?? null,
          created_at: now,
          updated_at: now,
          published_at: now, // single row, always published (no draft/publish)
        },
      });
      await this.applyRelations(tx, created.id, input);
      return created;
    });
    return this.serialize(row);
  }

  async update(documentId: string, input: ProductInput) {
    const target = await this.getRow(documentId);
    if (!target) throw new NotFoundException();
    const row = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.products.update({
        where: { id: target.id },
        data: {
          name: input.name,
          price: input.price,
          currency: input.currency,
          description: input.description,
          slug: input.slug,
          discount: input.discount,
          updated_at: new Date(),
          // Keeps the row published (in case it comes from unpublished legacy
          // data); store visibility is controlled by `visible`.
          published_at: target.published_at ?? new Date(),
        },
      });
      await this.applyRelations(tx, target.id, input, { onlyProvided: true });
      // `visible` is propagated to every row of the document (for robustness
      // against legacy duplicates; with a single row it's a harmless no-op).
      if (input.visible !== undefined) {
        await tx.products.updateMany({
          where: { document_id: documentId },
          data: { visible: input.visible },
        });
      }
      return updated;
    });
    return this.serialize(row);
  }

  async delete(documentId: string) {
    const rows = await this.prisma.products.findMany({
      where: { document_id: documentId },
    });
    if (!rows.length) throw new NotFoundException();
    const serialized = await this.serialize(rows[0]);
    await this.prisma.$transaction(async (tx) => {
      const ids = rows.map((r) => r.id);
      await tx.files_related_mph.deleteMany({
        where: { related_type: RELATED_TYPE, related_id: { in: ids } },
      });
      await tx.products.deleteMany({ where: { id: { in: ids } } }); // cascades to lnk
    });
    return serialized;
  }

  /** The document's single row: with legacy duplicates, the last edited one. */
  private async getRow(documentId: string) {
    return this.prisma.products.findFirst({
      where: { document_id: documentId },
      orderBy: { updated_at: "desc" },
    });
  }

  private async applyRelations(
    tx: Tx,
    productId: number,
    input: ProductInput,
    opts: { onlyProvided?: boolean } = {},
  ) {
    const provided = (key: keyof ProductInput) =>
      !opts.onlyProvided || input[key] !== undefined;

    if (provided("categories")) {
      await tx.products_categories_lnk.deleteMany({
        where: { product_id: productId },
      });
      const ids =
        input.categories == null
          ? []
          : Array.isArray(input.categories)
            ? input.categories
            : [input.categories];
      for (const categoryId of ids) {
        await tx.products_categories_lnk.create({
          data: { product_id: productId, category_id: categoryId },
        });
      }
    }
    if (provided("image")) {
      await tx.files_related_mph.deleteMany({
        where: { related_type: RELATED_TYPE, related_id: productId, field: "image" },
      });
      if (input.image) {
        await tx.files_related_mph.create({
          data: {
            file_id: input.image,
            related_id: productId,
            related_type: RELATED_TYPE,
            field: "image",
            order: 1,
          },
        });
      }
    }
    if (provided("images")) {
      await tx.files_related_mph.deleteMany({
        where: { related_type: RELATED_TYPE, related_id: productId, field: "images" },
      });
      for (let i = 0; i < (input.images ?? []).length; i += 1) {
        await tx.files_related_mph.create({
          data: {
            file_id: (input.images ?? [])[i],
            related_id: productId,
            related_type: RELATED_TYPE,
            field: "images",
            order: i + 1,
          },
        });
      }
    }
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /** Marks the product as visible/hidden in the store (all its rows). */
  async setVisible(documentId: string, visible: boolean) {
    const rows = await this.prisma.products.findMany({
      where: { document_id: documentId },
    });
    if (!rows.length) throw new NotFoundException();
    await this.prisma.products.updateMany({
      where: { document_id: documentId },
      data: { visible, updated_at: new Date() },
    });
    return this.serialize({ ...rows[0], visible });
  }

  async serialize(row: {
    id: number;
    document_id: string | null;
    name: string | null;
    price: number | null;
    slug: string | null;
    currency: string | null;
    description: string | null;
    visible: boolean | null;
    discount: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    published_at: Date | null;
  }) {
    const [image, imagesRel, catLnk] = await Promise.all([
      this.mediaService.findRelatedFile(RELATED_TYPE, row.id, "image"),
      this.prisma.files_related_mph.findMany({
        where: { related_type: RELATED_TYPE, related_id: row.id, field: "images" },
        orderBy: { order: "asc" },
        include: { files: true },
      }),
      this.prisma.products_categories_lnk.findMany({
        where: { product_id: row.id },
        orderBy: { id: "asc" },
        include: { categories: true },
      }),
    ]);
    // "New" = created in the last 15 days (by creation date).
    const NEW_WINDOW_MS = 15 * 24 * 60 * 60 * 1000;
    const isNew = row.created_at
      ? Date.now() - row.created_at.getTime() <= NEW_WINDOW_MS
      : false;

    return {
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      price: row.price,
      slug: row.slug,
      currency: row.currency,
      description: row.description,
      visible: row.visible ?? true,
      discount: row.discount ?? null,
      isNew,
      image,
      images: imagesRel
        .filter((r) => r.files)
        .map((r) => this.mediaService.toMediaFile(r.files!)),
      categories: catLnk
        .filter((c) => c.categories)
        .map((c) => ({
          id: c.categories!.id,
          documentId: c.categories!.document_id,
          name: c.categories!.name,
        })),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
    };
  }
}
