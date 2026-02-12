"use client";

import { useEffect, useRef, useState } from "react";
import type { HotelCity, HotelOption } from "@/types/trip";

function RyokanBadges({ h }: { h: HotelOption }) {
  const rd = h.ryokanDetails;
  if (!rd) return null;
  const tags: string[] = [];
  if (rd.onsen) tags.push("♨️ Onsen");
  if (rd.rotenburo) tags.push("🌿 Rotenburo");
  if (rd.privateBath) tags.push("🛁 Private bath");
  if (rd.meals) tags.push("🍱 " + rd.meals);
  if (rd.drinks) tags.push("🍶 " + rd.drinks);
  if (rd.tatami) tags.push("Tatami");
  if (rd.futon) tags.push("Futon");
  if (rd.yukata) tags.push("Yukata");
  if (!tags.length) return null;
  return (
    <div className="ryokan-badges">
      {tags.map((t, i) => (
        <span key={i} className="ryokan-tag">{t}</span>
      ))}
    </div>
  );
}

export function HotelModal({
  city,
  onClose,
}: {
  city: HotelCity;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "hotel" | "ryokan">("all");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasRyokans = city.options.some((h) => h.type === "ryokan");
  const filtered =
    filter === "all"
      ? city.options
      : city.options.filter((h) => (h.type || "hotel") === filter);

  return (
    <div className="hotel-overlay" onClick={onClose}>
      <div
        className="hotel-modal"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="hotel-close" onClick={onClose}>
          &times;
        </button>
        <div className="hotel-header">
          <h3 className="hotel-location">{city.location}</h3>
          <p className="hotel-meta">
            {city.nights} nights &middot; {city.dates}
            {city.checkIn && city.checkOut && (
              <span className="hotel-dates-exact">
                {" "}({city.checkIn} &rarr; {city.checkOut})
              </span>
            )}
          </p>
          <p className="hotel-purpose">{city.purpose}</p>
          {city.pricingNote && (
            <p className="hotel-pricing-note">{city.pricingNote}</p>
          )}
          {hasRyokans && (
            <div className="hotel-filters">
              {(["all", "hotel", "ryokan"] as const).map((f) => (
                <button
                  key={f}
                  className={`hotel-filter${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "ryokan" ? "♨️ Ryokans" : "Hotels"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hotel-list">
          {filtered.map((h) => (
            <div
              key={h.name}
              className={`hotel-card${h.travellerPick ? " hotel-pick" : ""}${h.type === "ryokan" ? " hotel-ryokan" : ""}`}
            >
              {h.type === "ryokan" && (
                <span className="ryokan-label">♨️ Ryokan</span>
              )}
              {h.travellerPick && (
                <span className="hotel-badge">
                  {h.pickReason || "Traveller Pick"}
                </span>
              )}
              <div className="hotel-card-top">
                <span className="hotel-name">{h.name}</span>
                <span className="hotel-name-jp">{h.nameJp}</span>
              </div>
              <span className="hotel-style">{h.style}</span>
              <div className="hotel-prices">
                <span>{h.priceEUR}/night</span>
                <span className="hotel-price-jpy">{h.priceJPY}</span>
                {h.totalPerRoom && (
                  <span className="hotel-total">{h.totalPerRoom}</span>
                )}
              </div>
              <p className="hotel-loc">{h.location}</p>
              <ul className="hotel-highlights">
                {h.highlights.map((hl, j) => (
                  <li key={j}>{hl}</li>
                ))}
              </ul>
              {h.type === "ryokan" && <RyokanBadges h={h} />}
              {h.dietaryNote && (
                <p className="hotel-dietary">{h.dietaryNote}</p>
              )}
              <div className="hotel-links">
                {h.bookingUrl && (
                  <a
                    href={h.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hotel-link hotel-link-booking"
                  >
                    Booking.com
                  </a>
                )}
                {h.officialUrl && (
                  <a
                    href={h.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hotel-link hotel-link-official"
                  >
                    Official site
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
