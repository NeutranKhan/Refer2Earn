import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap, Wallet } from "lucide-react";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Join 1,000+ Liberians Earning
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              <span className="text-foreground">Turn Your Network Into </span>
              <span className="gradient-neon-text">Real Income</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Pay just 1,500 LRD/month. Refer 3 friends and your subscription is free forever. 
              Keep referring to earn 500 LRD for each additional friend!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="neon-glow text-base px-8"
                onClick={onGetStarted}
                data-testid="button-hero-get-started"
              >
                Start Earning Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base"
                onClick={onLearnMore}
                data-testid="button-hero-learn-more"
              >
                How It Works
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display font-bold text-primary">1,500 LRD</p>
                <p className="text-sm text-muted-foreground mt-1">Monthly Fee</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display font-bold text-accent">500 LRD</p>
                <p className="text-sm text-muted-foreground mt-1">Per Referral</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-display font-bold text-pink-500">3 Friends</p>
                <p className="text-sm text-muted-foreground mt-1">= Free Forever</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-6 md:p-8 neon-border animate-float">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl gradient-neon">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">Your Referral Network</p>
                  <p className="text-sm text-muted-foreground">Growing daily</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Kwame Johnson", status: "Active", earnings: "+500 LRD" },
                  { name: "Fatou Williams", status: "Active", earnings: "+500 LRD" },
                  { name: "Prince Cooper", status: "Active", earnings: "+500 LRD" },
                  { name: "Mary Weah", status: "Pending", earnings: "Activating..." },
                ].map((referral, index) => (
                  <motion.div
                    key={referral.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl glass-strong"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-neon flex items-center justify-center text-white font-semibold">
                        {referral.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{referral.name}</p>
                        <p className={`text-xs ${referral.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {referral.status}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${referral.status === 'Active' ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {referral.earnings}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Total Monthly Earnings</span>
                  </div>
                  <span className="text-xl font-display font-bold text-primary">1,500 LRD</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your subscription is covered + 0 LRD payout
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
