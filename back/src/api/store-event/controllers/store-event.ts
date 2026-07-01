/**
 * store-event controller
 */

import { factories } from "@strapi/strapi";
import { ensureStaff } from "../../../utils/staff";

const UID = "api::store-event.store-event";

const ALLOWED_TYPES = ["product_view", "add_to_cart", "cart_view"] as const;
type EventType = (typeof ALLOWED_TYPES)[number];

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function toQuantity(value: unknown): number | undefined {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.min(Math.floor(n), 9999);
}

export default factories.createCoreController(UID, ({ strapi }) => ({
  /**
   * Registra una interacción. Endpoint público (auth:false) usado por el
   * storefront. No confía en el cliente: valida el tipo y acota los campos.
   */
  async track(ctx) {
    const body = (ctx.request.body || {}) as Record<string, unknown>;

    const type = clip(body.type, 32) as EventType | undefined;
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return ctx.badRequest("invalid event type");
    }

    await strapi.db.query(UID).create({
      data: {
        type,
        label: clip(body.label, 255),
        productSlug: clip(body.productSlug, 255),
        quantity: toQuantity(body.quantity),
        path: clip(body.path, 512),
        sessionId: clip(body.sessionId, 128),
      },
    });

    ctx.status = 204;
  },

  /** Últimas interacciones para la tabla del backoffice. Solo staff. */
  async recent(ctx) {
    if (!ensureStaff(ctx)) return;
    const limit = Math.min(Number(ctx.query.limit) || 100, 500);
    const type = clip(ctx.query.type, 32);
    const where =
      type && ALLOWED_TYPES.includes(type as EventType) ? { type } : {};

    const data = await strapi.db.query(UID).findMany({
      where,
      orderBy: { createdAt: "desc" },
      limit,
    });

    ctx.body = { data };
  },
}));
