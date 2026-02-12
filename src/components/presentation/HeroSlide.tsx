import { Countdown } from "./Countdown";
import { Sticker } from "./Sticker";
import { LuggageTag } from "./LuggageTag";
import type { TripData, StickerPlacement, TagPlacement } from "@/types/trip";

export function HeroSlide({
  trip,
  stickers,
  tags,
}: {
  trip: TripData["trip"];
  stickers?: StickerPlacement[];
  tags?: TagPlacement[];
}) {
  return (
    <section className="slide hero" id="slide-0">
      {stickers?.map((s, i) => (
        <Sticker key={i} s={s} />
      ))}
      {tags?.map((t, i) => (
        <LuggageTag
          key={i}
          city={t.city}
          code={t.code}
          date={t.date}
          style={{
            ...(t.top ? { top: t.top } : {}),
            ...(t.bottom ? { bottom: t.bottom } : {}),
            ...(t.left ? { left: t.left } : {}),
            ...(t.right ? { right: t.right } : {}),
            "--tag-rot": t.rot || "0deg",
            "--tag-delay": t.delay || "0.2s",
          } as React.CSSProperties}
        />
      ))}
      <div className="hero-content">
        <span className="hero-pre rv d1">{trip.dates}</span>
        <h1 className="hero-title rv d2">{trip.title}</h1>
        <div className="hero-line rv-l d4" />
        <p className="hero-meta rv d5">{trip.travelers} Travelers &middot; {trip.durationDays} Days</p>
        {trip.route.length > 0 && (
          <p className="hero-route rv d6">{trip.route.join(" \u2192 ")}</p>
        )}
        <Countdown trip={trip} />
      </div>
      <div className="scroll-cue">
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span>Scroll to begin</span>
      </div>
    </section>
  );
}
