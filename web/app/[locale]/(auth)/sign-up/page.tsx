"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PasswordInput } from "@/components/form/password-input/PasswordInput";
import { PhoneInput } from "@/components/form/phone-input/PhoneInput";
import { TextInput } from "@/components/form/text-input/TextInput";
import { GoogleButton } from "@/components/auth/google-button";
import { useAuth } from "@/context/auth-context";
import { errorMessage, isAdminPath, safeRedirectPath } from "@/lib/auth/client";

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUpPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const methods = useForm<FormValues>({ mode: "onTouched" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const password = methods.watch("password");

  const onSubmit = methods.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone
      });
      const redirect = safeRedirectPath(searchParams.get("redirect"));
      if (isAdminPath(redirect)) {
        // The panel is unprefixed and Spanish-only: leave the locale tree.
        window.location.assign(redirect);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, t("common.genericError")));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {t("signUp.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("signUp.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            name="firstName"
            label={t("signUp.firstName")}
            required
            validation={{ required: t("signUp.firstNameRequired") }}
          />
          <TextInput
            name="lastName"
            label={t("signUp.lastName")}
            required
            validation={{ required: t("signUp.lastNameRequired") }}
          />
        </div>

        <PhoneInput name="phone" label={t("signUp.phone")} required />

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordInput
            name="password"
            label={t("common.password")}
            required
            validation={{
              required: t("common.passwordRequired"),
              minLength: { value: 8, message: t("common.passwordMinLength") }
            }}
          />
          <PasswordInput
            name="passwordConfirm"
            label={t("common.passwordRepeat")}
            required
            validation={{
              required: t("common.passwordConfirmRequired"),
              validate: (v: string) =>
                v === password || t("common.passwordMismatch")
            }}
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
          {submitting ? t("signUp.submitting") : t("signUp.submit")}
        </button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("common.or")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton label={t("signUp.google")} />

        <p className="text-center text-sm text-muted-foreground">
          {t("signUp.haveAccount")}{" "}
          <Link
            href={`/sign-in${
              searchParams.get("redirect")
                ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}`
                : ""
            }`}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {t("signUp.signInLink")}
          </Link>
        </p>
      </form>
    </FormProvider>
  );
}
