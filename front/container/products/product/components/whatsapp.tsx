"use client";

import { Product } from "@/definitions/Product";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { logsStrapi } from "@/lib/strapi/logs";
import { useTranslations } from "next-intl";

export const WhatsappLink = ({
  product,
  quantity,
  getDeliveryText,
  getButtonText
}: {
  product: Product;
  quantity: number;
  getDeliveryText: () => string;
  getButtonText: () => string;
}) => {
  const t = useTranslations("products.whatsapp");
  const totalPrice = product.price ? product.price * quantity : 0;

  const message = t("message", {
    quantity,
    name: product.name,
    hasPrice: product.price ? "yes" : "no",
    price: product.price ?? 0,
    currency: product.currency ?? "",
    hasTotal: totalPrice > 0 ? "yes" : "no",
    total: totalPrice,
    delivery: getDeliveryText()
  });

  const handleClick = async () => {
    window.open(
      `https://wa.me/${
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      }?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    try {
      await logsStrapi("User Clicked Button Whatsapp", message);
    } catch {
      () => {};
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex w-full justify-center items-center gap-2 border border-primary rounded-full px-4 py-2 hover:bg-primary text-primary hover:text-foreground hover:border-foreground"
    >
      <IconBrandWhatsapp className="w-6 h-6 " />
      <span className="text-lg hover:text-foreground">{getButtonText()}</span>
    </button>
  );
};
