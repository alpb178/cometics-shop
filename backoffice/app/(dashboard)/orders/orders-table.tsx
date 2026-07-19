"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { RefreshButton } from "@/components/refresh-button";
import {
  AdminTable,
  Badge,
  ConfirmDialog,
  FilterSelect,
  IconButton,
  SearchInput,
  SelectCheckbox,
} from "@/components/ui";
import { useSelection } from "@/lib/use-selection";
import { formatDate, ORDER_STATUS_META } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { bulkDeleteOrdersAction, deleteOrderAction } from "./actions";

const PAGE_SIZE = 10;

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState<Order | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const filter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter((o) => {
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
  }, [orders, q, status]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = useMemo(
    () => pageRows.map((o) => o.documentId),
    [pageRows],
  );
  const { selected, allInPage, toggleOne, togglePage, clear } =
    useSelection(pageIds);

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
        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => setConfirmBulk(true)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar seleccionados ({selected.size})
            </button>
          )}
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
            ? "Aún no hay pedidos."
            : "Ningún pedido coincide con la búsqueda."
        }
        headers={[
          <SelectCheckbox
            key="all"
            label="Seleccionar página"
            checked={allInPage}
            onChange={togglePage}
          />,
          "Pedido",
          "Cliente",
          "Fecha",
          "Total",
          "Estado",
          "",
        ]}
      >
        {pageRows.map((o) => {
          const meta = ORDER_STATUS_META[o.status];
          return (
            <tr key={o.documentId} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <SelectCheckbox
                  label={`Seleccionar ${o.orderNumber}`}
                  checked={selected.has(o.documentId)}
                  onChange={() => toggleOne(o.documentId)}
                />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/orders/${o.documentId}`}
                  className="font-mono text-brand hover:underline"
                >
                  {o.orderNumber}
                </Link>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {o.user?.email || o.shippingAddress?.fullName || "—"}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {formatDate(o.createdAt)}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                Bs {Number(o.total).toLocaleString("es-BO")}
              </td>
              <td className="px-4 py-3">
                <Badge className={meta.className}>{meta.label}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end">
                  <IconButton
                    icon={Trash2}
                    label={`Eliminar ${o.orderNumber}`}
                    variant="danger"
                    onClick={() => setToDelete(o)}
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

      <ConfirmDialog
        open={confirmBulk}
        title="Eliminar seleccionados"
        message={`¿Eliminar ${selected.size} pedido(s)? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar todos"
        pending={pending}
        error={error}
        onCancel={() => setConfirmBulk(false)}
        onConfirm={() =>
          run(
            () => bulkDeleteOrdersAction([...selected]),
            () => {
              setConfirmBulk(false);
              clear();
            },
          )
        }
      />
    </div>
  );
}
