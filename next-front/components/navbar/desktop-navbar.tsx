"use client";

import { LogoNavbar } from "@/components/logo/logo-navbar";
import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { NavbarItem } from "./navbar-item";
import { useAppMode } from "@/hooks/useAppMode";
import { CartIcon } from "../cart/cart-icon";

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

  const [showBackground, setShowBackground] = useState(false);

  const { isDark } = useAppMode();

  const logoIcon = !isDark ? logo?.imageDark : logo?.image;

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <div className="hidden lg:flex items-center justify-center w-full mb-10 px-4">
      <div
        className={cn(
          "flex transition-all duration-300 items-center justify-between w-full max-w-7xl mx-auto px-5 py-2.5 mt-4 gap-6 rounded-full border",
          showBackground
            ? "backdrop-blur-xl bg-white/95 shadow-lg border-gray-200/70"
            : "backdrop-blur-md bg-white/70 shadow-sm border-white/60"
        )}
        role="banner"
      >
        <LogoNavbar locale={locale} image={logoIcon} />

        <nav
          className="flex items-center gap-1 flex-1 justify-center"
          aria-label="Main navigation"
        >
          {leftNavbarItems?.map((item) => (
            <NavbarItem
              href={`/${locale}${item.URL}` as never}
              key={item.URL}
              target={item.target}
            >
              {item.text}
            </NavbarItem>
          ))}
        </nav>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <CartIcon
            href={`/${locale}/cart`}
            className="!bg-transparent !border-0 !shadow-none !p-2 hover:!bg-primary/5"
          />
        </div>
      </div>
    </div>
  );
};
