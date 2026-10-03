"use client";

import { MapLibreMap } from "./MapLibreMap";

const ViewMap = ({
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
}) => {
  return (
    <MapLibreMap
      lat={lat}
      lng={lng}
      address={address}
      zoom={zoom}
      className={className}
    />
  );
};

export default ViewMap;
