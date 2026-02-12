"use client";

import { useTripData, useTripSlug } from "@/context/TripContext";
import { RestaurantsView } from "@/components/restaurants/RestaurantsView";

export default function RestaurantsPage() {
  const data = useTripData();
  const slug = useTripSlug();

  return (
    <RestaurantsView
      restaurants={data.restaurants}
      extendedRestaurants={data.extended?.restaurants}
      slug={slug}
    />
  );
}
