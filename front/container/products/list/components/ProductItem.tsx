"use client";

import { Product } from "@/definitions/Product";
import { getImageSrc } from "@/lib/strapi/strapiImage";
import Image from "next/image";
import { formatPrice } from "@/lib/price";
import { useCart } from "@/context/cart-context";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { trackEvent } from "@/lib/track-event";

export const ProductItem = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const locale = useLocale();

  const hasDiscount = !!product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? (product.price ?? 0) * (1 - (product.discount ?? 0) / 100)
    : product.price ?? 0;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
      aria-label={`Ver detalles de ${product.name}`}
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
          <Image
            src={getImageSrc(
              product?.image?.url ?? product?.images?.[0]?.url ?? ""
            )}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 20vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            quality={85}
          />

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-background">
                New
              </span>
            )}
            {product.featured && (
              <span className="bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground ring-1 ring-foreground/10">
                Destacado
              </span>
            )}
            {hasDiscount && (
              <span className="bg-destructive px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-destructive-foreground">
                -{product.discount}%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              trackEvent("add_to_cart", {
                label: product.name,
                productSlug: product.slug,
                quantity: 1
              });
            }}
            className="pointer-events-auto absolute inset-x-0 bottom-0 flex h-11 items-center justify-center gap-2 bg-foreground text-xs font-semibold uppercase tracking-[0.14em] text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
            Añadir
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {product.name}
          </h3>

          {product.price !== null && product.price > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-foreground">
                {formatPrice({
                  price: finalPrice,
                  currency: product.currency ?? "BOB"
                }).toString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice({
                    price: product.price,
                    currency: product.currency ?? "BOB"
                  }).toString()}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};
