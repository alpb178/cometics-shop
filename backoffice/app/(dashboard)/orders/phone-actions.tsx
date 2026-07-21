"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

// Normaliza el teléfono al formato que espera wa.me (solo dígitos, con código
// de país). Los móviles bolivianos locales tienen 8 dígitos → se antepone 591.
function toWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 8 ? `591${digits}` : digits;
}

export function PhoneActions({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Portapapeles no disponible (contexto no seguro): no hacemos nada.
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <a
        href={`https://wa.me/${toWhatsApp(phone)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
