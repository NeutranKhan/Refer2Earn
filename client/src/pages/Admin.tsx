import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { AdminTable } from "@/components/AdminTable";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, CreditCard, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Payout, User } from "@shared/schema";

interface AdminUser extends User {
  referralsCount: number;
  subscriptionStatus: string;
  totalEarnings: number;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingPayouts: number;
  totalReferrals: number;
}

interface PendingPayout extends Payout {
  user: User | null;
}

export function Admin() {
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const isAdminUser = Boolean(isAuthenticated && user?.isAdmin);

  const { data: usersData, isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdminUser,
  });
  const users = usersData || [];

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAdminUser,
  });

  const { data: pendingPayoutsData, isLoading: payoutsLoading } = useQuery<PendingPayout[]>({
    queryKey: ["/api/admin/payouts/pending"],
    enabled: isAdminUser,
  });
  const pendingPayouts = pendingPayoutsData || [];

  const approveMutation = useMutation({
    mutationFn: async (payoutId: string) => {
      return apiRequest("POST", `/api/admin/payouts/${payoutId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Payout Approved",
        description: "The payout has been approved and is ready for processing.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payouts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (authLoading || usersLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have admin privileges to access this page.
          </p>
          <Button
            className="mt-6"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formattedUsers = users.map((u) => ({
    id: u.id,
    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email || "Unknown",
    email: u.email || "",
    phone: u.phone || "N/A",
    referralCode: u.referralCode,
    referralsCount: u.referralsCount,
    subscriptionStatus: (u.subscriptionStatus === "none" ? "pending" : u.subscriptionStatus) as
      | "active"
      | "pending"
      | "expired"
      | "free",
    totalEarnings: u.totalEarnings,
    joinedDate: new Date(u.createdAt!).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Admin <span className="gradient-neon-text">Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage users, payouts, and platform analytics
                </p>
              </div>
              {pendingPayouts.length > 0 && (
                <Badge
                  variant="outline"
                  className="w-fit bg-primary/10 text-primary border-primary/30"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {pendingPayouts.length} Pending Payouts
                </Badge>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              subtitle={`${stats?.activeUsers || 0} active`}
              icon={Users}
              trend={{ value: 15, positive: true }}
            />
            <StatCard
              title="Monthly Revenue"
              value={`${(stats?.totalRevenue || 0).toLocaleString()} LRD`}
              icon={Wallet}
              variant="accent"
              trend={{ value: 22, positive: true }}
            />
            <StatCard
              title="Pending Payouts"
              value={`${(stats?.pendingPayouts || 0).toLocaleString()} LRD`}
              subtitle={`${pendingPayouts.length} users`}
              icon={CreditCard}
              variant="warning"
            />
            <StatCard
              title="Total Referrals"
              value={stats?.totalReferrals || 0}
              icon={TrendingUp}
              variant="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <AdminTable
                users={formattedUsers}
                onApprove={(id) => {
                  toast({
                    title: "User Action",
                    description: `Action triggered for user ${id}`,
                  });
                }}
                onBlock={(id) => {
                  toast({
                    title: "User Blocked",
                    description: `User ${id} has been blocked.`,
                    variant: "destructive",
                  });
                }}
              />
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 neon-border-cyan">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Pending Payouts
                </h3>
                {payoutsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : pendingPayouts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending payouts
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingPayouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between p-4 rounded-xl glass-strong"
                        data-testid={`payout-item-${payout.id}`}
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {payout.user
                              ? `${payout.user.firstName || ""} ${payout.user.lastName || ""}`.trim() ||
                                payout.user.email
                              : "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payout.paymentPhone}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-green-500">
                            {payout.amount.toLocaleString()} LRD
                          </span>
                          <Button
                            size="sm"
                            onClick={() => approveMutation.mutate(payout.id)}
                            disabled={approveMutation.isPending}
                            data-testid={`button-approve-payout-${payout.id}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass rounded-2xl p-6 neon-border">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Free Users</span>
                    <span className="font-display font-bold text-foreground">
                      {formattedUsers.filter((u) => u.subscriptionStatus === "free").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paying Users</span>
                    <span className="font-display font-bold text-foreground">
                      {formattedUsers.filter((u) => u.subscriptionStatus === "active").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pending Verification</span>
                    <span className="font-display font-bold text-yellow-500">
                      {formattedUsers.filter((u) => u.subscriptionStatus === "pending").length}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Referrals</span>
                      <span className="font-display font-bold text-primary">
                        {stats?.totalReferrals || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
