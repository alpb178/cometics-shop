"use server";

import { revalidatePath } from "next/cache";
import { updatePaymentQr } from "@/lib/data";
import { uploadFiles } from "@/lib/strapi";
import { requireStaff } from "@/lib/auth-guard";

/** Sube una nueva imagen QR y la fija en payment-info (sin tocar el resto). */
export async function savePaymentQrAction(formData: FormData) {
  await requireStaff();

  const qr = formData.get("qrImage");
  if (!(qr instanceof File) || qr.size === 0) {
    throw new Error("Selecciona una imagen del QR.");
  }

  const [uploaded] = await uploadFiles([qr]);
  if (!uploaded) throw new Error("No se pudo subir la imagen.");

  await updatePaymentQr(uploaded.id);
  revalidatePath("/payment-qr");
  revalidatePath("/content");
}
