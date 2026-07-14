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
    <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
      El envío de nuestros productos es gratuito hasta el 10.º anillo en Santa
      Cruz de la Sierra.{" "}
      <span className="text-muted-foreground">
        Para envíos fuera de esta zona se aplica un adicional de Bs. 17.
      </span>
    </p>
  </div>
);
