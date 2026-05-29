"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_META } from "@/lib/utils";
import { updateOrderStatusAction } from "./actions";

const STATUSES = Object.keys(ORDER_STATUS_META) as OrderStatus[];

export function StatusSelect({
  documentId,
  current
}: {
  documentId: string;
  current: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(current);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onChange(next: OrderStatus) {
    const prev = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      try {
        await updateOrderStatusAction(documentId, next);
      } catch (e) {
        setStatus(prev);
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div>
      <label className="label">Estado del pedido</label>
      <div className="flex items-center gap-2">
        <select
          className="input"
          value={status}
          disabled={pending}
          onChange={(e) => onChange(e.target.value as OrderStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_META[s].label}
            </option>
          ))}
        </select>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
