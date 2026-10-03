import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const ButtonDetails = ({
  onClick,
  label
}: {
  onClick: () => void;
  label?: string;
}) => {
  const t = useTranslations("products.buttons");
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full text-underline text-xs justify-center items-center p-3 font-medium transition-all duration-200"
    >
      {label ?? t("viewOptions")}
    </motion.button>
  );
};
