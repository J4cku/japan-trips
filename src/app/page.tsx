import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Demo } from "@/components/landing/Demo";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="lp-root">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
