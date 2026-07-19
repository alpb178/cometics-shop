"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  updateCategory
} from "@/lib/data";
import { requireStaff } from "@/lib/auth-guard";

export async function createCategoryAction(name: string) {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("El nombre es obligatorio");
  await createCategory(trimmed);
  revalidatePath("/categories");
}

export async function updateCategoryAction(documentId: string, name: string) {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("El nombre es obligatorio");
  await updateCategory(documentId, trimmed);
  revalidatePath("/categories");
}

export async function deleteCategoryAction(documentId: string) {
  await requireStaff();
  await deleteCategory(documentId);
  revalidatePath("/categories");
}

/** Elimina varias categorías seleccionadas. */
export async function bulkDeleteCategoriesAction(documentIds: string[]) {
  await requireStaff();
  for (const documentId of documentIds) {
    await deleteCategory(documentId);
  }
  revalidatePath("/categories");
}
