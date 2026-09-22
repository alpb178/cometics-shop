import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

/** KPI enlazado con hover-lift y chevron (estilo StatCard de Tu Chamba). */
export function StatCard({
  label,
  value,
  href,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number | string;
  href: string;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-brand" />
        <ChevronRight className="h-4 w-4 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-brand" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
    </Link>
  );
}
