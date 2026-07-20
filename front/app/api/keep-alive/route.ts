import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Endpoint de keep-alive disparado por Vercel Cron (ver vercel.json).
 * Llama a `/api/health/db` del backend, que hace un `SELECT 1`, para:
 *  - mantener ACTIVO el proyecto de Supabase (el plan free se pausa tras
 *    inactividad),
 *  - y despertar la API (evita que quede dormida por inactividad).
 */
export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return NextResponse.json(
      { ok: false, error: "NEXT_PUBLIC_API_URL no definida" },
      { status: 500 }
    );
  }
  try {
    const res = await fetch(new URL("api/health/db", base), {
      cache: "no-store"
    });
    const db = await res.json().catch(() => ({}));
    return NextResponse.json(
      { ok: res.ok, db, at: new Date().toISOString() },
      { status: res.ok ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "error" },
      { status: 503 }
    );
  }
}
