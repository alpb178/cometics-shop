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

async function uploadProof(token: string, file: File): Promise<number> {
  const fd = new FormData();
  fd.append("files", file, file.name);
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`upload failed: ${res.status} ${text}`);
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
    const text = await res.text().catch(() => "");
    throw new Error(`address failed: ${res.status} ${text}`);
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
      // Entradas de cálculo de envío; el servidor las verifica y no las persiste.
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
    const text = await res.text().catch(() => "");
    throw new Error(`order failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    data: { id: number; attributes?: { orderNumber?: string } };
  };
  return { id: data.data.id, orderNumber: data.data.attributes?.orderNumber };
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
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { error: `No se pudo crear el pedido: ${msg}` },
      { status: 500 }
    );
  }
}
