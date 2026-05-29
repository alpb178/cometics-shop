"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  updateCategory
} from "@/lib/data";

export async function createCategoryAction(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("El nombre es obligatorio");
  await createCategory(trimmed);
  revalidatePath("/categories");
}

export async function updateCategoryAction(documentId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("El nombre es obligatorio");
  await updateCategory(documentId, trimmed);
  revalidatePath("/categories");
}

export async function deleteCategoryAction(documentId: string) {
  await deleteCategory(documentId);
  revalidatePath("/categories");
}
