import { requireUser } from "@/lib/auth/server";
import { authFetch } from "@/lib/strapi/auth-fetch";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { Address } from "@/definitions/Address";
import type { PaymentInfo } from "@/definitions/PaymentInfo";

async function loadPaymentInfo(): Promise<PaymentInfo | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/payment-info?populate=qrImage`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const { data } = (await res.json()) as { data: PaymentInfo };
    return data ?? null;
  } catch {
    return null;
  }
}

async function loadAddresses(): Promise<Address[]> {
  const res = await authFetch(
    "/api/addresses?sort[0]=isDefault:desc&sort[1]=createdAt:desc&pagination[pageSize]=20"
  );
  if (!res.ok) return [];
  const { data } = (await res.json()) as { data: Address[] };
  return data ?? [];
}

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const [paymentInfo, addresses, meRes] = await Promise.all([
    loadPaymentInfo(),
    loadAddresses(),
    authFetch("/api/users/me")
  ]);
  if (!meRes.ok) {
    return (
      <section className="mx-auto w-full max-w-md px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">
          Tu sesión ha expirado. Inicia sesión de nuevo.
        </p>
      </section>
    );
  }

  return (
    <CheckoutForm
      user={user}
      paymentInfo={paymentInfo}
      savedAddresses={addresses}
    />
  );
}
