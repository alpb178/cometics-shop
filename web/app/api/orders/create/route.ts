import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

type Payload = {
  addressId?: number | null;
  address: null | {
    fullName: string;
    phone: string;
    line1?: string;
    line2?: string;
    city?: string;
    department?: string;
    ci?: string;
    notes?: string;
    // Last point marked on the map: saved with the address so the checkout pin
    // starts there on the next purchase.
    lat?: number;
    lng?: number;
  };
  deliveryMethod: "delivery" | "pickup";
  paymentMethod: "cash" | "qr";
  customerNotes?: string;
  paymentReference?: string;
  items: Array<{
    productId: number;
    name: string;
    slug?: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  subtotal: number;
  total: number;
  isProvince?: boolean;
  destLat?: number | null;
  destLng?: number | null;
};

/**
 * A failed API call. Keeps the status and reason so checkout shows
 * "Producto no disponible" instead of a 500 with the raw JSON.
 */
class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/** Extracts the `message` from the Nest error; if missing, keeps the raw text. */
async function apiError(res: Response, fallback: string): Promise<ApiError> {
  const text = await res.text().catch(() => "");
  let message = text;
  try {
    const body = JSON.parse(text) as { message?: unknown };
    if (typeof body.message === "string" && body.message) {
      message = body.message;
    } else if (Array.isArray(body.message) && body.message.length) {
      // class-validator returns an array of messages
      message = body.message.join(". ");
    }
  } catch {
    // non-JSON response: keep the text as is
  }
  return new ApiError(message || fallback, res.status);
}

async function uploadProof(token: string, file: File): Promise<number> {
  const fd = new FormData();
  fd.append("files", file, file.name);
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });
  if (!res.ok) {
    throw await apiError(res, "No se pudo subir el comprobante.");
  }
  const data = (await res.json()) as Array<{ id: number }>;
  if (!data?.[0]?.id) throw new Error("upload returned no id");
  return data[0].id;
}

async function createAddress(
  token: string,
  address: NonNullable<Payload["address"]>
): Promise<number> {
  const res = await fetch(`${STRAPI_URL}/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ data: address })
  });
  if (!res.ok) {
    throw await apiError(res, "No se pudo guardar la dirección.");
  }
  const data = (await res.json()) as { data: { id: number } };
  return data.data.id;
}

async function createOrder(
  token: string,
  payload: Payload,
  proofId: number | null,
  addressId: number | null
): Promise<{ id: number; orderNumber?: string }> {
  const body = {
    data: {
      items: payload.items,
      shippingAddress: addressId,
      deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod,
      paymentProof: proofId,
      subtotal: payload.subtotal,
      total: payload.total,
      customerNotes: payload.customerNotes,
      paymentReference: payload.paymentReference,
      // Shipping calculation inputs: the server recalculates the cost with them
      // and also stores destLat/destLng as the order's delivery location
      // (it's what the admin sees), so they must arrive at full precision.
      isProvince: payload.isProvince ?? false,
      destLat: payload.destLat ?? null,
      destLng: payload.destLng ?? null
    }
  };
  const res = await fetch(`${STRAPI_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    throw await apiError(res, "No se pudo crear el pedido.");
  }
  // Strapi v5 returns flattened attributes (no `attributes` wrapper).
  const data = (await res.json()) as {
    data: { id: number; orderNumber?: string };
  };
  return { id: data.data.id, orderNumber: data.data.orderNumber };
}

export async function POST(req: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const payloadRaw = form.get("payload");
  const proof = form.get("proof");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  let payload: Payload;
  try {
    payload = JSON.parse(payloadRaw) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid payload JSON" }, { status: 400 });
  }

  if (!payload.items?.length) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
  }
  // The receipt is only required for QR payment; cash is paid on delivery
  // or in store.
  if (payload.paymentMethod === "qr" && !(proof instanceof File)) {
    return NextResponse.json({ error: "Missing proof file" }, { status: 400 });
  }
  if (
    payload.deliveryMethod === "delivery" &&
    !payload.address &&
    !payload.addressId
  ) {
    return NextResponse.json(
      { error: "Falta la dirección de envío" },
      { status: 400 }
    );
  }

  try {
    const proofId =
      proof instanceof File ? await uploadProof(token, proof) : null;
    let addressId: number | null = payload.addressId ?? null;
    if (!addressId && payload.address) {
      addressId = await createAddress(token, payload.address);
    }
    const order = await createOrder(token, payload, proofId, addressId);
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber
    });
  } catch (err) {
    // A 4xx from the API is a problem with the order (product unavailable,
    // invalid address…), not a failure of this server: the status and reason
    // are passed through so checkout shows them as is. Anything else is a 500.
    if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[orders/create]", err);
    return NextResponse.json(
      { error: "No se pudo crear el pedido. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
