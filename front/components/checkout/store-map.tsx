"use client";

import { useEffect, useState } from "react";
import { Maximize2, X, MapPin } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapLibreMap } from "@/components/map/MapLibreMap";

const lat = Number(process.env.NEXT_PUBLIC_LAT);
const lng = Number(process.env.NEXT_PUBLIC_LNG);
const address = process.env.NEXT_PUBLIC_ADDRESS || "";
const locationLink = process.env.NEXT_PUBLIC_LOCATION_URL;

// Link to the store location: the configured one (Google Maps) or one generated
// from the coordinates as a fallback.
const mapsUrl = locationLink || `https://www.google.com/maps?q=${lat},${lng}`;



/**
 * Store map for the "Pick up in store" checkout step, with options to expand it
 * to full screen and share the location via WhatsApp.
 */
export function StoreMap() {
  const t = useTranslations("checkout.storeMap");
  const [expanded, setExpanded] = useState(false);
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    t("whatsappShare", { address: address ? ` — ${address}` : "", url: mapsUrl })
  )}`;

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative h-64 w-full overflow-hidden border border-border">
        <MapLibreMap
          lat={lat}
          lng={lng}
          address={address}
          className="h-full w-full"
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          title={t("expand")}
          aria-label={t("expand")}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center border border-border bg-background/95 text-foreground shadow transition-colors hover:bg-background"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-primary transition-colors hover:text-primary/80"
        >
          <MapPin className="h-3.5 w-3.5" />
          {t("viewOnMap")}
        </Link>
        <Link
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-[#25D366] transition-colors hover:opacity-80"
        >
          <IconBrandWhatsapp className="h-4 w-4" />
          {t("shareWhatsapp")}
        </Link>
      </div>

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("expandedLabel")}
          className="fixed inset-0 z-[10000] flex flex-col bg-black/80 p-4 sm:p-8"
        >
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {t("expandedTitle")}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("shareWhatsapp")}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:opacity-80"
                >
                  <IconBrandWhatsapp className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("share")}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  aria-label={t("close")}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <MapLibreMap
                lat={lat}
                lng={lng}
                address={address}
                zoom={17}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
