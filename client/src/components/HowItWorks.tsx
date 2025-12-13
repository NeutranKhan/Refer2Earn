import { motion } from "framer-motion";
import { UserPlus, Share2, Wallet, Trophy } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up & Subscribe",
      description:
        "Create your account and pay just 200 LRD/week via Mobile Money to get started.",
      color: "from-primary to-purple-600",
    },
    {
      icon: Share2,
      title: "Share Your Code",
      description:
        "Get your unique referral code and share it with friends, family, and your network.",
      color: "from-accent to-cyan-600",
    },
    {
      icon: Wallet,
      title: "Earn Credits",
      description:
        "Earn 100 LRD credit for each friend who joins and pays their subscription.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Trophy,
      title: "Get Free + Cash",
      description:
        "With 2 referrals, your subscription is free. More referrals = cash payouts!",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            How It <span className="gradient-neon-text">Works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start earning in just 4 simple steps. No complicated processes, no hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 h-full neon-border hover:neon-glow transition-all duration-300">
                  <div className="absolute -top-4 left-6">
                    <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <span className="text-sm font-display font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mt-4 mb-4`}
                  >
                    <StepIcon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-lg font-display font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 gradient-neon" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
