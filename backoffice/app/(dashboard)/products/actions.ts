"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  setProductVisible,
  updateProduct,
  type ProductInput
} from "@/lib/data";
import { uploadFiles } from "@/lib/strapi";
import { requireStaff } from "@/lib/auth-guard";

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function buildInput(formData: FormData): Promise<ProductInput> {
  // Imagen principal: conservar la existente salvo que se suba una nueva.
  const newImage = formData.get("newImage");
  let imageId = parseNumber(formData.get("keepImageId"));
  if (newImage instanceof File && newImage.size > 0) {
    const [uploaded] = await uploadFiles([newImage]);
    if (uploaded) imageId = uploaded.id;
  }

  // Galería: ids conservados + nuevas subidas.
  const keepGallery = String(formData.get("keepGalleryIds") || "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

  const newGallery = formData
    .getAll("newGallery")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploadedGallery = await uploadFiles(newGallery);
  const galleryIds = [...keepGallery, ...uploadedGallery.map((m) => m.id)];

  return {
    name: String(formData.get("name") || "").trim(),
    price: parseNumber(formData.get("price")),
    currency: String(formData.get("currency") || "BS"),
    description: (String(formData.get("description") || "").trim() || null) as
      | string
      | null,
    image: imageId,
    images: galleryIds,
    categories: parseNumber(formData.get("categoryId")),
    // "on" (checkbox marcado) → visible; ausente → oculto
    visible: formData.get("visible") === "on"
  };
}

export async function createProductAction(formData: FormData) {
  await requireStaff();
  const input = await buildInput(formData);
  await createProduct(input);
  // La visibilidad en la tienda la controla el flag `visible` (checkbox
  // "Mostrar en la tienda"); no hay paso de publicación (fila única).
  revalidatePath("/products");
  redirect("/products");
}

/** Muestra u oculta el producto en la tienda. */
export async function setProductVisibleAction(
  documentId: string,
  visible: boolean
) {
  await requireStaff();
  await setProductVisible(documentId, visible);
  revalidatePath("/products");
  revalidatePath(`/products/${documentId}/edit`);
}

export async function updateProductAction(
  documentId: string,
  formData: FormData
) {
  await requireStaff();
  const input = await buildInput(formData);
  // Se edita en sitio la única fila del producto; la tienda lo refleja al
  // instante (el front lee sin caché).
  await updateProduct(documentId, input);
  revalidatePath("/products");
  revalidatePath(`/products/${documentId}/edit`);
  redirect("/products");
}

export async function deleteProductAction(documentId: string) {
  await requireStaff();
  await deleteProduct(documentId);
  revalidatePath("/products");
}

/** Elimina varios productos seleccionados. */
export async function bulkDeleteProductsAction(documentIds: string[]) {
  await requireStaff();
  for (const documentId of documentIds) {
    await deleteProduct(documentId);
  }
  revalidatePath("/products");
}
