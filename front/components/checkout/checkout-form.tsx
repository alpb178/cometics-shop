"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Upload, X, MapPin, ArrowLeft } from "lucide-react";
import {
  getPricingSettings,
  isProvinceCoords,
  PRICING_DEFAULTS,
  type PricingSettings
} from "@/lib/pricing";
import { PhoneInput } from "@/components/form/phone-input/PhoneInput";
import { TextInput } from "@/components/form/text-input/TextInput";
import { LocationPicker } from "@/components/checkout/location-picker";
import { StoreMap } from "@/components/checkout/store-map";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import type { Address } from "@/definitions/Address";
import type { User } from "@/definitions/User";
import type { PaymentInfo } from "@/definitions/PaymentInfo";
import type { DeliveryMethod, PaymentMethod } from "@/definitions/Order";
import { formatAmount } from "@/lib/price";

type FormValues = {
  fullName: string;
  phone: string;
  ci?: string;
  zona?: string;
  department?: string;
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

  // Wizard step: 1 = delivery method, 2 = delivery details, 3 = payment.
  // Improves the mobile experience.
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const defaultAddress = savedAddresses[0] ?? null;
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    defaultAddress?.id ?? null
  );
  const [addressMode, setAddressMode] = useState<"saved" | "new">(
    savedAddresses.length > 0 ? "saved" : "new"
  );
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [amountCopied, setAmountCopied] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pricing/shipping configuration and delivery zone.
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

  // Inside Santa Cruz we show the map to pin the delivery point.
  const showMap = deliveryMethod === "delivery" && !isProvince;

  const requestLocation = useCallback(() => {
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
  }, [pricing]);

  // Last saved point for the chosen destination: only exists when a saved
  // address that already has a point is being used.
  const savedCoords = useMemo(() => {
    if (addressMode !== "saved") return null;
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!addr || addr.lat == null || addr.lng == null) return null;
    return { lat: addr.lat, lng: addr.lng };
  }, [addressMode, savedAddresses, selectedAddressId]);

  // The pin follows the chosen destination: it jumps to the point of the new
  // address, and is cleared if that address has none. It used to be assigned
  // only when there was a point, so switching to an address without one kept
  // the previous address's pin — and on confirm that foreign point was saved
  // into it.
  useEffect(() => {
    setCoords(savedCoords);
  }, [savedCoords]);

  // With no point for the chosen destination, the device's real location is
  // requested. The pin used to be pre-centered on downtown Santa Cruz, so
  // anyone who did not touch the map sent a point they never chose. `geoStatus`
  // itself prevents retries: "locating" blocks re-entry and "denied" does not
  // ask again.
  useEffect(() => {
    if (!showMap || coords || savedCoords) return;
    if (geoStatus === "locating" || geoStatus === "denied") return;
    requestLocation();
  }, [showMap, coords, savedCoords, geoStatus, requestLocation]);

  const subtotal = useMemo(() => getCartTotal(), [getCartTotal]);
  const shippingCost =
    deliveryMethod === "delivery" && isProvince
      ? pricing.provinceShippingCost
      : 0;
  const total = subtotal + shippingCost;

  const qrUrl = mediaUrl(paymentInfo?.qrImage?.url);

  // Outside Santa Cruz (shipping to the provinces) only QR is accepted: the
  // order travels by bus terminal/courier, so it must be prepaid.
  const onlyQr = deliveryMethod === "delivery" && isProvince;

  const paymentOptions: { value: PaymentMethod; label: string }[] = onlyQr
    ? [{ value: "qr", label: "Pago por QR" }]
    : [
        { value: "cash", label: "Efectivo" },
        { value: "qr", label: "Pago por QR" }
      ];

  useEffect(() => {
    if (onlyQr && paymentMethod === "cash") setPaymentMethod(null);
  }, [onlyQr, paymentMethod]);

  const proofRequired = paymentMethod === "qr";

  const canSubmit =
    items.length > 0 &&
    paymentMethod !== null &&
    (!proofRequired || proofFile !== null) &&
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
      await navigator.clipboard.writeText(formatAmount(total));
      setAmountCopied(true);
      setTimeout(() => setAmountCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the amount is visible on screen anyway.
    }
  }

  function goToStep(next: 1 | 2 | 3) {
    setError(null);
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  // Validate step 2 (delivery details) before moving on to payment.
  async function goToPayment() {
    setError(null);
    if (deliveryMethod === "delivery") {
      const useSaved = addressMode === "saved" && savedAddresses.length > 0;
      if (useSaved) {
        if (selectedAddressId == null) {
          setError("Selecciona una dirección guardada.");
          return;
        }
      } else {
        const fields = isProvince
          ? (["fullName", "phone", "ci", "zona", "department"] as const)
          : (["fullName", "phone"] as const);
        const ok = await methods.trigger(fields as unknown as (keyof FormValues)[]);
        if (!ok) return;
      }
      if (!isProvince && !coords) {
        setError("Marca tu ubicación de entrega en el mapa.");
        return;
      }
    } else {
      // Store pickup: we ask for a contact name and phone.
      const ok = await methods.trigger(["fullName", "phone"]);
      if (!ok) return;
    }
    goToStep(3);
  }

  const onSubmit = methods.handleSubmit(async (values) => {
    if (step !== 3) return;
    if (!paymentMethod) return;
    if (proofRequired && !proofFile) return;
    setSubmitting(true);
    setError(null);

    try {
      const isPickup = deliveryMethod === "pickup";
      const useSaved =
        deliveryMethod === "delivery" && addressMode === "saved";
      const useNew = deliveryMethod === "delivery" && addressMode === "new";

      // A contact (name + phone) is attached to the order both for home
      // delivery (new address) and for store pickup. Inside Santa Cruz only
      // name and phone; outside Santa Cruz also CI, zone and department (zone
      // -> `city`, department -> `department`).
      const collectContact = useNew || isPickup;
      // The map point is saved with the address so the pin starts there next
      // time. Only applies to delivery inside Santa Cruz, which is where it is
      // marked on the map.
      const pointFields =
        useNew && !isProvince && coords
          ? { lat: coords.lat, lng: coords.lng }
          : {};
      const newAddress = collectContact
        ? {
            fullName: values.fullName,
            phone: values.phone,
            ...pointFields,
            ...(useNew && isProvince
              ? {
                  ci: values.ci?.trim() || undefined,
                  city: values.zona?.trim() || undefined,
                  department: values.department?.trim() || undefined
                }
              : {})
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

      // Saved address whose point changed: it is updated so the next purchase
      // starts at the last place the customer chose. A failure does not stop
      // the order: it is a convenience, not a requirement.
      if (
        useSaved &&
        selectedAddressId != null &&
        coords &&
        (savedCoords?.lat !== coords.lat || savedCoords?.lng !== coords.lng)
      ) {
        await fetch(`/api/addresses/${selectedAddressId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: { lat: coords.lat, lng: coords.lng } })
        }).catch((e) => {
          // Does not stop the order, but it is not silenced either: if this
          // fails, the next purchase starts again with no point and no clue
          // why.
          console.error("Could not save the address point", e);
        });
      }

      const payload = {
        addressId: finalAddressId,
        address: collectContact && !finalAddressId ? newAddress : null,
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
        // Delivery zone: the server checks with the coords if present;
        // otherwise it uses this flag as a fallback.
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

      // Success: we navigate first (keeping `submitting` true) so the UI does
      // not flash the "empty cart" state when the cart is cleared before the
      // redirect completes. The cart is cleared and the session refreshed
      // without blocking navigation to the order detail.
      router.push(`/account/orders/${data.orderId}`);
      router.refresh();
      clearCart();
      refresh().catch(() => {});
    } catch (err) {
      // We only re-enable the button on error; on the success path we leave the
      // page, so `submitting` stays true and the loading state visible.
      setError(err instanceof Error ? err.message : "Algo salió mal.");
      setSubmitting(false);
    }
  });

  // Do not show "empty cart" while the order is being submitted: after the
  // payment is confirmed we clear the cart, and without this guard the screen
  // would flash "empty" before the redirect to the order detail completes.
  if (items.length === 0 && !submitting) {
    return (
      <section className="mx-auto w-full max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Añade productos antes de pasar por el checkout.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Checkout
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Finaliza tu pedido
        </h1>
        {/* Step indicator: completed steps are clickable to go back; moving
            forward is only possible with the buttons (they validate). */}
        <div className="mt-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
          {(
            [
              { n: 1, label: "Método" },
              { n: 2, label: "Entrega" },
              { n: 3, label: "Pago" }
            ] as const
          ).map((s, i) => (
            <Fragment key={s.n}>
              {i > 0 && <span className="h-px w-8 bg-border" />}
              <button
                type="button"
                onClick={() => goToStep(s.n)}
                disabled={s.n >= step}
                className={
                  s.n === step
                    ? "text-foreground"
                    : s.n < step
                      ? "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      : "cursor-default text-muted-foreground"
                }
              >
                {s.n} · {s.label}
              </button>
            </Fragment>
          ))}
        </div>
      </header>

      <FormProvider {...methods}>
        <form
          onSubmit={onSubmit}
          noValidate
          className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-12">
            {step > 1 && (
              <button
                type="button"
                onClick={() => goToStep(step === 3 ? 2 : 1)}
                className="-mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 3 ? "Volver a entrega" : "Volver al método de entrega"}
              </button>
            )}

            {/* ==================== STEP 1: DELIVERY METHOD ==================== */}
            {step === 1 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Método de entrega
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        value: "delivery",
                        label: "Envío a domicilio",
                        description:
                          "Te llevamos el pedido hasta donde estés. Envío gratuito hasta el 10.º anillo; fuera de esta zona se adiciona Bs. 17."
                      },
                      {
                        value: "pickup",
                        label: "Recoger en tienda",
                        description:
                          "Pasa por la tienda cuando tu pedido esté listo: luego de 12 horas, entre las 10:00 y las 20:00."
                      }
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer border px-4 py-4 text-sm ${
                        deliveryMethod === opt.value
                          ? "border-foreground"
                          : "border-border hover:border-foreground/40"
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
                      <span className="block font-semibold">{opt.label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {opt.description}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* ==================== STEP 2: DELIVERY DETAILS ==================== */}
            {step === 2 && (
              <>
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
                      {geoStatus === "denied" && (
                        <p className="text-xs text-muted-foreground">
                          No pudimos obtener tu ubicación. Selecciona tu zona
                          manualmente.
                        </p>
                      )}
                      {isProvince && (
                        <p className="text-xs text-muted-foreground">
                          Envío a provincia (a la terminal): Bs{" "}
                          {formatAmount(pricing.provinceShippingCost)}.
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {showMap && (
                  <section>
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Ubicación de entrega
                    </h2>
                    <p className="mb-3 text-xs text-muted-foreground">
                      Marca en el mapa dónde entregar (por si no estás en casa).
                    </p>
                    <LocationPicker
                      value={coords}
                      center={{
                        lat: pricing.scCenterLat,
                        lng: pricing.scCenterLng
                      }}
                      onChange={setCoords}
                    />
                  </section>
                )}

                {deliveryMethod === "delivery" && (
                  <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Datos de envío
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
                                Tel: {addr.phone}
                                {addr.ci && (
                                  <>
                                    <br />
                                    CI: {addr.ci}
                                  </>
                                )}
                                {(addr.city || addr.department) && (
                                  <>
                                    <br />
                                    {[addr.city, addr.department]
                                      .filter(Boolean)
                                      .join(", ")}
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
                          <>
                            <div className="mt-4">
                              <TextInput
                                name="ci"
                                label="Carnet de identidad (CI)"
                                required
                                validation={{
                                  required:
                                    "Requerido para envíos fuera de Santa Cruz"
                                }}
                              />
                              <p className="mt-1 text-xs text-muted-foreground">
                                Necesario para reclamar el envío en la
                                terminal/mensajería.
                              </p>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <TextInput
                                name="zona"
                                label="Zona"
                                required
                                validation={{ required: "Requerido" }}
                              />
                              <TextInput
                                name="department"
                                label="Departamento"
                                required
                                validation={{ required: "Requerido" }}
                              />
                            </div>
                          </>
                        )}
                        <label className="mt-4 flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={saveNewAddress}
                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                            className="h-4 w-4 border-border accent-foreground"
                          />
                          Guardar estos datos para próximas compras
                        </label>
                      </>
                    )}
                  </section>
                )}

                {deliveryMethod === "pickup" && (
                  <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Datos de contacto
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <TextInput
                        name="fullName"
                        label="Nombre completo"
                        required
                        validation={{ required: "Requerido" }}
                      />
                      <PhoneInput name="phone" label="Teléfono" required />
                    </div>
                    <p className="mt-6 mb-3 text-sm text-muted-foreground">
                      Recoges tu pedido en la tienda; te avisaremos cuando esté
                      listo. Esta es nuestra ubicación:
                    </p>
                    <StoreMap />
                  </section>
                )}
              </>
            )}

            {/* ======================== STEP 3: PAYMENT ======================== */}
            {step === 3 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Método de pago
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
                        Bs {formatAmount(total)}
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
                      Ten listo el monto exacto: Bs {formatAmount(total)}.
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
                          Toca el QR para ampliarlo. Escanéalo con tu app
                          bancaria y sube luego el comprobante.
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        El QR todavía no está configurado. Contacta a la tienda.
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === "qr" && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Comprobante de pago
                    </h3>

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
                        Cópialo desde tu app bancaria para agilizar la
                        verificación.
                      </p>
                    </div>
                  </div>
                )}
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
                      <span className="text-muted-foreground">
                        × {it.quantity}
                      </span>
                    </span>
                    <span>
                      Bs {formatAmount(Number(it.product.price) * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>Bs {formatAmount(subtotal)}</dd>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Envío a provincia</dt>
                    <dd>Bs {formatAmount(shippingCost)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>Bs {formatAmount(total)}</dd>
                </div>
              </dl>

              {step === 1 && (
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="mt-6 w-full bg-foreground px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
                >
                  Continuar
                </button>
              )}
              {step === 2 && (
                <>
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="mt-6 w-full bg-foreground px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
                  >
                    Continuar al pago
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="mt-3 flex w-full items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al método de entrega
                  </button>
                </>
              )}
              {step === 3 && (
                <>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-6 w-full bg-foreground px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Enviando…" : "Confirmar pedido"}
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="mt-3 flex w-full items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a entrega
                  </button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Verificaremos tu comprobante y te confirmaremos el pedido en
                    cuanto esté listo.
                  </p>
                </>
              )}
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
            Monto exacto: Bs {formatAmount(total)} · Toca fuera del QR para cerrar
          </p>
        </div>
      )}
    </section>
  );
}
