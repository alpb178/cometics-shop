"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PasswordInput } from "@/components/form/password-input/PasswordInput";
import { TextInput } from "@/components/form/text-input/TextInput";
import { useAuth } from "@/context/auth-context";

type FormValues = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const methods = useForm<FormValues>({ mode: "onTouched" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email, values.password);
      const redirect = searchParams.get("redirect") ?? "/";
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-muted-foreground">
            Accede a tu cuenta para finalizar tu compra
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <TextInput
            name="email"
            label="Email"
            type="email"
            placeholder="tu@correo.com"
            required
            validation={{
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            }}
          />
          <PasswordInput
            name="password"
            label="Contraseña"
            required
            validation={{ required: "La contraseña es requerida" }}
          />
        </div>

        {error && (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-foreground px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Entrando…" : "Iniciar sesión"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href={`/sign-up${
              searchParams.get("redirect")
                ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}`
                : ""
            }`}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </FormProvider>
  );
}
