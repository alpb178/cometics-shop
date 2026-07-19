import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateDocumentId } from "../common/strapi.util";
import { PrismaService } from "../prisma/prisma.service";

export const ALLOWED_EVENT_TYPES = [
  "product_view",
  "add_to_cart",
  "cart_view",
] as const;

/** Mismas reglas de clasificación de fuentes que el servicio original. */
const SOURCE_RULES: { label: string; match: RegExp }[] = [
  { label: "Google", match: /(^|\.)google\./ },
  { label: "Instagram", match: /(^|\.)instagram\.com$/ },
  { label: "Facebook", match: /(^|\.)(facebook\.com|fb\.com|m\.facebook\.com)$/ },
  { label: "WhatsApp", match: /(^|\.)(whatsapp\.com|wa\.me|l\.wa\.me)$/ },
  { label: "TikTok", match: /(^|\.)tiktok\.com$/ },
  { label: "YouTube", match: /(^|\.)(youtube\.com|youtu\.be)$/ },
  { label: "X (Twitter)", match: /(^|\.)(twitter\.com|t\.co|x\.com)$/ },
  { label: "Bing", match: /(^|\.)bing\.com$/ },
  { label: "LinkedIn", match: /(^|\.)linkedin\.com$/ },
];

export function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function toQuantity(value: unknown): number | undefined {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.min(Math.floor(n), 9999);
}

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private storefrontHost(): string {
    return (this.config.get<string>("CLIENT_URL") ?? "")
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .toLowerCase();
  }

  async trackVisit(input: {
    path: string;
    referrer?: string;
    sessionId?: string;
    userAgent?: string;
  }) {
    const now = new Date();
    await this.prisma.page_visits.create({
      data: {
        document_id: generateDocumentId(),
        path: input.path,
        referrer: input.referrer,
        session_id: input.sessionId,
        user_agent: input.userAgent,
        created_at: now,
        updated_at: now,
        published_at: now,
      },
    });
  }

  async trackEvent(input: {
    type: string;
    label?: string;
    productSlug?: string;
    quantity?: number;
    path?: string;
    sessionId?: string;
  }) {
    const now = new Date();
    await this.prisma.store_events.create({
      data: {
        document_id: generateDocumentId(),
        type: input.type,
        label: input.label,
        product_slug: input.productSlug,
        quantity: input.quantity,
        path: input.path,
        session_id: input.sessionId,
        created_at: now,
        updated_at: now,
        published_at: now,
      },
    });
  }

  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const [total, today, last7Days] = await Promise.all([
      this.prisma.page_visits.count(),
      this.prisma.page_visits.count({
        where: { created_at: { gte: startOfToday } },
      }),
      this.prisma.page_visits.count({
        where: { created_at: { gte: sevenDaysAgo } },
      }),
    ]);
    return { total, today, last7Days };
  }

  async getTopPaths(opts: { limit: number; days: number }) {
    const since = new Date(Date.now() - opts.days * 86400000);
    const rows = await this.prisma.page_visits.groupBy({
      by: ["path"],
      _count: { _all: true },
      where: { created_at: { gte: since } },
      orderBy: { _count: { path: "desc" } },
      take: opts.limit,
    });
    return rows.map((r) => ({ path: r.path, count: r._count._all }));
  }

  async getTopSources(opts: { days: number }) {
    const since = new Date(Date.now() - opts.days * 86400000);
    const rows = await this.prisma.page_visits.groupBy({
      by: ["referrer"],
      _count: { _all: true },
      where: { created_at: { gte: since } },
    });
    const acc = new Map<string, number>();
    for (const row of rows) {
      const source = this.normalizeSource(row.referrer);
      acc.set(source, (acc.get(source) ?? 0) + row._count._all);
    }
    return [...acc.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getRecentEvents(opts: { limit: number; type?: string }) {
    const rows = await this.prisma.store_events.findMany({
      where: opts.type ? { type: opts.type } : {},
      orderBy: { created_at: "desc" },
      take: opts.limit,
    });
    return rows.map((r) => ({
      id: r.id,
      documentId: r.document_id,
      type: r.type,
      label: r.label,
      productSlug: r.product_slug,
      quantity: r.quantity,
      path: r.path,
      sessionId: r.session_id,
      createdAt: r.created_at,
    }));
  }

  normalizeSource(referrer: string | null): string {
    const raw = (referrer ?? "").trim();
    if (!raw) return "Directo";
    let host: string;
    try {
      host = new URL(raw).hostname.toLowerCase();
    } catch {
      return "Directo";
    }
    if (host === this.storefrontHost()) return "Directo";
    const rule = SOURCE_RULES.find((r) => r.match.test(host));
    return rule ? rule.label : host.replace(/^www\./, "");
  }
}
