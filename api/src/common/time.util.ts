/**
 * Utilidades de series temporales en hora local de Bolivia (America/La_Paz,
 * UTC-4 fijo, sin horario de verano). Los timestamps en BD están en UTC.
 */

const LA_PAZ_OFFSET_MS = 4 * 60 * 60 * 1000;

/** Fecha YYYY-MM-DD de un instante, vista desde La Paz. */
export function laPazDateKey(instant: Date): string {
  return new Date(instant.getTime() - LA_PAZ_OFFSET_MS)
    .toISOString()
    .slice(0, 10);
}

/** Medianoche de hoy en La Paz, expresada como instante UTC. */
export function laPazStartOfToday(): Date {
  const key = laPazDateKey(new Date());
  return new Date(`${key}T00:00:00.000-04:00`);
}

/** Serie completa de los últimos `days` días (rellena con 0 los que falten). */
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

/** Serie completa de 24 horas (rellena con 0 las que falten). */
export function fillHourlySeries(
  counts: Map<number, number>,
): { hour: number; count: number }[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: counts.get(hour) ?? 0,
  }));
}
