"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Coins, Percent, ShoppingBag, Trash2, Wallet } from "lucide-react";
import { Pagination } from "@/components/admin/pagination";
import { RefreshButton } from "@/components/admin/refresh-button";
import {
  AdminTable,
  Badge,
  ConfirmDialog,
  FilterSelect,
  IconButton,
  SearchInput,
} from "@/components/admin/ui";
import { formatDate, ORDER_STATUS_META } from "@/lib/admin/admin-utils";
import type { Order } from "@/lib/admin/types";
import { deleteOrderAction } from "../orders/actions";

const PAGE_SIZE = 10;

const round2 = (n: number) => Math.round(n * 100) / 100;
const bs = (n: number) => `Bs ${round2(n).toLocaleString("es-BO")}`;
// Cabecera alineada a la derecha, para que coincida con las celdas numéricas.
const right = (label: string) => (
  <span className="block text-right">{label}</span>
);

export function SalesTable({
  orders,
  markupPercent,
}: {
  orders: Order[];
  markupPercent: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Order | null>(null);

  const filter =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setPage(1);
    };

  // El subtotal guardado ya incluye el markup de la plataforma; lo revertimos
  // con el markup actual para separar precio original y ganancia de plataforma
  // (misma lógica que los KPIs del inicio).
  const rows = useMemo(
    () =>
      orders.map((o) => {
        const subtotal = Number(o.subtotal) || 0;
        const productProfit = round2(subtotal / (1 + markupPercent / 100));
        return {
          o,
          subtotal,
          shipping: Number(o.shippingCost) || 0,
          total: Number(o.total) || 0,
          productProfit,
          platformProfit: round2(subtotal - productProfit),
          cancelled: o.status === "cancelled",
        };
      }),
    [orders, markupPercent],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(({ o }) => {
      if (status && o.status !== status) return false;
      if (!term) return true;
      const haystack = [
        o.orderNumber,
        o.user?.email,
        o.user?.username,
        o.shippingAddress?.fullName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [rows, q, status]);

  // Totales sobre lo filtrado, excluyendo pedidos cancelados (no son ventas).
  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => {
          if (r.cancelled) return acc;
          acc.count += 1;
          acc.subtotal += r.subtotal;
          acc.productProfit += r.productProfit;
          acc.platformProfit += r.platformProfit;
          acc.shipping += r.shipping;
          acc.total += r.total;
          return acc;
        },
        {
          count: 0,
          subtotal: 0,
          productProfit: 0,
          platformProfit: 0,
          shipping: 0,
          total: 0,
        },
      ),
    [filtered],
  );

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function run(fn: () => Promise<void>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        after?.();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div>
      {/* Resumen (pedidos no cancelados) */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SummaryTile
          icon={ShoppingBag}
          label="Ventas"
          value={bs(totals.subtotal)}
          hint={`${totals.count} pedido(s) · sin envío`}
        />
        <SummaryTile
          icon={Coins}
          label="Ganancias productos"
          value={bs(totals.productProfit)}
          hint="A precio original"
        />
        <SummaryTile
          icon={Percent}
          label="Ganancias plataforma"
          value={bs(totals.platformProfit)}
          hint={`Markup ${markupPercent}%`}
          highlight
        />
        <SummaryTile
          icon={Wallet}
          label="Ingresos"
          value={bs(totals.total)}
          hint="Con envío"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={q}
          onChange={filter(setQ)}
          placeholder="Buscar por nº de pedido o cliente…"
          className="w-full sm:w-72"
        />
        <FilterSelect
          value={status}
          onChange={filter(setStatus)}
          allLabel="Todos los estados"
          options={Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
            value,
            label: meta.label,
          }))}
        />
        <div className="ml-auto">
          <RefreshButton />
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <AdminTable
        loading={pending}
        empty={
          orders.length === 0
            ? "Aún no hay ventas."
            : "Ningún pedido coincide con la búsqueda."
        }
        headers={[
          "Pedido",
          "Fecha",
          "Cliente",
          "Estado",
          right("G. productos"),
          right("G. plataforma"),
          right("Envío"),
          right("Total"),
          "",
        ]}
      >
        {pageRows.map((r) => {
          const meta = ORDER_STATUS_META[r.o.status];
          const money = r.cancelled ? "text-neutral-300 line-through" : "";
          return (
            <tr key={r.o.documentId} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <Link
                  href={`/orders/${r.o.documentId}`}
                  className="font-mono text-brand hover:underline"
                >
                  {r.o.orderNumber}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                {formatDate(r.o.createdAt)}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {r.o.user?.email || r.o.shippingAddress?.fullName || "—"}
              </td>
              <td className="px-4 py-3">
                <Badge className={meta.className}>{meta.label}</Badge>
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right text-neutral-600 ${money}`}
              >
                {bs(r.productProfit)}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right font-medium text-brand ${money}`}
              >
                {bs(r.platformProfit)}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right text-neutral-600 ${money}`}
              >
                {bs(r.shipping)}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right font-medium ${money}`}
              >
                {bs(r.total)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end">
                  <IconButton
                    icon={Trash2}
                    label={`Eliminar ${r.o.orderNumber}`}
                    variant="danger"
                    onClick={() => setToDelete(r.o)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
        total={filtered.length}
        limit={PAGE_SIZE}
        onPage={setPage}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar pedido"
        message={`¿Eliminar el pedido ${toDelete?.orderNumber}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        pending={pending}
        error={error}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          run(
            () => deleteOrderAction(toDelete.documentId),
            () => setToDelete(null),
          );
        }}
      />
    </div>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card p-5 ${highlight ? "bg-brand-light" : ""}`}>
      <Icon className={`h-5 w-5 ${highlight ? "text-brand" : "text-neutral-400"}`} />
      <p
        className={`mt-3 text-2xl font-semibold ${
          highlight ? "text-brand" : "text-neutral-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
