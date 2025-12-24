import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

interface PricingSectionProps {
  onGetStarted?: () => void;
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  const features = [
    "Unique referral code",
    "Real-time earnings tracking",
    "Mobile Money integration",
    "Instant credit application",
    "Weekly cash payouts",
    "24/7 customer support",
    "Referral analytics dashboard",
    "Fraud protection",
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            Simple <span className="gradient-neon-text">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One plan. Unlimited earning potential.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 neon-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full gradient-neon">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Most Popular</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl gradient-neon">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  WealthBridge Pro
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-display font-bold text-foreground">
                    500
                  </span>
                  <span className="text-xl text-muted-foreground">LRD/week</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  Can be <span className="text-green-500 font-semibold">FREE</span> with 2+ referrals
                </p>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto neon-glow text-base px-8"
                onClick={onGetStarted}
                data-testid="button-pricing-get-started"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Earning Today
              </Button>
            </div>

            <div className="lg:w-1/2">
              <p className="text-sm font-medium text-muted-foreground mb-4">
                EVERYTHING INCLUDED
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl glass-strong">
                <p className="text-2xl font-display font-bold text-primary">250 LRD</p>
                <p className="text-sm text-muted-foreground mt-1">Per referral credit</p>
              </div>
              <div className="p-4 rounded-xl glass-strong">
                <p className="text-2xl font-display font-bold text-green-500">FREE</p>
                <p className="text-sm text-muted-foreground mt-1">With 2+ referrals</p>
              </div>
              <div className="p-4 rounded-xl glass-strong">
                <p className="text-2xl font-display font-bold text-accent">Unlimited</p>
                <p className="text-sm text-muted-foreground mt-1">Earning potential</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
