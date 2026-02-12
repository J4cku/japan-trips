import { JapanMap } from "./JapanMap";
import { Reveal } from "./Reveal";

const checklist = [
  "Snap-scroll through 12 destinations",
  "40+ recommended restaurants & hotels",
  "Custom packing checklist with check-off",
  "Interactive map with 252 pins and booking links",
  "Sharable itinerary with friends",
];

const testimonials = [
  {
    quote:
      "I planned my entire Bali trip using TripMag. The restaurant recommendations were spot-on, and the interactive map saved me hours of research.",
    name: "Sarah M.",
    role: "Product Designer",
  },
  {
    quote:
      "As someone who travels frequently, TripMag\u2019s personalization is incredible. It\u2019s like having a local guide who knows my exact taste.",
    name: "James L.",
    role: "Executive",
  },
  {
    quote:
      "Finally, a travel planning tool that doesn\u2019t feel like homework. Beautiful, intuitive, and actually useful.",
    name: "Maria C.",
    role: "Entrepreneur",
  },
];


export function Demo() {
  return (
    <section className="lp-demo" id="demo">
      <div className="lp-container">
        <div className="lp-demo__grid">
          <Reveal>
            <div>
              <div className="lp-section-header" style={{ textAlign: "left", marginBottom: 24 }}>
                <h2>See the Japan Trip Magazine</h2>
                <p style={{ margin: "12px 0 0" }}>
                  Interactive, personalized, beautifully designed.
                </p>
              </div>
              <ul className="lp-demo__list">
                {checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="/trip/japan-2026" className="lp-demo__cta-link">
                View Live Demo &rarr;
              </a>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <a href="/trip/japan-2026" className="lp-demo__iframe-wrap">
              <div className="lp-demo__browser">
                <div className="lp-demo__browser-bar">
                  <div className="lp-demo__browser-dots">
                    <span /><span /><span />
                  </div>
                  <div className="lp-demo__browser-url">tripmag.io/japan-2026</div>
                </div>
                <div className="lp-demo__browser-body">
                  <iframe
                    src="/trip/japan-2026"
                    title="Japan 2026 Trip Magazine Preview"
                    className="lp-demo__iframe"
                    loading="lazy"
                    tabIndex={-1}
                  />
                </div>
              </div>
            </a>
          </Reveal>
        </div>

        {/* Route map */}
        <Reveal>
          <div className="lp-demo__map-section">
            <h3 className="lp-demo__map-title">14 Days Across Japan</h3>
            <div className="lp-demo__route-map">
              <JapanMap className="lp-demo__leaflet-map" center={[34.5, 135.5]} zoom={6.5} />
              <div className="lp-demo__map-stats">
                <div><strong>6</strong> cities</div>
                <div><strong>252</strong> pins</div>
                <div><strong>48</strong> hotels</div>
                <div><strong>34</strong> restaurants</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="lp-testimonials">
            <div className="lp-testimonials__grid">
              {testimonials.map((t) => (
                <div key={t.name} className="lp-testimonial">
                  <div className="lp-testimonial__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <p className="lp-testimonial__quote">&ldquo;{t.quote}&rdquo;</p>
                  <p className="lp-testimonial__author">{t.name}</p>
                  <p className="lp-testimonial__role">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
