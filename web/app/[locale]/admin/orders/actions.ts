"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteOrder, updateOrderStatus } from "@/lib/admin/data";
import type { OrderStatus } from "@/lib/admin/types";
import { requireStaff } from "@/lib/admin/auth-guard";

export async function updateOrderStatusAction(
  documentId: string,
  status: OrderStatus
) {
  await requireStaff();
  await updateOrderStatus(documentId, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${documentId}`);
}

/** Confirms the payment after manually checking the receipt. */
export async function confirmOrderPaymentAction(documentId: string) {
  await requireStaff();
  await updateOrderStatus(documentId, "confirmed");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${documentId}`);
}

/** Permanently deletes the order. */
export async function deleteOrderAction(documentId: string) {
  await requireStaff();
  await deleteOrder(documentId);
  revalidatePath("/admin/orders");
}

/** Deletes several selected orders. */
export async function bulkDeleteOrdersAction(documentIds: string[]) {
  await requireStaff();
  for (const documentId of documentIds) {
    await deleteOrder(documentId);
  }
  revalidatePath("/admin/orders");
}

/** Deletes the order from its detail page and returns to the list. */
export async function deleteOrderFromDetailAction(documentId: string) {
  await requireStaff();
  await deleteOrder(documentId);
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

/** Rejects the order (invalid receipt) with a reason. */
export async function rejectOrderAction(documentId: string, reason: string) {
  await requireStaff();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("Indica un motivo del rechazo.");
  await updateOrderStatus(documentId, "cancelled", trimmed);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${documentId}`);
}
