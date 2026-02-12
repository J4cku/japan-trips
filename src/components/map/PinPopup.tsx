"use client";
import type { Pin } from "@/types/trip";

const CATEGORY_ICONS: Record<string, string> = {
  temple: "\u{26E9}\uFE0F",
  shrine: "\u{26E9}\uFE0F",
  museum: "\u{1F3DB}\uFE0F",
  food: "\u{1F374}",
  shopping: "\u{1F6CD}\uFE0F",
  nature: "\u{1F33F}",
  park: "\u{1F333}",
  onsen: "\u{2668}\uFE0F",
  attraction: "\u{2B50}",
  hotel: "\u{1F3E8}",
  viewpoint: "\u{1F441}\uFE0F",
  neighborhood: "\u{1F4CD}",
  street: "\u{1F6B6}",
  bridge: "\u{1F309}",
  ryokan: "\u{2668}\uFE0F",
};

export function PinPopup({ pin }: { pin: Pin }) {
  const icon = CATEGORY_ICONS[pin.category] || "\u{1F4CD}";

  return (
    <div style={{ minWidth: 200, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{pin.name}</span>
      </div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{pin.category} &middot; {pin.region}</span>
        {pin.source === "itinerary" && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#BC002D", background: "rgba(188,0,45,0.12)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.04em" }}>
            ITINERARY
          </span>
        )}
      </div>

      {pin.status === "matched" && (
        <div style={{ fontSize: 12, color: "#4a9", fontWeight: 600, marginBottom: 6 }}>
          {"\u{2705}"} {pin.dayLabel}
        </div>
      )}
      {pin.status === "nearRoute" && (
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#c4956a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
            {"\u{1F7E1}"} Could visit on:
          </div>
          {pin.possibleDayLabels.map((label, i) => (
            <div key={i} style={{ fontSize: 12, color: "#aaa", paddingLeft: 12 }}>
              {label}
            </div>
          ))}
        </div>
      )}
      {pin.status === "offRoute" && (
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: "#888" }}>
            {"\u{274C}"} Not on this trip&apos;s route
          </div>
          <div style={{ fontSize: 11, color: "#666", paddingLeft: 12 }}>
            Region: {pin.region}
          </div>
        </div>
      )}

      {pin.extendedStatus && pin.extendedDayLabel && (
        <div style={{ fontSize: 11, fontWeight: 600, color: "#c4956a", background: "rgba(196,149,106,0.12)", padding: "2px 6px", borderRadius: 3, marginBottom: 6, display: "inline-block" }}>
          Extended {pin.extendedDayLabel}
        </div>
      )}

      {pin.note && (
        <div style={{ fontSize: 12, fontWeight: 300, fontStyle: "italic", color: "#999", marginBottom: 6, borderLeft: "2px solid #333", paddingLeft: 8 }}>
          &ldquo;{pin.note}&rdquo;
        </div>
      )}

      {pin.googleMapsUrl && (
        <a
          href={pin.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#BC002D", textDecoration: "none", fontWeight: 600 }}
        >
          Open in Google Maps {"\u{2197}"}
        </a>
      )}
    </div>
  );
}

export function HotelPinPopup({ pin }: { pin: Pin }) {
  const icon = pin.category === "ryokan" ? "\u{2668}\uFE0F" : "\u{1F3E8}";

  return (
    <div style={{ minWidth: 200, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{pin.name}</span>
      </div>
      {pin.nameJp && (
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>{pin.nameJp}</div>
      )}
      <div style={{ fontSize: 12, color: "#888", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{pin.category} &middot; {pin.region}</span>
        {pin.chosen && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#c4956a", background: "rgba(196,149,106,0.15)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.04em" }}>
            CHOSEN
          </span>
        )}
      </div>

      {pin.hotelLocation && (
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>
          {pin.hotelLocation}
        </div>
      )}

      {pin.status === "matched" && pin.dayLabel && (
        <div style={{ fontSize: 12, color: "#4a9", fontWeight: 600, marginBottom: 6 }}>
          {"\u{2705}"} {pin.dayLabel}
        </div>
      )}

      {pin.extendedStatus && pin.extendedDayLabel && (
        <div style={{ fontSize: 11, fontWeight: 600, color: "#c4956a", background: "rgba(196,149,106,0.12)", padding: "2px 6px", borderRadius: 3, marginBottom: 6, display: "inline-block" }}>
          Extended {pin.extendedDayLabel}
        </div>
      )}

      {pin.note && (
        <div style={{ fontSize: 12, fontWeight: 300, fontStyle: "italic", color: "#999", marginBottom: 6, borderLeft: "2px solid #333", paddingLeft: 8 }}>
          &ldquo;{pin.note}&rdquo;
        </div>
      )}

      {pin.googleMapsUrl && (
        <a
          href={pin.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#BC002D", textDecoration: "none", fontWeight: 600 }}
        >
          Open in Google Maps {"\u{2197}"}
        </a>
      )}
    </div>
  );
}
