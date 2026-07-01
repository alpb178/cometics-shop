"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUser } from "@/lib/data";
import { requireStaff } from "@/lib/auth-guard";

export async function createUserAction(formData: FormData) {
  await requireStaff();

  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const role = Number(formData.get("role"));

  if (!username || !email || !password) {
    throw new Error("Usuario, email y contraseña son obligatorios.");
  }
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
  if (!Number.isFinite(role) || role <= 0) {
    throw new Error("Selecciona un rol válido.");
  }

  await createUser({ username, email, password, role });

  revalidatePath("/users");
  redirect("/users");
}
