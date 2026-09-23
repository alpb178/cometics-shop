"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * ES | EN toggle. Replaces the current URL with the same path under the other
 * locale prefix (query string kept); next-intl stores the choice in the
 * NEXT_LOCALE cookie so the next unprefixed visit lands on it.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common.localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(href, { locale: next, scroll: false });
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wide",
        pending && "opacity-60",
        className
      )}
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i > 0 && <span aria-hidden className="px-1 text-gray-300">|</span>}
          <button
            type="button"
            lang={l}
            onClick={() => switchTo(l)}
            aria-pressed={l === locale}
            aria-label={t(l)}
            className={cn(
              "min-h-[32px] px-1.5 transition-colors",
              l === locale ? "text-primary" : "text-gray-500 hover:text-primary"
            )}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
