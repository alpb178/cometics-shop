"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";
import { requireStaff } from "@/lib/auth-guard";

export async function updateOrderStatusAction(
  documentId: string,
  status: OrderStatus
) {
  await requireStaff();
  await updateOrderStatus(documentId, status);
  revalidatePath("/orders");
  revalidatePath(`/orders/${documentId}`);
}

/** Confirma el pago tras verificar el comprobante manualmente. */
export async function confirmOrderPaymentAction(documentId: string) {
  await requireStaff();
  await updateOrderStatus(documentId, "confirmed");
  revalidatePath("/orders");
  revalidatePath(`/orders/${documentId}`);
}

/** Rechaza el pedido (comprobante inválido) con un motivo. */
export async function rejectOrderAction(documentId: string, reason: string) {
  await requireStaff();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("Indica un motivo del rechazo.");
  await updateOrderStatus(documentId, "cancelled", trimmed);
  revalidatePath("/orders");
  revalidatePath(`/orders/${documentId}`);
}
