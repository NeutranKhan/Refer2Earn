import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useLocation } from "wouter";

export function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [_location, setLocation] = useLocation();

  // Redirect logic removed to allow authenticated users to visit landing page
  // useEffect(() => {
  //   if (!isLoading && isAuthenticated) {
  //     setLocation("/dashboard");
  //   }
  // }, [isLoading, isAuthenticated, setLocation]);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isAuthenticated}
        isAdmin={false} // Todo: fetch admin status if needed
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
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => window.location.href = "/dashboard"}
      />
    </div>
  );
}
