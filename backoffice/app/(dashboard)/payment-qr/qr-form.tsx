"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import type { PaymentInfo } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";
import { savePaymentQrAction } from "./actions";

export function QrForm({ info }: { info: PaymentInfo | null }) {
  const [preview, setPreview] = useState<string | null>(
    mediaUrl(info?.qrImage ?? null, "small")
  );
  const [hasNew, setHasNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      await savePaymentQrAction(new FormData(e.currentTarget));
      setDone(true);
      setHasNew(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-4 p-5">
      <div>
        <p className="label">Imagen del QR de cobro</p>
        <label className="block cursor-pointer">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 hover:border-brand">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="QR de pago"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-neutral-400">
                <ImagePlus className="h-7 w-7" />
                <span className="text-xs">Subir QR</span>
              </div>
            )}
          </div>
          <input
            name="qrImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                setHasNew(true);
                setDone(false);
              }
            }}
          />
        </label>
        <p className="mt-2 text-xs text-neutral-500">
          Este es el QR que ven los clientes al pagar. Sube el QR estático de tu
          app bancaria (imagen PNG/JPG). Solo se actualiza el QR; los datos
          bancarios no se tocan.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {done && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          QR actualizado ✓
        </p>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={saving || !hasNew}
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar QR
      </button>
    </form>
  );
}
