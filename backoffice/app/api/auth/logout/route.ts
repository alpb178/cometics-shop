import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, USER_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(USER_COOKIE);
  return NextResponse.redirect(new URL("/login", req.url));
}
