import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

interface LandingProps {
  onLogin?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function Landing({ onLogin, isLoggedIn, onLogout }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout} />
      <main>
        <HeroSection onGetStarted={onLogin} onLearnMore={() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }} />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <EarningsCalculator />
        <PricingSection onGetStarted={onLogin} />
      </main>
      <Footer />
    </div>
  );
}
