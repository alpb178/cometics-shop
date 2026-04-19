import React from "react";
import { motion } from "framer-motion";

export const ButtonDetails = ({
  onClick,
  label
}: {
  onClick: () => void;
  label?: string;
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full text-underline text-xs justify-center items-center p-3 font-medium transition-all duration-200"
    >
      {label ?? "Ver opciones"}
    </motion.button>
  );
};
