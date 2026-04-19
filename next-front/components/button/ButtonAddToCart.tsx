"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { logsStrapi } from "@/lib/strapi/logs";

export const ButtonAddToCart = ({
  onClick,
  name
}: {
  onClick: () => void;
  name: string;
}) => {
  const handleAddToCart = async () => {
    onClick();

    try {
      await logsStrapi(
        "User Clicked Button Add to Cart",
        "Product Added to Cart: " + name
      );
    } catch {
      () => {};
    }
  };

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        handleAddToCart();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full  items-center justify-center gap-1 rounded-full py-3 px-4 font-semibold transition-all duration-200 shadow-md !bg-yellow-300 border-2 hover:shadow-lg"
    >
      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 " />
      <span className=" text-xs md:text-lg">Agregar al carrito</span>
    </motion.button>
  );
};
