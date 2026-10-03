import { NextResponse } from "next/server";
import { authFetch } from "@/lib/strapi/auth-fetch";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body?.data) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  const res = await authFetch(`/api/addresses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: body.data })
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.message || "No se pudo actualizar" },
      { status: res.status }
    );
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await authFetch(`/api/addresses/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: data?.error?.message || "No se pudo eliminar" },
      { status: res.status }
    );
  }
  return NextResponse.json({ ok: true });
}
