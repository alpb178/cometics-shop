"use client";

import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { forwardRef, Suspense, useMemo, type ComponentProps } from "react";
import {
  GROUP_LANGUAGES,
  LanguageSwitcher,
  type LanguageOption
} from "@/components/language-switcher/language-switcher";
import { getPathname, usePathname } from "@/i18n/navigation";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Same cookie next-intl reads in the middleware to remember the language. */
const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * The options' hrefs are already localized (`/pt/faq?x=1`), so they go through
 * plain `next/link`: next-intl's `Link` and `TransitionLink` would prefix them
 * again with the current locale. No prefetch: each option is a whole new tree.
 */
const LocaleLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<"a"> & { href: string }
>(function LocaleLink({ href, ...rest }, ref) {
  return <NextLink ref={ref} href={href} prefetch={false} {...rest} />;
});

type Props = {
  className?: string;
  /** Menu edge aligned with the button (default: right, "end"). */
  align?: "start" | "end";
  /** Open the menu upwards (e.g. at the bottom of a scrolling drawer). */
  placement?: "bottom" | "top";
  /** Called after a language is picked (e.g. to close the mobile menu). */
  onSelect?: (code: string) => void;
};

function Menu({
  query,
  className,
  align,
  placement,
  onSelect
}: Props & { query: string }) {
  const t = useTranslations("common.localeSwitcher");
  const current = useLocale();
  // Locale-free path (`/faq`), re-prefixed for each option.
  const pathname = usePathname();

  const options = useMemo<LanguageOption[]>(
    () =>
      GROUP_LANGUAGES.filter((l) => isAppLocale(l.code)).map((l) => {
        const path = getPathname({
          href: pathname,
          locale: l.code as AppLocale
        });
        return { ...l, href: query ? `${path}?${query}` : path };
      }),
    [pathname, query]
  );

  return (
    <LanguageSwitcher
      current={current}
      options={options}
      linkAs={LocaleLink}
      label={t("label")}
      align={align}
      placement={placement}
      className={cn("lang-switcher-iris", className)}
      onSelect={(code) => {
        // Kept in sync on the client too: a router-cache hit skips the middleware.
        document.cookie = `${LOCALE_COOKIE}=${code}; path=/; SameSite=Lax`;
        onSelect?.(code);
      }}
    />
  );
}

function MenuWithQuery(props: Props) {
  const query = useSearchParams().toString();
  return <Menu {...props} query={query} />;
}

/**
 * Language menu of the navbars: the group's shared `LanguageSwitcher`, with one
 * link per locale to the current page (query string kept). The fallback renders
 * the same links without the query so they are in the server HTML too.
 */
export function LocaleMenu(props: Props) {
  return (
    <Suspense fallback={<Menu {...props} query="" />}>
      <MenuWithQuery {...props} />
    </Suspense>
  );
}
