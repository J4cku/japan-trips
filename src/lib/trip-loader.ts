import { promises as fs } from "fs";
import path from "path";
import type { TripData, Trip, Day, Stat, DietaryGuide, TransportInfo, Booking, Budget, Hotels, Restaurants, RestaurantLocation, Travel, PinsData } from "@/types/trip";
import { TripDataSchema } from "./schema";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalize any valid trip JSON into the canonical TripData shape.
 * This handles varying schemas (e.g., Japan vs Iceland) by providing
 * sensible defaults and transforming alternate field names.
 */
function normalize(raw: any): TripData {
  const r = raw as Record<string, any>;

  const trip = normalizeTrip(r.trip);
  const days = normalizeDays(r.days);
  const stats = normalizeStats(r.stats);
  const packing = normalizePacking(r.packing);
  const dietary = normalizeDietary(r.dietary);
  const transport = normalizeTransport(r.transport);
  const bookings = normalizeBookings(r.bookings);
  const budget = normalizeBudget(r.budget);
  const hotels = normalizeHotels(r.hotels);
  const restaurants = normalizeRestaurants(r.restaurants);
  const travels = normalizeTravels(r.travels);
  const pins = r.pins as PinsData;
  const stays = r.stays || [];
  const extended = r.extended || undefined;

  return {
    trip,
    stays,
    days,
    dietary,
    transport,
    bookings,
    budget,
    packing,
    stats,
    hotels,
    travels,
    restaurants,
    pins,
    extended: extended || undefined,
    routes: r.routes ?? undefined,
    mapConfig: r.mapConfig ?? undefined,
    regionStyles: r.regionStyles ?? undefined,
    routeStops: r.routeStops ?? undefined,
    capabilities: r.capabilities ?? undefined,
    theme: r.theme ?? undefined,
    stickers: r.stickers ?? undefined,
    luggageTags: normalizeLuggageTags(r.luggageTags),
    weather: r.weather ?? undefined,
    currency: r.currency ?? undefined,
    polaroids: r.polaroids ?? undefined,
  } as TripData;
}

function normalizeTrip(t: any): Trip {
  const title = t.title || t.name || "Untitled Trip";
  const dates = t.dates || `${t.startDate || ""} – ${t.endDate || ""}`.trim();
  return {
    ...t,
    title,
    titleJp: t.titleJp || "",
    dates,
    travelers: t.travelers || 1,
    durationDays: t.durationDays || 1,
    durationNights: t.durationNights ?? (t.durationDays ? t.durationDays - 1 : 0),
    origin: t.origin || "",
    flights: t.flights || {
      outbound: { from: "", to: "", date: "", arrives: "", note: "" },
      return: { from: "", to: "", date: "", departs: "" },
    },
    dietary: t.dietary || [],
    route: t.route || [],
  };
}

function normalizeDays(days: any[]): Day[] {
  if (!days) return [];
  return days.map((d: any) => ({
    day: d.day,
    date: d.date || "",
    dateLabel: d.dateLabel || d.date || "",
    title: d.title || "",
    region: d.region || "default",
    tagline: d.tagline || "",
    stay: typeof d.stay === "string" ? d.stay : d.stay?.city ? `${d.stay.city}${d.stay.area ? ` (${d.stay.area})` : ""}` : d.stay || null,
    highlights: normalizeHighlights(d.highlights, d.activities),
    activities: normalizeActivities(d.activities),
    transport: d.transport || { mode: "car", duration: "" },
    food: d.food || "",
    tip: d.tip || "",
    keyCost: d.keyCost,
    isCyclingDay: d.isCyclingDay,
    optional: d.optional,
  }));
}

function normalizeHighlights(highlights: any, activities: any[]): string[] {
  if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
    // Fall back to activity names
    if (!activities || activities.length === 0) return [];
    return activities.slice(0, 4).map((a: any) => a.title || a.name || "").filter(Boolean);
  }
  return highlights.map((h: any) => {
    if (typeof h === "string") {
      // Detect stringified Python dicts: "{'name': 'Foo', ...}"
      if (h.startsWith("{") && h.includes("'name'")) {
        const m = h.match(/'name':\s*'([^']+)'/);
        return m ? m[1] : h;
      }
      return h;
    }
    // Object with name field
    if (h && typeof h === "object") return h.name || h.title || "";
    return String(h);
  }).filter(Boolean);
}

