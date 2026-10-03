"use client";

import { Link as ViewTransitionLink } from "next-view-transitions";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { getPathname } from "@/i18n/navigation";

type Props = Omit<ComponentProps<typeof ViewTransitionLink>, "href"> & {
  /** Unprefixed internal path (`/cart`) or an absolute/hash/mailto URL. */
  href: string;
};

/**
 * `next-view-transitions` Link that keeps the locale prefix. Internal paths are
 * resolved with next-intl's `getPathname`, so `/cart` becomes `/es/cart` or
 * `/en/cart`; anything else (http, mailto, tel, #hash) is passed through.
 */
export function TransitionLink({ href, ...rest }: Props) {
  const locale = useLocale();
  const localized =
    href.startsWith("/") && !href.startsWith("//")
      ? getPathname({ href, locale })
      : href;
  return <ViewTransitionLink href={localized} {...rest} />;
}
