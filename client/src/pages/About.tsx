import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Zap, Heart } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function About() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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

      <main className="pt-20 md:pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              About <span className="gradient-neon-text">WealthBridge</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Empowering Liberians to build wealth through meaningful referrals
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 md:p-12 neon-border mb-12"
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              WealthBridge is Liberia's premier financial empowerment platform. We combine a powerful <strong>Personal Finance Tracker</strong> to help you manage your money with a lucrative <strong>Referral Network</strong> to help you earn it.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to provide Liberians with the tools they need for financial freedom—tracking every dollar earned and spent, while creating sustainable income opportunities through our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 neon-border hover-elevate"
            >
              <div className="p-3 rounded-xl gradient-neon w-fit mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Transparent & Fair
              </h3>
              <p className="text-muted-foreground">
                Clear earning structure with no hidden fees. Every credit is earned through active referrals with real engagement from your network.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-8 neon-border hover-elevate"
            >
              <div className="p-3 rounded-xl gradient-neon w-fit mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Fast Payments
              </h3>
              <p className="text-muted-foreground">
                Quick and reliable payout system via Mobile Money. Get paid directly to your Lonestar Cell MTN or Orange Money account.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-8 neon-border hover-elevate"
            >
              <div className="p-3 rounded-xl gradient-neon w-fit mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Community Driven
              </h3>
              <p className="text-muted-foreground">
                Join thousands of Liberians earning with WealthBridge. Grow your network and watch your earnings compound.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-8 neon-border hover-elevate"
            >
              <div className="p-3 rounded-xl gradient-neon w-fit mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Customer Focused
              </h3>
              <p className="text-muted-foreground">
                Your success is our success. We provide 24/7 support to help you maximize your earning potential.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8 md:p-12 neon-border"
          >
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              How We Work
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  1. Get Your Referral Code
                </h3>
                <p className="text-muted-foreground">
                  Sign up and receive your unique referral code instantly. Share it with friends and family through any channel.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  2. They Subscribe
                </h3>
                <p className="text-muted-foreground">
                  When someone uses your referral code to subscribe with a 500 LRD weekly payment, they become an active referral.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  3. Earn Credits
                </h3>
                <p className="text-muted-foreground">
                  You earn 250 LRD in credits for each active referral. With 2+ active referrals, your subscription becomes completely free.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  4. Get Paid
                </h3>
                <p className="text-muted-foreground">
                  With 3+ active referrals, you can request cash payouts directly to your Mobile Money account. We handle all the processing.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
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
