"use client";

import { useEffect, useState } from "react";

export function NavDots({ totalSlides }: { totalSlides: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = document.getElementById("snap-root");
    if (!container) return;

    const slides = container.querySelectorAll(".slide");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = parseInt(e.target.id.replace("slide-", ""));
            setActive(i);
          }
        });
      },
      { root: container, threshold: 0.3 }
    );
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav id="nav">
      {Array.from({ length: totalSlides }, (_, i) => (
        <button
          key={i}
          className={`dot${i === active ? " active" : ""}`}
          onClick={() =>
            document
              .getElementById(`slide-${i}`)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          title={
            i === 0
              ? "Start"
              : i < totalSlides - 1
              ? `Day ${String(i).padStart(2, "0")}`
              : "End"
          }
        />
      ))}
    </nav>
  );
}
