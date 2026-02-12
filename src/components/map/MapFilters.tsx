"use client";
import type { PinCategory, PinStatus } from "@/types/trip";

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

interface MapFiltersProps {
  statusFilters: Record<PinStatus, boolean>;
  onToggleStatus: (s: PinStatus) => void;
  categoryFilters: Set<PinCategory>;
  allCategories: PinCategory[];
  onToggleCategory: (c: PinCategory) => void;
  selectedDay: number | null;
  onSelectDay: (d: number | null) => void;
  totalDays: number;
  extendedTotalDays?: number;
  stats: { total: number; matched: number; nearRoute: number; offRoute: number };
  showHotels: boolean;
  onToggleHotels: () => void;
  showExtended: boolean;
  onToggleExtended: () => void;
}

export function MapFilters({
  statusFilters,
  onToggleStatus,
  categoryFilters,
  allCategories,
  onToggleCategory,
  selectedDay,
  onSelectDay,
  totalDays,
  extendedTotalDays = totalDays,
  stats,
  showHotels,
  onToggleHotels,
  showExtended,
  onToggleExtended,
}: MapFiltersProps) {
  const dayCount = showExtended ? extendedTotalDays : totalDays;

  return (
    <div className="map-filters">
      <div className="mf-stats">
        {stats.total} saved pins &middot;{" "}
        <span style={{ color: "#4a9" }}>{stats.matched} in plan</span> &middot;{" "}
        <span style={{ color: "#c4956a" }}>{stats.nearRoute} nearby</span> &middot;{" "}
        <span style={{ color: "#888" }}>{stats.offRoute} off-route</span>
      </div>

      <div className="mf-section">
        <div className="mf-row" style={{ gap: 6 }}>
          <button
            className={`mf-btn ${showHotels ? "mf-btn-active-near" : ""}`}
            onClick={onToggleHotels}
            style={{ fontSize: 12 }}
          >
            Hotels {showHotels ? "ON" : "OFF"}
          </button>
          <button
            className={`mf-btn ${showExtended ? "mf-btn-active-near" : ""}`}
            onClick={onToggleExtended}
            style={showExtended ? { fontSize: 12, borderColor: "#c4956a", color: "#c4956a" } : { fontSize: 12 }}
          >
            Extended Trip {showExtended ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="mf-section">
        <div className="mf-label">Status</div>
        <div className="mf-row">
          <button
            className={`mf-btn ${statusFilters.matched ? "mf-btn-active-matched" : ""}`}
            onClick={() => onToggleStatus("matched")}
          >
            Matched
          </button>
          <button
            className={`mf-btn ${statusFilters.nearRoute ? "mf-btn-active-near" : ""}`}
            onClick={() => onToggleStatus("nearRoute")}
          >
            Near Route
          </button>
          <button
            className={`mf-btn ${statusFilters.offRoute ? "mf-btn-active-off" : ""}`}
            onClick={() => onToggleStatus("offRoute")}
          >
            Off Route
          </button>
        </div>
      </div>

      <div className="mf-section">
        <div className="mf-label">Category</div>
        <div className="mf-chips">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`mf-chip ${categoryFilters.has(cat) ? "mf-chip-active" : ""}`}
              onClick={() => onToggleCategory(cat)}
            >
              <span className="mf-chip-icon">{CATEGORY_ICONS[cat] || "\u{1F4CC}"}</span> {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mf-section">
        <div className="mf-label">Day</div>
        <div className="mf-days">
          <button
            className={`mf-day ${selectedDay === null ? "mf-day-active" : ""}`}
            onClick={() => onSelectDay(null)}
          >
            All
          </button>
          {Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              className={`mf-day ${selectedDay === d ? "mf-day-active" : ""}`}
              onClick={() => onSelectDay(d)}
              style={d > totalDays ? { borderColor: "#c4956a33", color: "#c4956a" } : undefined}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
