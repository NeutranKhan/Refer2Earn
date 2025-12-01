import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

export function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isLoggedIn={isAuthenticated} 
        isAdmin={isAuthenticated ? false : false}
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      <main>
        <HeroSection 
          onGetStarted={handleLogin} 
          onLearnMore={() => {
            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
          }} 
        />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <EarningsCalculator />
        <PricingSection onGetStarted={handleLogin} />
      </main>
      <Footer />
    </div>
  );
}
