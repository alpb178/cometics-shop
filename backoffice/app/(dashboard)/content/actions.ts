"use server";

import { revalidatePath } from "next/cache";
import {
  createFaq,
  deleteFaq,
  updateFaq,
  updatePaymentInfo,
  type PaymentInfoInput
} from "@/lib/data";
import { uploadFiles } from "@/lib/strapi";

export async function savePaymentInfoAction(formData: FormData) {
  const input: PaymentInfoInput = {
    bankName: (String(formData.get("bankName") || "").trim() || null) as string | null,
    accountNumber:
      (String(formData.get("accountNumber") || "").trim() || null) as string | null,
    accountName:
      (String(formData.get("accountName") || "").trim() || null) as string | null,
    accountType:
      (String(formData.get("accountType") || "").trim() || null) as string | null,
    ci: (String(formData.get("ci") || "").trim() || null) as string | null,
    instructions:
      (String(formData.get("instructions") || "").trim() || null) as string | null
  };

  const qr = formData.get("qrImage");
  if (qr instanceof File && qr.size > 0) {
    const [uploaded] = await uploadFiles([qr]);
    if (uploaded) input.qrImage = uploaded.id;
  }

  await updatePaymentInfo(input);
  revalidatePath("/content");
}

export async function createFaqAction(question: string, answer: string) {
  if (!question.trim()) throw new Error("La pregunta es obligatoria");
  await createFaq(question.trim(), answer.trim());
  revalidatePath("/content");
}

export async function updateFaqAction(
  documentId: string,
  question: string,
  answer: string
) {
  if (!question.trim()) throw new Error("La pregunta es obligatoria");
  await updateFaq(documentId, question.trim(), answer.trim());
  revalidatePath("/content");
}

export async function deleteFaqAction(documentId: string) {
  await deleteFaq(documentId);
  revalidatePath("/content");
}
