"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import type { OrderStatus } from "@/lib/admin/types";
import { confirmOrderPaymentAction, rejectOrderAction } from "./actions";

export function PaymentVerification({
  documentId,
  status,
  cancellationReason
}: {
  documentId: string;
  status: OrderStatus;
  cancellationReason: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const decided = status === "confirmed" || status === "cancelled";

  function confirm() {
    setError(null);
    startTransition(async () => {
      try {
        await confirmOrderPaymentAction(documentId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  function reject() {
    setError(null);
    startTransition(async () => {
      try {
        await rejectOrderAction(documentId, reason);
        setRejecting(false);
        setReason("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div className="card p-5">
      <h2 className="mb-3 font-medium">Verificación de pago</h2>

      {status === "confirmed" && (
        <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Pago confirmado.
        </p>
      )}
      {status === "cancelled" && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Pedido rechazado{cancellationReason ? `: ${cancellationReason}` : "."}
        </p>
      )}

      {!rejecting ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirm}
            disabled={pending || status === "confirmed"}
            className="btn-primary flex-1"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Confirmar pago
          </button>
          <button
            type="button"
            onClick={() => setRejecting(true)}
            disabled={pending || status === "cancelled"}
            className="btn-danger flex-1"
          >
            <X className="h-4 w-4" />
            Rechazar
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            className="input resize-y"
            rows={2}
            autoFocus
            placeholder="Motivo del rechazo (ej. comprobante ilegible, monto no coincide)…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reject}
              disabled={pending || !reason.trim()}
              className="btn-danger flex-1"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Confirmar rechazo
            </button>
            <button
              type="button"
              onClick={() => {
                setRejecting(false);
                setReason("");
              }}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {decided && (
        <p className="mt-2 text-xs text-neutral-400">
          Puedes cambiar el estado más abajo si te equivocaste.
        </p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
