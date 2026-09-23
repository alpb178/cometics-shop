"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function Error() {
  const t = useTranslations("errors.page");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt={t("imageAlt")}
          width={100}
          height={100}
          className="mx-auto mb-6 rounded-full border-2 border-primary"
        />
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <p className="text-gray-600 mb-4">
          {t("description")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="min-h-[44px] px-6 py-3 border-2 border-primary rounded-full text-primary hover:bg-primary hover:text-white transition-colors font-medium"
          aria-label={t("retryLabel")}
        >
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
