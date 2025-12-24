import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { EarningsCalculator } from "@/components/EarningsCalculator";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useLocation } from "wouter";

export function NetworkPage() {
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [_location, setLocation] = useLocation();

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
                onSuccess={() => setLocation("/dashboard")}
            />
        </div>
    );
}
