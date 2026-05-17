"use client";

import { Search as SearchIcon } from "lucide-react";

export const SearchBar = ({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div className="relative w-full max-w-lg">
      <label htmlFor="product-search" className="sr-only">
        Buscar productos
      </label>
      <SearchIcon
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id="product-search"
        type="search"
        placeholder="Buscar productos"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full min-h-[44px] border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
        aria-label="Buscar productos"
        autoComplete="off"
      />
    </div>
  );
};
