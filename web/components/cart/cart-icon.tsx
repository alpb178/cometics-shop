"use client";

import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface CartIconProps {
  /** When provided, icon links to cart page; otherwise use onClick */
  href?: string;
  onClick?: () => void;
  className?: string;
}

const iconContent = (
  <>
    <ShoppingCart className="w-6 h-6 text-foreground" />
    <CartBadge />
  </>
);

function CartBadge() {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  if (itemCount <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}

/** Accepts `/cart` or a legacy `/es/cart`; the locale-aware Link adds the prefix. */
const stripLocale = (href: string) => href.replace(/^\/(es|en)(?=\/|$)/, "") || "/";

export const CartIcon = ({ href, onClick, className }: CartIconProps) => {
  const t = useTranslations("cart");
  const baseClass = cn(
    "relative flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-primary/10",
    className
  );

  if (href) {
    return (
      <Link
        href={stripLocale(href)}
        className={baseClass}
        aria-label={t("openCart")}
      >
        {iconContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClass}
      aria-label={t("openCart")}
    >
      {iconContent}
    </button>
  );
};
