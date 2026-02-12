"use client";

import { useState } from "react";
import { useTripData, useTripSlug } from "@/context/TripContext";
import { DayCard } from "./DayCard";
import { PracticalTab } from "./PracticalTab";
import { BudgetTab } from "./BudgetTab";
import Link from "next/link";

// Generate consistent colors from region names (fallback when regionStyles not in data)
function hashColor(str: string): { bg: string; border: string; badge: string; accent: string } {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  const hue = ((hash % 360) + 360) % 360;
  return {
    bg: `hsl(${hue}, 40%, 97%)`,
    border: `hsl(${hue}, 40%, 80%)`,
    badge: `hsl(${hue}, 50%, 45%)`,
    accent: `hsl(${hue}, 50%, 35%)`,
  };
}

// Convert enriched RegionStyle (with hex) to inline-style-compatible values
function regionStyleFromHex(hex: string): { bg: string; border: string; badge: string; accent: string } {
  return {
    bg: `${hex}11`,
    border: `${hex}44`,
    badge: hex,
    accent: hex,
  };
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
        active
          ? "bg-slate-800 text-white shadow-md"
          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function ItineraryPage() {
  const data = useTripData();
  const slug = useTripSlug();
  const [tab, setTab] = useState<"itinerary" | "practical" | "budget">("itinerary");
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  // Build region style map: use enriched data if available, fall back to hash
  const regionStyles: Record<string, ReturnType<typeof hashColor>> = {};
  if (data.regionStyles) {
    for (const [region, style] of Object.entries(data.regionStyles)) {
      regionStyles[region] = regionStyleFromHex(style.hex);
    }
  } else {
    for (const day of data.days) {
      if (!regionStyles[day.region]) {
        regionStyles[day.region] = hashColor(day.region);
      }
    }
  }

  const toggleDay = (dayNum: number) => {
    if (expandAll) {
      setExpandAll(false);
      setOpenDay(dayNum);
    } else {
      setOpenDay(openDay === dayNum ? null : dayNum);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{data.trip.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {data.trip.dates} &middot; {data.trip.durationDays} Days &middot; {data.trip.travelers} Travelers
          </p>
          <p className="text-xs text-slate-400 mt-1">{data.trip.route.join(" \u2192 ")}</p>
        </div>

        {/* Quick Stats */}
        <div className={`grid gap-2 mb-6 ${data.stats.length >= 4 ? "grid-cols-4" : "grid-cols-3"}`}>
          {data.stats.slice(0, data.stats.length >= 4 ? 4 : 3).map((s, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-2 text-center">
              <p className="text-lg font-bold text-slate-800">{s.value}{s.suffix || ""}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Route */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 overflow-x-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Route</p>
          {data.routeStops ? (
            <div className="flex items-center gap-1 min-w-max">
              {data.routeStops.map((stop, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm" title={stop.type}>{stop.icon}</span>
                    <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{stop.name}</span>
                    {stop.sub && <span className="text-[10px] text-slate-400">{stop.sub}</span>}
                  </div>
                  {i < data.routeStops!.length - 1 && (
                    <div className="w-6 h-px bg-slate-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 min-w-max">
              {data.trip.route.map((stop, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{stop}</span>
                  </div>
                  {i < data.trip.route.length - 1 && (
                    <div className="w-6 h-px bg-slate-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <TabButton active={tab === "itinerary"} onClick={() => setTab("itinerary")}>Itinerary</TabButton>
          <TabButton active={tab === "practical"} onClick={() => setTab("practical")}>Practical Info</TabButton>
          <TabButton active={tab === "budget"} onClick={() => setTab("budget")}>Budget</TabButton>
        </div>

        {/* Content */}
        {tab === "itinerary" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs text-slate-500">Click a day to expand details</p>
              <button
                onClick={() => { setExpandAll(!expandAll); setOpenDay(null); }}
                className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
              >
                {expandAll ? "Collapse All" : "Expand All"}
              </button>
            </div>
            {data.days.map((day) => (
              <DayCard
                key={day.day}
                day={day}
                regionStyle={regionStyles[day.region] || hashColor("default")}
                isOpen={expandAll || openDay === day.day}
                onToggle={() => toggleDay(day.day)}
              />
            ))}
          </div>
        )}

        {tab === "practical" && <PracticalTab dietary={data.dietary} bookings={data.bookings} transport={data.transport} packing={data.packing} />}
        {tab === "budget" && <BudgetTab budget={data.budget} />}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
          <p>Have a great trip!</p>
          <Link href={`/trip/${slug}`} className="inline-block mt-3 text-slate-500 hover:text-slate-700 underline">
            View Presentation
          </Link>
        </div>
      </div>
    </div>
  );
}
