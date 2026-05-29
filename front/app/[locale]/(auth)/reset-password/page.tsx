"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PasswordInput } from "@/components/form/password-input/PasswordInput";
import { useAuth } from "@/context/auth-context";

type FormValues = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { refresh } = useAuth();
  const methods = useForm<FormValues>({ mode: "onTouched" });
  const password = methods.watch("password");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    if (!code) {
      setError("Enlace inválido o expirado.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Algo salió mal.");
      await refresh();
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setSubmitting(false);
    }
  });

  if (!code) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Enlace inválido
        </h1>
        <p className="text-sm text-muted-foreground">
          Este enlace no es válido o ya fue usado. Pide uno nuevo desde
          la página de recuperación.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-semibold underline-offset-4 hover:underline"
        >
          Pedir un nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Nueva contraseña
          </h1>
          <p className="text-sm text-muted-foreground">
            Elige una nueva contraseña para tu cuenta.
          </p>
        </header>

        <PasswordInput
          name="password"
          label="Nueva contraseña"
          required
          validation={{
            required: "La contraseña es requerida",
            minLength: { value: 8, message: "Mínimo 8 caracteres" }
          }}
        />
        <PasswordInput
          name="passwordConfirmation"
          label="Repite la contraseña"
          required
          validation={{
            required: "Confirma tu contraseña",
            validate: (v: string) =>
              v === password || "Las contraseñas no coinciden"
          }}
        />

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
          {submitting ? "Guardando…" : "Restablecer contraseña"}
        </button>
      </form>
    </FormProvider>
  );
}
