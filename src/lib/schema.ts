import { z } from "zod";

// Minimal schema — just validate that required top-level sections exist
// with the bare minimum fields. The normalizer in trip-loader.ts handles
// transforming varying JSON shapes into the canonical TripData interface.
export const TripDataSchema = z.object({
  trip: z.object({}).passthrough(),
  days: z.array(z.object({
    day: z.number(),
    title: z.string(),
  }).passthrough()),
  pins: z.object({
    items: z.array(z.object({
      lat: z.number(),
      lng: z.number(),
    }).passthrough()),
  }).passthrough(),
}).passthrough();
