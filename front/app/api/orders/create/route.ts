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
    // Último punto marcado en el mapa: se guarda con la dirección para que el
    // pin del checkout arranque ahí en la siguiente compra.
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
 * Fallo de una llamada a la API. Conserva el estado y el motivo para que el
 * checkout muestre "Producto no disponible" en vez de un 500 con el JSON crudo.
 */
class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/** Saca el `message` del error de Nest; si no lo hay, deja el texto en bruto. */
async function apiError(res: Response, fallback: string): Promise<ApiError> {
  const text = await res.text().catch(() => "");
  let message = text;
  try {
    const body = JSON.parse(text) as { message?: unknown };
    if (typeof body.message === "string" && body.message) {
      message = body.message;
    } else if (Array.isArray(body.message) && body.message.length) {
      // class-validator devuelve un array de mensajes
      message = body.message.join(". ");
    }
  } catch {
    // respuesta no JSON: nos queda el texto tal cual
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
      // Entradas del cálculo de envío: el servidor recalcula el coste con ellas
      // y además guarda destLat/destLng como ubicación de entrega del pedido
      // (es lo que ve el admin), así que deben llegar con toda su precisión.
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
  // Strapi v5 devuelve los atributos aplanados (sin envoltorio `attributes`).
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
  // El comprobante solo es obligatorio para pago por QR; en efectivo se paga
  // contra entrega o en tienda.
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
    // Un 4xx de la API es un problema del pedido (producto no disponible,
    // dirección inválida…), no un fallo de este servidor: se propaga el estado
    // y el motivo para que el checkout lo muestre tal cual. El resto sí es 500.
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
