"use client";

import { Children, type ReactNode } from "react";
import { Loader2, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kit de UI del backoffice. La familia de tabla (DataTable, AdminTable,
 * TableSkeleton, Skeleton) es la MISMA del admin de Tu Chamba, copiada
 * verbatim — sus tokens de color (surface/outline/primary) están mapeados
 * a la paleta de Iris en tailwind.config.ts.
 */

export function DataTable({
  headers,
  children,
}: {
  headers: ReactNode[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/60">{children}</tbody>
      </table>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-surface-container-high ${className}`} />
  );
}

export function TableSkeleton({
  headers,
  rows = 6,
}: {
  headers: ReactNode[];
  rows?: number;
}) {
  return (
    <div aria-hidden="true">
      <DataTable headers={headers}>
        {Array.from({ length: rows }, (_, r) => (
          <tr key={r}>
            {headers.map((_, c) => (
              <td key={c} className="px-4 py-3">
                <Skeleton className={`h-4 ${c === 0 ? "w-32" : "w-20"}`} />
              </td>
            ))}
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

// Tabla estándar del panel: encapsula los cuatro estados de una tabla con
// datos remotos. Primera carga -> skeleton; recarga con datos previos ->
// tabla atenuada (transición suave, sin parpadeo); error -> mensaje; sin
// filas -> una fila de "sin datos" dentro de la propia tabla.
export function AdminTable({
  headers,
  loading = false,
  error = null,
  empty = "No hay datos.",
  skeletonRows = 8,
  children,
}: {
  headers: ReactNode[];
  loading?: boolean;
  error?: string | null;
  empty?: string;
  skeletonRows?: number;
  children?: ReactNode;
}) {
  const rows = Children.toArray(children);
  if (error) return <p className="text-sm text-error">{error}</p>;
  if (loading && rows.length === 0) {
    return <TableSkeleton headers={headers} rows={skeletonRows} />;
  }
  return (
    <div
      aria-busy={loading}
      className={`transition-opacity duration-300 ${
        loading ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <DataTable headers={headers}>
        {rows.length > 0 ? (
          rows
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="px-4 py-10 text-center text-sm text-on-surface-variant"
            >
              {empty}
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn("badge", className)}>{children}</span>;
}

/** Botón de acción por fila, solo icono, con tooltip accesible. */
export function IconButton({
  icon: Icon,
  label,
  variant = "neutral",
  className,
  ...props
}: {
  icon: LucideIcon;
  label: string;
  variant?: "neutral" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        "rounded p-1.5 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30",
        variant === "danger"
          ? "text-red-500 hover:bg-red-50"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
        className,
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/** Checkbox de selección de filas. */
export function SelectCheckbox({
  label,
  ...props
}: { label: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-brand"
      {...props}
    />
  );
}

/** Buscador con icono. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        className="input pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

/** Select de filtro compacto. */
export function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  className,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  allLabel: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      className={cn("input w-auto", className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel ?? allLabel}
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Modal genérico (overlay + tarjeta). */
export function Modal({
  title,
  onClose,
  children,
  maxWidth = "max-w-md",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={cn("w-full rounded-xl bg-white p-6 shadow-xl", maxWidth)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Diálogo de confirmación para acciones destructivas (sustituye a window.confirm). */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  pending = false,
  error = null,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <Modal title={title} onClose={onCancel} maxWidth="max-w-sm">
      <p className="text-sm text-neutral-600">{message}</p>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn-danger"
          disabled={pending}
          onClick={onConfirm}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
