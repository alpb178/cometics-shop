"use client";

import { Logo } from "@/components/logo/logo";
import { cn } from "@/lib/utils";
import { MenuIcon, X } from "lucide-react";
import { Link } from "next-view-transitions";
import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { Modal } from "../modal/Modal";
import { CartIcon } from "../cart/cart-icon";
import { useAuth } from "@/context/auth-context";

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
    children?: { URL: string; text: string }[];
  }[];
  logo: any;
  locale: string;
};

export const MobileNavbar = ({ leftNavbarItems, logo, locale }: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const normalize = (p?: string) =>
    !p ? "/" : p.replace(/^\/(en|es)/, "") || "/";

  return (
    <div
      className="flex w-full items-center justify-between border-b border-border bg-background px-4 py-3"
      role="banner"
    >
      <div className="flex items-center">
        <button
          onClick={() => setOpen(true)}
          className="-ml-2 flex h-10 w-10 items-center justify-center text-foreground hover:bg-secondary"
          aria-label="Abrir menú"
        >
          <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex justify-center">
        <Logo image={logo?.image} locale={locale} />
      </div>

      <div className="flex items-center justify-end">
        <CartIcon
          href={`/${locale}/cart`}
          className="!rounded-none !p-0 !h-10 !w-10 !bg-transparent hover:!bg-secondary"
        />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        hideCloseButton
        position="left"
        className="bg-background"
      >
        <>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Logo locale={locale} image={logo?.image} />
            <button
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-secondary"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <ul className="flex max-h-[calc(100vh-72px)] flex-col overflow-y-auto">
            <li className="border-b border-border">
              {user ? (
                <>
                  <div className="px-5 pt-5 pb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                      user.email}
                  </div>
                  <Link
                    href={`/${locale}/account`}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 text-sm hover:bg-secondary"
                  >
                    Mi cuenta
                  </Link>
                  <Link
                    href={`/${locale}/account/orders`}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 text-sm hover:bg-secondary"
                  >
                    Mis pedidos
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setOpen(false);
                    }}
                    className="block w-full px-5 py-3 text-left text-sm hover:bg-secondary"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  href={`/${locale}/sign-in`}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em] hover:bg-secondary"
                >
                  Iniciar sesión / Registrarse
                </Link>
              )}
            </li>
            {leftNavbarItems.map((navItem: any) => {
              const isActive =
                normalize(pathname) === normalize(navItem.URL);

              return (
                <Fragment key={navItem.URL}>
                  {navItem.children && navItem.children.length > 0 ? (
                    <li className="border-b border-border">
                      <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {navItem.text}
                      </p>
                      <ul>
                        {navItem.children.map((child: any) => {
                          const childActive =
                            normalize(pathname) === normalize(child.URL);
                          return (
                            <li key={child.URL}>
                              <Link
                                href={`/${locale}${child.URL}`}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "block px-5 py-3 text-sm",
                                  childActive
                                    ? "font-semibold text-foreground"
                                    : "text-foreground hover:bg-secondary"
                                )}
                                aria-current={
                                  childActive ? "page" : undefined
                                }
                              >
                                {child.text}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ) : (
                    <li>
                      <Link
                        href={`/${locale}${navItem.URL}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block border-b border-border px-5 py-4 text-sm font-semibold uppercase tracking-[0.14em]",
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-foreground hover:bg-secondary"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {navItem.text}
                      </Link>
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ul>
        </>
      </Modal>
    </div>
  );
};
