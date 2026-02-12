"use client";

import { useEffect, useRef } from "react";

export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById("snap-root");
    if (!container) return;
    const handler = () => {
      if (!ref.current) return;
      const pct = container.scrollTop / (container.scrollHeight - container.clientHeight);
      ref.current.style.width = `${pct * 100}%`;
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  return <div id="progress" ref={ref} />;
}
