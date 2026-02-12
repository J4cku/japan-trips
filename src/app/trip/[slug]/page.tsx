"use client";

import React from "react";
import { useTripData, useTripSlug } from "@/context/TripContext";
import type { Travel, RestaurantLocation } from "@/types/trip";
import { HeroSlide } from "@/components/presentation/HeroSlide";
import { DaySlide } from "@/components/presentation/DaySlide";
import { ClosingSlide } from "@/components/presentation/ClosingSlide";
import { NavDots } from "@/components/presentation/NavDots";
import { ProgressBar } from "@/components/presentation/ProgressBar";
import { ScrollObserver } from "@/components/presentation/ScrollObserver";
import { SplitBanner } from "@/components/extended/SplitBanner";
import Link from "next/link";

export default function PresentationPage() {
  const data = useTripData();
  const slug = useTripSlug();

  const travelsByDay: Record<number, Travel[]> = {};
  (data.travels || []).forEach((t) => {
    if (!travelsByDay[t.day]) travelsByDay[t.day] = [];
    travelsByDay[t.day].push(t);
  });

  const restaurantsByDay: Record<number, { count: number; locationId: string }> = {};
  if (data.restaurants?.byLocation) {
    Object.entries(data.restaurants.byLocation).forEach(([id, loc]) => {
      (loc as RestaurantLocation).forDays.forEach((d) => {
        restaurantsByDay[d] = { count: (loc as RestaurantLocation).spots.length, locationId: id };
      });
    });
  }

  const totalSlides = data.days.length + 2;
  const stickers = data.stickers;
  const tags = data.luggageTags;
  const polaroids = data.polaroids;

  return (
    <div
      id="snap-root"
      className="snap-container"
      style={{
        backgroundColor: "var(--black)",
        color: "var(--white)",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <ProgressBar />
      <NavDots totalSlides={totalSlides} />
      <ScrollObserver />

      <HeroSlide
        trip={data.trip}
        stickers={stickers?.hero}
        tags={tags?.hero}
      />
      {data.days.map((day, i) => {
        const num = String(day.day).padStart(2, "0");
        return (
          <React.Fragment key={day.day}>
            <DaySlide
              day={day}
              index={i}
              hotels={data.hotels}
              travels={travelsByDay[day.day]}
              restaurantInfo={restaurantsByDay[day.day]}
              slug={slug}
              stickers={stickers?.days[num]}
              tag={tags?.days[num]}
              dayIconSrc={stickers?.dayIcons?.[num]}
              polaroids={polaroids?.[`day${day.day}`]}
            >
              {data.extended && day.day === data.extended.splitDay && (
                <SplitBanner slug={slug} />
              )}
            </DaySlide>
          </React.Fragment>
        );
      })}
      <ClosingSlide
        stats={data.stats}
        totalDays={data.days.length}
        trip={data.trip}
        stickers={stickers?.closing}
        tags={tags?.closing}
      />

      <div className="fixed-links">
        <Link href={`/trip/${slug}/itinerary`} className="itinerary-link">Itinerary</Link>
        <Link href={`/trip/${slug}/hotels`} className="itinerary-link">Hotels</Link>
        <Link href={`/trip/${slug}/restaurants`} className="itinerary-link">Restaurants</Link>
        <Link href={`/trip/${slug}/map`} className="itinerary-link">Map</Link>
        <Link href={`/trip/${slug}/packing`} className="itinerary-link">Packing</Link>
        {data.extended && (
          <Link href={`/trip/${slug}/extended`} className="itinerary-link" style={{ borderColor: "rgba(196,149,106,0.3)", color: "#c4956a" }}>Extended</Link>
        )}
      </div>
    </div>
  );
}
