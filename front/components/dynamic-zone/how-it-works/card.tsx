"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, MessageCircle, Package } from "lucide-react";

const stepIcons = [Search, ShoppingCart, MessageCircle, Package];

export const Card = ({
  title,
  description,
  index,
  total
}: {
  title: string;
  description: string;
  index: number;
  total?: number;
}) => {
  const Icon = stepIcons[(index - 1) % stepIcons.length];
  const isLast = total !== undefined && index === total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index - 1) * 0.1 }}
      className="relative group"
    >
      {/* Connector line to next step (desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-12 left-[calc(100%-1rem)] w-8 h-0.5 bg-gradient-to-r from-pink-200 to-green-200 z-0" />
      )}

      <div className="relative z-10 h-full flex flex-col items-start gap-4 p-6 md:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Number badge + icon */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30">
            <Icon className="w-6 h-6" strokeWidth={2.2} />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-white text-pink-600 text-xs font-bold border-2 border-pink-500 shadow-sm">
              {index}
            </span>
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h3>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Decorative gradient accent on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-pink-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};
