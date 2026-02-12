import { Reveal } from "./Reveal";

const features = [
  "AI-generated personalized magazine",
  "Interactive snap-scroll design",
  "Full-featured interactive map",
  "40+ curated recommendations",
  "Customizable packing list",
  "Shareable itinerary & booking links",
  "Lifetime access to your magazine",
  "Updates & new features included",
];

export function Pricing() {
  return (
    <section className="lp-pricing" id="pricing">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>Perfectly Priced for Every Traveler</h2>
            <p>Get a personalized trip magazine for one flat price.</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="lp-pricing__card">
            <div className="lp-pricing__badge">Most Popular</div>
            <div className="lp-pricing__price">$29</div>
            <p className="lp-pricing__price-sub">per trip magazine</p>
            <p className="lp-pricing__note">
              Unlimited personalization. One-time purchase.
            </p>
            <ul className="lp-pricing__features">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              href="/trip/japan-2026"
              className="lp-btn-primary lp-pricing__btn"
            >
              Create Your Trip Magazine
            </a>
            <a href="#demo" className="lp-pricing__secondary">
              Or view the demo first &rarr;
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
