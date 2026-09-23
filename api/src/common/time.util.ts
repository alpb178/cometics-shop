/**
 * Time-series helpers in Bolivia local time (America/La_Paz, fixed UTC-4,
 * no daylight saving). Timestamps in the DB are in UTC.
 */

const LA_PAZ_OFFSET_MS = 4 * 60 * 60 * 1000;

/** YYYY-MM-DD date of an instant, as seen from La Paz. */
export function laPazDateKey(instant: Date): string {
  return new Date(instant.getTime() - LA_PAZ_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

/** Today's midnight in La Paz, expressed as a UTC instant. */
export function laPazStartOfToday(): Date {
  const key = laPazDateKey(new Date());
  return new Date(`${key}T00:00:00.000-04:00`);
}

/** Full series of the last `days` days (missing ones filled with 0). */
export function fillDailySeries(
  counts: Map<string, number>,
  days: number,
): { date: string; count: number }[] {
  const out: { date: string; count: number }[] = [];
  const todayKey = laPazDateKey(new Date());
  const today = new Date(`${todayKey}T00:00:00.000Z`);
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return out;
}

/** Full 24-hour series (missing hours filled with 0). */
export function fillHourlySeries(
  counts: Map<number, number>,
): { hour: number; count: number }[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: counts.get(hour) ?? 0,
  }));
}
