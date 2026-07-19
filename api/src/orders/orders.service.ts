import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AddressesService } from "../addresses/addresses.service";
import { AuthenticatedUser, isStaffUser } from "../common/staff.util";
import {
  generateDocumentId,
  generateOrderNumber,
  isNumericId,
  round2,
  toNumber,
} from "../common/strapi.util";
import { fillDailySeries } from "../common/time.util";
import { MediaService } from "../media/media.service";
import { PricingService } from "../pricing/pricing.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto, OrderItemInputDto, UpdateOrderDto } from "./order.dto";

const ORDER_RELATED_TYPE = "api::order.order";

interface VerifiedItem {
  productId: number;
  name: string | null;
  slug: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
    private readonly mediaService: MediaService,
    private readonly addressesService: AddressesService,
  ) {}

  /**
   * Réplica de buildVerifiedOrderData del servicio de Strapi: nunca se confía
   * en los importes del cliente; precios desde BD (solo productos publicados)
   * con markup, envío por Haversine con fallback al flag del cliente.
   */
  async buildVerifiedOrderData(
    rawItems: OrderItemInputDto[],
    opts: {
      deliveryMethod: string;
      lat?: number | null;
      lng?: number | null;
      clientIsProvince?: boolean;
    },
  ) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new BadRequestException("El pedido no tiene items");
    }
    const ids = [
      ...new Set(
        rawItems
          .map((i) => Number(i.productId))
          .filter((n) => Number.isInteger(n) && n > 0),
      ),
    ];
    const [products, settings] = await Promise.all([
      this.prisma.products.findMany({
        where: { id: { in: ids }, published_at: { not: null } },
        select: { id: true, name: true, slug: true, price: true },
      }),
      this.pricingService.getSettings(),
    ]);
    const byId = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const items: VerifiedItem[] = rawItems.map((raw) => {
      const product = byId.get(Number(raw.productId));
      if (!product) throw new BadRequestException("Producto no disponible");
      const quantity = Number(raw.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new BadRequestException("Cantidad inválida");
      }
      const price = this.pricingService.applyMarkup(
        toNumber(product.price) ?? 0,
        settings,
      );
      subtotal += price * quantity;
      return {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price,
        quantity,
        imageUrl: raw.imageUrl ?? null,
      };
    });
    subtotal = round2(subtotal);

    let shippingCost = 0;
    if (opts.deliveryMethod === "delivery") {
      const province =
        this.pricingService.isProvince(settings, opts.lat, opts.lng) ??
        opts.clientIsProvince === true;
      if (province) shippingCost = round2(settings.provinceShippingCost);
    }
    return {
      items,
      subtotal,
      shippingCost,
      total: round2(subtotal + shippingCost),
    };
  }

  async create(user: AuthenticatedUser, dto: CreateOrderDto) {
    const verified = await this.buildVerifiedOrderData(dto.items, {
      deliveryMethod: dto.deliveryMethod,
      lat: dto.destLat,
      lng: dto.destLng,
      clientIsProvince: dto.isProvince,
    });

    // A diferencia de Strapi, verificamos que la dirección sea del usuario
    // (evita enlazar y leer direcciones ajenas vía populate)
    if (dto.shippingAddress) {
      await this.addressesService
        .findOwnedOrThrow(dto.shippingAddress, user.id)
        .catch(() => {
          throw new BadRequestException("Dirección no válida");
        });
    }

    const now = new Date();
    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.orders.create({
        data: {
          document_id: generateDocumentId(),
          order_number: generateOrderNumber(),
          delivery_method: dto.deliveryMethod,
          payment_method: dto.paymentMethod,
          subtotal: verified.subtotal,
          shipping_cost: verified.shippingCost,
          total: verified.total,
          status: "pending_verification",
          customer_notes: dto.customerNotes,
          payment_reference: dto.paymentReference,
          dest_lat: toNumber(dto.destLat),
          dest_lng: toNumber(dto.destLng),
          created_at: now,
          updated_at: now,
          published_at: now,
        },
      });
      for (let i = 0; i < verified.items.length; i += 1) {
        const item = verified.items[i];
        const cmp = await tx.components_order_items.create({
          data: {
            product_id: item.productId,
            name: item.name,
            slug: item.slug,
            price: item.price,
            quantity: item.quantity,
            image_url: item.imageUrl,
          },
        });
        await tx.orders_cmps.create({
          data: {
            entity_id: created.id,
            cmp_id: cmp.id,
            component_type: "order.item",
            field: "items",
            order: i + 1,
          },
        });
      }
      await tx.orders_user_lnk.create({
        data: { order_id: created.id, user_id: user.id, order_ord: 1 },
      });
      if (dto.shippingAddress) {
        await tx.orders_shipping_address_lnk.create({
          data: { order_id: created.id, address_id: dto.shippingAddress },
        });
      }
      if (dto.paymentProof) {
        await tx.files_related_mph.create({
          data: {
            file_id: dto.paymentProof,
            related_id: created.id,
            related_type: ORDER_RELATED_TYPE,
            field: "paymentProof",
            order: 1,
          },
        });
      }
      return created;
    });
    return this.serializeById(order.id);
  }

  /** KPIs de pedidos para el dashboard del backoffice (solo staff). */
  async getStats(days: number) {
    const since = new Date(Date.now() - days * 86400000);
    const [total, pending, rows] = await Promise.all([
      this.prisma.orders.count(),
      this.prisma.orders.count({ where: { status: "pending_verification" } }),
      this.prisma.$queryRaw<
        { day: Date; count: number; revenue: number | null }[]
      >`
        SELECT (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/La_Paz')::date AS day,
               count(*)::int AS count,
               coalesce(sum(total), 0)::float AS revenue
        FROM orders
        WHERE created_at >= ${since} AND status IS DISTINCT FROM 'cancelled'
        GROUP BY 1
        ORDER BY 1`,
    ]);
    const revenueByDay = new Map(
      rows.map((r) => [r.day.toISOString().slice(0, 10), r.revenue ?? 0]),
    );
    const byDay = fillDailySeries(
      new Map(rows.map((r) => [r.day.toISOString().slice(0, 10), r.count])),
      days,
    ).map((d) => ({
      ...d,
      revenue: round2(revenueByDay.get(d.date) ?? 0),
    }));
    const revenue = round2(byDay.reduce((acc, d) => acc + d.revenue, 0));
    return { total, pending, revenue, days, byDay };
  }

  async findMany(user: AuthenticatedUser, pageSize: number) {
    const where = isStaffUser(user)
      ? {}
      : { orders_user_lnk: { some: { user_id: user.id } } };
    const [rows, total] = await Promise.all([
      this.prisma.orders.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: pageSize,
      }),
      this.prisma.orders.count({ where }),
    ]);
    const data = await Promise.all(rows.map((r) => this.serialize(r)));
    return {
      data,
      meta: {
        pagination: {
          page: 1,
          pageSize,
          pageCount: Math.max(1, Math.ceil(total / pageSize)),
          total,
        },
      },
    };
  }

  /** Acepta id numérico (front) o documentId (backoffice), como el controller original. */
  async findOneOrThrow(idOrDocumentId: string, user: AuthenticatedUser) {
    const where = isNumericId(idOrDocumentId)
      ? { id: Number(idOrDocumentId) }
      : { document_id: idOrDocumentId };
    const row = await this.prisma.orders.findFirst({ where });
    if (!row) throw new NotFoundException();
    if (!isStaffUser(user)) {
      const owned = await this.prisma.orders_user_lnk.findFirst({
        where: { order_id: row.id, user_id: user.id },
      });
      // 404 y no 403, para no revelar existencia de pedidos ajenos
      if (!owned) throw new NotFoundException();
    }
    return row;
  }

  async update(idOrDocumentId: string, user: AuthenticatedUser, dto: UpdateOrderDto) {
    const row = await this.findOneOrThrow(idOrDocumentId, user);
    const updated = await this.prisma.orders.update({
      where: { id: row.id },
      data: {
        status: dto.status,
        customer_notes: dto.customerNotes,
        cancellation_reason: dto.cancellationReason,
        updated_at: new Date(),
      },
    });
    return this.serialize(updated);
  }

  async delete(idOrDocumentId: string, user: AuthenticatedUser) {
    const row = await this.findOneOrThrow(idOrDocumentId, user);
    const serialized = await this.serialize(row);
    await this.prisma.$transaction(async (tx) => {
      // Los componentes no tienen FK en cascada: borrarlos explícitamente
      const cmps = await tx.orders_cmps.findMany({
        where: { entity_id: row.id, field: "items" },
        select: { cmp_id: true },
      });
      const cmpIds = cmps.map((c) => c.cmp_id).filter((id): id is number => !!id);
      if (cmpIds.length) {
        await tx.components_order_items.deleteMany({
          where: { id: { in: cmpIds } },
        });
      }
      await tx.files_related_mph.deleteMany({
        where: { related_type: ORDER_RELATED_TYPE, related_id: row.id },
      });
      await tx.orders.delete({ where: { id: row.id } }); // cascada: cmps + lnk
    });
    return serialized;
  }

  async serializeById(id: number) {
    const row = await this.prisma.orders.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    return this.serialize(row);
  }

  private async serialize(row: {
    id: number;
    document_id: string | null;
    order_number: string | null;
    delivery_method: string | null;
    payment_method: string | null;
    subtotal: unknown;
    shipping_cost: unknown;
    total: unknown;
    status: string | null;
    customer_notes: string | null;
    payment_reference: string | null;
    cancellation_reason: string | null;
    dest_lat: unknown;
    dest_lng: unknown;
    created_at: Date | null;
    updated_at: Date | null;
  }) {
    const [cmps, addressLnk, userLnk, paymentProof] = await Promise.all([
      this.prisma.orders_cmps.findMany({
        where: { entity_id: row.id, field: "items" },
        orderBy: { order: "asc" },
      }),
      this.prisma.orders_shipping_address_lnk.findFirst({
        where: { order_id: row.id },
        include: { addresses: true },
      }),
      this.prisma.orders_user_lnk.findFirst({
        where: { order_id: row.id },
        include: { up_users: true },
      }),
      this.mediaService.findRelatedFile(ORDER_RELATED_TYPE, row.id, "paymentProof"),
    ]);
    const cmpIds = cmps.map((c) => c.cmp_id).filter((id): id is number => !!id);
    const itemRows = cmpIds.length
      ? await this.prisma.components_order_items.findMany({
          where: { id: { in: cmpIds } },
        })
      : [];
    const itemsById = new Map(itemRows.map((i) => [i.id, i]));
    const items = cmpIds
      .map((id) => itemsById.get(id))
      .filter((i): i is NonNullable<typeof i> => !!i)
      .map((i) => ({
        id: i.id,
        productId: i.product_id,
        name: i.name,
        slug: i.slug,
        price: toNumber(i.price),
        quantity: i.quantity,
        imageUrl: i.image_url,
      }));

    return {
      id: row.id,
      documentId: row.document_id,
      orderNumber: row.order_number,
      deliveryMethod: row.delivery_method,
      paymentMethod: row.payment_method,
      subtotal: toNumber(row.subtotal),
      shippingCost: toNumber(row.shipping_cost),
      total: toNumber(row.total),
      status: row.status,
      customerNotes: row.customer_notes,
      paymentReference: row.payment_reference,
      cancellationReason: row.cancellation_reason,
      destLat: toNumber(row.dest_lat),
      destLng: toNumber(row.dest_lng),
      items,
      shippingAddress: addressLnk?.addresses
        ? this.addressesService.serialize(addressLnk.addresses)
        : null,
      paymentProof,
      user: userLnk?.up_users
        ? {
            id: userLnk.up_users.id,
            username: userLnk.up_users.username,
            email: userLnk.up_users.email,
          }
        : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
