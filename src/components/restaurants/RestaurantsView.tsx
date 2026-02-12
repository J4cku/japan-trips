"use client";

import { useState } from "react";
import type { Restaurants, RestaurantSpot, RestaurantLocation } from "@/types/trip";
import Link from "next/link";

function DietaryBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className={`rx-badge ${ok ? "rx-badge-ok" : "rx-badge-no"}`}>
      {ok ? "\u2713 " : "\u2717 "}{label}
    </span>
  );
}

function PriceLevel({ price }: { price: string }) {
  const count = price.length;
  return (
    <span className="rx-price">
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={i < count ? "rx-price-active" : "rx-price-dim"}>
          {"\u00a5"}
        </span>
      ))}
    </span>
  );
}

function SpotCard({ spot }: { spot: RestaurantSpot }) {
  return (
    <div className="rx-card">
      <div className="rx-card-head">
        <div className="rx-card-title">
          <h3 className="rx-name">{spot.name}</h3>
          <span className="rx-name-jp">{spot.nameJp}</span>
        </div>
        <PriceLevel price={spot.price} />
      </div>
      <p className="rx-cuisine">{spot.cuisine}</p>
      <p className="rx-neighborhood">{spot.neighborhood}</p>
      <div className="rx-badges">
        <DietaryBadge label="GF" ok={spot.gf} />
        <DietaryBadge label="Vegan" ok={spot.vegan} />
        <DietaryBadge label="Veg" ok={spot.vegetarian} />
      </div>
      <div className="rx-musttry">
        <span className="rx-musttry-label">Must try</span>
        <span>{spot.mustTry}</span>
      </div>
      <p className="rx-note">{spot.note}</p>
      <a href={spot.url} target="_blank" rel="noopener noreferrer" className="rx-link">
        View restaurant
      </a>
    </div>
  );
}

function SurvivalTips({ tips }: { tips: string }) {
  return (
    <div className="rx-callout rx-callout-warn">
      <span className="rx-callout-icon">&#9888;&#65039;</span>
      <div>
        <strong>Survival tips</strong>
        <p>{tips}</p>
      </div>
    </div>
  );
}

