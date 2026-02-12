import { Reveal } from "./Reveal";

const steps = [
  {
    num: "1",
    title: "Answer 5 Quick Questions",
    desc: "Tell us about your destination, travel style, budget, and must-see experiences. Our AI learns exactly what you\u2019re looking for.",
    time: "~3 minutes",
  },
  {
    num: "2",
    title: "AI Generates Your Magazine",
    desc: "Watch as our system curates and organizes the perfect trip content for you. 40+ recommendations, custom itineraries, and everything you need.",
    time: "~30 seconds",
  },
  {
    num: "3",
    title: "Explore, Customize & Share",
    desc: "Browse your personalized magazine on any device. Tweak recommendations. Add your own notes. Share with travel partners. Book directly.",
    time: "Yours forever",
  },
];

export function HowItWorks() {
  return (
    <section className="lp-how" id="how-it-works">
      <div className="lp-container">
        <Reveal>
          <div className="lp-section-header">
            <h2>Create Your Trip Magazine in 3 Steps</h2>
            <p>Personalized travel content, generated in minutes.</p>
          </div>
        </Reveal>
        <div className="lp-steps">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className="lp-step">
                <div className="lp-step__number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <p className="lp-step__time">{s.time}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
