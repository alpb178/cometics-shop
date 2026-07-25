import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export const ShippingNotice = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex items-start gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4",
      className
    )}
  >
    <Truck className="mt-1 h-6 w-6 shrink-0 text-primary" />
    <p className="text-base leading-relaxed text-foreground sm:text-lg">
      Realizamos envíos a toda Bolivia:{" "}
      <mark className="rounded-md bg-primary/25 px-1.5 py-0.5 font-semibold text-foreground">
        Delivery gratis hasta el 10.º anillo en Santa Cruz de la Sierra.
      </mark>{" "}
      Otras zonas: adicional de Bs. 17.
    </p>
  </div>
);
