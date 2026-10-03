"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface QuantitySelectorProps {
  min?: number;
  max?: number;
  initialValue?: number;
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

export const QuantitySelector = ({
  min = 1,
  max = 20,
  initialValue = 1,
  onQuantityChange,
  className
}: QuantitySelectorProps) => {
  const t = useTranslations("products.quantity");
  const [quantity, setQuantity] = useState(initialValue);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      setQuantity(value);
      onQuantityChange?.(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor="quantity" className="text-sm font-medium text-foreground">
        {t("label")}
      </label>

      <div className="flex items-center border border-border p-4 rounded-lg overflow-hidden">
        <div onClick={handleDecrease} className="border-none" aria-label={t("decrease")}>
          <Minus className="w-4 h-4" />
        </div>

        <input
          id="quantity"
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={handleInputChange}
          className="w-16 text-center border-0 focus:outline-none focus:ring-0 bg-transparent text-foreground font-medium"
        />

        <div onClick={handleIncrease} className="border-none" aria-label={t("increase")}>
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
