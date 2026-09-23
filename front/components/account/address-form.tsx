"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { errorMessage } from "@/lib/auth/client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PhoneInput } from "@/components/form/phone-input/PhoneInput";
import { TextInput } from "@/components/form/text-input/TextInput";
import type { Address, AddressInput } from "@/definitions/Address";

type FormValues = AddressInput & { isDefault?: boolean };

export function AddressForm({
  initial,
  mode
}: {
  initial?: Address;
  mode: "create" | "edit";
}) {
  const t = useTranslations("account.addressForm");
  const router = useRouter();
  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      fullName: initial?.fullName ?? "",
      phone: initial?.phone ?? "",
      line1: initial?.line1 ?? "",
      line2: initial?.line2 ?? "",
      city: initial?.city ?? "",
      department: initial?.department ?? "Santa Cruz",
      notes: initial?.notes ?? "",
      isDefault: initial?.isDefault ?? false
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const url =
        mode === "create"
          ? "/api/addresses"
          : `/api/addresses/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: values })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || t("saveError"));
      }
      router.push("/account/addresses");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, t("genericError")));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            name="fullName"
            label={t("fullName")}
            required
            validation={{ required: t("required") }}
          />
          <PhoneInput name="phone" label={t("phone")} required />
        </div>

        <TextInput
          name="line1"
          label={t("line1")}
          required
          validation={{ required: t("required") }}
        />

        <TextInput
          name="line2"
          label={t("line2")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            name="city"
            label={t("city")}
            required
            validation={{ required: t("required") }}
          />
          <TextInput
            name="department"
            label={t("department")}
            required
            validation={{ required: t("required") }}
          />
        </div>

        <TextInput name="notes" as="textarea" label={t("notes")} />

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            {...methods.register("isDefault")}
            className="h-4 w-4 border-border accent-foreground"
          />
          {t("makeDefault")}
        </label>

        {error && (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-foreground px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? t("saving")
              : mode === "create"
                ? t("saveNew")
                : t("saveChanges")}
          </button>
          <button
            type="button"
            onClick={() => router.push("/account/addresses")}
            className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] underline-offset-4 hover:underline"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
