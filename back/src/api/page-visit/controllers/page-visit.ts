/**
 * page-visit controller
 */

import { factories } from "@strapi/strapi";
import { ensureStaff } from "../../../utils/staff";

const UID = "api::page-visit.page-visit";

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export default factories.createCoreController(UID, ({ strapi }) => ({
  /**
   * Registra una visita. Endpoint público (auth:false) usado por el storefront.
   * No confía en el cliente: solo persiste campos saneados y acotados. El
   * user-agent se toma de la cabecera, no del body.
   */
  async track(ctx) {
    const body = (ctx.request.body || {}) as Record<string, unknown>;

    const path = clip(body.path, 512);
    if (!path) return ctx.badRequest("path is required");

    await strapi.db.query(UID).create({
      data: {
        path,
        referrer: clip(body.referrer, 512),
        sessionId: clip(body.sessionId, 128),
        userAgent: clip(ctx.request.header["user-agent"], 1024),
      },
    });

    ctx.status = 204;
  },

  /** Estadísticas de visitas para el dashboard. Solo staff. */
  async stats(ctx) {
    if (!ensureStaff(ctx)) return;
    const data = await strapi.service(UID).getStats();
    ctx.body = { data };
  },

  /** Páginas más visitadas. Solo staff. */
  async top(ctx) {
    if (!ensureStaff(ctx)) return;
    const days = Number(ctx.query.days) || 30;
    const limit = Math.min(Number(ctx.query.limit) || 10, 50);
    const data = await strapi.service(UID).getTopPaths({ limit, days });
    ctx.body = { data };
  },
}));
