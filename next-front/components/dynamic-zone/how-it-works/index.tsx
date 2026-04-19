"use client";
import {
  entranceAnimationVariants,
  useEntranceAnimation
} from "@/hooks/useEntranceAnimation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "./card";

export const HowItWorks = ({
  heading,
  sub_heading,
  steps
}: {
  heading: string;
  sub_heading: string;
  steps: any;
}) => {
  const { ref, isInView } = useEntranceAnimation();
  const total = steps?.length ?? 0;

  return (
    <motion.section
      ref={ref}
      variants={entranceAnimationVariants.container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          variants={entranceAnimationVariants.item}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-pink-100 rounded-full">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-xs md:text-sm font-semibold text-pink-700 uppercase tracking-wider">
              Proceso simple
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          {sub_heading && (
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">
              {sub_heading}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps?.map(
            (item: { title: string; description: string }, index: number) => (
              <Card
                title={item.title}
                description={item.description}
                index={index + 1}
                total={total}
                key={"card" + index}
              />
            )
          )}
        </div>
      </div>
    </motion.section>
  );
};
