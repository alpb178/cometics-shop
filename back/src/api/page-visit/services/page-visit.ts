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
}));
