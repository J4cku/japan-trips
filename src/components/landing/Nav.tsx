"use client";

import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
      <a href="#" className="lp-nav__logo">
        TRIP<span>MAG</span>
      </a>
      <div className="lp-nav__links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
        <a href="#pricing" className="lp-nav__cta">
          Create Your Trip
        </a>
      </div>
    </nav>
  );
}
