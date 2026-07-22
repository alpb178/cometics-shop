"use server";

import { revalidatePath } from "next/cache";
import {
  createUser,
  deleteUser,
  setUserPassword,
  updateUser
} from "@/lib/admin/data";
import { requireStaff } from "@/lib/admin/auth-guard";

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
}

export async function updateUserAction(
  id: number,
  input: { username: string; email: string; role: number }
) {
  await requireStaff();
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();
  if (!username || !email) {
    throw new Error("Usuario y email son obligatorios.");
  }
  if (!Number.isFinite(input.role) || input.role <= 0) {
    throw new Error("Selecciona un rol válido.");
  }
  await updateUser(id, { username, email, role: input.role });
  revalidatePath("/users");
}

export async function setUserPasswordAction(id: number, password: string) {
  await requireStaff();
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
  await setUserPassword(id, password);
  revalidatePath("/users");
}

export async function deleteUserAction(id: number) {
  const me = await requireStaff();
  if (me.id === id) {
    throw new Error("No puedes eliminar tu propia cuenta.");
  }
  await deleteUser(id);
  revalidatePath("/users");
}

/** Elimina varios usuarios seleccionados (nunca la cuenta propia). */
export async function bulkDeleteUsersAction(ids: number[]) {
  const me = await requireStaff();
  for (const id of ids) {
    if (id === me.id) continue;
    await deleteUser(id);
  }
  revalidatePath("/users");
}
