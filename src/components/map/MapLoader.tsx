"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { PinsData, MapConfig, TripRoutes } from "@/types/trip";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

interface MapLoaderProps {
  pinsData: PinsData;
  totalDays: number;
  extendedTotalDays?: number;
  mapConfig?: MapConfig;
  routes?: TripRoutes;
}

export function MapLoader({ pinsData, totalDays, extendedTotalDays = 21, mapConfig, routes }: MapLoaderProps) {
  const searchParams = useSearchParams();
  const initialDay = useMemo(() => {
    const raw = searchParams.get("day");
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return !isNaN(n) && n >= 1 && n <= totalDays ? n : null;
  }, [searchParams, totalDays]);

  return (
    <MapView
      pinsData={pinsData}
      totalDays={totalDays}
      extendedTotalDays={extendedTotalDays}
      initialDay={initialDay}
      mapConfig={mapConfig}
      routes={routes}
    />
  );
}
