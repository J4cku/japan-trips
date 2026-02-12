---
name: trip-generate
description: Generate a new trip.json skeleton for TripMag from a destination and travel preferences. Creates the full data structure needed by the trip renderer.
allowed-tools: Bash, Read, Write, Grep, Glob, WebSearch, WebFetch
argument-hint: "[destination, duration, traveler-description]"
---

# Trip Generator

Generate a complete `trip.json` file for a new TripMag trip.

## Input

$ARGUMENTS should describe the trip. Examples:
- `Italy, 10 days, couple, foodie, $8k budget`
- `Iceland, 7 days, solo adventure, ring road`
- `Thailand, 14 days, family with kids, beach + culture`

## Process

### 1. Research the destination
Use WebSearch to gather current information about:
- Best routes and city combinations for the duration
- Must-see attractions and activities per city
- Highly-rated restaurants (check dietary if mentioned)
- Hotel options at different price points
- Transport between cities (trains, flights, buses)
- Current prices (accommodation, transport, food, activities)
- Weather for the travel period if dates specified

### 2. Read the schema
Read `src/types/trip.ts` for the full `TripData` interface. Every field matters.
Read an existing trip for reference: `public/trips/japan-2026/trip.json`

### 3. Generate the trip.json

Create `public/trips/{slug}/trip.json` with ALL required sections:

**Required sections** (renderer will break without these):
```
trip        — title, dates, travelers, durationDays, origin, flights, dietary, route
stays       — array of {location, nights, dates, area, budget}
days        — array of Day objects (1 per day, with activities, highlights, transport)
pins        — {source, exportDate, stats, categories, regions, statusDescriptions, items[]}
budget      — {currency, perPerson, totalPerPerson, totalGroup, note}
packing     — string[] of items
stats       — [{value, label}] for the closing slide (e.g. "6 cities", "14 days")
hotels      — keyed by city slug, each with options[]
travels     — array of Travel objects between cities
restaurants — {note, byLocation: {regionKey: {label, forDays, spots[]}}}
```

**Optional sections** (renderer handles absence gracefully):
```
dietary     — guide for food restrictions
transport   — JR pass analysis, transit cards
bookings    — priority-sorted booking checklist
extended    — split-group or extension trip
stickers    — hero/closing/day sticker placements (skip for now)
luggageTags — hero/closing tag placements (skip for now)
weather     — per-day forecast (skip for now)
currency    — exchange rates config
capabilities — feature flags
theme       — accent colors, map tile config
mapConfig   — center, zoom, bounds
```

### 4. Generate pins

For each point of interest mentioned in activities, hotels, and restaurants:
- Look up real lat/lng coordinates (use WebSearch if needed)
- Assign a category: food, hotel, activity, transport, shopping, temple, nature, nightlife
- Assign a status: "matched" (in itinerary), "nearRoute" (close to route), "offRoute"
- Link to the relevant day number

### 5. Configure map

Set `mapConfig` with appropriate center and zoom for the destination:
```json
"mapConfig": {
  "defaultCenter": [lat, lng],
  "defaultZoom": 7,
  "minZoom": 5,
  "maxZoom": 18,
  "fitBoundsFromPins": true,
  "fitBoundsPadding": [50, 50]
}
```

### 6. Set capabilities

```json
"capabilities": {
  "hasHotelSelection": true,
  "hasDietaryFilters": true,
  "hasPackingChecklist": true,
  "hasCurrencyConverter": true,
  "hasWeatherOverlay": false,
  "hasStickers": false,
  "hasLuggageTags": false,
  "hasCountdown": true
}
```

### 7. Validate

After generating, run `/trip-validate {slug}` to check the output.

## Output

The file at `public/trips/{slug}/trip.json` ready to render at `/trip/{slug}`.

## Quality guidelines

- **Real data**: Use actual restaurant names, hotel names, real coordinates. Don't invent places.
- **Practical tips**: Include genuine travel advice in `tip` fields
- **Balanced days**: Don't overschedule. 3-5 activities per day max.
- **Transport realism**: Use real transit options (Shinkansen names, bus routes, etc.)
- **Price accuracy**: Research current prices. Use the destination's local currency.
- **Dietary awareness**: If dietary restrictions mentioned, flag restaurants and add notes.
