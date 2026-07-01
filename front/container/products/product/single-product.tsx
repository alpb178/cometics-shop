"use client";

import { Product } from "@/definitions/Product";
import { formatPrice } from "@/lib/price";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import { FormattedText } from "../../../components/text/formatted-text";
import { QuantitySelector } from "./components/quantity-selector";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { logsStrapi } from "@/lib/strapi/logs";
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Truck,
  Store
} from "lucide-react";

const DESCRIPTION_PREVIEW_CHARS = 320;

export const SingleProduct = ({ product }: { product: Product }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [feedback, setFeedback] = useState<null | string>(null);

  const { addToCart } = useCart();

  // Registra la vista del detalle de producto (una vez por producto montado).
  useEffect(() => {
    trackEvent("product_view", {
      label: product.name,
      productSlug: product.slug
    });
  }, [product.slug, product.name]);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const activeImage = images[activeIndex];

  const description = product.description ?? "";
  const needsTruncation = description.length > DESCRIPTION_PREVIEW_CHARS;
  const displayedDescription =
    needsTruncation && !isDescriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_CHARS).trimEnd()}…`
      : description;

  const hasDiscount = !!product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? (product.price ?? 0) * (1 - (product.discount ?? 0) / 100)
    : product.price ?? 0;

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    trackEvent("add_to_cart", {
      label: product.name,
      productSlug: product.slug,
      quantity
    });
    setFeedback(
      `Añadido al carrito: ${product.name} × ${quantity}`
    );
    setTimeout(() => setFeedback(null), 3500);
    try {
      await logsStrapi(
        "User Clicked Button Add to Cart",
        `Product Added to Cart: ${product.name} x ${quantity}`
      );
    } catch {
      void 0;
    }
  };

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_440px] lg:gap-16">
        <div className="grid grid-cols-[64px_1fr] gap-3 sm:grid-cols-[88px_1fr] sm:gap-5">
          <div className="flex flex-col gap-2">
            {images.map((image: any, index: number) => (
              <button
                key={image.url ?? index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver imagen ${index + 1} de ${images.length}`}
                aria-pressed={index === activeIndex}
                className={cn(
                  "relative aspect-square w-full overflow-hidden border transition-colors",
                  index === activeIndex
                    ? "border-foreground"
                    : "border-transparent hover:border-foreground/40"
                )}
              >
                <Image
                  src={strapiImage(image.url)}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <motion.div
            key={activeImage?.url ?? "single"}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative aspect-[3/4] w-full overflow-hidden bg-secondary"
          >
            {activeImage && (
              <Image
                src={strapiImage(activeImage.url)}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </div>

        <div className="flex flex-col">
          {product.categories?.name && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {product.categories.name}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {product.price !== null && product.price > 0 && (
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground sm:text-3xl">
                {formatPrice({
                  price: finalPrice,
                  currency: product.currency ?? "BOB"
                }).toString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice({
                      price: product.price,
                      currency: product.currency ?? "BOB"
                    }).toString()}
                  </span>
                  <span className="bg-destructive px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-destructive-foreground">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <QuantitySelector
              min={1}
              max={20}
              initialValue={quantity}
              onQuantityChange={setQuantity}
              className="mb-5"
            />

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 bg-foreground py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
              aria-label={`Añadir al carrito: ${product.name}`}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              Añadir al carrito
            </button>

            {quantity > 1 && product.price && (
              <p className="mt-3 flex items-baseline justify-between text-sm text-muted-foreground">
                <span>
                  Total ({quantity} {quantity === 1 ? "unidad" : "unidades"})
                </span>
                <span className="font-semibold text-foreground">
                  {formatPrice({
                    price: finalPrice * quantity,
                    currency: product.currency ?? "BOB"
                  }).toString()}
                </span>
              </p>
            )}

            {feedback && (
              <p
                role="status"
                className="mt-3 border border-foreground/10 bg-secondary px-3 py-2 text-sm text-foreground"
              >
                {feedback}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 text-xs">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-foreground" strokeWidth={1.5} />
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-foreground">
                  Envío
                </p>
                <p className="text-muted-foreground">Entrega 24–72 h</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Store className="mt-0.5 h-4 w-4 text-foreground" strokeWidth={1.5} />
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-foreground">
                  Recogida
                </p>
                <p className="text-muted-foreground">Lista en 24–48 h</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
              Descripción del producto
            </p>
            <FormattedText
              content={displayedDescription}
              className="text-sm leading-relaxed text-foreground"
            />
            {needsTruncation && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((v) => !v)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:text-foreground/70"
              >
                {isDescriptionExpanded ? (
                  <>
                    Ver menos <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Ver más <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