function normalizeActivities(activities: any[]): any[] {
  if (!activities) return [];
  return activities.map((a: any) => ({
    time: a.time || "",
    name: a.name || a.title || "",
    location: a.location,
    duration: a.duration,
    cost: a.cost,
    bookAhead: a.bookAhead,
    note: a.note || a.details,
    type: a.type || "activity",
  }));
}

function normalizeStats(stats: any[]): Stat[] {
  if (!stats) return [];
  return stats.map((s: any) => {
    const val = s.value;
    if (typeof val === "number") {
      return { value: val, label: s.label, suffix: s.suffix };
    }
    // Parse string values like "7", "2,000 km", "4+"
    const numMatch = String(val).match(/^[\d,]+/);
    const numPart = numMatch ? parseInt(numMatch[0].replace(/,/g, ""), 10) : 0;
    const rest = String(val).replace(/^[\d,]+\s*/, "").trim();
    return {
      value: numPart || 0,
      label: s.label,
      suffix: rest || s.suffix || undefined,
    };
  });
}

function normalizePacking(packing: any): string[] {
  if (!packing) return [];
  if (Array.isArray(packing) && packing.length > 0) {
    if (typeof packing[0] === "string") return packing;
    // Structured packing: [{category, items}]
    return packing.flatMap((group: any) => {
      if (group.items && Array.isArray(group.items)) {
        return group.items as string[];
      }
      return [];
    });
  }
  return [];
}

function normalizeDietary(d: any): DietaryGuide {
  if (!d) return { restrictions: [], japanesePhrases: [], safeFoods: [], watchOut: [], apps: [], recommendedRestaurants: [] };
  // Already canonical shape
  if (d.restrictions && d.japanesePhrases) return d;
  // Generic shape
  return {
    restrictions: d.restrictions || d.requirements || [],
    japanesePhrases: d.japanesePhrases || [],
    safeFoods: d.safeFoods || [],
    watchOut: d.watchOut || [],
    apps: d.apps || [],
    recommendedRestaurants: d.recommendedRestaurants || [],
    // Preserve extra fields
    ...d,
  };
}

function normalizeTransport(t: any): TransportInfo {
  if (!t) return { jrPassAnalysis: { sevenDay: 0, fourteenDay: 0, estimatedIndividualTotal: "", recommendation: "", note: "" }, suicaCard: "", takkyubin: { what: "", cost: "", how: "", delivery: "", usedOnDay: 0 } };
  if (t.jrPassAnalysis) return t;
  // Generic transport — store raw data and provide empty canonical fields
  return {
    jrPassAnalysis: { sevenDay: 0, fourteenDay: 0, estimatedIndividualTotal: "", recommendation: "", note: "" },
    suicaCard: "",
    takkyubin: { what: "", cost: "", how: "", delivery: "", usedOnDay: 0 },
    ...t,
  };
}

function normalizeBookings(bookings: any[]): Booking[] {
  if (!bookings) return [];
  const priorityMap: Record<string, "critical" | "high" | "medium" | "low"> = {
    essential: "critical",
    recommended: "high",
    optional: "low",
    critical: "critical",
    high: "high",
    medium: "medium",
    low: "low",
  };
  return bookings.map((b: any) => ({
    item: b.item || "",
    when: b.when || "",
    priority: priorityMap[b.priority] || "medium",
    url: b.url,
    note: b.note,
  }));
}

function normalizeBudget(b: any): Budget {
  if (!b) return { currency: "USD", perPerson: {}, totalPerPerson: "", totalPerPersonUSD: "", totalGroup: "", totalGroupUSD: "", note: "" };
  if (b.perPerson && typeof b.perPerson === "object" && !Array.isArray(b.perPerson) && typeof b.perPerson !== "boolean") return b;
  // Generic budget with breakdown
  const perPerson: Record<string, { amount: number | string; note: string }> = {};
  if (b.breakdown) {
    for (const [key, val] of Object.entries(b.breakdown)) {
      const v = val as any;
      perPerson[key] = { amount: v.amount || 0, note: v.note || "" };
    }
  }
  return {
    currency: b.currency || "USD",
    perPerson,
    totalPerPerson: b.total || "",
    totalPerPersonUSD: "",
    totalGroup: b.total || "",
    totalGroupUSD: "",
    note: (b.tips || []).join(". ") || b.note || "",
  };
}

