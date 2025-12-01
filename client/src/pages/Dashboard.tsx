import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { ReferralCodeCard } from "@/components/ReferralCodeCard";
import { ReferralList } from "@/components/ReferralList";
import { PaymentCard } from "@/components/PaymentCard";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, CheckCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [showPayment, setShowPayment] = useState(false);

  const mockUser = {
    name: "Kwame Johnson",
    referralCode: "REF2E-KW8X4",
    subscriptionStatus: "free" as const,
  };

  const mockReferrals = [
    {
      id: "1",
      name: "Fatou Williams",
      phone: "+231 88 234 5678",
      status: "active" as const,
      joinedDate: "Nov 15, 2024",
      earnings: 500,
    },
    {
      id: "2",
      name: "Prince Cooper",
      phone: "+231 77 345 6789",
      status: "active" as const,
      joinedDate: "Nov 20, 2024",
      earnings: 500,
    },
    {
      id: "3",
      name: "Mary Weah",
      phone: "+231 88 456 7890",
      status: "active" as const,
      joinedDate: "Nov 22, 2024",
      earnings: 500,
    },
    {
      id: "4",
      name: "John Doe",
      phone: "+231 77 567 8901",
      status: "pending" as const,
      joinedDate: "Nov 28, 2024",
      earnings: 0,
    },
    {
      id: "5",
      name: "Sarah Cole",
      phone: "+231 88 678 9012",
      status: "active" as const,
      joinedDate: "Nov 25, 2024",
      earnings: 500,
    },
  ];

  const activeReferrals = mockReferrals.filter((r) => r.status === "active").length;
  const pendingReferrals = mockReferrals.filter((r) => r.status === "pending").length;
  const monthlyCredits = activeReferrals * 500;
  const subscriptionFree = activeReferrals >= 3;
  const monthlyPayout = subscriptionFree ? Math.max(0, monthlyCredits - 1500) : 0;
  const totalEarnings = monthlyPayout * 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} onLogout={onLogout} />

      <main className="pt-20 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Welcome back, <span className="gradient-neon-text">{mockUser.name.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your referral performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Active Referrals"
              value={activeReferrals}
              subtitle={`${pendingReferrals} pending activation`}
              icon={Users}
              trend={{ value: 25, positive: true }}
            />
            <StatCard
              title="Monthly Credits"
              value={`${monthlyCredits.toLocaleString()} LRD`}
              icon={Wallet}
              variant="accent"
            />
            <StatCard
              title="Monthly Payout"
              value={`${monthlyPayout.toLocaleString()} LRD`}
              subtitle={subscriptionFree ? "Subscription covered" : "Need 3 referrals"}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Subscription Status"
              value={subscriptionFree ? "FREE" : "1,500 LRD"}
              subtitle={subscriptionFree ? "3+ referrals achieved" : "Invite more friends"}
              icon={subscriptionFree ? CheckCircle : CreditCard}
              variant={subscriptionFree ? "success" : "default"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProgressTracker currentReferrals={activeReferrals} />
            </div>
            <div>
              <div className="glass rounded-2xl p-6 neon-border h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your account and subscription
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowPayment(true)}
                    data-testid="button-renew-subscription"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {subscriptionFree ? "View Payment History" : "Pay Subscription"}
                  </Button>
                  <Button
                    className="w-full justify-start neon-glow"
                    data-testid="button-invite-friends"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Invite More Friends
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <ReferralCodeCard referralCode={mockUser.referralCode} />
          </div>

          <ReferralList referrals={mockReferrals} />
        </div>
      </main>

      <Footer />

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="glass-strong border-primary/20 sm:max-w-md p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-display font-bold">
              {subscriptionFree ? "Payment History" : "Pay Subscription"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            {subscriptionFree ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Your subscription is FREE!
                </h3>
                <p className="text-muted-foreground">
                  You have {activeReferrals} active referrals covering your subscription.
                </p>
              </div>
            ) : (
              <PaymentCard onPaymentComplete={() => setShowPayment(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
