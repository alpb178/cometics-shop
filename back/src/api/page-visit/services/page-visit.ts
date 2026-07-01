/**
 * page-visit service
 */

import { factories } from "@strapi/strapi";

const UID = "api::page-visit.page-visit";

// El host del propio storefront: un referrer con este host es navegación
// interna, no una fuente externa. Se puede ajustar con STOREFRONT_HOST.
const STOREFRONT_HOST = (process.env.CLIENT_URL || "")
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "")
  .toLowerCase();

// Mapea un host de referrer a una etiqueta de fuente legible.
const SOURCE_RULES: Array<{ label: string; match: RegExp }> = [
  { label: "Google", match: /(^|\.)google\./ },
  { label: "Instagram", match: /(^|\.)instagram\.com$/ },
  { label: "Facebook", match: /(^|\.)(facebook\.com|fb\.com|m\.facebook\.com)$/ },
  { label: "WhatsApp", match: /(^|\.)(whatsapp\.com|wa\.me|l\.wa\.me)$/ },
  { label: "TikTok", match: /(^|\.)tiktok\.com$/ },
  { label: "YouTube", match: /(^|\.)(youtube\.com|youtu\.be)$/ },
  { label: "X / Twitter", match: /(^|\.)(twitter\.com|t\.co|x\.com)$/ },
  { label: "Bing", match: /(^|\.)bing\.com$/ },
  { label: "LinkedIn", match: /(^|\.)linkedin\.com$/ },
];

/** Normaliza un referrer crudo a una etiqueta de fuente. */
function normalizeSource(referrer: string | null | undefined): string {
  const raw = (referrer || "").trim();
  if (!raw) return "Directo";

  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    // Referrer no parseable como URL: lo tratamos como directo.
    return "Directo";
  }

  if (STOREFRONT_HOST && host === STOREFRONT_HOST) return "Directo";

  for (const rule of SOURCE_RULES) {
    if (rule.match.test(host)) return rule.label;
  }

  // Fuente externa no catalogada: usamos el dominio sin "www.".
  return host.replace(/^www\./, "");
}

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

  /**
   * Origen del tráfico agrupado por FUENTE en los últimos `days` días. El
   * referrer crudo se normaliza a una etiqueta legible (Directo, Google,
   * Instagram, …). La agregación por fuente se hace en JS porque depende de
   * parsear el host del referrer (difícil/portable en SQL puro).
   */
  async getTopSources(
    { days = 30 }: { days?: number } = {},
  ): Promise<Array<{ source: string; count: number }>> {
    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    ).toISOString();

    const rows = (await strapi.db
      .connection("page_visits")
      .select("referrer")
      .count("* as count")
      .where("created_at", ">=", since)
      .groupBy("referrer")) as Array<{
      referrer: string | null;
      count: number | string;
    }>;

    const totals = new Map<string, number>();
    for (const r of rows) {
      const source = normalizeSource(r.referrer);
      totals.set(source, (totals.get(source) || 0) + Number(r.count));
    }

    return [...totals.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
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
