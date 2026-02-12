import { Sticker } from "./Sticker";
import { LuggageTag } from "./LuggageTag";
import type { Stat, Trip, StickerPlacement, TagPlacement } from "@/types/trip";

export function ClosingSlide({
  stats,
  totalDays,
  trip,
  stickers,
  tags,
}: {
  stats: Stat[];
  totalDays: number;
  trip: Trip;
  stickers?: StickerPlacement[];
  tags?: TagPlacement[];
}) {
  return (
    <section className="slide closing" id={`slide-${totalDays + 1}`}>
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
      <p className="hero-pre rv">The journey</p>
      <div className="stats">
        {stats.map((s, i) => (
          <div key={i} className={`rv d${i + 1}`}>
            <div className="stat-num">
              {s.value}
              {s.suffix && <span className="suffix">{s.suffix}</span>}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      {trip.titleJp && <p className="closing-jp rv d7">{trip.titleJp}</p>}
      <p className="closing-sub rv d8">Have a great trip.</p>
    </section>
  );
}
