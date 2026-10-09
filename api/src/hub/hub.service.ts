import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { round2 } from "../common/strapi.util";
import { laPazDateKey } from "../common/time.util";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Pushes the business metrics the hub can't see on its own: the storefront's
 * live beacon (`web/lib/hub-tracker`) already reports traffic (`visits`,
 * `page_views`) straight to `/api/ingest/events`. This service must never
 * declare those keys — a metrics push only clears the keys it declares, but
 * duplicating traffic here would still produce two sources of truth for it.
 */

const PROJECT = "iris-natural";
const TIMEZONE = "America/La_Paz";

/**
 * Statuses that mean the payment was actually verified, as opposed to
 * `pending_verification` (screenshot uploaded, not yet checked by staff) or
 * `cancelled`. See `src/orders/order.dto.ts` for the full status list.
 */
const PAID_STATUSES = new Set(["confirmed", "shipped", "delivered"]);

/**
 * Always resend the last few days, not just yesterday: an order confirmed or
 * cancelled days after it was placed changes that day's aggregate, and the
 * hub replaces the whole declared window with each push.
 */
const RESEND_DAYS = 3;

interface OrderDayRow {
  day: string;
  status: string | null;
  count: number;
  revenue: number | null;
}

interface SignupDayRow {
  day: string;
  provider: string | null;
  count: number;
}

interface UsersTotalDayRow {
  day: string;
  total: number;
}

interface DayBucket {
  orders: number;
  orders_paid: number;
  revenue: number;
  signups: number;
  users_total: number;
  statusBreakdown: Record<string, number>;
  signupBreakdown: Record<string, number>;
}

