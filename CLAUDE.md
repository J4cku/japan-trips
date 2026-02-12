# TripMag

AI-powered interactive trip magazine platform. Users get a personalized, scroll-snap travel magazine with maps, hotels, restaurants, packing lists, and more.

## Architecture

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS custom properties in `globals.css` (no Tailwind utility classes in components)
- **Fonts**: `next/font/google` — Inter (body), Playfair Display (`--font-display`), Space Mono (`--font-mono`)
- **Maps**: Leaflet + react-leaflet (CartoDB dark tiles)
- **Validation**: Zod (minimal schema) + custom normalizer
- **State**: React Context (`TripDataProvider`) — no Redux/Zustand

## Key Directories

```
src/app/                    # App Router pages
  page.tsx                  # Landing page (imports landing components)
  trip/[slug]/              # Dynamic trip routes
    layout.tsx              # Loads trip.json, wraps in TripDataProvider
    page.tsx                # Main scroll-snap presentation
    itinerary/hotels/map/restaurants/packing/extended/

src/components/
  landing/                  # Landing page sections (Hero, Features, etc.)
  presentation/             # Trip slides (HeroSlide, DaySlide, Sticker, etc.)
  map/                      # Leaflet map components
  hotels/restaurants/       # Trip content views
  fun/                      # Weather, currency, packing checklist
  itinerary/                # Tabbed itinerary view

src/lib/
  trip-loader.ts            # Reads + normalizes trip.json from /public/trips/{slug}/
  schema.ts                 # Zod validation (minimal — normalizer does the heavy lifting)

src/types/trip.ts           # Full TripData interface
src/context/TripContext.tsx  # React Context provider

public/trips/{slug}/        # Trip data (trip.json + stickers/)
branding/                   # Design system docs (brand-guide.html is the visual reference)
```

## Trip Data Flow

1. User visits `/trip/japan-2026`
2. `[slug]/layout.tsx` calls `loadTripData("japan-2026")`
3. Reads `/public/trips/japan-2026/trip.json`
4. Validates with Zod (minimal check: title, days, pins exist)
5. **Normalizes** raw JSON into canonical `TripData` shape (handles varying formats)
6. Wraps children in `<TripDataProvider>`
7. Components use `useTripData()` hook

## CSS Conventions

- **Landing page**: All classes prefixed with `lp-` (e.g., `.lp-hero`, `.lp-btn-primary`)
- **Trip presentation**: No prefix (`.slide`, `.day-title`, `.sticker`, `.hotel-modal`)
- **CSS variables**: Landing uses `--lp-*` tokens, trip uses `--red`, `--black`, `--g1`-`--g5`
- **Font variables**: Use `var(--font-display, 'Playfair Display')` with CSS fallback — NOT intermediary variables on `:root` (Next.js sets `--font-display` on `<body>`, not `:root`)
- **Dark/light mode**: `[data-theme="light"]` selector overrides CSS variables
- **Responsive**: Landing has breakpoints at 1024px and 640px; trip at 768px

## Branding (Cinematic Nomad)

Reference: `branding/brand-guide.html` (visual) and `branding/04-DESIGN-TOKENS.md` (tokens)

| Element | Font | Color |
|---------|------|-------|
| Headlines | Playfair Display 700 | `#0A0E27` (dark) / `#F8F9FA` (light) |
| Body | Inter 400 | `#6B7280` (muted) |
| Labels/tech | Space Mono 700 | `#00D9FF` (cyan) |
| Primary CTA | Inter 600 | `#BC002D` (red) bg, white text |
| Secondary CTA | Inter 600 | `#BC002D` border, transparent bg |
| Logo "MAG" | Playfair Display 700 | `#BC002D` (red accent) |

## Common Gotchas

1. **Leaflet SSR**: Leaflet uses `window` — must dynamically `import("leaflet")` inside `useEffect`, never at module level
2. **Font variable scope**: `--font-display` and `--font-mono` are set by Next.js on `<body>` class, NOT on `:root`. Any CSS that references them must be scoped to body descendants or use `var(--font-display, 'Playfair Display')` fallback syntax
3. **Snap scroll z-index**: Leaflet creates its own stacking context with high z-index. Overlays on top of maps need explicit `z-index` (map: 0, overlay: 1, stats: 2)
4. **Trip normalizer**: Don't expect trip.json to perfectly match `TripData` — the normalizer in `trip-loader.ts` handles variations. When adding new trips, check normalizer handles your format
5. **Stale build cache**: When CSS changes don't appear, kill ALL `next start` processes and delete `.next/` before rebuilding. `kill %1` may not catch orphaned processes — use `lsof -i :PORT`

## Commands

```bash
npm run dev           # Dev server on port 8080
npm run build         # Production build
npm run start         # Production server on port 8080
```

## Adding a New Trip

1. Create `public/trips/{slug}/trip.json` following the schema in `src/types/trip.ts`
2. Add sticker images to `public/trips/{slug}/stickers/` if needed
3. The normalizer will handle minor format variations — check `src/lib/trip-loader.ts` if fields differ significantly
4. Visit `/trip/{slug}` — the dynamic route picks it up automatically
