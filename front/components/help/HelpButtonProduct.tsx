"use client";

import { motion } from "framer-motion";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { onSendWhatsAppMessage } from "@/lib/utils";
import { logsStrapi } from "@/lib/strapi/logs";

export const HelpButtonProduct = ({ productName }: { productName: string }) => {
  const message = `¡Hola! ¿Podrían ayudarme con alguna consulta sobre el producto ${productName}?`;

  const handleWhatsAppClick = async () => {
    onSendWhatsAppMessage(message);

    try {
      await logsStrapi(
        "User Clicked Help Button WhatsApp on Product Details",
        message
      );
    } catch {
      () => {};
    }
  };

  return (
    <motion.div
      key="help-product "
      initial={{ rotate: 90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      exit={{ rotate: -90, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        e.stopPropagation();
        handleWhatsAppClick();
      }}
      className="flex items-center justify-center cursor-pointer bg-primary rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 "
    >
      <IconBrandWhatsapp className="w-6 h-6 text-lg text-white" />
    </motion.div>
  );
};
