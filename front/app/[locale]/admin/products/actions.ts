"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  setProductVisible,
  updateProduct,
  type ProductInput
} from "@/lib/admin/data";
import { uploadFiles } from "@/lib/admin/strapi";
import { requireStaff } from "@/lib/admin/auth-guard";

/** Maximum photos in the gallery; must match the form's limit. */
const MAX_GALLERY = 3;

function parseNumber(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function buildInput(formData: FormData): Promise<ProductInput> {
  // Main image: keep the existing one unless a new one is uploaded.
  const newImage = formData.get("newImage");
  let imageId = parseNumber(formData.get("keepImageId"));
  if (newImage instanceof File && newImage.size > 0) {
    const [uploaded] = await uploadFiles([newImage]);
    if (uploaded) imageId = uploaded.id;
  }

  // Gallery: kept ids + new uploads.
  const keepGallery = String(formData.get("keepGalleryIds") || "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

  // Only upload what fits within the maximum: the form already limits it,
  // but the action can't trust whatever arrives in the FormData.
  const newGallery = formData
    .getAll("newGallery")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, Math.max(0, MAX_GALLERY - keepGallery.length));
  const uploadedGallery = await uploadFiles(newGallery);
  const galleryIds = [
    ...keepGallery,
    ...uploadedGallery.map((m) => m.id)
  ].slice(0, MAX_GALLERY);

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
    // Discount (sale) in %: empty → no sale.
    discount: parseNumber(formData.get("discount")),
    // "on" (checkbox checked) → visible; missing → hidden
    visible: formData.get("visible") === "on"
  };
}

export async function createProductAction(formData: FormData) {
  await requireStaff();
  const input = await buildInput(formData);
  await createProduct(input);
  // Store visibility is controlled by the `visible` flag ("Mostrar en la tienda"
  // checkbox); there is no publish step (single row).
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

/** Shows or hides the product in the store. */
export async function setProductVisibleAction(
  documentId: string,
  visible: boolean
) {
  await requireStaff();
  await setProductVisible(documentId, visible);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${documentId}/edit`);
}

export async function updateProductAction(
  documentId: string,
  formData: FormData
) {
  await requireStaff();
  // An existing product's visibility is managed with the Hide/Show button
  // (a separate action). The edit form does NOT include the "visible"
  // checkbox, so buildInput would return it as `false`; it must be removed so
  // the product isn't hidden on every save.
  const input: Partial<ProductInput> = await buildInput(formData);
  delete input.visible;
  // The product's single row is edited in place; the store reflects it
  // instantly (the front reads without cache).
  await updateProduct(documentId, input);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${documentId}/edit`);
  redirect("/admin/products");
}

export async function deleteProductAction(documentId: string) {
  await requireStaff();
  await deleteProduct(documentId);
  revalidatePath("/admin/products");
}

/** Deletes several selected products. */
export async function bulkDeleteProductsAction(documentIds: string[]) {
  await requireStaff();
  for (const documentId of documentIds) {
    await deleteProduct(documentId);
  }
  revalidatePath("/admin/products");
}
