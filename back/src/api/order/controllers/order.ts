/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import { isStaffUser } from "../../../utils/staff";

const ALLOWED_STATUSES = [
  "pending_verification",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
] as const;

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      const data = ctx.request.body?.data || {};
      // Recalcula items/subtotal/total con el precio real del catálogo.
      // Nunca se confía en los importes que envía el cliente.
      const pricing = await (
        strapi.service("api::order.order") as {
          buildVerifiedOrderData: (
            items: unknown,
            opts?: {
              deliveryMethod?: string;
              lat?: unknown;
              lng?: unknown;
              clientIsProvince?: unknown;
            }
          ) => Promise<{
            items: unknown[];
            subtotal: number;
            shippingCost: number;
            total: number;
          }>;
        }
      ).buildVerifiedOrderData(data.items, {
        deliveryMethod: data.deliveryMethod,
        lat: data.destLat,
        lng: data.destLng,
        clientIsProvince: data.isProvince
      });
      // La relación `user` no se puede fijar en el body vía content-API (Strapi
      // v5 la rechaza: "Invalid key user"). Se crea con el Document Service
      // asignando el dueño server-side. Se toman solo campos permitidos del
      // cliente; los importes vienen de `pricing` (verificados), y el estado y
      // el usuario se fijan aquí. `destLat`/`destLng`/`isProvince` son entradas
      // de cálculo (no atributos), así que no se persisten.
      const ALLOWED = [
        "shippingAddress",
        "deliveryMethod",
        "paymentMethod",
        "paymentProof",
        "customerNotes",
        "paymentReference",
      ];
      const clean: Record<string, unknown> = {};
      for (const key of ALLOWED) if (key in data) clean[key] = data[key];

      const entity = await strapi.documents("api::order.order").create({
        data: {
          ...clean,
          ...pricing,
          user: user.id,
          status: "pending_verification",
        },
      });
      const sanitized = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitized);
    },

    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      if (!isStaffUser(user)) {
        ctx.query.filters = {
          ...(ctx.query.filters || {}),
          user: user.id
        };
      }
      return await super.find(ctx);
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      if (isStaffUser(user)) {
        return await super.findOne(ctx);
      }
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne(
        "api::order.order",
        id,
        { populate: { user: true } }
      );
      if (!entity || (entity as any).user?.id !== user.id) {
        return ctx.notFound();
      }
      return await super.findOne(ctx);
    },

    async update(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      if (!isStaffUser(user)) return ctx.forbidden();

      const data = ctx.request.body?.data || {};
      const allowedKeys = ["status", "customerNotes", "cancellationReason"];
      const sanitized: Record<string, unknown> = {};
      for (const key of allowedKeys) {
        if (key in data) sanitized[key] = data[key];
      }
      if (
        sanitized.status &&
        !ALLOWED_STATUSES.includes(sanitized.status as never)
      ) {
        return ctx.badRequest("Invalid status");
      }
      ctx.request.body.data = sanitized;
      return await super.update(ctx);
    },

    async delete(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      if (!isStaffUser(user)) return ctx.forbidden();
      return await super.delete(ctx);
    }
  })
);