@Injectable()
export class HubService {
  private readonly logger = new Logger(HubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Early morning, once the previous day is closed. */
  @Cron("0 30 4 * * *", { timeZone: TIMEZONE, name: "hub-push" })
  async push(): Promise<void> {
    const url = this.config.get<string>("HUB_URL");
    const key = this.config.get<string>("HUB_API_KEY");
    // Unconfigured means no-op: a development environment has no reason to
    // push anything to the hub.
    if (!url || !key) return;

    const to = laPazDateKey(new Date(Date.now() - 86_400_000));
    const from = laPazDateKey(new Date(Date.now() - RESEND_DAYS * 86_400_000));

    try {
      const payload = await this.buildPayload(from, to);

      const response = await fetch(`${url}/api/ingest/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": key },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
      }

      const result = (await response.json()) as {
        rowsWritten: number;
        warnings: string[];
      };
      this.logger.log(`Sent ${from}…${to}: ${result.rowsWritten} rows`);
      for (const warning of result.warnings) this.logger.warn(warning);
    } catch (error) {
      // Never rethrown: the hub being down can't take down this project's own
      // scheduler. The hub detects the silence on its own (freshness check).
      this.logger.error(`Failed to push to hub: ${(error as Error).message}`);
    }
  }

  /** Builds the `/api/ingest/metrics` payload for the closed days in [from, to]. */
  async buildPayload(from: string, to: string) {
    const [orderRows, signupRows, usersTotalRows] = await Promise.all([
      this.ordersByDay(from, to),
      this.signupsByDay(from, to),
      this.usersTotalByDay(from, to),
    ]);

    const days = new Map<string, DayBucket>();
    const bucketOf = (day: string): DayBucket => {
      let bucket = days.get(day);
      if (!bucket) {
        bucket = {
          orders: 0,
          orders_paid: 0,
          revenue: 0,
          signups: 0,
          users_total: 0,
          statusBreakdown: {},
          signupBreakdown: {},
        };
        days.set(day, bucket);
      }
      return bucket;
    };

    for (const row of orderRows) {
      const status = row.status ?? "unknown";
      const bucket = bucketOf(row.day);
      bucket.orders += row.count;
      bucket.statusBreakdown[status] = (bucket.statusBreakdown[status] ?? 0) + row.count;
      if (PAID_STATUSES.has(status)) {
        bucket.orders_paid += row.count;
        bucket.revenue += row.revenue ?? 0;
      }
    }

    for (const row of signupRows) {
      const method = this.signupMethod(row.provider);
      const bucket = bucketOf(row.day);
      bucket.signups += row.count;
      bucket.signupBreakdown[method] = (bucket.signupBreakdown[method] ?? 0) + row.count;
    }

    // `users_total` is a point-in-time snapshot, not a daily aggregate: every
    // day in the declared window gets its own cumulative count, independent
    // of whether that day had any orders or signups of its own.
    for (const row of usersTotalRows) {
      bucketOf(row.day).users_total = row.total;
    }

    const sortedDates = [...days.keys()].sort((a, b) => a.localeCompare(b));

    return {
      schemaVersion: 1,
      project: PROJECT,
      timezone: TIMEZONE,
      generatedAt: new Date().toISOString(),
      // `range` rules: the hub replaces exactly this period.
      range: { from, to },
      definitions: [
        { key: "orders", label: "Pedidos", unit: "count" as const },
        { key: "orders_paid", label: "Pedidos pagados", unit: "count" as const },
        {
          key: "revenue",
          label: "Ingresos",
          unit: "currency" as const,
          currency: "BOB",
        },
        { key: "signups", label: "Altas", unit: "count" as const },
        {
          key: "users_total",
          label: "Usuarios registrados",
          unit: "count" as const,
          aggregation: "last" as const,
        },
      ],
      days: sortedDates.map((date) => {
        const bucket = days.get(date)!;
        return {
          date,
          metrics: {
            orders: bucket.orders,
            orders_paid: bucket.orders_paid,
            revenue: round2(bucket.revenue),
            signups: bucket.signups,
            users_total: bucket.users_total,
          },
          breakdowns: [
            {
              metric: "orders",
              dimension: "status",
              values: bucket.statusBreakdown,
            },
            {
              metric: "signups",
              dimension: "signup_method",
              values: bucket.signupBreakdown,
            },
          ],
        };
      }),
    };
  }

  /**
   * `up_users.provider` carries the raw users-permissions value. Relabeled to
   * something meaningful on the hub panel, same spirit as
   * `TrackingService.normalizeSource`. Never a personal identifier — only the
   * signup method.
   */
  private signupMethod(provider: string | null): string {
    if (provider === "local") return "email";
    if (provider === "google") return "google";
    return "unknown";
  }

  /**
   * Daily order count/revenue by status, local day (La Paz). The cut is done
   * by Postgres, not JavaScript, so it doesn't depend on the process's own
   * timezone and we don't have to pull every row to bucket it.
   */
  private ordersByDay(from: string, to: string): Promise<OrderDayRow[]> {
    return this.prisma.$queryRaw<OrderDayRow[]>`
      SELECT to_char((created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/La_Paz')::date, 'YYYY-MM-DD') AS day,
             status,
             count(*)::int AS count,
             coalesce(sum(total), 0)::float AS revenue
        FROM orders
       WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/La_Paz')::date
             BETWEEN ${from}::date AND ${to}::date
       GROUP BY 1, 2
       ORDER BY 1`;
  }

  /** Daily signups by provider, local day (La Paz). Same cut rule as orders. */
  private signupsByDay(from: string, to: string): Promise<SignupDayRow[]> {
    return this.prisma.$queryRaw<SignupDayRow[]>`
      SELECT to_char((created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/La_Paz')::date, 'YYYY-MM-DD') AS day,
             provider,
             count(*)::int AS count
        FROM up_users
       WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/La_Paz')::date
             BETWEEN ${from}::date AND ${to}::date
       GROUP BY 1, 2
       ORDER BY 1`;
  }

  /**
   * Cumulative registered-user count as of each day in [from, to] — a
   * point-in-time snapshot, not a daily aggregate (CONTRATO.md rule 3: the
   * explicit `aggregation: "last"` exception). The window is only a handful
   * of days, so a correlated subquery per day is cheap and keeps the cut
   * consistent with the other queries here (`AT TIME ZONE`, local day).
   */
  private usersTotalByDay(from: string, to: string): Promise<UsersTotalDayRow[]> {
    return this.prisma.$queryRaw<UsersTotalDayRow[]>`
      SELECT gs.day::date::text AS day,
             (SELECT count(*)::int
                FROM up_users u
               WHERE (u.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/La_Paz')::date <= gs.day)
             AS total
        FROM generate_series(${from}::date, ${to}::date, '1 day') AS gs(day)
       ORDER BY 1`;
  }
}
