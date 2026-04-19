"use client";

import { IconSearch } from "@tabler/icons-react";

export const SearchBar = ({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <div className="relative w-full">
      <label htmlFor="product-search" className="sr-only">
        Buscar productos
      </label>
      <IconSearch
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        aria-hidden
      />
      <input
        id="product-search"
        type="search"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full min-h-[44px] pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        aria-label="Buscar productos"
        autoComplete="off"
      />
    </div>
  );
};
