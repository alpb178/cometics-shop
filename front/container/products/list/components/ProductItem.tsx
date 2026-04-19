"use client";

import { Product } from "@/definitions/Product";
import { getImageSrc } from "@/lib/strapi/strapiImage";
import Image from "next/image";
import { formatPrice } from "@/lib/price";
import { useCart } from "@/context/cart-context";
import { ShoppingCart, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";


export const ProductItem = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const locale = useLocale();

  return (
    <div className="group flex flex-col h-full w-full text-left border border-gray-200 rounded-lg hover:border-gray-300 transition duration-200 ease-in-out shadow-sm bg-white relative">
      {/* Badges Container */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
        {/* Featured Badge */}
        {product.featured && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
            <Star className="w-3 h-3 fill-current" />
            <span>Destacado</span>
          </div>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>Nuevo</span>
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="relative bg-white border-b border-gray-200 rounded-t-lg overflow-hidden w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
       
        <Image
          src={getImageSrc(
            product?.image?.url ?? product?.images?.[0]?.url ?? ""
          )}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center"
          quality={85}
        />
      </div>

      <div className="px-3 sm:px-4 py-3 sm:py-4 flex flex-col flex-1 gap-2 sm:gap-3">
        {/* Product Name - Most prominent */}
        <div>
          <h3 className="text-base sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.categories?.name && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              {product.categories.name}
            </span>
          )}
        </div>

        {/* Price - Standardized styling with discount */}
        {product.price !== null && product.price > 0 && (
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="font-bold text-foreground text-2xl sm:text-3xl">
                    {formatPrice({
                      price: product.price * (1 - product.discount / 100),
                      currency: product.currency ?? "BOB"
                    }).toString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice({
                      price: product.price,
                      currency: product.currency ?? "BOB"
                    }).toString()}
                  </span>
                </>
              ) : (
            <span className="font-bold text-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl">
              {formatPrice({
                price: product.price ?? 0,
                currency: product.currency ?? "BOB"
              }).toString()}
            </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-2 sm:px-4 pb-3 sm:pb-4 pt-2 flex justify-between items-center gap-2 sm:gap-4">
        <Link
          href={`/${locale}/products/${product.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-gray-700 underline hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
          aria-label={`Ver detalles de ${product.name}`}
        >
          <span className="hidden sm:inline">Ver detalles</span>
          <span className="sm:hidden">Detalles</span>
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="flex min-w-[44px] min-h-[44px] w-10 h-10 sm:w-11 sm:h-11 items-center justify-center rounded-full font-semibold transition-all duration-200 shadow-md bg-amber-300 border-2 border-amber-400 hover:bg-amber-400 hover:border-amber-500 cursor-pointer flex-shrink-0"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingCart className="w-5 h-5 text-gray-900" />
        </button>
      </div>
     
    </div>
  );
};
