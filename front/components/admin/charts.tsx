"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/admin/admin-utils";
import type { DayPoint, HourPoint } from "@/lib/admin/types";

/**
 * Gráficos propios sin librerías (portados del admin de Tu Chamba):
 * columnas por día, columnas por hora, línea SVG y barras horizontales.
 * Tooltips por hover (CSS) en escritorio; la línea además responde al
 * toque, mostrando la info del día seleccionado.
 */

const DAY_LABEL = new Intl.DateTimeFormat("es-BO", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function dayLabel(date: string): string {
  return DAY_LABEL.format(new Date(`${date}T00:00:00Z`));
}

/** Tarjeta contenedora de un gráfico; con href se vuelve enlace. */
export function ChartCard({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
        {subtitle && <span className="text-xs text-neutral-400">{subtitle}</span>}
      </div>
      {children}
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        {body}
      </Link>
    );
  }
  return <div className="card p-5">{body}</div>;
}

/** Columnas por día con tooltip; etiqueta visible solo en el máximo. */
export function DailyColumns({
  data,
  unit = "visitas",
  colorClass = "bg-brand/80 group-hover:bg-brand",
}: {
  data: DayPoint[];
  unit?: string;
  colorClass?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-36 items-end gap-[3px]">
      {data.map((d) => (
        <div
          key={d.date}
          className="group relative flex h-full flex-1 flex-col justify-end"
        >
          <div
            className={cn("rounded-t transition-colors", colorClass)}
            style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
          />
          <div className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-neutral-800 px-2 py-1 text-xs text-white group-hover:block">
            {dayLabel(d.date)}: {d.count} {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Columnas de 24 horas (eje etiquetado cada 3 h). */
export function HourlyColumns({
  data,
  unit = "visitas",
}: {
  data: HourPoint[];
  unit?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div>
      <div className="flex h-32 items-end gap-[3px]">
        {data.map((d) => (
          <div
            key={d.hour}
            className="group relative flex h-full flex-1 flex-col justify-end"
          >
            <div
              className="rounded-t bg-brand/80 transition-colors group-hover:bg-brand"
              style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
            />
            <div className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-neutral-800 px-2 py-1 text-xs text-white group-hover:block">
              {String(d.hour).padStart(2, "0")}:00 · {d.count} {unit}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h}>{String(h).padStart(2, "0")}h</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Línea + área en SVG (escala a cualquier ancho). Hover muestra el tooltip
 * en escritorio; al tocar/clicar se fija el día más cercano (tocar de nuevo
 * el mismo lo oculta) sin activar el enlace de la tarjeta contenedora.
 */
export function DailyLine({
  data,
  unit = "visitas",
}: {
  data: DayPoint[];
  unit?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const points = data.map((d, i) => ({
    x: data.length > 1 ? (i / (data.length - 1)) * 100 : 50,
    y: 100 - (d.count / max) * 92 - 4,
    ...d,
  }));
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  function handleTap(e: React.MouseEvent<HTMLDivElement>) {
    // No navegar cuando el gráfico vive dentro de una ChartCard con href.
    e.preventDefault();
    e.stopPropagation();
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    let nearest = 0;
    for (let i = 1; i < points.length; i += 1) {
      if (Math.abs(points[i].x - xPct) < Math.abs(points[nearest].x - xPct)) {
        nearest = i;
      }
    }
    setActive((prev) => (prev === nearest ? null : nearest));
  }

  return (
    <div
      className="relative h-36 cursor-pointer touch-manipulation"
      onClick={handleTap}
      onMouseLeave={() => setActive(null)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden
      >
        <path
          d={`${path} L100,100 L0,100 Z`}
          className="fill-brand/10"
          stroke="none"
        />
        <path
          d={path}
          className="stroke-brand"
          fill="none"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
      {points.map((p, i) => (
        <div
          key={p.date}
          className="group pointer-events-none absolute h-full w-4 -translate-x-1/2 sm:pointer-events-auto"
          style={{ left: `${p.x}%` }}
        >
          <div
            className={cn(
              "absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand transition-opacity group-hover:opacity-100",
              active === i ? "opacity-100" : "opacity-0",
            )}
            style={{ top: `${p.y}%` }}
          />
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-neutral-800 px-2 py-1 text-xs text-white group-hover:block",
              active === i ? "block" : "hidden",
            )}
          >
            {dayLabel(p.date)}: {p.count} {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Barras horizontales con etiqueta y valor. Si un dato trae `today`, se muestra
 * además el conteo de hoy junto al total (p. ej. "11 vistas · 2 hoy").
 */
export function HorizontalBars({
  data,
  unit = "",
}: {
  data: { label: string; count: number; today?: number | null }[];
  unit?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-400">Sin datos.</p>;
  }
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li key={`${d.label}-${i}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-neutral-700">{d.label}</span>
            <span className="shrink-0 font-medium text-neutral-900">
              {d.count} {unit}
              {d.today != null && (
                <span className="ml-1 font-normal text-neutral-400">
                  · {d.today} hoy
                </span>
              )}
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-brand/80"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
