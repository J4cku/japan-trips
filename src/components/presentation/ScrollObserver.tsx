"use client";

import { useEffect } from "react";

export function ScrollObserver() {
  useEffect(() => {
    const container = document.getElementById("snap-root");
    if (!container) return;

    // Reveal animations
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll(".rv,.rv-s,.rv-l").forEach((el) => el.classList.add("v"));
            e.target.querySelectorAll(".sticker,.sticker-float,.sticker-spin,.luggage-tag,.ts-item,.polaroid").forEach((el) => el.classList.add("vis"));
          } else {
            e.target.querySelectorAll(".sticker,.sticker-float,.sticker-spin,.luggage-tag,.ts-item,.polaroid").forEach((el) => el.classList.remove("vis"));
          }
        });
      },
      { root: container, threshold: 0.3 }
    );
    container.querySelectorAll(".slide").forEach((s) => obs.observe(s));

    // Keyboard navigation
    let current = 0;
    const total = container.querySelectorAll(".slide").length;

    const keyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            current = parseInt(e.target.id.replace("slide-", ""));
          }
        });
      },
      { root: container, threshold: 0.5 }
    );
    container.querySelectorAll(".slide").forEach((s) => keyObs.observe(s));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        current = Math.min(current + 1, total - 1);
        document.getElementById(`slide-${current}`)?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        current = Math.max(current - 1, 0);
        document.getElementById(`slide-${current}`)?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "Home") {
        e.preventDefault();
        current = 0;
        document.getElementById("slide-0")?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "End") {
        e.preventDefault();
        current = total - 1;
        document.getElementById(`slide-${current}`)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      obs.disconnect();
      keyObs.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
