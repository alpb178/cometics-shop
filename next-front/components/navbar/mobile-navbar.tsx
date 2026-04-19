"use client";

import { Logo } from "@/components/logo/logo";
import { cn } from "@/lib/utils";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { CloseButton } from "../button/close-button/CloseButton";
import { Modal } from "../modal/Modal";
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

export const MobileNavbar = ({ leftNavbarItems, logo, locale }: Props) => {
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  return (
    <div
      className={cn(
        "flex justify-between items-center w-full min-w-full px-4 py-3 transition-all duration-300 sticky top-0 z-50 border-b",
        showBackground
          ? "backdrop-blur-xl bg-white/95 shadow-md border-gray-200/70"
          : "backdrop-blur-md bg-white/80 border-white/60"
      )}
      role="banner"
    >
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-primary/5 active:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Abrir menú"
      >
        <MenuIcon className="size-6 text-gray-700" />
      </button>
      <Logo image={logo?.image} />

      <div className="flex items-center gap-2">
        <CartIcon href={`/${locale}/cart`} />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        hideCloseButton
        position="left"
        className="bg-white/95 backdrop-blur-xl"
      >
        <>
          <div className="flex justify-between items-center p-6 pt-6 w-full border-b border-gray-200">
            <Logo locale={locale} image={logo?.image} />
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <CloseButton
                iconColor="text-gray-700"
                onClick={() => setOpen(false)}
              />
            </button>
          </div>

          <div className="flex flex-col justify-start items-start gap-2 p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {leftNavbarItems.map((navItem: any) => {
              // Normalize paths for comparison
              const normalizePath = (path: string) => {
                if (!path) return '/';
                const pathWithoutLocale = path.replace(/^\/(en|es)/, '') || '/';
                return pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');
              };

              const currentPath = normalizePath(pathname);
              const itemPath = normalizePath(navItem.URL);
              const isActive = currentPath === itemPath || 
                               (itemPath !== '/' && currentPath.startsWith(itemPath + '/'));

              return (
                <Fragment key={navItem.URL}>
                  {navItem.children && navItem.children.length > 0 ? (
                    <div className="w-full">
                      {/* Section Label */}
                      <div className="mb-2 mt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                          {navItem.text}
                        </h3>
                        <div className="h-px bg-gray-200" />
                      </div>
                      
                      {/* Children Items */}
                      <div className="flex flex-col gap-0.5 w-full">
                        {navItem.children.map((childNavItem: any) => {
                          const childPath = normalizePath(childNavItem.URL);
                          const isChildActive = currentPath === childPath || 
                                               (childPath !== '/' && currentPath.startsWith(childPath + '/'));
                          
                          return (
                            <Link
                              key={childNavItem.URL}
                              href={`/${locale}${childNavItem.URL}`}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "relative w-full p-3 text-base rounded-lg transition-all duration-200 ml-2",
                                isChildActive
                                  ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
                              )}
                              aria-current={isChildActive ? "page" : undefined}
                            >
                              <span className="block">{childNavItem.text}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}${navItem.URL}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "relative w-full rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/10"
                          : "hover:bg-gray-50"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "block p-3 text-base font-medium transition-colors duration-200",
                          isActive
                            ? "text-primary font-semibold border-l-4 border-primary pl-3"
                            : "text-gray-700 hover:text-primary"
                        )}
                      >
                        {navItem.text}
                      </span>
                    </Link>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Theme toggle removed for mobile - always uses light theme */}
        </>
      </Modal>
    </div>
  );
};
