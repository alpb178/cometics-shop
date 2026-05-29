"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  setProductPublished,
  updateProduct,
  type ProductInput
} from "@/lib/data";
import { uploadFiles } from "@/lib/strapi";

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
    categories: parseNumber(formData.get("categoryId"))
  };
}

export async function createProductAction(formData: FormData) {
  const input = await buildInput(formData);
  const product = await createProduct(input);

  if (formData.get("publish") === "on") {
    await setProductPublished(product.documentId, true).catch(() => {});
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProductAction(
  documentId: string,
  formData: FormData
) {
  const input = await buildInput(formData);
  await updateProduct(documentId, input);
  revalidatePath("/products");
  revalidatePath(`/products/${documentId}/edit`);
  redirect("/products");
}

export async function deleteProductAction(documentId: string) {
  await deleteProduct(documentId);
  revalidatePath("/products");
}

export async function togglePublishAction(
  documentId: string,
  publish: boolean
) {
  await setProductPublished(documentId, publish);
  revalidatePath("/products");
}
