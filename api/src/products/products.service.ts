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
}

type Tx = Parameters<Parameters<PrismaService["$transaction"]>[0]>[0];

/**
 * Products es draft & publish (como en Strapi v5): cada documento tiene una
 * fila borrador (published_at null) y opcionalmente una publicada, ambas con
 * el mismo document_id. El backoffice edita el borrador y publica; el front
 * solo ve filas publicadas.
 */
@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async findMany(opts: { status: "draft" | "published"; slug?: string; pageSize: number }) {
    const where = {
      published_at: opts.status === "draft" ? null : { not: null as never },
      // La tienda (status published) solo ve los productos marcados como
      // visibles; el backoffice (status draft) los ve todos. `not: false`
      // también deja pasar los `visible = null` heredados.
      ...(opts.status === "published" ? { visible: { not: false } } : {}),
      ...(opts.slug ? { slug: opts.slug } : {}),
    };
    const [rows, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: opts.pageSize,
      }),
      this.prisma.products.count({ where }),
    ]);
    const data = await Promise.all(rows.map((r) => this.serialize(r)));
    return {
      data,
      meta: {
        pagination: {
          page: 1,
          pageSize: opts.pageSize,
          pageCount: Math.max(1, Math.ceil(total / opts.pageSize)),
          total,
        },
      },
    };
  }

  async findByDocumentId(documentId: string, status: "draft" | "published") {
    const row = await this.getRow(documentId, status);
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
          created_at: now,
          updated_at: now,
          published_at: null, // se crea como borrador, como Strapi v5
        },
      });
      await this.applyRelations(tx, created.id, input);
      return created;
    });
    return this.serialize(row);
  }

  async update(documentId: string, input: ProductInput) {
    const draft = await this.getRow(documentId, "draft");
    const target = draft ?? (await this.getRow(documentId, "published"));
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
          updated_at: new Date(),
        },
      });
      await this.applyRelations(tx, target.id, input, { onlyProvided: true });
      // `visible` se propaga a TODAS las filas del documento (borrador y
      // publicada) para que la tienda y el backoffice queden consistentes.
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

  /** Publica el borrador: clona la fila (y sus relaciones) como versión publicada. */
  async publish(documentId: string) {
    const draft = await this.getRow(documentId, "draft");
    if (!draft) throw new NotFoundException();
    const now = new Date();
    const published = await this.prisma.$transaction(async (tx) => {
      await this.deletePublishedRows(tx, documentId);
      const clone = await tx.products.create({
        data: {
          document_id: draft.document_id,
          name: draft.name,
          price: draft.price,
          currency: draft.currency,
          description: draft.description,
          slug: draft.slug,
          visible: draft.visible,
          locale: draft.locale,
          created_at: draft.created_at,
          updated_at: now,
          published_at: now,
        },
      });
      await this.copyRelations(tx, draft.id, clone.id);
      return clone;
    });
    return this.serialize(published);
  }

  async unpublish(documentId: string) {
    const draft = await this.getRow(documentId, "draft");
    if (!draft) throw new NotFoundException();
    await this.prisma.$transaction(async (tx) => {
      await this.deletePublishedRows(tx, documentId);
    });
    return this.serialize(draft);
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
      await tx.products.deleteMany({ where: { id: { in: ids } } }); // cascada lnk
    });
    return serialized;
  }

  private async getRow(documentId: string, status: "draft" | "published") {
    return this.prisma.products.findFirst({
      where: {
        document_id: documentId,
        published_at: status === "draft" ? null : { not: null },
      },
    });
  }

  private async deletePublishedRows(tx: Tx, documentId: string) {
    const olds = await tx.products.findMany({
      where: { document_id: documentId, published_at: { not: null } },
      select: { id: true },
    });
    const ids = olds.map((o) => o.id);
    if (!ids.length) return;
    await tx.files_related_mph.deleteMany({
      where: { related_type: RELATED_TYPE, related_id: { in: ids } },
    });
    await tx.products.deleteMany({ where: { id: { in: ids } } });
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

  private async copyRelations(tx: Tx, fromId: number, toId: number) {
    const [cats, media] = await Promise.all([
      tx.products_categories_lnk.findMany({ where: { product_id: fromId } }),
      tx.files_related_mph.findMany({
        where: { related_type: RELATED_TYPE, related_id: fromId },
      }),
    ]);
    for (const c of cats) {
      await tx.products_categories_lnk.create({
        data: { product_id: toId, category_id: c.category_id },
      });
    }
    for (const m of media) {
      await tx.files_related_mph.create({
        data: {
          file_id: m.file_id,
          related_id: toId,
          related_type: RELATED_TYPE,
          field: m.field,
          order: m.order,
        },
      });
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

  /** Marca el producto como visible/oculto en la tienda (todas sus filas). */
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
    return {
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      price: row.price,
      slug: row.slug,
      currency: row.currency,
      description: row.description,
      visible: row.visible ?? true,
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
