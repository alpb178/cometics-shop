"use client";

import { Product } from "@/definitions/Product";
import { formatPrice } from "@/lib/price";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import { FormattedText } from "../../../components/text/formatted-text";
import { QuantitySelector } from "./components/quantity-selector";
import { SparklesCore } from "@/components/ui/sparkles";
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
import { applyDiscount } from "@/lib/pricing";
import { useTranslations } from "next-intl";

const DESCRIPTION_PREVIEW_CHARS = 700;

export const SingleProduct = ({ product }: { product: Product }) => {
  const t = useTranslations("products.detail");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [feedback, setFeedback] = useState<null | string>(null);

  const { addToCart } = useCart();

  // Record the product detail view (once per mounted product).
  useEffect(() => {
    trackEvent("product_view", {
      label: product.name,
      productSlug: product.slug
    });
  }, [product.slug, product.name]);

  // Gallery shows the cover image (product.image) first, then the rest,
  // skipping the cover if it is already included in product.images.
  const gallery =
    product.images && product.images.length > 0 ? product.images : [];
  const images = product.image?.url
    ? [product.image, ...gallery.filter((img: any) => img?.url !== product.image.url)]
    : gallery;
  const activeImage = images[activeIndex];

  const description = product.description ?? "";
  const needsTruncation = description.length > DESCRIPTION_PREVIEW_CHARS;
  const displayedDescription =
    needsTruncation && !isDescriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_CHARS).trimEnd()}…`
      : description;

  const hasDiscount = !!product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? applyDiscount(product.price, product.discount)
    : (product.price ?? 0);

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    trackEvent("add_to_cart", {
      label: product.name,
      productSlug: product.slug,
      quantity
    });
    setFeedback(t("added", { name: product.name, quantity }));
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
      {/* Amazon-style layout: photos on the left, name and description in
          the middle and the buy box on the right. On mobile the DOM order
          rules: photos, header, cart/shipping and the description last. */}
      {/* `grid-rows-[auto_1fr]`: the header row keeps its height and the
          description row absorbs the leftover space of the columns that span
          both rows. Without this the header grew and left a gap between the
          price and the description. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr] lg:gap-10">
        {/* The image block is width-limited: stretched to the full column
            the main photo was scaled beyond its source resolution and looked
            pixelated. */}
        <div className="grid w-full max-w-[520px] grid-cols-[64px_1fr] gap-3 sm:grid-cols-[88px_1fr] sm:gap-5 lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div className="flex flex-col gap-2">
            {images.map((image: any, index: number) => (
              <button
                key={image.url ?? index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={t("viewImage", { index: index + 1, total: images.length })}
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
                {/* Particle grain over the active thumbnail. The canvas does
                    not capture clicks so it does not cancel the button that
                    contains it. */}
                {index === activeIndex && (
                  <SparklesCore
                    id={`thumb-sparkles-${index}`}
                    background="transparent"
                    particleColor="#6DBA74"
                    particleDensity={1400}
                    minSize={0.4}
                    maxSize={1.2}
                    speed={2}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  />
                )}
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
                sizes="(max-width: 640px) 100vw, 420px"
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </div>

        {/* Header: category, name and price */}
        <div className="flex flex-col lg:col-start-2 lg:row-start-1">
          {product.categories?.[0]?.name && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {product.categories[0].name}
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
        </div>

        {/* Buy box: quantity, cart and shipping terms. On mobile it falls
            right below the photos, before the description. */}
        <div className="border border-border p-5 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div>
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
              aria-label={t("addToCartAria", { name: product.name })}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
              {t("addToCart")}
            </button>

            {quantity > 1 && product.price && (
              <p className="mt-3 flex items-baseline justify-between text-sm text-muted-foreground">
                <span>
                  {t("totalUnits", { quantity })}
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

          <div className="mt-6 space-y-3 border-t border-border pt-6 text-xs">
            <div className="flex items-start gap-3">
              <Truck
                className="mt-0.5 h-4 w-4 text-foreground"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-foreground">
                  {t("shipping")}
                </p>
                <p className="text-muted-foreground">{t("shippingTime")}</p>
                {/* Same policy as the floating welcome notice. */}
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {t("shippingPolicy")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Store
                className="mt-0.5 h-4 w-4 text-foreground"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-foreground">
                  {t("pickup")}
                </p>
                <p className="text-muted-foreground">{t("pickupTime")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description: under the header on desktop, last on mobile. It is
            the only thing that scrolls on desktop, so the photo does not
            move while reading it. */}
        <div className="lg:col-start-2 lg:row-start-2 lg:max-h-[60vh] lg:self-start lg:overflow-y-auto lg:pr-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
            {t("description")}
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
                  {t("showLess")} <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t("showMore")} <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
