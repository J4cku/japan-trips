"use client";

import { createContext, useContext } from "react";
import type { TripData } from "@/types/trip";

interface TripContextValue {
  data: TripData;
  slug: string;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripDataProvider({
  data,
  slug,
  children,
}: {
  data: TripData;
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <TripContext.Provider value={{ data, slug }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripData(): TripData {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripData must be used within TripDataProvider");
  return ctx.data;
}

export function useTripSlug(): string {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripSlug must be used within TripDataProvider");
  return ctx.slug;
}
