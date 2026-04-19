"use client";

import { IconMapPin } from "@tabler/icons-react";
import ViewMap from "@/components/map/ViewMap";
import Link from "next/link";

const lat = process.env.NEXT_PUBLIC_LAT;
const lng = process.env.NEXT_PUBLIC_LNG;
const address = process.env.NEXT_PUBLIC_ADDRESS;
const locationLink = process.env.NEXT_PUBLIC_LOCATION_URL;

export const ViewMapComponent = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <ViewMap lat={Number(lat)} lng={Number(lng)} address={address || ""} />
      <Link
        href={locationLink || ""}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
      >
        <IconMapPin className="w-3 h-3" />
        Ver ubicación en el mapa
      </Link>
    </div>
  );
};
