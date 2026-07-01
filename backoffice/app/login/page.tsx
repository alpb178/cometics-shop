import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar · Iris Natural Backoffice" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-light to-neutral-100 p-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-brand-dark">
            Iris Natural
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Panel de administración</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
