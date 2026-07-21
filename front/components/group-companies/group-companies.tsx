"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Company, GROUP_COMPANIES } from "@/lib/companies";
import { trackEvent } from "@/lib/track-event";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { SlideBurst } from "@/components/carrousel/slide-burst";

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
  // Se incrementa en cada movimiento del carrusel (flecha o auto-avance) para
  // relanzar la ráfaga de destellos sobre las tarjetas.
  const [burst, setBurst] = useState(0);
  // Punto activo del indicador de cantidad: se deriva de la posición de scroll.
  const [active, setActive] = useState(0);
  const count = GROUP_COMPANIES.length;

  // Lleva la tarjeta `i` al inicio de la vista (usado por los puntos).
  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (max * i) / Math.max(1, count - 1), behavior: "smooth" });
    setBurst((b) => b + 1);
  };

  // Mantiene el punto activo sincronizado con el scroll (flechas, auto-avance
  // o arrastre manual). Mapea el rango de scroll a los índices de tarjeta.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const frac = max > 0 ? el.scrollLeft / max : 0;
      setActive(Math.round(frac * (count - 1)));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  // Auto-avance del carrusel: cada 5s pasa a la siguiente "página" y al llegar
  // al final vuelve al inicio (mismo tiempo de cambio que el carrusel del hero).
  // Se pausa al pasar el puntero por encima y respeta prefers-reduced-motion.
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
      setBurst((b) => b + 1);
    }, 5000);

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
      <div className="relative">
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

        {/* Ráfaga de destellos al mover el carrusel (no captura clics) */}
        <SlideBurst trigger={burst} />
      </div>

      {/* Indicador de cantidad (puntos) — mismo estilo que el carrusel del hero */}
      <div className="mt-6 flex justify-center gap-1.5">
        {GROUP_COMPANIES.map((company, i) => (
          <button
            key={company.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a ${company.name}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-6 bg-primary"
                : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
