import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Wallet, Gift } from "lucide-react";

export function EarningsCalculator() {
  const [referrals, setReferrals] = useState([5]);
  const monthlyFee = 500; // Actually weekly fee now
  const creditPerReferral = 250;

  const totalCredits = referrals[0] * creditPerReferral;
  const subscriptionCovered = referrals[0] >= 2;
  const excessCredits = Math.max(0, totalCredits - monthlyFee);
  const monthlyPayout = subscriptionCovered ? excessCredits : 0;
  const yearlyPayout = monthlyPayout * 52; // Weekly * 52 weeks

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            Calculate Your <span className="gradient-neon-text">Earnings</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how much you can earn based on your referrals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 md:p-10 neon-border"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl gradient-neon">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-foreground">
                Earnings Calculator
              </h3>
              <p className="text-muted-foreground">Adjust the slider to see potential earnings</p>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Number of Referrals</span>
              <span className="text-3xl font-display font-bold gradient-neon-text">
                {referrals[0]}
              </span>
            </div>
            <Slider
              value={referrals}
              onValueChange={setReferrals}
              max={20}
              min={0}
              step={1}
              className="py-4"
              data-testid="slider-referrals"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>0</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-strong rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Total Credits</span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">
                {totalCredits.toLocaleString()} LRD
              </p>
            </div>

            <div className="glass-strong rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Subscription</span>
              </div>
              <p className={`text-2xl font-display font-bold ${subscriptionCovered ? 'text-green-500' : 'text-foreground'}`}>
                {subscriptionCovered ? "FREE!" : `${monthlyFee.toLocaleString()} LRD`}
              </p>
            </div>

            <div className="glass-strong rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-muted-foreground">Weekly Payout</span>
              </div>
              <p className="text-2xl font-display font-bold text-green-500">
                +{monthlyPayout.toLocaleString()} LRD
              </p>
            </div>
          </div>

          {referrals[0] >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-green-500/10 border border-green-500/30"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-lg text-green-500">
                    Yearly Earnings Potential
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Free subscription + {yearlyPayout > 0 ? 'cash payouts' : 'covered fees'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl md:text-4xl font-display font-bold text-green-500">
                    {yearlyPayout.toLocaleString()} LRD
                  </p>
                  <p className="text-sm text-muted-foreground">per year in payouts</p>
                </div>
              </div>
            </motion.div>
          )}

          {referrals[0] < 2 && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <p className="text-foreground">
                Invite <span className="font-bold text-primary">{2 - referrals[0]}</span> more friend{2 - referrals[0] !== 1 ? 's' : ''} to get your subscription for{" "}
                <span className="font-bold text-green-500">FREE</span>!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
