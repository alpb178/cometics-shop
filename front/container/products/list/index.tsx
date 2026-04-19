"use client";

import { Product } from "@/definitions/Product";
import { useState, useMemo } from "react";
import { IconMapPin } from "@tabler/icons-react";
import { Package, Search, Star, Sparkles } from "lucide-react";
import { ProductShows } from "./components/ProductsShow";
import { Carrousel } from "@/components/carrousel";
import Link from "next/link";
import { SearchBar } from "./components/Search";
import { Filter } from "./components/Filter";
import { groupProductsByCategory } from "./utils";



export const ProductList = ({ products }: { products: Product[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedProducts = useMemo(() => groupProductsByCategory(products), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product?.categories?.name === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const hasActiveFilters = selectedCategory !== null || searchQuery.trim() !== "";

  // Get featured products
  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.featured === true);
  }, [products]);

  // Get new products
  const newProducts = useMemo(() => {
    return products.filter((product) => product.isNew === true);
  }, [products]);

  return (
    <div className="p-2">
   
      
      {/* Page Header */}
      <div className="mb-6 mt-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Nuestros Productos
          </h1>
        </div>
        <p className="text-muted-foreground text-base ml-9">
          Descubre nuestra amplia selección de productos naturales y de calidad
        </p>
      </div>

      {/* Featured Products Section */}
      {!hasActiveFilters && featuredProducts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold text-foreground">
              Productos Destacados
            </h2>
          </div>
          <ProductShows products={featuredProducts.slice(0, 4)} />
        </div>
      )}

      {/* New Products Section */}
      {!hasActiveFilters && newProducts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-foreground">
              Productos Nuevos
            </h2>
          </div>
          <ProductShows products={newProducts.slice(0, 4)} />
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-3">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Filter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={products}
        />
      </div>

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg" role="status" aria-live="polite">
          <div className="flex items-center gap-2 text-foreground">
            <Search className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
              {selectedCategory && ` en "${selectedCategory}"`}
              {searchQuery.trim() && ` para "${searchQuery}"`}
            </span>
          </div>
        </div>
      )}

      {/* Products Display */}
      {filteredProducts.length > 0 ? (
        <>
          {!hasActiveFilters ? (
            // Show products grouped by category when no filters
            <>
              {Object.entries(groupedProducts)
                .filter(([categoryName]) => categoryName !== "withoutCategory")
                .map(([categoryName, categoryProducts]) => (
                  <div key={categoryName} className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {categoryName}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {categoryProducts.length} {categoryProducts.length === 1 ? "producto" : "productos"}
                      </span>
                    </div>
                    <ProductShows products={categoryProducts} />
                  </div>
                ))}
              {/* Show products without category if they exist */}
              {groupedProducts["withoutCategory"] && groupedProducts["withoutCategory"].length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Otros Productos
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {groupedProducts["withoutCategory"].length} {groupedProducts["withoutCategory"].length === 1 ? "producto" : "productos"}
                    </span>
                  </div>
                  <ProductShows products={groupedProducts["withoutCategory"]} />
                </div>
              )}
            </>
          ) : (
            // Show filtered products
            <ProductShows products={filteredProducts} />
          )}
        </>
      ) : (
        // No results message
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {searchQuery.trim()
              ? `No hay productos que coincidan con "${searchQuery}". Intenta con otros términos de búsqueda.`
              : "No hay productos disponibles en esta categoría."}
          </p>
          {(searchQuery.trim() || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="min-h-[44px] px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
              aria-label="Limpiar filtros de búsqueda y categoría"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Story CTA below products */}
      <div className="mt-16 mb-8 flex justify-center">
        <Link
          href="/about"
          className="text-base font-semibold text-gray-700 hover:text-pink-600 underline underline-offset-4 decoration-gray-300 hover:decoration-pink-600 transition-colors py-2"
        >
          Conoce Nuestra Historia
        </Link>
      </div>
    </div>
  );
};
