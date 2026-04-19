"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "maplibre-gl/dist/maplibre-gl.css";

// Load react-map-gl dynamically from @vis.gl/react-maplibre
const Map = dynamic(
  () => import("@vis.gl/react-maplibre").then((mod) => mod.Map),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-lg bg-muted animate-pulse" />
    )
  }
);

const Marker = dynamic(
  () => import("@vis.gl/react-maplibre").then((mod) => mod.Marker),
  {
    ssr: false
  }
);

export function MapLibreMap({
  lat,
  lng,
  address,
  zoom = 16,
  className
}: {
  lat: number;
  lng: number;
  address: string;
  zoom?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={className || "w-full h-64 rounded-lg bg-muted animate-pulse"}
      />
    );
  }

  return (
    <div
      className={
        className ||
        "w-full h-64 rounded-lg overflow-hidden border border-primary"
      }
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "256px"
      }}
    >
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: zoom
        }}
        style={{ width: "100%", height: "100%", minHeight: "256px" }}
        mapStyle={{
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 22
            }
          ]
        }}
        scrollZoom={false}
        attributionControl={false}
      >
        {/* Marker using react-map-gl Marker */}
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <div
            style={{
              width: "32px",
              height: "40px",
              cursor: "pointer"
            }}
          >
            <svg
              width="32"
              height="40"
              viewBox="0 0 32 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0C7.164 0 0 7.164 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.164 24.836 0 16 0Z"
                fill="#ef4444"
              />
              <path
                d="M16 0C7.164 0 0 7.164 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.164 24.836 0 16 0Z"
                fill="#ef4444"
                opacity="0.2"
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>
          </div>
        </Marker>
      </Map>

      {/* Tooltip with the address */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs shadow-lg z-[1000] max-w-[90%] text-center border border-gray-200">
        {address}
      </div>
    </div>
  );
}
