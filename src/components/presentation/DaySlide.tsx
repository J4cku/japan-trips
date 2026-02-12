import { Sticker } from "./Sticker";
import { Polaroid } from "./Polaroid";
import { LuggageTag } from "./LuggageTag";
import { TransportStrip } from "./TransportStrip";
import type { Day, Hotels, Travel, HotelCity, StickerPlacement, TagPlacement, PolaroidPhoto } from "@/types/trip";
import Link from "next/link";

export function DaySlide({
  day,
  index,
  hotels,
  travels,
  restaurantInfo,
  accentColor,
  children,
  slideClassName,
  slug,
  stickers,
  tag,
  dayIconSrc,
  polaroids,
}: {
  day: Day;
  index: number;
  hotels?: Hotels;
  travels?: Travel[];
  restaurantInfo?: { count: number; locationId: string };
  accentColor?: string;
  children?: React.ReactNode;
  slideClassName?: string;
  slug?: string;
  stickers?: StickerPlacement[];
  tag?: TagPlacement;
  dayIconSrc?: string;
  polaroids?: PolaroidPhoto[];
}) {
  const num = String(day.day).padStart(2, "0");
  const prefix = slug ? `/trip/${slug}` : "";

  // Derive hotel data from tag's hotelKey or stay field matching
  let hotelData: HotelCity | undefined;
  if (hotels && day.stay) {
    const stayLower = day.stay.toLowerCase();
    for (const val of Object.values(hotels)) {
      if (val && typeof val === "object" && "options" in val && "location" in val) {
        const city = val as HotelCity;
        const locLower = city.location.toLowerCase();
        const noise = /\b(hotel|the|a|an|near)\b/g;
        const stayWords = stayLower.replace(noise, "").split(/[\s,()]+/).filter(Boolean);
        const locWords = locLower.replace(noise, "").split(/[\s,()]+/).filter(Boolean);
        if (stayWords.some(w => locWords.includes(w))) {
          hotelData = city;
          break;
        }
      }
    }
  }

  return (
    <section
      className={`slide${slideClassName ? ` ${slideClassName}` : ""}`}
      id={`slide-${index + 1}`}
      {...(accentColor ? { style: { "--red": accentColor } as React.CSSProperties } : {})}
    >
      <div className="day-bg-num rv-s">{num}</div>
      {stickers?.map((s, j) => (
        <Sticker key={j} s={{ ...s, delay: `${0.3 + j * 0.2}s` }} />
      ))}
      {polaroids?.map((p, j) => (
        <Polaroid key={j} photo={p} index={j} delay={`${0.5 + j * 0.25}s`} />
      ))}
      {tag && (
        <LuggageTag
          city={tag.city}
          code={tag.code}
          date={tag.date}
          hotelData={
            hotelData && typeof hotelData === "object" && "options" in hotelData
              ? hotelData
              : undefined
          }
          style={{
            ...(tag.top ? { top: tag.top } : {}),
            ...(tag.bottom ? { bottom: tag.bottom } : {}),
            ...(tag.left ? { left: tag.left } : {}),
            ...(tag.right ? { right: tag.right } : {}),
            "--tag-rot": tag.rot || "0deg",
            "--tag-delay": tag.delay || "0.2s",
          } as React.CSSProperties}
        />
      )}
      {travels && travels.length > 0 && (
        <TransportStrip travels={travels} />
      )}
      <div className="day-content">
        <p className="day-label rv">
          {dayIconSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="day-icon" src={dayIconSrc} alt="" />
          )}
          Day {num} &mdash; {day.dateLabel}
        </p>
        <div className="red-line rv-l d1" />
        <h2 className="day-title rv d2">{day.title}</h2>
        <p className="day-tagline rv d3">{day.tagline}</p>
        <div className="highlights">
          {day.highlights.map((h, j) => (
            <div key={j} className={`hl rv d${Math.min(j + 4, 9)}`}>
              <span className="hl-dot" />
              <span>{h}</span>
            </div>
          ))}
        </div>
        {children}
        <div className="day-footer rv d8">
          <div className="df-item">
            <span className="df-label">Transport</span>
            <span className="df-val">{day.transport.mode}</span>
          </div>
          <div className="df-item">
            <span className="df-label">Stay</span>
            <span className="df-val">{day.stay || "N/A"}</span>
          </div>
          {day.keyCost != null && (
            <div className="df-item">
              <span className="df-label">Key cost</span>
              <span className="df-val">
                {day.keyCost.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {restaurantInfo && (
            <Link
              href={`${prefix}/restaurants#rx-${restaurantInfo.locationId}`}
              className="day-dining rv d9"
            >
              {restaurantInfo.count} dining spots for this area
            </Link>
          )}
          <Link
            href={`${prefix}/map?day=${day.day}`}
            className="day-dining day-map-link rv d9"
          >
            Show on map
          </Link>
        </div>
        {day.tip && <p className="day-tip rv d9">{day.tip}</p>}
      </div>
    </section>
  );
}
