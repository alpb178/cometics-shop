"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { errorMessage } from "@/lib/auth/client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextInput } from "@/components/form/text-input/TextInput";

type FormValues = { email: string };

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const methods = useForm<FormValues>({ mode: "onTouched" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async ({ email }) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "");
      setSent(true);
    } catch (err) {
      setError(errorMessage(err, t("common.genericError")));
    } finally {
      setSubmitting(false);
    }
  });

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {t("forgotPassword.sentTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("forgotPassword.sentBody")}
        </p>
        <Link
          href="/sign-in"
          className="inline-block text-sm font-semibold underline-offset-4 hover:underline"
        >
          {t("common.backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {t("forgotPassword.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("forgotPassword.subtitle")}
          </p>
        </header>

        <TextInput
          name="email"
          label={t("common.email")}
          type="email"
          required
          validation={{
            required: t("common.emailRequired"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("common.emailInvalid")
            }
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
          {submitting ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/sign-in"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {t("common.backToSignIn")}
          </Link>
        </p>
      </form>
    </FormProvider>
  );
}