function normalizeHotels(h: any): Hotels {
  if (!h) return { budget: "", note: "", userPreferences: { lovedHotel: "", style: "", interestedIn: "" } } as any;
  if (!h.userPreferences) {
    h.userPreferences = { lovedHotel: "", style: "", interestedIn: "" };
  }
  // Ensure all hotel options have required fields with defaults
  for (const [key, val] of Object.entries(h)) {
    if (val && typeof val === "object" && "options" in (val as any)) {
      const city = val as any;
      city.options = (city.options || []).map((opt: any) => ({
        nameJp: "",
        priceJPY: "",
        ...opt,
        priceEUR: opt.priceEUR || opt.price || "",
        travellerPick: opt.travellerPick ?? false,
      }));
    }
  }
  return h;
}

function normalizeRestaurants(r: any): Restaurants {
  if (!r) return { note: "", allergyCardJp: "", allergyCardEn: "", safeFoods: [], dangerFoods: [], apps: [], byLocation: {} };
  // Already canonical
  if (r.byLocation) return r;
  // Generic: object with region keys mapping to arrays of restaurants
  const byLocation: Record<string, RestaurantLocation> = {};
  const allRegionKeys = Object.keys(r).filter(k => Array.isArray(r[k]));
  for (const regionKey of allRegionKeys) {
    const spots = (r[regionKey] as any[]).map((s: any) => ({
      name: s.name || "",
      nameJp: s.nameJp || s.nameLocal || "",
      cuisine: s.cuisine || "",
      neighborhood: s.neighborhood || "",
      price: s.price || "",
      gf: s.dietary?.glutenFree ?? false,
      vegan: s.dietary?.vegan ?? false,
      vegetarian: s.dietary?.vegetarian ?? false,
      mustTry: s.mustTry || s.note || "",
      note: s.note || "",
      url: s.url || "",
    }));
    const label = regionKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    byLocation[regionKey] = {
      label,
      forDays: [],
      spots,
    };
  }
  return {
    note: r.note || "",
    allergyCardJp: r.allergyCardJp || "",
    allergyCardEn: r.allergyCardEn || "",
    safeFoods: r.safeFoods || [],
    dangerFoods: r.dangerFoods || [],
    apps: r.apps || [],
    byLocation,
  };
}

function normalizeTravels(travels: any[]): Travel[] {
  if (!travels) return [];
  return travels.map((t: any, i: number) => {
    const fromObj = typeof t.from === "string" ? { name: t.from } : t.from;
    const toObj = typeof t.to === "string" ? { name: t.to } : t.to;
    const modeMap: Record<string, string> = {
      "rental car": "bus",
      car: "bus",
      flight: "plane",
      train: "train",
      shinkansen: "shinkansen",
      bus: "bus",
      bike: "bike",
    };
    return {
      ...t,
      id: t.id || `travel-${i}`,
      day: t.day || 0,
      from: fromObj,
      to: toObj,
      mode: modeMap[t.mode || t.method || ""] || "bus",
      icon: t.icon || "",
      duration: t.duration || "",
      distance: t.distance || "",
      cost: t.cost ?? null,
      details: t.details || "",
      animation: t.animation || "",
    };
  });
}

function normalizeLuggageTags(lt: any): any {
  if (!lt) return undefined;
  const result = { ...lt };
  // Normalize day keys: "day1" → "01", "day2" → "02", etc.
  if (result.days && typeof result.days === "object") {
    const normalized: Record<string, any> = {};
    for (const [key, val] of Object.entries(result.days)) {
      const m = key.match(/^day(\d+)$/);
      if (m) {
        normalized[m[1].padStart(2, "0")] = val;
      } else {
        normalized[key] = val;
      }
    }
    result.days = normalized;
  }
  // Normalize hotelKeys the same way
  if (result.hotelKeys && typeof result.hotelKeys === "object") {
    const normalized: Record<string, any> = {};
    for (const [key, val] of Object.entries(result.hotelKeys)) {
      const m = key.match(/^day(\d+)$/);
      if (m) {
        normalized[m[1].padStart(2, "0")] = val;
      } else {
        normalized[key] = val;
      }
    }
    result.hotelKeys = normalized;
  }
  return result;
}

export async function loadTripData(slug: string): Promise<TripData> {
  const filePath = path.join(process.cwd(), "public", "trips", slug, "trip.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(raw);
  // Validate minimal structure
  TripDataSchema.parse(json);
  // Normalize into canonical TripData shape
  return normalize(json);
}
