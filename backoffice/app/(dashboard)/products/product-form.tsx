"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Category, Product, StrapiMedia } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";
import { setProductVisibleAction } from "./actions";

type SaveAction = (formData: FormData) => Promise<void>;

export function ProductForm({
  categories,
  product,
  action
}: {
  categories: Category[];
  product?: Product;
  action: SaveAction;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingVisible, startVisible] = useTransition();
  // Estado optimista del flag visible (para que el toggle responda al instante).
  const [visible, setVisible] = useState(product?.visible ?? true);

  function toggleVisible() {
    if (!product) return;
    const next = !visible;
    setVisible(next);
    setError(null);
    startVisible(async () => {
      try {
        await setProductVisibleAction(product.documentId, next);
        router.refresh();
      } catch (e) {
        setVisible(!next); // revertir si falla
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  // Imagen principal
  const [keepImageId, setKeepImageId] = useState<number | null>(
    product?.image?.id ?? null
  );
  const [mainPreview, setMainPreview] = useState<string | null>(
    mediaUrl(product?.image ?? null, "small")
  );

  // Galería
  const [keepGallery, setKeepGallery] = useState<StrapiMedia[]>(
    product?.images ?? []
  );
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const currency = product?.currency ?? "BS";

  function onMainChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setMainPreview(file ? URL.createObjectURL(file) : null);
  }

  function onGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setNewGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  const keepGalleryIds = useMemo(
    () => keepGallery.map((m) => m.id).join(","),
    [keepGallery]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await action(formData);
      // En éxito el server action redirige; si no, refrescamos.
      router.refresh();
    } catch (err) {
      // redirect() lanza un error especial NEXT_REDIRECT que debemos propagar.
      if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
      setError(
        err instanceof Error ? err.message : "No se pudo guardar el producto"
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Columna principal */}
      <div className="space-y-5 lg:col-span-2">
        <div className="card p-5">
          <div>
            <label className="label" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              className="input"
              defaultValue={product?.name ?? ""}
              required
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="price">
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                className="input"
                defaultValue={product?.price ?? ""}
              />
            </div>
            <div>
              <label className="label" htmlFor="currency">
                Moneda
              </label>
              <select
                id="currency"
                name="currency"
                className="input"
                defaultValue={currency}
              >
                <option value="BS">Bs</option>
                <option value="BOB">BOB</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="label" htmlFor="categoryId">
              Categoría
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="input"
              defaultValue={product?.categories?.[0]?.id ?? ""}
            >
              <option value="">— Sin categoría —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="label" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className="input resize-y"
              defaultValue={product?.description ?? ""}
            />
          </div>
        </div>

        {/* Galería */}
        <div className="card p-5">
          <p className="label">Galería de fotos</p>
          <div className="flex flex-wrap gap-3">
            {keepGallery.map((m) => (
              <div
                key={m.id}
                className="relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(m, "thumbnail") ?? ""}
                  alt={m.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setKeepGallery((g) => g.filter((x) => x.id !== m.id))
                  }
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                  aria-label="Quitar foto"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {newGalleryPreviews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Nueva foto ${i + 1}`}
                className="h-24 w-24 rounded-lg border border-brand object-cover"
              />
            ))}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-300 text-neutral-400 hover:border-brand hover:text-brand"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs">Añadir</span>
            </button>
          </div>
          <input
            ref={galleryInputRef}
            name="newGallery"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onGalleryChange}
          />
          <input type="hidden" name="keepGalleryIds" value={keepGalleryIds} />
          {newGalleryPreviews.length > 0 && (
            <p className="mt-2 text-xs text-neutral-500">
              {newGalleryPreviews.length} foto(s) nueva(s) por subir
            </p>
          )}
        </div>
      </div>

      {/* Columna lateral: imagen principal + acciones */}
      <div className="space-y-5">
        <div className="card p-5">
          <p className="label">Imagen principal</p>
          <label className="block cursor-pointer">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 hover:border-brand">
              {mainPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainPreview}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-neutral-400">
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Subir imagen</span>
                </div>
              )}
            </div>
            <input
              name="newImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onMainChange}
            />
          </label>
          {mainPreview && (
            <button
              type="button"
              onClick={() => {
                setMainPreview(null);
                setKeepImageId(null);
              }}
              className="mt-2 text-xs text-red-600 hover:underline"
            >
              Quitar imagen
            </button>
          )}
          <input
            type="hidden"
            name="keepImageId"
            value={keepImageId ?? ""}
          />
        </div>

        <div className="card space-y-3 p-5">
          {!product && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="visible" defaultChecked />
              Mostrar en la tienda
            </label>
          )}
          {product && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-3 py-2">
              <span className="flex items-center gap-2 text-sm text-neutral-600">
                En tienda:
                <Badge
                  className={
                    visible
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-600"
                  }
                >
                  {visible ? "Visible" : "Oculto"}
                </Badge>
              </span>
              <button
                type="button"
                className="btn-secondary shrink-0"
                onClick={toggleVisible}
                disabled={savingVisible}
              >
                {savingVisible && <Loader2 className="h-4 w-4 animate-spin" />}
                {visible ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          )}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => router.push("/products")}
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
