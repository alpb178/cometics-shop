import { DashboardShell } from "@/components/admin/admin-shell";
import { requireStaff } from "@/lib/admin/auth-guard";
import { getCurrentUser } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iris Natural · Panel",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Server-side gate for the whole panel: no session → /sign-in; not staff → home.
  await requireStaff();
  const user = await getCurrentUser();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
