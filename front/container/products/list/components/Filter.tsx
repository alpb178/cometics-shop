"use client";

import { Product } from "@/definitions/Product";
import { groupProductsByCategory } from "../utils";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type FilterFlag = "featured" | "isNew" | "discount";

export type FilterState = {
  category: string | null;
  priceRange: [number, number];
  flags: Set<FilterFlag>;
};

type Props = {
  products: Product[];
  filter: FilterState;
  onChange: (next: FilterState) => void;
  minPrice: number;
  maxPrice: number;
};

export const Filter = ({
  products,
  filter,
  onChange,
  minPrice,
  maxPrice
}: Props) => {
  const grouped = useMemo(() => groupProductsByCategory(products), [products]);
  const categories = useMemo(
    () => Object.keys(grouped).filter((c) => c !== "withoutCategory").sort(),
    [grouped]
  );

  const toggleFlag = (flag: FilterFlag) => {
    const next = new Set(filter.flags);
    if (next.has(flag)) next.delete(flag);
    else next.add(flag);
    onChange({ ...filter, flags: next });
  };

  const setCategory = (category: string | null) => {
    onChange({ ...filter, category });
  };

  const setPriceRange = (range: [number, number]) => {
    onChange({ ...filter, priceRange: range });
  };

  return (
    <aside aria-label="Filtros" className="text-sm">
      <FilterSection title="Estilo">
        <ul className="space-y-2">
          <FilterCheckbox
            label="Todas"
            checked={filter.category === null}
            onChange={() => setCategory(null)}
          />
          {categories.map((c) => (
            <FilterCheckbox
              key={c}
              label={c}
              count={grouped[c]?.length}
              checked={filter.category === c}
              onChange={() =>
                setCategory(filter.category === c ? null : c)
              }
            />
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Destacar">
        <ul className="space-y-2">
          <FilterCheckbox
            label="Nuevos"
            checked={filter.flags.has("isNew")}
            onChange={() => toggleFlag("isNew")}
          />
          <FilterCheckbox
            label="Destacados"
            checked={filter.flags.has("featured")}
            onChange={() => toggleFlag("featured")}
          />
          <FilterCheckbox
            label="En oferta"
            checked={filter.flags.has("discount")}
            onChange={() => toggleFlag("discount")}
          />
        </ul>
      </FilterSection>

      <FilterSection title="Precio" defaultOpen>
        <PriceRange
          min={minPrice}
          max={maxPrice}
          value={filter.priceRange}
          onChange={setPriceRange}
        />
      </FilterSection>
    </aside>
  );
};

const FilterSection = ({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => (
  <details
    open={defaultOpen}
    className="group border-b border-border py-5 [&_summary::-webkit-details-marker]:hidden"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
      {title}
      <span
        className="text-foreground transition-transform group-open:rotate-45"
        aria-hidden
      >
        +
      </span>
    </summary>
    <div className="pt-4">{children}</div>
  </details>
);

const FilterCheckbox = ({
  label,
  count,
  checked,
  onChange
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) => (
  <li>
    <label className="group flex cursor-pointer items-center gap-3 py-1">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
          checked
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/30 bg-background group-hover:border-foreground"
        )}
        aria-hidden
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">{count}</span>
      )}
    </label>
  </li>
);

const PriceRange = ({
  min,
  max,
  value,
  onChange
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) => {
  if (max <= min) return null;
  const [lo, hi] = value;

  const handleLo = (v: number) => {
    onChange([Math.min(v, hi), hi]);
  };
  const handleHi = (v: number) => {
    onChange([lo, Math.max(v, lo)]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-foreground">
        <span>{Math.round(lo)}</span>
        <span>{Math.round(hi)}</span>
      </div>
      <div className="relative h-1 bg-border">
        <div
          className="absolute h-1 bg-foreground"
          style={{
            left: `${((lo - min) / (max - min)) * 100}%`,
            right: `${100 - ((hi - min) / (max - min)) * 100}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          step={1}
          onChange={(e) => handleLo(Number(e.target.value))}
          className="pointer-events-auto absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
          aria-label="Precio mínimo"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          step={1}
          onChange={(e) => handleHi(Number(e.target.value))}
          className="pointer-events-auto absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
          aria-label="Precio máximo"
        />
      </div>
    </div>
  );
};
