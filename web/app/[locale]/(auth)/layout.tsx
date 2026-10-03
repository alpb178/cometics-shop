import LayoutApp from "@/app/layout-app";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutApp>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16 lg:py-24">
        {children}
      </main>
    </LayoutApp>
  );
}
