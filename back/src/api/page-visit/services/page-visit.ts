/**
 * page-visit service
 */

import { factories } from "@strapi/strapi";

const UID = "api::page-visit.page-visit";

export default factories.createCoreService(UID, ({ strapi }) => ({
  /** Devuelve el conteo total, de hoy y de los últimos 7 días. */
  async getStats(): Promise<{
    total: number;
    today: number;
    last7Days: number;
  }> {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();

    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const [total, today, last7Days] = await Promise.all([
      strapi.db.query(UID).count(),
      strapi.db.query(UID).count({ where: { createdAt: { $gte: startOfToday } } }),
      strapi.db.query(UID).count({ where: { createdAt: { $gte: sevenDaysAgo } } }),
    ]);

    return { total, today, last7Days };
  },

  /** Páginas más visitadas en los últimos `days` días. */
  async getTopPaths(
    { limit = 10, days = 30 }: { limit?: number; days?: number } = {},
  ): Promise<Array<{ path: string; count: number }>> {
    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    ).toISOString();

    const rows = await strapi.db
      .connection("page_visits")
      .select("path")
      .count("* as count")
      .where("created_at", ">=", since)
      .groupBy("path")
      .orderBy("count", "desc")
      .limit(limit);

    return (rows as Array<{ path: string; count: number | string }>).map(
      (r) => ({ path: r.path, count: Number(r.count) }),
    );
  },
}));
