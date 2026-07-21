"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { SlideBurst } from "@/components/carrousel/slide-burst";

const CAROUSEL_IMAGES = [
  "/images/carrousel/2.jpeg",
  "/images/carrousel/4.jpeg",
  "/images/carrousel/5.jpeg",
  "/images/carrousel/8.jpeg",
  "/images/carrousel/9.jpeg",
  "/images/carrousel/10.jpeg",
  "/images/carrousel/11.jpeg",
  "/images/carrousel/12.jpeg",
  "/images/carrousel/13.jpeg",
  "/images/carrousel/14.jpeg",
  "/images/carrousel/15.jpeg",
  "/images/carrousel/16.jpeg",
  "/images/carrousel/17.jpeg",
  "/images/carrousel/18.jpeg"
];

const HeroCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % images.length),
      5000
    );
    return () => clearInterval(id);
  }, [images.length, paused]);

  const goPrev = () =>
    setIndex((p) => (p - 1 + images.length) % images.length);
  const goNext = () => setIndex((p) => (p + 1) % images.length);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 1024px) 90vw, 448px"
            className="object-cover object-center"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Ráfaga de destellos al cambiar de slide (debajo de flechas/indicadores) */}
      <SlideBurst trigger={index} className="z-[5]" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/10 text-foreground backdrop-blur-sm transition hover:bg-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente"
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/10 text-foreground backdrop-blur-sm transition hover:bg-foreground/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-foreground/30"
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

      <div className="order-1 flex items-center justify-center px-6 py-8 lg:order-2 lg:px-10 lg:py-16">
        <div className="relative w-full max-w-md">
          <div
            aria-hidden
            className="absolute -inset-6 -rotate-3 rounded-3xl bg-gradient-to-r from-pink-300/40 to-green-300/40"
          />
          <div
            aria-hidden
            className="absolute -inset-6 rotate-3 rounded-3xl bg-gradient-to-r from-green-300/30 to-yellow-300/30"
          />
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
            <HeroCarousel images={CAROUSEL_IMAGES} />
          </div>
        </div>
      </div>
    </section>
  );
};
