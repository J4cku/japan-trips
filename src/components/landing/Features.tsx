import { Reveal } from "./Reveal";

const cards = [
  {
    emoji: "\uD83C\uDFAC",
    colorClass: "lp-icon--red",
    title: "Navigate Like a Magazine",
    body: "Beautiful, frictionless navigation through your entire trip. Snap-scroll between destinations, hotels, restaurants, and activities. Designed to feel like reading editorial travel content \u2014 not browsing a spreadsheet.",
  },
  {
    emoji: "\u2726",
    colorClass: "lp-icon--cyan",
    title: "Everything Curated for You",
    body: "Our AI analyzes your style, budget, and travel preferences to recommend exactly what you\u2019ll love. Not generic advice \u2014 genuinely personalized suggestions for restaurants, hotels, activities, and more.",
  },
  {
    emoji: "\uD83D\uDDFA",
    colorClass: "lp-icon--gold",
    title: "Maps, Bookings & Details",
    body: "Embedded maps show real restaurant locations. Instant booking links to hotels. Sharable itineraries. Customizable checklists. Your entire trip in one interactive document.",
  },
];

export function Features() {
  return (
    <section className="lp-features" id="features">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>What Makes TripMag Different</h2>
            <p>AI-powered personalization meets human travel expertise.</p>
          </div>
        </Reveal>
        <div className="lp-features__grid">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="lp-feature-card">
                <div className={`lp-feature-card__icon ${c.colorClass}`}>
                  {c.emoji}
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
