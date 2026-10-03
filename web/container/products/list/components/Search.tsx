"use client";

import { Search as SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const SearchBar = ({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const t = useTranslations("products.search");
  return (
    <div className="relative w-full max-w-lg">
      <label htmlFor="product-search" className="sr-only">
        {t("label")}
      </label>
      <SearchIcon
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id="product-search"
        type="search"
        placeholder={t("placeholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full min-h-[44px] border border-border bg-background pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
        aria-label={t("label")}
        autoComplete="off"
      />
    </div>
  );
};
