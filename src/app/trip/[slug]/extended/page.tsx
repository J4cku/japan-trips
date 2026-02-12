"use client";

import React from "react";
import { useTripData, useTripSlug } from "@/context/TripContext";
import type { Travel, RestaurantLocation, ExtendedDay } from "@/types/trip";
import { DaySlide } from "@/components/presentation/DaySlide";
import { NavDots } from "@/components/presentation/NavDots";
import { ProgressBar } from "@/components/presentation/ProgressBar";
import { ScrollObserver } from "@/components/presentation/ScrollObserver";
import { SplitBanner } from "@/components/extended/SplitBanner";
import Link from "next/link";

export default function ExtendedPage() {
  const data = useTripData();
  const slug = useTripSlug();
  const ext = data.extended;

  if (!ext) return <p>No extended trip data available.</p>;

  const ACCENT = "#c4956a";

  const travelsByDay: Record<number, Travel[]> = {};
  (ext.travels || []).forEach((t) => {
    if (!travelsByDay[t.day]) travelsByDay[t.day] = [];
    travelsByDay[t.day].push(t);
  });

  const restaurantsByDay: Record<number, { count: number; locationId: string }> = {};
  if (ext.restaurants?.byLocation) {
    Object.entries(ext.restaurants.byLocation).forEach(([id, loc]) => {
      (loc as RestaurantLocation).forDays.forEach((d) => {
        restaurantsByDay[d] = { count: (loc as RestaurantLocation).spots.length, locationId: id };
      });
    });
  }

  const totalSlides = ext.days.length + 2;

  return (
    <div
      id="snap-root"
      className="snap-container extended-page"
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

      {/* Hero Slide */}
      <section className="slide hero" id="slide-0">
        <div className="hero-content">
          <p className="hero-pre">Extended Adventure</p>
          <h1 className="hero-title" style={{ color: ACCENT }}>+{ext.extendedDays} Days</h1>
          <div className="hero-line" style={{ background: ACCENT }} />
          <p className="hero-meta">{ext.dates}<br />{ext.travelers} travelers &middot; {ext.extendedDays} days &middot; {ext.extendedNights} nights</p>
          <p className="hero-route">
            {ext.stays.map((s) => s.location).join(" → ")}
          </p>
          <SplitBanner isExtendedPage slug={slug} />
        </div>
      </section>

      {/* Day slides */}
      {ext.days.map((day, i) => {
        const extDay = day as ExtendedDay;
        let slideClass = "";
        if (extDay.isHikingDay) slideClass = "slide-hiking";
        if (extDay.onsenEtiquette) slideClass = "slide-onsen";

        return (
          <DaySlide
            key={day.day}
            day={day}
            index={i}
            travels={travelsByDay[day.day]}
            restaurantInfo={restaurantsByDay[day.day]}
            accentColor={ACCENT}
            slideClassName={slideClass}
            slug={slug}
          />
        );
      })}

      {/* Closing Slide */}
      <section className="slide closing" id={`slide-${totalSlides - 1}`}>
        <p className="closing-sub">Have a wonderful journey</p>
        <div className="stats" style={{ marginTop: 32 }}>
          <div>
            <div className="stat-num" style={{ color: ACCENT }}>{ext.extendedDays}</div>
            <div className="stat-label">Extra days</div>
          </div>
          <div>
            <div className="stat-num" style={{ color: ACCENT }}>{ext.stays.length}</div>
            <div className="stat-label">Cities</div>
          </div>
        </div>
      </section>

      <div className="fixed-links">
        <Link href={`/trip/${slug}`} className="itinerary-link">Main Trip</Link>
        <Link href={`/trip/${slug}/itinerary`} className="itinerary-link">Itinerary</Link>
        <Link href={`/trip/${slug}/hotels`} className="itinerary-link">Hotels</Link>
        <Link href={`/trip/${slug}/restaurants`} className="itinerary-link">Restaurants</Link>
        <Link href={`/trip/${slug}/map`} className="itinerary-link">Map</Link>
        <Link href={`/trip/${slug}/packing`} className="itinerary-link">Packing</Link>
      </div>
    </div>
  );
}
