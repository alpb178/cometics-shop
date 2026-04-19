"use client";

import { strapiImage } from "@/lib/strapi/strapiImage";
import { motion } from "framer-motion";
import Image from "next/image";

type StoryItem = {
  tittle: string;
  description: string;
  image?: { url: string; alternativeText?: string };
};

export function StoryPanel({ storys: data }: { storys: StoryItem[] }) {
  if (!data?.length) return null;

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-32">
        {data.map((item, index) => {
          const imageFirst = index % 2 === 0;
          const hasImage = Boolean(item.image);

          if (!hasImage) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="inline-block text-xs font-semibold text-pink-600 uppercase tracking-widest mb-4">
                  {String(index + 1).padStart(2, "0")} · Nuestra historia
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {item.tittle}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div
                className={`relative ${
                  imageFirst ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-pink-200 to-green-200 rounded-3xl blur-2xl opacity-40" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/60">
                  <Image
                    src={strapiImage(item.image!.url)}
                    alt={item.image!.alternativeText || item.tittle}
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div
                className={`${
                  imageFirst ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <span className="inline-block text-xs font-semibold text-pink-600 uppercase tracking-widest mb-4">
                  {String(index + 1).padStart(2, "0")} · Nuestra historia
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {item.tittle}
                  <div className="mt-4 w-16 h-1 bg-gradient-to-r from-pink-500 to-green-500 rounded-full" />
                </h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
