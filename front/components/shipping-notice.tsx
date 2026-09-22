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
      Al hacer pedido por la web{" "}
      <strong className="font-semibold">
        el envío de los productos es gratis hasta el 10.º anillo.
      </strong>{" "}
      Otras zonas y departamentos de Bolivia se cobra Bs. 17 adicionales.
    </p>
  </div>
);
