"use client";

import { useEffect, useState, useMemo } from "react";
import type { Trip } from "@/types/trip";

function parseFirstDate(dates: string): Date | null {
  const isoMatch = dates.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return new Date(isoMatch[1] + "T00:00:00");

  const parts = dates.match(/(\w+)\s+(\d+).*?(\d{4})/);
  if (parts) {
    const d = new Date(`${parts[1]} ${parts[2]}, ${parts[3]}`);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function compute(departMs: number, durationDays: number) {
  const returnMs = departMs + durationDays * 86_400_000;
  const now = Date.now();
  if (now >= returnMs) return { label: "Trip complete!", done: true };
  if (now >= departMs) return { label: "Trip in progress!", done: true };
  const diff = departMs - now;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return { label: `${d} days, ${h} hours, ${m} minutes`, done: false };
}

export function Countdown({ trip }: { trip: Trip }) {
  const departMs = useMemo(() => parseFirstDate(trip.dates)?.getTime() ?? null, [trip.dates]);
  const [state, setState] = useState<{ label: string; done: boolean } | null>(null);

  useEffect(() => {
    if (departMs === null) return;
    setState(compute(departMs, trip.durationDays));
    const id = setInterval(() => setState(compute(departMs, trip.durationDays)), 60_000);
    return () => clearInterval(id);
  }, [departMs, trip.durationDays]);

  if (departMs === null || !state) return <p className="countdown rv d7">&nbsp;</p>;
  return <p className="countdown rv d7">{state.label}</p>;
}
