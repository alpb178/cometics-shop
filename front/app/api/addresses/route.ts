import { NextResponse } from "next/server";
import { authFetch } from "@/lib/strapi/auth-fetch";

export async function GET() {
  const res = await authFetch(
    "/api/addresses?sort[0]=createdAt:desc&pagination[pageSize]=50"
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: "No se pudieron cargar las direcciones" },
      { status: res.status }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  let body: { data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body?.data) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  const res = await authFetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: body.data })
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.message || "No se pudo crear la dirección" },
      { status: res.status }
    );
  }
  return NextResponse.json(data);
}