function CyclingFuel({ guide }: { guide: NonNullable<RestaurantLocation["cyclingFuelGuide"]> }) {
  return (
    <div className="rx-callout rx-callout-fuel">
      <span className="rx-callout-icon">&#x1F6B2;</span>
      <div>
        <strong>Cycling fuel guide</strong>
        <ul className="rx-fuel-list">
          {guide.whatToPack.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="rx-fuel-konbini">{guide.konbiniStops}</p>
        <p className="rx-fuel-tip">{guide.tip}</p>
      </div>
    </div>
  );
}

function LocationSection({ id, loc, accent }: { id: string; loc: RestaurantLocation; accent?: string }) {
  return (
    <section id={`rx-${id}`} className="rx-location">
      <div className="rx-loc-header">
        <h2 className="rx-loc-name" style={accent ? { color: accent } : undefined}>{loc.label}</h2>
        <span className="rx-loc-days" style={accent ? { color: accent } : undefined}>
          Days {loc.forDays.join(", ")}
        </span>
      </div>
      {loc.survivalTips && <SurvivalTips tips={loc.survivalTips} />}
      {loc.cyclingFuelGuide && <CyclingFuel guide={loc.cyclingFuelGuide} />}
      <div className="rx-grid">
        {loc.spots.map((spot) => (
          <SpotCard key={spot.name} spot={spot} />
        ))}
      </div>
    </section>
  );
}

function AllergyCard({ jp, en }: { jp: string; en: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(jp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rx-allergy">
      <div className="rx-allergy-header">
        <h2 className="rx-allergy-title">Allergy Card</h2>
        <p className="rx-allergy-sub">Show this to restaurant staff</p>
      </div>
      <div className="rx-allergy-jp" lang="ja">{jp}</div>
      <p className="rx-allergy-en">{en}</p>
      <button className="rx-allergy-copy" onClick={copy}>
        {copied ? "Copied" : "Copy Japanese text"}
      </button>
    </div>
  );
}

function SafetyColumns({ safe, danger }: { safe: string[]; danger: string[] }) {
  return (
    <div className="rx-safety">
      <div className="rx-safety-col rx-safety-ok">
        <h3 className="rx-safety-title">Safe foods</h3>
        <ul>
          {safe.map((f, i) => (
            <li key={i}><span className="rx-check">{"\u2714"}</span> {f}</li>
          ))}
        </ul>
      </div>
      <div className="rx-safety-col rx-safety-no">
        <h3 className="rx-safety-title">Watch out</h3>
        <ul>
          {danger.map((f, i) => (
            <li key={i}><span className="rx-x">{"\u2718"}</span> {f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function RestaurantsView({ restaurants, extendedRestaurants, slug }: { restaurants: Restaurants; extendedRestaurants?: Restaurants; slug?: string }) {
  const prefix = slug ? `/trip/${slug}` : "";
  const locations = Object.entries(restaurants.byLocation);
  const extendedLocations = extendedRestaurants ? Object.entries(extendedRestaurants.byLocation) : [];
  const totalSpots = locations.reduce((n, [, loc]) => n + loc.spots.length, 0)
    + extendedLocations.reduce((n, [, loc]) => n + loc.spots.length, 0);

  return (
    <div className="rx-page">
      <div className="rx-enso" aria-hidden="true" />
      <header className="rx-header">
        <Link href={prefix || "/"} className="rx-back">&larr; Presentation</Link>
        <h1 className="rx-title">Dining Guide</h1>
        <p className="rx-subtitle">
          {totalSpots} restaurants across {locations.length + extendedLocations.length} areas
        </p>
        <p className="rx-note-top">{restaurants.note}</p>
        <nav className="rx-nav">
          {locations.map(([id, loc]) => (
            <a key={id} href={`#rx-${id}`} className="rx-nav-link">
              {loc.label}
              <span className="rx-nav-count">{loc.spots.length}</span>
            </a>
          ))}
          {extendedRestaurants && Object.entries(extendedRestaurants.byLocation).map(([id, loc]) => (
            <a key={`ext-${id}`} href={`#rx-ext-${id}`} className="rx-nav-link" style={{ borderColor: "rgba(196,149,106,0.3)" }}>
              {loc.label}
              <span className="rx-nav-count">{loc.spots.length}</span>
            </a>
          ))}
        </nav>
      </header>

      <main className="rx-main">
        {(restaurants.allergyCardJp || restaurants.allergyCardEn) && (
          <AllergyCard jp={restaurants.allergyCardJp} en={restaurants.allergyCardEn} />
        )}
        {(restaurants.safeFoods.length > 0 || restaurants.dangerFoods.length > 0) && (
          <SafetyColumns safe={restaurants.safeFoods} danger={restaurants.dangerFoods} />
        )}

        {restaurants.apps.length > 0 && (
          <div className="rx-apps">
            <span className="rx-apps-label">Useful apps:</span>
            {restaurants.apps.map((app, i) => (
              <span key={i} className="rx-app-chip">{app}</span>
            ))}
          </div>
        )}

        {locations.map(([id, loc]) => (
          <LocationSection key={id} id={id} loc={loc} />
        ))}

        {extendedRestaurants && Object.keys(extendedRestaurants.byLocation).length > 0 && (
          <>
            <div className="rx-extended-divider">
              <div className="rx-extended-line" />
              <span className="rx-extended-label">Extended Trip Restaurants</span>
              <div className="rx-extended-line" />
            </div>
            {extendedRestaurants.note && (
              <p className="rx-note-top" style={{ color: "#c4956a" }}>{extendedRestaurants.note}</p>
            )}
            {Object.entries(extendedRestaurants.byLocation).map(([id, loc]) => (
              <LocationSection key={id} id={`ext-${id}`} loc={loc} accent="#c4956a" />
            ))}
          </>
        )}
      </main>
    </div>
  );
}
