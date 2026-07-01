import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-x-hidden">
        <div className="px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
