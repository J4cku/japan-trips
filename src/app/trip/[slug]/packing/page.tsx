"use client";

import Link from "next/link";
import { useTripData, useTripSlug } from "@/context/TripContext";
import { PackingChecklist } from "@/components/fun/PackingChecklist";

export default function PackingPage() {
  const data = useTripData();
  const slug = useTripSlug();

  return (
    <div className="pk-page">
      <div className="pk-wrapper">
        <Link href={`/trip/${slug}`} className="pk-back">
          ← Back
        </Link>
        <h1 className="pk-title">Packing List</h1>
        <p className="pk-subtitle">{data.trip.durationDays} days. Pack smart.</p>
        <PackingChecklist items={data.packing} />
      </div>
    </div>
  );
}
