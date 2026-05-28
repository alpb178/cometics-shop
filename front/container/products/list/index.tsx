"use client";

import { Product } from "@/definitions/Product";
import { useState, useMemo, useEffect } from "react";
import { ProductShows } from "./components/ProductsShow";
import { SearchBar } from "./components/Search";
import { Filter, FilterState } from "./components/Filter";
import { Grid2X2, Grid3X3, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const PAGE_SIZE_OPTIONS = [24, 48, 96];

export const ProductList = ({ products }: { products: Product[] }) => {
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products
      .map((p) => p.price)
      .filter((p): p is number => typeof p === "number" && p > 0);
    if (prices.length === 0) return { minPrice: 0, maxPrice: 0 };
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  const [filter, setFilter] = useState<FilterState>({
    category: null,
    priceRange: [minPrice, maxPrice],
    flags: new Set()
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState<"comfortable" | "compact">(
    "comfortable"
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilter((f) => ({ ...f, priceRange: [minPrice, maxPrice] }));
  }, [minPrice, maxPrice]);

  const filtered = useMemo(() => {
    let result = products;

    if (filter.category) {
      result = result.filter(
        (p) => p.categories?.name === filter.category
      );
    }

    if (filter.flags.has("featured")) {
      result = result.filter((p) => p.featured === true);
    }
    if (filter.flags.has("isNew")) {
      result = result.filter((p) => p.isNew === true);
    }
    if (filter.flags.has("discount")) {
      result = result.filter((p) => (p.discount ?? 0) > 0);
    }

    if (maxPrice > 0) {
      result = result.filter((p) => {
        if (typeof p.price !== "number") return true;
        return (
          p.price >= filter.priceRange[0] && p.price <= filter.priceRange[1]
        );
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => Number(b.isNew ?? 0) - Number(a.isNew ?? 0));
    }
    return sorted;
  }, [products, filter, sort, searchQuery, maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [filter, sort, searchQuery, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  const activeChips = [
    filter.category && { key: "category", label: filter.category },
    filter.flags.has("isNew") && { key: "isNew", label: "Nuevos" },
    filter.flags.has("featured") && { key: "featured", label: "Destacados" },
    filter.flags.has("discount") && { key: "discount", label: "En oferta" },
    searchQuery.trim() && { key: "search", label: `"${searchQuery}"` }
  ].filter(Boolean) as { key: string; label: string }[];

  const clearChip = (key: string) => {
    if (key === "category") setFilter({ ...filter, category: null });
    else if (key === "search") setSearchQuery("");
    else if (key === "isNew" || key === "featured" || key === "discount") {
      const next = new Set(filter.flags);
      next.delete(key as any);
      setFilter({ ...filter, flags: next });
    }
  };

  const clearAll = () => {
    setFilter({
      category: null,
      priceRange: [minPrice, maxPrice],
      flags: new Set()
    });
    setSearchQuery("");
  };

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-10">
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Catálogo
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Nuestros productos
          </h1>
        </div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </header>

      <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block">
          <Filter
            products={products}
            filter={filter}
            onChange={setFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>

        <div className="min-w-0">
          <Toolbar
            count={filtered.length}
            pageSize={pageSize}
            setPageSize={setPageSize}
            sort={sort}
            setSort={setSort}
            density={density}
            setDensity={setDensity}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />

          {activeChips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => clearChip(c.key)}
                  className="inline-flex items-center gap-1.5 border border-foreground/20 bg-background px-3 py-1.5 font-medium text-foreground hover:border-foreground"
                >
                  {c.label}
                  <X className="h-3 w-3" aria-hidden />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {pageProducts.length > 0 ? (
            <>
              <ProductShows products={pageProducts} density={density} />
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="mb-2 text-base font-semibold text-foreground">
                No encontramos productos
              </p>
              <p className="mb-6 max-w-md text-sm text-muted-foreground">
                Prueba con otra búsqueda o ajusta los filtros.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-background hover:bg-foreground/90"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="flex-1 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Cerrar filtros"
          />
          <div className="flex h-full w-[88vw] max-w-sm flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                Filtros
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Cerrar"
                className="p-1"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">
              <Filter
                products={products}
                filter={filter}
                onChange={setFilter}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
            </div>
            <div className="border-t border-border p-5">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.14em] text-background"
              >
                Ver {filtered.length} productos
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Toolbar = ({
  count,
  pageSize,
  setPageSize,
  sort,
  setSort,
  density,
  setDensity,
  onOpenFilters
}: {
  count: number;
  pageSize: number;
  setPageSize: (n: number) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  density: "comfortable" | "compact";
  setDensity: (d: "comfortable" | "compact") => void;
  onOpenFilters: () => void;
}) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 font-semibold uppercase tracking-[0.14em] text-foreground lg:hidden"
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
      </button>
      <p className="text-foreground">
        <span className="font-semibold">{count}</span>{" "}
        <span className="text-muted-foreground">productos</span>
      </p>
      <label className="hidden items-center gap-2 text-muted-foreground sm:inline-flex">
        Por página
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border-0 bg-transparent font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>

    <div className="flex items-center gap-4">
      <label className="inline-flex items-center gap-2 text-muted-foreground">
        Ordenar
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border-0 bg-transparent font-semibold text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
        >
          <option value="newest">Lo más nuevo</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name">Nombre A–Z</option>
        </select>
      </label>

      <div className="hidden items-center gap-1 sm:flex" role="group">
        <button
          type="button"
          aria-label="Vista cómoda"
          aria-pressed={density === "comfortable"}
          onClick={() => setDensity("comfortable")}
          className={cn(
            "p-1.5 transition-colors",
            density === "comfortable"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Grid2X2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Vista compacta"
          aria-pressed={density === "compact"}
          onClick={() => setDensity("compact")}
          className={cn(
            "p-1.5 transition-colors",
            density === "compact"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Grid3X3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

const Pagination = ({
  page,
  totalPages,
  onChange
}: {
  page: number;
  totalPages: number;
  onChange: (n: number) => void;
}) => {
  const pages = useMemo(() => {
    const arr: (number | "…")[] = [];
    const push = (n: number | "…") => arr.push(n);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
    } else {
      push(1);
      if (page > 3) push("…");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      )
        push(i);
      if (page < totalPages - 2) push("…");
      push(totalPages);
    }
    return arr;
  }, [page, totalPages]);

  return (
    <nav
      aria-label="Paginación"
      className="mt-12 flex items-center justify-center gap-1 text-sm"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-2 font-semibold text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`dots-${i}`}
            className="px-2 text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "min-w-[36px] px-2 py-2 text-sm transition-colors",
              p === page
                ? "font-bold text-foreground underline underline-offset-[6px]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-2 font-semibold text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
      >
        ›
      </button>
    </nav>
  );
};
