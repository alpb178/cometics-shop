"use client";

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import { Company, GROUP_COMPANIES } from "@/lib/companies";
import { trackEvent } from "@/lib/track-event";

// Envoltorio con inclinación 3D al mover el cursor (perspectiva + rotateX/Y),
// suavizada con springs. En táctil no aplica (no hay hover) y no estorba.
function Tilt3D({ children }: { children: React.ReactNode }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), {
    stiffness: 220,
    damping: 18
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), {
    stiffness: 220,
    damping: 18
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.03 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="h-full [transform-style:preserve-3d]"
    >
      {children}
    </motion.div>
  );
}

// Tarjeta de una empresa hermana: imagen destacada con el nombre en overlay,
// descripción y CTA "Visitar sitio" (enlace externo seguro).
function CompanyCard({ company }: { company: Company }) {
  const track = () => trackEvent("group_click", { label: company.name });
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track}
        className="group relative block h-48 overflow-hidden"
        style={{ backgroundColor: company.background }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={company.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 font-display text-xl font-semibold text-white">
          {company.name}
        </h3>
      </a>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {company.description}
        </p>
        <a
          href={company.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`Visitar el sitio de ${company.name} (se abre en una pestaña nueva)`}
        >
          Visitar sitio
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

// Sección "Sitios de interés" — carrusel con las demás empresas del Grupo CorpSC.
export function GroupCompanies() {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // Auto-avance del carrusel: cada 4.5s pasa a la siguiente "página" y al
  // llegar al final vuelve al inicio. Se pausa al pasar el puntero por encima y
  // respeta prefers-reduced-motion.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });

    const id = setInterval(() => {
      if (paused) return;
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({
        left: nearEnd ? 0 : el.scrollLeft + el.clientWidth * 0.85,
        behavior: "smooth"
      });
    }, 4500);

    return () => {
      clearInterval(id);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("touchstart", pause);
    };
  }, []);

  return (
    <section
      aria-label="Sitios de interés del Grupo CorpSC"
      className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-10"
    >
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="mb-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Sitios de interés
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Conoce las demás plataformas del Grupo CorpSC.
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GROUP_COMPANIES.map((c) => (
          <div
            key={c.slug}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <Tilt3D>
              <CompanyCard company={c} />
            </Tilt3D>
          </div>
        ))}
      </div>
    </section>
  );
}
