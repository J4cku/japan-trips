import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <>
      {/* Pre-footer CTA */}
      <section className="lp-cta-banner">
        <div className="lp-container">
          <Reveal>
            <h2>Ready to Transform Your Travel?</h2>
          </Reveal>
          <Reveal delay={80}>
            <p>Create your personalized trip magazine in minutes.</p>
          </Reveal>
          <Reveal delay={160}>
            <a
              href="#pricing"
              className="lp-btn-primary"
              style={{ display: "inline-flex" }}
            >
              Create Your Trip Now &rarr;
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer__grid">
            <div>
              <a href="#" className="lp-nav__logo">
                TRIP<span style={{ color: "var(--lp-accent-red)" }}>MAG</span>
              </a>
              <p className="lp-footer__desc">
                AI-powered interactive trip magazines. Personalized travel
                content, beautifully designed.
              </p>
            </div>
            <div>
              <p className="lp-footer__col-title">Product</p>
              <ul className="lp-footer__links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#demo">Demo</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="lp-footer__col-title">Company</p>
              <ul className="lp-footer__links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="lp-footer__col-title">Connect</p>
              <ul className="lp-footer__links">
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer__bottom">
            <span>&copy; 2026 TripMag. All rights reserved.</span>
            <span>Privacy Policy &middot; Terms of Service</span>
          </div>
        </div>
      </footer>
    </>
  );
}
