"use client";

import type { Travel } from "@/types/trip";

const EMOJI: Record<string, string> = {
  plane: "✈️",
  shinkansen: "🚅",
  train: "🚃",
  bus: "🚌",
  bike: "🚲",
};

export function TransportStrip({ travels }: { travels: Travel[] }) {
  return (
    <div className="transport-strip">
      {travels.map((t, i) => {
        const emoji = EMOJI[t.icon] || EMOJI.train;
        const from = t.from.code || t.from.name;
        const to = t.to.code || t.to.name;
        return (
          <div
            key={t.id}
            className={`ts-item ${t.animation}`}
            style={{ "--ts-delay": `${i * 0.4}s` } as React.CSSProperties}
          >
            <span className="ts-from">{from}</span>
            <div className="ts-rail">
              <div className="ts-track" />
              <div className="ts-emoji">{emoji}</div>
            </div>
            <span className="ts-to">{to}</span>
            <span className="ts-meta">
              {t.line || t.carrier || t.route || t.mode} · {t.duration}
            </span>
          </div>
        );
      })}
    </div>
  );
}
