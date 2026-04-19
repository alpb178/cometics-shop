"use client";

import { Product } from "@/definitions/Product";
import { groupProductsByCategory } from "../utils";

export const Filter = ({
  selectedCategory,
  setSelectedCategory,
  products
}: {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  products: Product[];
}) => {
  const groupedProducts = groupProductsByCategory(products);
  const categoryNames = Object.keys(groupedProducts).filter(
    (name) => name !== "withoutCategory"
  );

  return (
    <div
      className="relative"
      role="group"
      aria-label="Filtrar por categoría"
    >
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`min-h-[44px] px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-primary/50 hover:bg-primary/5"
            }`}
            aria-pressed={selectedCategory === null}
            aria-label="Ver todas las categorías"
          >
            Todas
          </button>
          {categoryNames.map((categoryName) => (
            <button
              key={categoryName}
              onClick={() => setSelectedCategory(categoryName)}
              className={`min-h-[44px] px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                selectedCategory === categoryName
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-primary/50 hover:bg-primary/5"
              }`}
              aria-pressed={selectedCategory === categoryName}
              aria-label={`Filtrar por ${categoryName}`}
            >
              {categoryName}
            </button>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
    </div>
  );
};
