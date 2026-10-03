"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";

export const StickyScroll = ({
  content
}: {
  content: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
}) => {
  return (
    <div className="py-4 md:py-20">
      <motion.div className="hidden relative lg:flex flex-col justify-between mx-auto p-10 max-w-7xl h-full">
        {content.map((item, index) => (
          <ScrollContent key={item.title + index} item={item} index={index} />
        ))}
      </motion.div>
      <motion.div className="lg:hidden relative flex flex-col justify-between mx-auto p-10 max-w-7xl">
        {content.map((item, index) => (
          <ScrollContentMobile
            key={item.title + index}
            item={item}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const ScrollContent = ({
  item,
  index
}: {
  item: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  };
  index: number;
}) => {
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const translate = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const translateContent = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.5, 0.7, 1],
    [0, 1, 1, 0, 0]
  );

  const opacityContent = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      transition={{
        duration: 0.3
      }}
      key={item.title + index}
      className="relative gap-8 grid grid-cols-2 my-40"
    >
      <motion.div
        key={item.title + index}
        style={{
          y: translate,
          opacity: opacity
        }}
        className="self-start rounded-md w-full h-full font-merriweather"
      >
        {item.content && item.content}
      </motion.div>
      <div className="w-full">
        <motion.div
          style={{
            y: translateContent,
            opacity: index === 0 ? opacityContent : 1
          }}
          className=""
        >
          <div>{item.icon}</div>
          <motion.h2 className="inline-block mt- max-w-lg font-bold text-foreground text-2xl text-left">
            {item.title}
          </motion.h2>

          <motion.div className="space-y-4 mt-4 font-regular text-foreground/60 text-lg">
            <ReactMarkdown>{item.description}</ReactMarkdown>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const ScrollContentMobile = ({
  item,
  index
}: {
  item: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  };
  index: number;
}) => {
  return (
    <motion.div
      transition={{
        duration: 0.3
      }}
      key={item.title + index}
      className="relative flex md:flex-row flex-col md:space-x-4 my-10"
    >
      <motion.div
        key={item.title + index}
        className="self-start mb-8 rounded-md w-full"
      >
        {item.content && item.content}
      </motion.div>
      <div className="w-full">
        <motion.div className="mb-6">
          <div>{item.icon}</div>
          <motion.h2 className="inline-block mt-2 font-bold text-foreground text-2xl lg:text-4xl text-left">
            {item.title}
          </motion.h2>
          <motion.div className="gap-4 mt-4 text-foreground/70 xs:text-lg">
            <ReactMarkdown>{item.description}</ReactMarkdown>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
