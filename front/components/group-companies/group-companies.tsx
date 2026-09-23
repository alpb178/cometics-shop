"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Company, GROUP_COMPANIES } from "@/lib/companies";
import { trackEvent } from "@/lib/track-event";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { SlideBurst } from "@/components/carrousel/slide-burst";

// Sister company card: featured image with the name overlaid, description and a
// "Visitar sitio" CTA (safe external link).
function CompanyCard({ company }: { company: Company }) {
  const t = useTranslations("home");
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
          {t(`companies.${company.slug}.description`)}
        </p>
        <a
          href={company.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={t("groupCompanies.visitSiteLabel", { name: company.name })}
        >
          {t("groupCompanies.visitSite")}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

// "Sitios de interés" section — carousel with the other CorpSC Group companies.
export function GroupCompanies() {
  const t = useTranslations("home");
  const scroller = useRef<HTMLDivElement>(null);
  // Incremented on every carousel move (arrow or auto-advance) to restart the
  // sparkle burst over the cards.
  const [burst, setBurst] = useState(0);
  // Active dot of the count indicator: derived from the scroll position.
  const [active, setActive] = useState(0);
  const count = GROUP_COMPANIES.length;

  // Bring card `i` to the start of the view (used by the dots).
  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (max * i) / Math.max(1, count - 1), behavior: "smooth" });
    setBurst((b) => b + 1);
  };

  // Keeps the active dot in sync with the scroll (arrows, auto-advance or
  // manual drag). Maps the scroll range to card indexes.
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

  // Carousel auto-advance: every 5s it moves to the next "page" and at the end
  // goes back to the start (same interval as the hero carousel). It pauses
  // while the pointer is over it and respects prefers-reduced-motion.
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
      aria-label={t("groupCompanies.sectionLabel")}
      className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-10"
    >
      {/* Align the cards with the products column: same grid as the list
          (220px sidebar + products) with a gap on the left at lg. */}
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-x-10">
        <div aria-hidden="true" className="hidden lg:block" />
        <div className="min-w-0">
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

        {/* Sparkle burst when the carousel moves (does not capture clicks) */}
        <SlideBurst trigger={burst} />
      </div>

      {/* Count indicator (dots) — same style as the hero carousel */}
      <div className="mt-6 flex justify-center gap-1.5">
        {GROUP_COMPANIES.map((company, i) => (
          <button
            key={company.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={t("groupCompanies.goTo", { name: company.name })}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? "w-6 bg-primary"
                : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
        </div>
      </div>
    </section>
  );
}
