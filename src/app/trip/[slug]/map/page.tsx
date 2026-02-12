"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useTripData, useTripSlug } from "@/context/TripContext";
import { MapLoader } from "@/components/map/MapLoader";

export default function MapPage() {
  const data = useTripData();
  const slug = useTripSlug();
  const extDays = data.extended ? data.days.length + data.extended.extendedDays : data.days.length;

  return (
    <>
      <Link href={`/trip/${slug}`} className="map-back">
        &larr; Back
      </Link>
      <Suspense>
        <MapLoader
          pinsData={data.pins}
          totalDays={data.days.length}
          extendedTotalDays={extDays}
          mapConfig={data.mapConfig}
          routes={data.routes}
        />
      </Suspense>
    </>
  );
}
