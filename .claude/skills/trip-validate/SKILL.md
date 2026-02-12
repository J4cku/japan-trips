---
name: trip-validate
description: Validate a trip.json file against TripMag's schema and normalization expectations. Catches data issues before rendering.
allowed-tools: Bash, Read, Grep, Glob
argument-hint: "[slug-or-path]"
---

# Trip Validator

Validate a trip JSON file for compatibility with TripMag's renderer.

## Input

`$ARGUMENTS` is either:
- A slug name like `japan-2026` (resolves to `public/trips/japan-2026/trip.json`)
- A file path to a trip.json

If no argument provided, validate ALL trips in `public/trips/*/trip.json`.

## Validation Steps

### 1. Schema (Required Fields)
Read `src/types/trip.ts` and `src/lib/schema.ts` for the canonical types.

Check these required top-level keys exist:
- `trip` — object with `title`, `dates`, `travelers`, `durationDays`
- `days` — array, length > 0
- `pins` — object with `items` array
- `stays` — array
- `budget` — object with `currency`

### 2. Days Structure
For each day in `days[]`:
- Must have: `day` (number), `date`, `title`
- Should have: `region`, `highlights[]` or `activities[]`
- Each activity should have: `name` (or `title`), `time`
- Transport (if present): `mode` must be one of: plane, train, shinkansen, bus, bike, ferry, walk, car

### 3. Hotels Structure
If `hotels` exists:
- Each city key should have: `location`, `options[]`
- Each option needs: `name`, `priceEUR` or `priceJPY`, `style`, `highlights[]`
- Check `travellerPick` boolean — at least one option per city should be the pick

### 4. Restaurants Structure
If `restaurants` exists:
- Should have `byLocation` object (or region keys that normalizer converts)
- Each location should have: `label`, `spots[]`
- Each spot needs: `name`, `cuisine`, and dietary info (`dietaryNotes` or `veganOptions`)

### 5. Pins Structure
For each pin in `pins.items[]`:
- Must have: `name`, `lat`, `lng`, `category`, `region`
- `lat` must be valid (-90 to 90), `lng` must be valid (-180 to 180)
- `category` should be one of: food, hotel, activity, transport, shopping, temple, nature, nightlife, other

### 6. Stickers (Optional)
If `stickers` array exists in trip.json:
- Each sticker's `src` file should exist in `public/trips/{slug}/stickers/`
- Required fields: `src`, `size`, at least one position (top/bottom + left/right)

### 7. Normalizer Compatibility
Read `src/lib/trip-loader.ts` to check if the normalizer handles the trip's format:
- Does it use `title` or `name` for activities? (normalizer maps both)
- Does it use `mode: "rental car"` or `mode: "car"`? (normalizer maps variations)
- Are there custom fields the normalizer doesn't know about?

## Output Format

```
TRIP VALIDATION — {slug}
File: {path} ({size})

SCHEMA          [PASS] All required fields present
DAYS            [PASS] 14 days, all have title + date
HOTELS          [WARN] Kumamoto has no travellerPick
RESTAURANTS     [PASS] 6 locations, 34 spots
PINS            [FAIL] 3 pins have invalid lat/lng
STICKERS        [PASS] 14 sticker files found
NORMALIZER      [WARN] Uses "rental car" mode — normalizer maps to "bus"

SUMMARY: 1 error, 2 warnings
[details for each non-PASS item]
```
