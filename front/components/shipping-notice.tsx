"use client";

import { Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const ShippingNotice = ({ className }: { className?: string }) => {
  const t = useTranslations("home.shippingNotice");
  return (
  <div
    className={cn(
      "flex items-start gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4",
      className
    )}
  >
    <Truck className="mt-1 h-6 w-6 shrink-0 text-primary" />
    <p className="text-base leading-relaxed text-foreground sm:text-lg">
      {t.rich("text", {
        strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
      })}
    </p>
  </div>
  );
};
