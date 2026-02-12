"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How personalized is the AI actually?",
    a: "Our AI analyzes your destination preferences, budget, travel style, and must-see experiences to curate 40+ recommendations specifically for you. Each magazine is uniquely generated \u2014 no two users get the same content.",
  },
  {
    q: "Can I edit my trip magazine after it\u2019s created?",
    a: "Absolutely. Your magazine is fully editable. Swap restaurant recommendations, adjust dates, remove sections entirely, or add your own notes. Think of it as your personal travel document \u2014 live and changeable.",
  },
  {
    q: "What happens if I change my mind about something?",
    a: "The AI can regenerate specific sections. Want completely different restaurant recommendations? Different hotels? Just ask, and we\u2019ll regenerate that section with fresh, personalized suggestions.",
  },
  {
    q: "Is this just a travel website I could build myself?",
    a: "Building something like this yourself would require 20+ hours of research across multiple sites, aggregating recommendations, building itineraries. Our AI does that work in minutes. Plus, your magazine stays interactive, shareable, and updateable.",
  },
  {
    q: "How long do I have access to my magazine?",
    a: "Forever. Once created, your magazine is yours indefinitely. Access it anytime to explore, share, or update your trip details. No subscriptions, no expiration.",
  },
  {
    q: "Can I share my magazine with friends?",
    a: "Yes! Your magazine includes a shareable link and downloadable itinerary. Co-travelers can view your entire magazine, see your recommendations, and use your itinerary to plan together. They don\u2019t need a TripMag account.",
  },
  {
    q: "What destinations do you support?",
    a: "We\u2019re launching with Japan and expanding to 150+ destinations worldwide, including major cities, island destinations, mountain regions, and emerging travel spots. If your destination isn\u2019t listed, let us know.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="lp-faq" id="faq">
      <div className="lp-container">
        <div className="lp-section-header">
          <h2>Questions? We Have Answers</h2>
        </div>
        <div className="lp-faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`lp-faq__item${isOpen ? " open" : ""}`}
              >
                <button
                  className="lp-faq__question"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {f.q}
                </button>
                <div className="lp-faq__answer">
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
