"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = dynamic(
  () => import("@vis.gl/react-maplibre").then((m) => m.Map),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full animate-pulse bg-secondary" />
    )
  }
);
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
 * Toca el mapa o arrastra el pin para actualizar las coordenadas.
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
  useEffect(() => setMounted(true), []);

  const pos = value ?? center;

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse bg-secondary" />;
  }

  return (
    <div className="relative h-72 w-full overflow-hidden border border-border">
      <Map
        initialViewState={{
          longitude: pos.lng,
          latitude: pos.lat,
          zoom: 14
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
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/95 px-3 py-1.5 text-center text-xs text-muted-foreground shadow">
        Toca el mapa o arrastra el pin a tu ubicación de entrega
      </div>
    </div>
  );
}
