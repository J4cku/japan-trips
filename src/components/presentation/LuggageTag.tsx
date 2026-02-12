"use client";

import { useState } from "react";
import { HotelModal } from "./HotelModal";
import type { HotelCity } from "@/types/trip";

export function LuggageTag({
  city,
  code,
  date,
  style,
  hotelData,
}: {
  city: string;
  code: string;
  date?: string;
  style?: React.CSSProperties;
  hotelData?: HotelCity;
}) {
  const [open, setOpen] = useState(false);
  const clickable = !!hotelData;

  return (
    <>
      <div
        className={`luggage-tag${clickable ? " luggage-tag-clickable" : ""}`}
        style={style}
        onClick={clickable ? () => setOpen(true) : undefined}
      >
        <div className="luggage-tag-inner">
          <div className="luggage-tag-city">{city}</div>
          <div className="luggage-tag-code">{code}</div>
          {date && <div className="luggage-tag-date">{date}</div>}
        </div>
      </div>
      {open && hotelData && (
        <HotelModal city={hotelData} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
