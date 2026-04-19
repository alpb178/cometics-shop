import React from "react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { logsStrapi } from "@/lib/strapi/logs";

export const ButtonWhatsapp = ({
  onClick,
  label,
  description,
  productName
}: {
  onClick: () => void;
  label?: string;
  description?: string;
  productName?: string;
}) => {
  const handleWhatsAppClick = async () => {
    onClick();
    try {
      await logsStrapi(
        productName ?? "log whatsapp",
        description ?? "WhatsApp Button Clicked"
      );
    } catch {
      () => {};
    }
  };
  return (
    <motion.button
      onClick={handleWhatsAppClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full text-lg justify-center items-center mb-6 gap-2 bg-primary text-black rounded-full py-3 px-4 font-medium transition-all duration-200 hover:bg-primary/80"
    >
      <IconBrandWhatsapp className="w-5 h-5 text-lg" />
      {label ?? "Compra por WhatsApp"}
    </motion.button>
  );
};
