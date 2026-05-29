"use client";

import { LogoNavbar } from "@/components/logo/logo-navbar";
import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useAppMode } from "@/hooks/useAppMode";
import { CartIcon } from "../cart/cart-icon";
import { UserMenu } from "../auth/user-menu";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const DesktopNavbar = ({ leftNavbarItems, logo, locale }: Props) => {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const { isDark } = useAppMode();
  const pathname = usePathname();

  const logoIcon = !isDark ? logo?.imageDark : logo?.image;

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 80));

  const normalize = (p?: string) =>
    !p ? "/" : p.replace(/^\/(en|es)/, "") || "/";

  return (
    <div
      className={cn(
        "hidden w-full border-b border-border bg-background transition-shadow lg:block",
        compact && "shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
      )}
      role="banner"
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-screen-2xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 transition-[padding] duration-200",
          compact ? "py-3" : "py-5"
        )}
      >
        <div aria-hidden />

        <div className="flex justify-center">
          <LogoNavbar locale={locale} image={logoIcon} />
        </div>

        <nav
          className="flex items-center justify-end gap-1"
          aria-label="Cuenta y carrito"
        >
          <UserMenu locale={locale} />
          <CartIcon
            href={`/${locale}/cart`}
            className="!rounded-none !p-0 !h-10 !w-10 !bg-transparent hover:!bg-secondary"
          />
        </nav>
      </div>

      <nav
        className="border-t border-border bg-background"
        aria-label="Categorías"
      >
        <ul className="mx-auto flex max-w-screen-2xl items-center justify-center gap-8 overflow-x-auto px-6 scrollbar-hide">
          {leftNavbarItems?.map((item) => {
            const isActive =
              normalize(pathname) === normalize(item.URL);
            return (
              <li key={item.URL}>
                <Link
                  href={`/${locale}${item.URL}`}
                  target={item.target}
                  className={cn(
                    "block whitespace-nowrap border-b-2 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

