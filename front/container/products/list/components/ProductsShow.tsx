"use client";

import { Product } from "@/definitions/Product";
import { ProductItem } from "./ProductItem";
import { cn } from "@/lib/utils";

type Density = "comfortable" | "compact";

export const ProductShows = ({
  products,
  density = "comfortable"
}: {
  products: Product[];
  density?: Density;
}) => {
  return (
    <div
      className={cn(
        "grid gap-x-3 gap-y-8 sm:gap-x-4",
        density === "compact"
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      )}
    >
      {products?.map((product) => (
        <ProductItem key={product.slug} product={product} />
      ))}
    </div>
  );
};
