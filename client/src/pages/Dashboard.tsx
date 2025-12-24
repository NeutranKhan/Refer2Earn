import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { ReferralCodeCard } from "@/components/ReferralCodeCard";
import { ReferralList } from "@/components/ReferralList";
import { PaymentCard } from "@/components/PaymentCard";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, CheckCircle, CreditCard, Loader2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Referral, User } from "@shared/schema";
import { auth } from "@/lib/firebase";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  weeklyCredits: number;
  subscriptionFree: boolean;
  weeklyPayout: number;
}

interface ReferralWithUser extends Referral {
  referredUser: User | null;
}

export function Dashboard() {
  const [showPayment, setShowPayment] = useState(false);
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery<ReferralStats>({
    queryKey: ["/api/referrals/stats"],
  });

  const { data: referralsData, isLoading: referralsLoading } = useQuery<ReferralWithUser[]>({
    queryKey: ["/api/referrals"],
  });
  const referrals = referralsData || [];

  const payMutation = useMutation({
    mutationFn: async (data: { paymentProvider: string; paymentPhone: string }) => {
      return apiRequest("POST", "/api/subscription/pay", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful!",
        description: "Your subscription is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/referrals/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      setShowPayment(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePayment = (provider: string, phone: string) => {
    payMutation.mutate({ paymentProvider: provider, paymentPhone: phone });
  };

  if (userLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeReferrals = stats?.activeReferrals || 0;
  const pendingReferrals = stats?.pendingReferrals || 0;
  const weeklyCredits = stats?.weeklyCredits || 0;
  const subscriptionFree = stats?.subscriptionFree || false;
  const weeklyPayout = stats?.weeklyPayout || 0;

  const formattedReferrals = referrals.map((ref) => ({
    id: ref.id,
    name: ref.referredUser
      ? `${ref.referredUser.firstName || ""} ${ref.referredUser.lastName || ""}`.trim() ||
      ref.referredUser.email ||
      "Unknown"
      : "Unknown",
    phone: ref.referredUser?.phone || "N/A",
    status: ref.status as "active" | "pending" | "inactive",
    joinedDate: new Date(ref.createdAt!).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    earnings: ref.status === "active" ? 250 : 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} isAdmin={user?.isAdmin || false} onLogout={handleLogout} />

      <main className="pt-20 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Welcome back,{" "}
                  <span className="gradient-neon-text">
                    {user?.firstName || user?.email?.split("@")[0] || "User"}
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Here's an overview of your referral performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                {user?.subscription?.status === 'active' ? (
                  <div className="flex items-center gap-3">
                    <Badge variant="success" className="px-4 py-1.5 text-sm font-medium animate-pulse-subtle">
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Active Subscription
                    </Badge>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Badge variant="destructive" className="px-4 py-1.5 text-sm font-medium bg-red-500/10 text-red-400 border-red-500/20">
                      Inactive Subscription
                    </Badge>
                    <Button
                      size="sm"
                      className="neon-glow text-xs h-9"
                      onClick={() => setShowPayment(true)}
                    >
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Pay Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
              title="Weekly Credits"
              value={`${weeklyCredits.toLocaleString()} LRD`}
              icon={Wallet}
              variant="accent"
            />
            <StatCard
              title="Weekly Payout"
              value={`${weeklyPayout.toLocaleString()} LRD`}
              subtitle={subscriptionFree ? "Subscription covered" : "Need 2 referrals"}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Subscription Status"
              value={subscriptionFree ? "FREE" : "500 LRD"}
              subtitle={subscriptionFree ? "2+ referrals achieved" : "Invite more friends"}
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
                  {(!user?.subscription || user.subscription.status !== 'active') && (
                    <Button
                      variant="outline"
                      className="w-full justify-start border-primary/50 hover:bg-primary/10 hover:text-primary"
                      onClick={() => setShowPayment(true)}
                      data-testid="button-pay-subscription"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Subscription (500 LRD)
                    </Button>
                  )}
                  <Button
                    className="w-full justify-start neon-glow"
                    onClick={() => {
                      if (user?.referralCode) {
                        navigator.clipboard.writeText(user.referralCode);
                        toast({
                          title: "Copied!",
                          description: "Referral code copied to clipboard",
                        });
                      }
                    }}
                    data-testid="button-invite-friends"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Invite More Friends
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {user?.referralCode && (
            <div className="mb-8">
              <ReferralCodeCard referralCode={user.referralCode} />
            </div>
          )}

          {referralsLoading ? (
            <div className="glass rounded-2xl p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ReferralList referrals={formattedReferrals} />
          )}
        </div>
      </main>

      <Footer />

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="glass-strong border-primary/20 sm:max-w-md p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-display font-bold">
              Pay Subscription
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            <PaymentCard
              onPaymentComplete={() => setShowPayment(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
