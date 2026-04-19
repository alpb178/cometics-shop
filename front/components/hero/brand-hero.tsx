"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const CarouselContent = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full min-h-[200px]">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 duration-700 ease-in-out transition-opacity ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            fill
            className="object-contain object-center"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 448px"
          />
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-3 left-1/2 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-pink-600 w-8"
                : "bg-white/50 hover:bg-white/75 w-2"
            }`}
            aria-current={index === currentIndex}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous button */}
      <button
        type="button"
        onClick={goToPrevious}
        className="absolute top-1/2 start-0 z-30 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none transform -translate-y-1/2"
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-pink-500 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={goToNext}
        className="absolute top-1/2 end-0 z-30 flex items-center justify-center h-full px-2 cursor-pointer group focus:outline-none transform -translate-y-1/2"
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-2 group-focus:ring-pink-500 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m9 5 7 7-7 7"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export const BrandHero = () => {


  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-white to-green-50 py-16 md:py-24 mb-10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Brand Tagline */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">
                  Productos Naturales de Calidad
                </span>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent">
                  Iris Natural Cosmética
                </span>
                 
              </h1>

              <p className="text-lg sm:text-lg md:text-xl text-gray-600 leading-loose sm:leading-relaxed max-w-2xl">
               En Iris Natural Cosmética creemos en el poder de la naturaleza para cuidar y realzar la belleza de cada persona. Estamos en Santa Cruz de la Sierra, Bolivia.
               </p>

              <Link
          href={process.env.NEXT_PUBLIC_LOCATION_URL || ""}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-10 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <MapPin className="w-6 h-6 text-primary" />
          <span className="text-primary font-semibold text-lg">Ver ubicación en el mapa</span>
        </Link>
            </div>

         

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <Link href="#productos" className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto min-h-[52px] bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Explorar Productos
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Carousel with Naturaleza Pura Style */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-green-200 to-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000" />
              
              {/* Central visual element with carousel */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-green-400 rounded-3xl transform rotate-6 opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-3xl transform -rotate-6 opacity-20" />
                  <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6">
                    <div className="relative w-full aspect-[10/3] overflow-hidden rounded-2xl">
                      <CarouselContent images={[
                        "/images/carrousel/1.png",
                        "/images/carrousel/2.png",
                        "/images/carrousel/3.png",
                        "/images/carrousel/4.png",
                        "/images/carrousel/5.png",
                        "/images/carrousel/6.png",
                        "/images/carrousel/7.png",
                        "/images/carrousel/8.png"
                      ]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};
