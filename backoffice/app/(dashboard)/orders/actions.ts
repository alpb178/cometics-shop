"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/data";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatusAction(
  documentId: string,
  status: OrderStatus
) {
  await updateOrderStatus(documentId, status);
  revalidatePath("/orders");
  revalidatePath(`/orders/${documentId}`);
}
