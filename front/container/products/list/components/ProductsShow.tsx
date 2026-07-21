"use client";

import { motion } from "framer-motion";
import { Product } from "@/definitions/Product";
import { ProductItem } from "./ProductItem";
import { Tilt3D } from "@/components/ui/tilt-3d";
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
      {products?.map((product, i) => (
        <motion.div
          key={product.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
        >
          <Tilt3D max={6} scale={1.02}>
            <ProductItem product={product} />
          </Tilt3D>
        </motion.div>
      ))}
    </div>
  );
};
