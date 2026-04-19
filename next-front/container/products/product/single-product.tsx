"use client";

import { Product } from "@/definitions/Product";
import { formatPrice } from "@/lib/price";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { motion } from "framer-motion";
import { useState } from "react";
import { FormattedText } from "../../../components/text/formatted-text";
import { QuantitySelector } from "./components/quantity-selector";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { ButtonAddToCart } from "@/components/button/ButtonAddToCart";
import { ChevronDown, ChevronUp } from "lucide-react";

const DESCRIPTION_PREVIEW_CHARS = 500;

export const SingleProduct = ({ product }: { product: Product }) => {
  const [activeThumbnail, setActiveThumbnail] = useState(
    strapiImage(product.images[0].url)
  );
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const description = product.description ?? "";
  const needsTruncation = description.length > DESCRIPTION_PREVIEW_CHARS;
  const displayedDescription =
    needsTruncation && !isDescriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_CHARS).trimEnd()}…`
      : description;

  return (
    <div className="pt-6 md:pt-10 pb-12 md:pb-20 mb-10">
      <div className="gap-12 grid grid-cols-1 md:grid-cols-2">
        <div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col justify-center items-center gap-4 mt-4">
              {product.images &&
                product?.images.map((image: any, index: number) => (
                  <button
                    type="button"
                    onClick={() => setActiveThumbnail(strapiImage(image.url))}
                    key={"product-image" + index}
                    className={cn(
                      "border-2 shadow-sm border-foreground rounded-md w-16 h-16 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      activeThumbnail === strapiImage(image.url)
                        ? "border-pink ring-2 ring-pink/20"
                        : "border-border hover:border-pink/50"
                    )}
                    style={{
                      backgroundImage: `url(${strapiImage(image.url)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat"
                    }}
                    aria-label={`Ver imagen ${index + 1} de ${product.images?.length ?? 0}`}
                    aria-pressed={activeThumbnail === strapiImage(image.url)}
                  />
                ))}
            </div>
            <motion.div
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              exit={{ x: 50 }}
              key={activeThumbnail}
              className="relative rounded overflow-hidden"
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 35
              }}
            >
              <Image
                src={strapiImage(activeThumbnail)}
                alt={product.name}
                width={600}
                height={600}
                className="rounded-3xl object-cover w-[400px] h-[400px] md:w-[600px] md:h-[700px]"
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <h2 className="mb-4 font-semibold text-foreground text-2xl">
              {product.name}
              <div className="w-20 h-1 bg-gradient-to-r from-pink  to-pink/50 rounded-full" />
            </h2>
            {product.price !== null && product.price > 0 && (
              <div className="mb-6 inline-flex items-end gap-3 rounded-2xl bg-gradient-to-br from-pink-50 to-green-50 border border-pink-100 px-5 py-4 shadow-sm w-fit">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-700 text-4xl sm:text-5xl leading-none tracking-tight">
                  {formatPrice({
                    price: product.price ?? 0,
                    currency: product.currency ?? "BOB"
                  }).toString()}
                </span>
                <span className="text-xs text-muted-foreground font-medium pb-1">
                  Precio online
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <QuantitySelector
              min={1}
              max={20}
              initialValue={quantity}
              onQuantityChange={setQuantity}
              className="mb-4"
            />

            <ButtonAddToCart
              onClick={handleAddToCart}
              name={`${product.name} x ${quantity}`}
            />

            <div className="mt-7">
              <FormattedText
                content={displayedDescription}
                className="font-normal text-base"
              />
              {needsTruncation && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded((v) => !v)}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
                >
                  {isDescriptionExpanded ? (
                    <>
                      Ver menos <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Ver más <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {quantity > 1 && product.price && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground">
                    Total ({quantity} {quantity === 1 ? "unidad" : "unidades"}):
                  </span>
                  <span className="font-semibold text-primary">
                    {formatPrice({
                      price: product.price * quantity,
                      currency: product.currency ?? "BOB"
                    }).toString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
