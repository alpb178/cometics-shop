"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Upload, X, MapPin } from "lucide-react";
import {
  getPricingSettings,
  isProvinceCoords,
  PRICING_DEFAULTS,
  type PricingSettings
} from "@/lib/pricing";
import { PhoneInput } from "@/components/form/phone-input/PhoneInput";
import { TextInput } from "@/components/form/text-input/TextInput";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import type { Address } from "@/definitions/Address";
import type { User } from "@/definitions/User";
import type { PaymentInfo } from "@/definitions/PaymentInfo";
import type {
  DeliveryMethod,
  PaymentMethod
} from "@/definitions/Order";

type FormValues = {
  fullName: string;
  phone: string;
  ci?: string;
};

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

function mediaUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

export function CheckoutForm({
  user,
  paymentInfo,
  savedAddresses
}: {
  user: User;
  paymentInfo: PaymentInfo | null;
  savedAddresses: Address[];
}) {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const { refresh } = useAuth();
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "";

  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      fullName,
      phone: user.phone ?? ""
    }
  });

  const defaultAddress = savedAddresses[0] ?? null;
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    defaultAddress?.id ?? null
  );
  const [addressMode, setAddressMode] = useState<"saved" | "new">(
    savedAddresses.length > 0 ? "saved" : "new"
  );
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [amountCopied, setAmountCopied] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuración de precios/envío y zona de entrega.
  const [pricing, setPricing] = useState<PricingSettings>(PRICING_DEFAULTS);
  const [isProvince, setIsProvince] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "locating" | "ok" | "denied"
  >("idle");

  useEffect(() => {
    getPricingSettings().then(setPricing);
  }, []);

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setIsProvince(isProvinceCoords(pricing, lat, lng));
        setGeoStatus("ok");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const subtotal = useMemo(() => getCartTotal(), [getCartTotal]);
  const shippingCost =
    deliveryMethod === "delivery" && isProvince
      ? pricing.provinceShippingCost
      : 0;
  const total = subtotal + shippingCost;

  const qrUrl = mediaUrl(paymentInfo?.qrImage?.url);

  // Fuera de Santa Cruz (envío a provincia) solo se acepta QR: el pedido viaja
  // por terminal/mensajería, así que debe prepagarse. El efectivo (contra
  // entrega o en tienda) solo aplica dentro de Santa Cruz o en recojo.
  const onlyQr = deliveryMethod === "delivery" && isProvince;

  const paymentOptions: { value: PaymentMethod; label: string }[] = onlyQr
    ? [{ value: "qr", label: "Pago por QR" }]
    : [
        { value: "cash", label: "Efectivo" },
        { value: "qr", label: "Pago por QR" }
      ];

  // Si el usuario tenía "efectivo" y pasa a zona solo-QR, se limpia la elección.
  useEffect(() => {
    if (onlyQr && paymentMethod === "cash") setPaymentMethod(null);
  }, [onlyQr, paymentMethod]);

  // El comprobante solo es obligatorio para pago por QR.
  const proofRequired = paymentMethod === "qr";

  const needsAddress = deliveryMethod === "delivery";
  const hasAddress =
    !needsAddress ||
    (addressMode === "saved" && selectedAddressId !== null) ||
    addressMode === "new";

  const canSubmit =
    items.length > 0 &&
    paymentMethod !== null &&
    (!proofRequired || proofFile !== null) &&
    hasAddress &&
    !submitting;

  function onProofChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  }

  function clearProof() {
    setProofFile(null);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofPreview(null);
  }

  async function copyAmount() {
    try {
      await navigator.clipboard.writeText(total.toFixed(2));
      setAmountCopied(true);
      setTimeout(() => setAmountCopied(false), 2000);
    } catch {
      // clipboard no disponible: el monto igual está visible en pantalla.
    }
  }

  const onSubmit = methods.handleSubmit(async (values) => {
    if (!paymentMethod) return;
    if (proofRequired && !proofFile) return;
    setSubmitting(true);
    setError(null);

    try {
      const useSaved =
        deliveryMethod === "delivery" && addressMode === "saved";
      const useNew =
        deliveryMethod === "delivery" && addressMode === "new";

      // Dentro de Santa Cruz solo pedimos nombre y teléfono; fuera de Santa
      // Cruz (provincia) además el CI para reclamar el envío en terminal.
      const newAddress = useNew
        ? {
            fullName: values.fullName,
            phone: values.phone,
            ci: isProvince ? values.ci?.trim() || undefined : undefined
          }
        : null;

      let finalAddressId: number | null = useSaved ? selectedAddressId : null;
      if (useNew && saveNewAddress) {
        const r = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: newAddress })
        });
        if (r.ok) {
          const j = (await r.json()) as { data: { id: number } };
          finalAddressId = j.data.id;
        }
      }

      const payload = {
        addressId: finalAddressId,
        address: useNew && !finalAddressId ? newAddress : null,
        deliveryMethod,
        paymentMethod,
        customerNotes: undefined,
        paymentReference: paymentReference.trim() || undefined,
        items: items.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          slug: it.product.slug,
          price: Number(it.product.price),
          quantity: it.quantity,
          imageUrl:
            it.product.image?.url ||
            it.product.image?.formats?.small?.url ||
            ""
        })),
        subtotal,
        total,
        // Zona de entrega: el servidor verifica con las coords si están; si no,
        // usa este flag como respaldo.
        isProvince: deliveryMethod === "delivery" ? isProvince : false,
        destLat: coords?.lat ?? null,
        destLng: coords?.lng ?? null
      };

      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (proofFile) formData.append("proof", proofFile);

      const res = await fetch("/api/orders/create", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo crear el pedido.");
      }

      clearCart();
      await refresh();
      router.push(`/account/orders/${data.orderId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setSubmitting(false);
    }
  });

  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Añade productos antes de pasar por el checkout.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Checkout
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Finaliza tu pedido
        </h1>
      </header>

      <FormProvider {...methods}>
        <form
          onSubmit={onSubmit}
          noValidate
          className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-12">
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                1 · Método de entrega
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "delivery", label: "Envío a domicilio" },
                    { value: "pickup", label: "Recoger en tienda" }
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer border px-4 py-3 text-sm ${
                      deliveryMethod === opt.value
                        ? "border-foreground"
                        : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={opt.value}
                      checked={deliveryMethod === opt.value}
                      onChange={() => setDeliveryMethod(opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </section>

            {deliveryMethod === "delivery" && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Zona de entrega
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 border border-border p-1 text-xs">
                    {(
                      [
                        { value: false, label: "Santa Cruz" },
                        { value: true, label: "Provincia (fuera de SC)" }
                      ] as const
                    ).map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setIsProvince(opt.value)}
                        className={`flex-1 px-3 py-2 font-semibold uppercase tracking-[0.14em] transition-colors ${
                          isProvince === opt.value
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-[0.14em] text-foreground underline-offset-4 hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    {geoStatus === "locating"
                      ? "Detectando ubicación…"
                      : "Detectar mi ubicación"}
                  </button>
                  {geoStatus === "ok" && (
                    <p className="text-xs text-muted-foreground">
                      Ubicación detectada:{" "}
                      {isProvince ? "fuera de Santa Cruz (provincia)" : "Santa Cruz"}.
                    </p>
                  )}
                  {geoStatus === "denied" && (
                    <p className="text-xs text-muted-foreground">
                      No pudimos obtener tu ubicación. Selecciona tu zona manualmente.
                    </p>
                  )}
                  {isProvince && (
                    <p className="text-xs text-muted-foreground">
                      Envío a provincia (a la terminal): Bs{" "}
                      {pricing.provinceShippingCost.toFixed(2)}.
                    </p>
                  )}
                </div>
              </section>
            )}

            {deliveryMethod === "delivery" && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  2 · Datos de envío
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="mb-4 flex gap-2 border border-border p-1 text-xs">
                    {(
                      [
                        { value: "saved", label: "Direcciones guardadas" },
                        { value: "new", label: "Usar una nueva" }
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setAddressMode(tab.value)}
                        className={`flex-1 px-3 py-2 font-semibold uppercase tracking-[0.14em] transition-colors ${
                          addressMode === tab.value
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {addressMode === "saved" && savedAddresses.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {savedAddresses.map((addr) => (
                      <li key={addr.id}>
                        <label
                          className={`block cursor-pointer border p-4 text-sm transition-colors ${
                            selectedAddressId === addr.id
                              ? "border-foreground"
                              : "border-border hover:border-foreground/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="sr-only"
                          />
                          <p className="font-semibold">{addr.fullName}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {addr.line1 && (
                              <>
                                {addr.line1}
                                {addr.line2 && `, ${addr.line2}`}
                                <br />
                              </>
                            )}
                            {(addr.city || addr.department) && (
                              <>
                                {[addr.city, addr.department]
                                  .filter(Boolean)
                                  .join(", ")}
                                <br />
                              </>
                            )}
                            Tel: {addr.phone}
                            {addr.ci && (
                              <>
                                <br />
                                CI: {addr.ci}
                              </>
                            )}
                          </p>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <TextInput
                        name="fullName"
                        label="Nombre completo"
                        required
                        validation={{ required: "Requerido" }}
                      />
                      <PhoneInput name="phone" label="Teléfono" required />
                    </div>
                    {isProvince && (
                      <div className="mt-4">
                        <TextInput
                          name="ci"
                          label="Carnet de identidad (CI)"
                          required
                          validation={{
                            required: "Requerido para envíos fuera de Santa Cruz"
                          }}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Necesario para reclamar el envío en la
                          terminal/mensajería.
                        </p>
                      </div>
                    )}
                    <label className="mt-4 flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="h-4 w-4 border-border accent-foreground"
                      />
                      Guardar esta dirección para próximas compras
                    </label>
                  </>
                )}
              </section>
            )}

            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {deliveryMethod === "delivery" ? "3" : "2"} · Método de pago
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer border px-4 py-3 text-sm ${
                      paymentMethod === opt.value
                        ? "border-foreground"
                        : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {onlyQr && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Para envíos fuera de Santa Cruz solo se acepta{" "}
                  <span className="font-semibold text-foreground">
                    pago por QR
                  </span>{" "}
                  (el pedido se envía por mensajería y debe estar pagado).
                </p>
              )}

              {paymentMethod !== null && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-foreground/20 bg-secondary/50 px-5 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Monto exacto a pagar
                    </p>
                    <p className="font-display text-2xl font-semibold">
                      Bs {total.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {paymentMethod === "qr"
                        ? "El QR no lleva el monto: ingrésalo manualmente en tu app bancaria."
                        : "Prepara el monto exacto en efectivo para pagar al recibir o al recoger."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyAmount}
                    className="shrink-0 border border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
                  >
                    {amountCopied ? "¡Copiado!" : "Copiar monto"}
                  </button>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="mt-6 space-y-2 border border-border bg-secondary/50 px-5 py-4 text-sm">
                  <p className="font-medium">Pago en efectivo</p>
                  <p className="text-muted-foreground">
                    {deliveryMethod === "pickup"
                      ? "Paga en efectivo al recoger tu pedido en la tienda."
                      : "Paga en efectivo al recibir tu pedido (contra entrega)."}{" "}
                    Ten listo el monto exacto: Bs {total.toFixed(2)}.
                  </p>
                </div>
              )}

              {paymentMethod === "qr" && (
                <div className="mt-6 border border-border bg-secondary/50 px-5 py-4 text-sm">
                  {qrUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQrZoomed(true)}
                        className="relative h-64 w-64 cursor-zoom-in bg-background transition-transform hover:scale-[1.02]"
                        aria-label="Ampliar QR para escanear"
                      >
                        <Image
                          src={qrUrl}
                          alt="QR de pago"
                          fill
                          sizes="256px"
                          className="object-contain"
                        />
                      </button>
                      <p className="text-center text-xs text-muted-foreground">
                        Toca el QR para ampliarlo. Escanéalo con tu app bancaria
                        y sube luego el comprobante.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      El QR todavía no está configurado. Contacta a la tienda.
                    </p>
                  )}
                </div>
              )}
            </section>

            {paymentMethod === "qr" && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {deliveryMethod === "delivery" ? "4" : "3"} · Comprobante de pago
                </h2>

                {!proofFile ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-secondary/30 px-6 py-10 text-sm text-muted-foreground hover:bg-secondary">
                    <Upload className="h-6 w-6" />
                    <span>Subir foto del comprobante</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={onProofChange}
                    />
                  </label>
                ) : (
                  <div className="relative inline-block">
                    {proofPreview && (
                      <div className="relative h-48 w-48 overflow-hidden border border-border">
                        <Image
                          src={proofPreview}
                          alt="Comprobante"
                          fill
                          sizes="192px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={clearProof}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background"
                      aria-label="Quitar comprobante"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  <label
                    htmlFor="paymentReference"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Nº de comprobante / transacción (opcional)
                  </label>
                  <input
                    id="paymentReference"
                    type="text"
                    inputMode="numeric"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    maxLength={120}
                    placeholder="Ej. 000123456789"
                    className="w-full max-w-xs border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cópialo desde tu app bancaria para agilizar la verificación.
                  </p>
                </div>
              </section>
            )}

            {error && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-secondary/30 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">
                Tu pedido
              </h2>
              <ul className="mb-4 divide-y divide-border">
                {items.map((it) => (
                  <li
                    key={it.product.id}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <span>
                      {it.product.name}{" "}
                      <span className="text-muted-foreground">× {it.quantity}</span>
                    </span>
                    <span>
                      Bs {(Number(it.product.price) * it.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>Bs {subtotal.toFixed(2)}</dd>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Envío a provincia
                    </dt>
                    <dd>Bs {shippingCost.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>Bs {total.toFixed(2)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 w-full bg-foreground px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Enviando…" : "Confirmar pedido"}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                Verificaremos tu comprobante y te confirmaremos el pedido en
                cuanto esté listo.
              </p>
            </div>
          </aside>
        </form>
      </FormProvider>

      {qrZoomed && qrUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR de pago ampliado"
          onClick={() => setQrZoomed(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 p-6"
        >
          <button
            type="button"
            onClick={() => setQrZoomed(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-square w-full max-w-[min(90vw,90vh)] bg-white p-4"
          >
            <Image
              src={qrUrl}
              alt="QR de pago ampliado"
              fill
              sizes="90vw"
              className="object-contain p-2"
              priority
            />
          </div>
          <p className="text-center text-sm text-white/80">
            Monto exacto: Bs {total.toFixed(2)} · Toca fuera del QR para cerrar
          </p>
        </div>
      )}
    </section>
  );
}
