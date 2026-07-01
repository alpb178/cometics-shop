"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { PricingSetting } from "@/lib/types";
import { savePricingAction } from "./actions";

export function PricingForm({ setting }: { setting: PricingSetting }) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      await savePricingAction(new FormData(e.currentTarget));
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  const fields: {
    name: keyof PricingSetting;
    label: string;
    step: string;
    hint?: string;
  }[] = [
    {
      name: "markupPercent",
      label: "Markup global (%)",
      step: "0.1",
      hint: "Recargo invisible sobre todos los productos (ej: 10)."
    },
    {
      name: "provinceShippingCost",
      label: "Envío a provincia (Bs)",
      step: "0.5",
      hint: "Costo fijo si el envío es fuera de Santa Cruz."
    },
    {
      name: "scRadiusKm",
      label: "Radio de Santa Cruz (km)",
      step: "0.5",
      hint: "Distancia desde el centro para considerar 'dentro de SC'."
    },
    { name: "scCenterLat", label: "Latitud centro SC", step: "0.0001" },
    { name: "scCenterLng", label: "Longitud centro SC", step: "0.0001" }
  ];

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="label" htmlFor={f.name}>
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type="number"
              step={f.step}
              className="input"
              defaultValue={setting[f.name]}
            />
            {f.hint && (
              <p className="mt-1 text-xs text-neutral-400">{f.hint}</p>
            )}
          </div>
        ))}
      </div>

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
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Guardar configuración de precios
      </button>
    </form>
  );
}
