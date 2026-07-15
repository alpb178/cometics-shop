"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, Maximize2, X } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = dynamic(() => import("@vis.gl/react-maplibre").then((m) => m.Map), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse bg-secondary" />
});
const Marker = dynamic(
  () => import("@vis.gl/react-maplibre").then((m) => m.Marker),
  { ssr: false }
);

type LngLatEvent = { lngLat: { lat: number; lng: number } };

// Estilo raster de OpenStreetMap (sin API key), igual que el mapa de la ficha.
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    "osm-tiles": {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap"
    }
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster" as const,
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

/**
 * Mapa interactivo para que el cliente fije el punto exacto de entrega.
 * Toca el mapa o arrastra el pin para actualizar las coordenadas. Incluye
 * controles para usar la ubicación actual del dispositivo y para ampliar el
 * mapa a pantalla completa.
 */
export function LocationPicker({
  value,
  center,
  onChange
}: {
  value: { lat: number; lng: number } | null;
  center: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"idle" | "locating" | "error">(
    "idle"
  );
  // Remonta el mapa para recentrarlo cuando llega la ubicación del dispositivo
  // (la vista es no controlada: mover solo el pin no recentra).
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => setMounted(true), []);

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

  const pos = value ?? center;

  const locate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        onChange({ lat: p.coords.latitude, lng: p.coords.longitude });
        setMapKey((k) => k + 1);
        setGeoStatus("idle");
      },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse bg-secondary" />;
  }

  const hint =
    geoStatus === "locating"
      ? "Obteniendo tu ubicación…"
      : geoStatus === "error"
        ? "No pudimos obtener tu ubicación. Marca el punto manualmente."
        : "Toca el mapa o arrastra el pin a tu ubicación de entrega";

  const renderMap = (zoom: number) => (
    <Map
      key={mapKey}
      initialViewState={{
        longitude: pos.lng,
        latitude: pos.lat,
        zoom
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={OSM_STYLE}
      attributionControl={false}
      onClick={(e: LngLatEvent) =>
        onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })
      }
    >
      <Marker
        longitude={pos.lng}
        latitude={pos.lat}
        anchor="bottom"
        draggable
        onDragEnd={(e: LngLatEvent) =>
          onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        }
      >
        <svg width="30" height="38" viewBox="0 0 32 40" fill="none">
          <path
            d="M16 0C7.164 0 0 7.164 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.164 24.836 0 16 0Z"
            fill="#111827"
          />
          <circle cx="16" cy="16" r="6" fill="white" />
        </svg>
      </Marker>
    </Map>
  );

  const locateButton = (
    <button
      type="button"
      onClick={locate}
      disabled={geoStatus === "locating"}
      title="Usar mi ubicación actual"
      aria-label="Usar mi ubicación actual"
      className="flex h-9 w-9 items-center justify-center border border-border bg-background/95 text-foreground shadow transition-colors hover:bg-background disabled:cursor-wait"
    >
      <LocateFixed
        className={`h-4 w-4 ${geoStatus === "locating" ? "animate-pulse" : ""}`}
      />
    </button>
  );

  return (
    <>
      <div className="relative h-72 w-full overflow-hidden border border-border">
        {renderMap(14)}
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          {locateButton}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            title="Agrandar mapa"
            aria-label="Agrandar mapa"
            className="flex h-9 w-9 items-center justify-center border border-border bg-background/95 text-foreground shadow transition-colors hover:bg-background"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-2 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-background/95 px-3 py-1.5 text-center text-xs text-muted-foreground shadow">
          {hint}
        </div>
      </div>

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mapa de ubicación de entrega ampliado"
          className="fixed inset-0 z-[10000] flex flex-col bg-black/80 p-4 sm:p-8"
        >
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                Ubicación de entrega
              </p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Cerrar mapa"
                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1">
              {renderMap(15)}
              <div className="absolute right-2 top-2">{locateButton}</div>
              <div className="pointer-events-none absolute bottom-3 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-background/95 px-3 py-1.5 text-center text-xs text-muted-foreground shadow">
                {hint}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
