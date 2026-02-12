import { JapanMap } from "./JapanMap";

export function Hero() {
  return (
    <section className="lp-hero" id="hero">
      <div className="lp-hero__grid-bg" />
      <div className="lp-hero__content">
        <p className="lp-hero__label">AI-Powered Trip Magazines</p>
        <h1 className="lp-hero__headline">
          Your Trip.
          <br />
          <em>Perfectly Personalized.</em>
        </h1>
        <p className="lp-hero__sub">
          Skip the travel research. Get a personalized, interactive trip
          magazine with curated recommendations, custom itineraries, and
          everything you need to explore with confidence.
        </p>
        <div className="lp-hero__ctas">
          <a href="#pricing" className="lp-btn-primary">
            Create Your Trip Magazine &rarr;
          </a>
          <a href="#demo" className="lp-btn-secondary">
            See It In Action
          </a>
        </div>
        <p className="lp-hero__trust">
          <span>&#10003;</span> Join 2,000+ travelers who&apos;ve already created
          their magazines
        </p>
      </div>
      <div className="lp-hero__visual">
        <div className="lp-hero__map-wrap">
          <JapanMap className="lp-hero__map" />
          <div className="lp-hero__map-overlay" />
          <div className="lp-hero__map-stats">
            <div className="lp-mock-stat">
              <div className="lp-mock-stat__val">252</div>
              <div className="lp-mock-stat__label">Pins</div>
            </div>
            <div className="lp-mock-stat">
              <div className="lp-mock-stat__val">48</div>
              <div className="lp-mock-stat__label">Hotels</div>
            </div>
            <div className="lp-mock-stat">
              <div className="lp-mock-stat__val">34</div>
              <div className="lp-mock-stat__label">Restaurants</div>
            </div>
            <div className="lp-mock-stat">
              <div className="lp-mock-stat__val">14</div>
              <div className="lp-mock-stat__label">Days</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
