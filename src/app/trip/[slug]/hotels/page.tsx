"use client";

import { useTripData, useTripSlug } from "@/context/TripContext";
import { HotelsView } from "@/components/hotels/HotelsView";
import type { HotelCity } from "@/types/trip";

export default function HotelsPage() {
  const data = useTripData();
  const slug = useTripSlug();

  const cities = Object.values(data.hotels).filter(
    (v): v is HotelCity => typeof v === "object" && v !== null && "options" in v && "stayId" in v
  );

  return <HotelsView cities={cities} slug={slug} />;
}
