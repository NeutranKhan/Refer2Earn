import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Gift, Star, Trophy } from "lucide-react";

interface ProgressTrackerProps {
  currentReferrals: number;
  targetReferrals?: number;
}

export function ProgressTracker({
  currentReferrals,
  targetReferrals = 3,
}: ProgressTrackerProps) {
  const progress = Math.min((currentReferrals / targetReferrals) * 100, 100);
  const isComplete = currentReferrals >= targetReferrals;
  const extraReferrals = Math.max(0, currentReferrals - targetReferrals);
  const extraEarnings = extraReferrals * 500;

  const milestones = [
    { count: 1, label: "First Referral", icon: Star, reward: "500 LRD Credit" },
    { count: 2, label: "Getting Closer", icon: Gift, reward: "1,000 LRD Credit" },
    { count: 3, label: "Free Forever!", icon: Trophy, reward: "Free Subscription" },
  ];

  return (
    <div className="glass rounded-2xl p-6 md:p-8 neon-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Your Referral Progress
          </h3>
          <p className="text-muted-foreground mt-1">
            {isComplete
              ? `Congratulations! You have ${currentReferrals} active referrals`
              : `Invite ${targetReferrals - currentReferrals} more friend${targetReferrals - currentReferrals !== 1 ? 's' : ''} for free subscription`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-display font-bold gradient-neon-text">
            {currentReferrals}
          </span>
          <span className="text-muted-foreground">/ {targetReferrals}</span>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-neon relative"
          >
            {isComplete && (
              <div className="absolute inset-0 animate-pulse bg-white/20" />
            )}
          </motion.div>
        </div>

        <div className="flex justify-between mt-2">
          {milestones.map((milestone, index) => {
            const achieved = currentReferrals >= milestone.count;
            return (
              <div
                key={milestone.count}
                className={cn(
                  "flex flex-col items-center",
                  index === 0 && "items-start",
                  index === milestones.length - 1 && "items-end"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    achieved
                      ? "gradient-neon text-white neon-glow"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {achieved ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <p className={cn(
                  "text-xs mt-2 hidden sm:block",
                  achieved ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {milestone.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {isComplete && extraReferrals > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-medium text-green-500">Bonus Earnings Active!</p>
              <p className="text-sm text-muted-foreground">
                {extraReferrals} extra referral{extraReferrals !== 1 ? 's' : ''} generating income
              </p>
            </div>
            <p className="text-2xl font-display font-bold text-green-500">
              +{extraEarnings.toLocaleString()} LRD
            </p>
          </div>
        </motion.div>
      )}

      {!isComplete && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {milestones.map((milestone) => {
            const achieved = currentReferrals >= milestone.count;
            const MilestoneIcon = milestone.icon;
            return (
              <div
                key={milestone.count}
                className={cn(
                  "p-4 rounded-xl transition-all",
                  achieved
                    ? "glass-strong border-primary/30"
                    : "glass border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <MilestoneIcon
                    className={cn(
                      "w-5 h-5",
                      achieved ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      achieved ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {milestone.count} Referral{milestone.count !== 1 ? 's' : ''}
                    </p>
                    <p className={cn(
                      "text-xs",
                      achieved ? "text-primary" : "text-muted-foreground"
                    )}>
                      {milestone.reward}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
