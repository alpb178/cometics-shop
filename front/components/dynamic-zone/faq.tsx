"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { FormattedText } from "../text/formatted-text";

export const FAQ = ({
  heading,
  faqs
}: {
  heading: string;
  faqs: { question: string; answer: string }[];
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-pink-100 rounded-full">
            <HelpCircle className="w-4 h-4 text-pink-600" />
            <span className="text-xs md:text-sm font-semibold text-pink-700 uppercase tracking-wider">
              Resolvemos tus dudas
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            {heading}
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs?.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-pink-200 shadow-md"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-start gap-4 p-5 md:p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-colors ${
                      isOpen
                        ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white"
                        : "bg-pink-50 text-pink-600"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 text-base md:text-lg font-semibold text-gray-900 leading-snug pt-1">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-gray-500 transition-transform duration-300 mt-1.5 ${
                      isOpen ? "rotate-180 text-pink-600" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.5rem] md:pl-[5rem]">
                        <FormattedText
                          content={faq.answer}
                          className="text-sm md:text-base text-gray-600 leading-relaxed"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
