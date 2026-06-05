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
