"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import type { PaymentInfo } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";
import { savePaymentInfoAction } from "./actions";

export function PaymentInfoForm({ info }: { info: PaymentInfo | null }) {
  const [preview, setPreview] = useState<string | null>(
    mediaUrl(info?.qrImage ?? null, "small")
  );
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      await savePaymentInfoAction(new FormData(e.currentTarget));
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  const fields: { name: keyof PaymentInfo; label: string }[] = [
    { name: "bankName", label: "Banco" },
    { name: "accountName", label: "Titular de la cuenta" },
    { name: "accountNumber", label: "Número de cuenta" },
    { name: "accountType", label: "Tipo de cuenta" },
    { name: "ci", label: "CI / NIT" }
  ];

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
      <div className="card space-y-4 p-5 md:col-span-2">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="label" htmlFor={f.name}>
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              className="input"
              defaultValue={(info?.[f.name] as string) ?? ""}
            />
          </div>
        ))}
        <div>
          <label className="label" htmlFor="instructions">
            Instrucciones de pago
          </label>
          <textarea
            id="instructions"
            name="instructions"
            rows={4}
            className="input resize-y"
            defaultValue={info?.instructions ?? ""}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <p className="label">Imagen QR</p>
          <label className="block cursor-pointer">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 hover:border-brand">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="QR"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-neutral-400">
                  <ImagePlus className="h-6 w-6" />
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
                setPreview(file ? URL.createObjectURL(file) : preview);
              }}
            />
          </label>
        </div>

        <div className="card space-y-3 p-5">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {done && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Guardado ✓
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar datos de pago
          </button>
        </div>
      </div>
    </form>
  );
}
