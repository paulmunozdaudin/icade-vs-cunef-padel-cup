import { TICKET_PRICE_EUR } from "@/lib/padel/config";
import { isStripeConfigured } from "@/lib/padel/stripe";
import AfterpartySection from "@/components/padel/AfterpartySection";
import CheckoutProvider from "@/components/padel/CheckoutProvider";
import FAQ from "@/components/padel/FAQ";
import FinalCta from "@/components/padel/FinalCta";
import Footer from "@/components/padel/Footer";
import Hero from "@/components/padel/Hero";
import HowItWorks from "@/components/padel/HowItWorks";
import IncludedSection from "@/components/padel/IncludedSection";
import MobileStickyCta from "@/components/padel/MobileStickyCta";
import Navbar from "@/components/padel/Navbar";
import Pricing from "@/components/padel/Pricing";
import RevealObserver from "@/components/padel/RevealObserver";
import RivalrySection from "@/components/padel/RivalrySection";
import TournamentFormat from "@/components/padel/TournamentFormat";

export default function Home() {
  const paymentsEnabled = TICKET_PRICE_EUR !== null && isStripeConfigured();

  return (
    <CheckoutProvider paymentsEnabled={paymentsEnabled}>
      <Navbar />
      <main>
        <Hero />
        <RivalrySection />
        <TournamentFormat />
        <IncludedSection />
        <AfterpartySection />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
      <MobileStickyCta />
      <RevealObserver />
    </CheckoutProvider>
  );
}
