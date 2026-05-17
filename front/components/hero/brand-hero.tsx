"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";

const CAROUSEL_IMAGES = [
  "/images/carrousel/1.png",
  "/images/carrousel/2.png",
  "/images/carrousel/3.png",
  "/images/carrousel/4.png",
  "/images/carrousel/5.png",
  "/images/carrousel/6.png",
  "/images/carrousel/7.png",
  "/images/carrousel/8.png"
];

const HeroCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % images.length),
      5000
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            className={`h-0.5 transition-all ${
              i === index ? "w-8 bg-background" : "w-4 bg-background/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export const BrandHero = () => {
  return (
    <section
      className="relative mx-auto grid w-full max-w-screen-2xl grid-cols-1 lg:grid-cols-2"
      aria-label="Iris Natural — bienvenida"
    >
      <div className="order-2 flex flex-col justify-center gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:order-1 lg:px-16 lg:py-24">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.22em] text-primary"
        >
          Iris Natural · Cosmética
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          El poder de la naturaleza, hecho cosmética
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Fórmulas naturales pensadas para cuidar y realzar la belleza de cada
          piel. Hechas con dedicación en Santa Cruz de la Sierra, Bolivia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-center gap-6"
        >
          <Link
            href="#productos"
            className="group inline-flex items-center gap-3 bg-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
          >
            Explorar productos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {process.env.NEXT_PUBLIC_LOCATION_URL && (
            <Link
              href={process.env.NEXT_PUBLIC_LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Ver tienda en el mapa
            </Link>
          )}
        </motion.div>
      </div>

      <div className="order-1 relative aspect-[4/5] w-full lg:order-2 lg:aspect-auto lg:min-h-[600px]">
        <HeroCarousel images={CAROUSEL_IMAGES} />
      </div>
    </section>
  );
};
