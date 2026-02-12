"use client";

import { useState } from "react";
import type { HotelCity, HotelOption } from "@/types/trip";
import Link from "next/link";

type Filter = "all" | "hotel" | "ryokan";
type Sort = "picks" | "price-asc" | "price-desc";

function parseMinPrice(h: HotelOption): number {
  const m = h.priceEUR.match(/(\d+)/);
  return m ? parseInt(m[1]) : 999;
}

function sortOptions(options: HotelOption[], sort: Sort): HotelOption[] {
  const sorted = [...options];
  switch (sort) {
    case "picks":
      return sorted.sort((a, b) => (b.travellerPick ? 1 : 0) - (a.travellerPick ? 1 : 0));
    case "price-asc":
      return sorted.sort((a, b) => parseMinPrice(a) - parseMinPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => parseMinPrice(b) - parseMinPrice(a));
  }
}

function RyokanChips({ h }: { h: HotelOption }) {
  const rd = h.ryokanDetails;
  if (!rd) return null;
  const chips: string[] = [];
  if (rd.onsen) chips.push("♨️ Onsen");
  if (rd.rotenburo) chips.push("🌿 Rotenburo");
  if (rd.privateBath) chips.push("🛁 Private bath");
  if (rd.meals) chips.push("🍱 " + rd.meals);
  if (rd.drinks) chips.push("🍶 " + rd.drinks);
  if (rd.yukata) chips.push("👘 Yukata");
  if (!chips.length) return null;
  return (
    <div className="hp-chips">
      {chips.map((c, i) => (
        <span key={i} className="hp-chip">{c}</span>
      ))}
      {rd.onsenType && <p className="hp-onsen-type">{rd.onsenType}</p>}
    </div>
  );
}

function HotelCard({ h }: { h: HotelOption }) {
  const isRyokan = h.type === "ryokan";
  return (
    <div className={`hp-card${isRyokan ? " hp-ryokan" : ""}${h.travellerPick ? " hp-pick" : ""}`}>
      <div className="hp-card-head">
        <div className="hp-card-labels">
          {isRyokan && <span className="hp-type-badge hp-type-ryokan">♨️ Ryokan</span>}
          {h.travellerPick && (
            <span className="hp-type-badge hp-type-pick">{h.pickReason || "Traveller Pick"}</span>
          )}
          {h.shimanamiReady && (
            <span className="hp-type-badge hp-type-shimanami">🚲 Shimanami ready</span>
          )}
        </div>
        <h3 className="hp-name">{h.name}</h3>
        <span className="hp-name-jp">{h.nameJp}</span>
      </div>
      <p className="hp-style">{h.style}</p>
      <div className="hp-pricing">
        <span className="hp-price-eur">{h.priceEUR}<span className="hp-per">/night</span></span>
        <span className="hp-price-jpy">{h.priceJPY}</span>
        {h.totalPerRoom && <span className="hp-total">{h.totalPerRoom}</span>}
      </div>
      <p className="hp-loc">{h.neighborhood} — {h.location}</p>
      <ul className="hp-highlights">
        {h.highlights.map((hl, j) => (
          <li key={j}>{hl}</li>
        ))}
      </ul>
      {isRyokan && <RyokanChips h={h} />}
      {h.dietaryNote && <p className="hp-dietary">{h.dietaryNote}</p>}
      {h.naritaAccess && <p className="hp-narita">{h.naritaAccess}</p>}
      <div className="hp-links">
        {h.bookingUrl && (
          <a href={h.bookingUrl} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-booking">
            Book on Booking.com
          </a>
        )}
        {h.officialUrl && (
          <a href={h.officialUrl} target="_blank" rel="noopener noreferrer" className="hp-btn hp-btn-official">
            Official site
          </a>
        )}
      </div>
    </div>
  );
}

export function HotelsView({ cities, slug }: { cities: HotelCity[]; slug?: string }) {
  const prefix = slug ? `/trip/${slug}` : "";
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("picks");

  const hasRyokans = cities.some((c) => c.options.some((o) => o.type === "ryokan"));

  return (
    <div className="hp-page">
      <div className="hp-enso" aria-hidden="true" />
      <header className="hp-header">
        <Link href={prefix || "/"} className="hp-back">&larr; Presentation</Link>
        <h1 className="hp-title">Hotels & Ryokans</h1>
        <p className="hp-subtitle">
          {cities.reduce((n, c) => n + c.options.length, 0)} options across {cities.length} cities
        </p>
        <div className="hp-controls">
          {hasRyokans && (
            <div className="hp-filter-group">
              {(["all", "hotel", "ryokan"] as const).map((f) => (
                <button
                  key={f}
                  className={`hp-filter${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "ryokan" ? "♨️ Ryokans" : "Hotels"}
                </button>
              ))}
            </div>
          )}
          <div className="hp-sort-group">
            {([
              ["picks", "Picks first"],
              ["price-asc", "Price ↑"],
              ["price-desc", "Price ↓"],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                className={`hp-sort${sort === val ? " active" : ""}`}
                onClick={() => setSort(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="hp-cities">
        {cities.map((city) => {
          const options = sortOptions(
            city.options.filter((h) => filter === "all" || (h.type || "hotel") === filter),
            sort
          );
          if (!options.length) return null;
          return (
            <section key={city.stayId} className="hp-city">
              <div className="hp-city-header">
                <h2 className="hp-city-name">{city.location}</h2>
                <div className="hp-city-meta">
                  <span>{city.nights} nights</span>
                  <span>{city.dates}</span>
                  {city.checkIn && city.checkOut && (
                    <span className="hp-city-dates">{city.checkIn} → {city.checkOut}</span>
                  )}
                </div>
                <p className="hp-city-purpose">{city.purpose}</p>
                {city.pricingNote && <p className="hp-city-note">{city.pricingNote}</p>}
              </div>
              <div className="hp-grid">
                {options.map((h) => (
                  <HotelCard key={h.name} h={h} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
