import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { AdminTable } from "@/components/AdminTable";
import { AdminAnalytics } from "@/components/AdminAnalytics";
import { BlogManager } from "@/components/BlogManager";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Wallet, TrendingUp, CreditCard,
  AlertTriangle, CheckCircle, Loader2,
  BarChart3, LayoutDashboard, FileText,
  Activity, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Payout, User } from "@shared/schema";
import { auth } from "@/lib/firebase";

interface AdminUser extends User {
  referralsCount: number;
  subscriptionStatus: "active" | "pending" | "expired" | "free";
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
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  const isAdminUser = Boolean(isAuthenticated && user?.isAdmin);

  // Queries
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

  const { data: financeAnalytics } = useQuery<any>({
    queryKey: ["/api/admin/analytics/finance"],
    enabled: isAdminUser,
  });

  const { data: behaviorAnalytics } = useQuery<any>({
    queryKey: ["/api/admin/analytics/behavior"],
    enabled: isAdminUser,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (payoutId: string) => {
      return apiRequest("POST", `/api/admin/payouts/${payoutId}/approve`);
    },
    onSuccess: () => {
      toast({ title: "Approved", description: "Payout ready for processing." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payouts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (payoutId: string) => {
      return apiRequest("POST", `/api/admin/payouts/${payoutId}/complete`);
    },
    onSuccess: () => {
      toast({ title: "Completed", description: "Payout marked as finished." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payouts/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics/finance"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/admin/users/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({ title: "User Updated", description: "Status changed successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      toast({ title: "User Deleted", description: "Account removed from platform." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

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
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Access Denied</h2>
          <Button className="mt-6" onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const formattedUsers = users.map((u) => ({
    id: u.id,
    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email || "Unknown",
    email: u.email || "No Email",
    phone: u.phone || "N/A",
    referralCode: u.referralCode,
    referralsCount: u.referralsCount,
    subscriptionStatus: u.subscriptionStatus,
    status: u.status,
    totalEarnings: u.totalEarnings,
    joinedDate: new Date(u.createdAt!).toLocaleDateString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={true} isAdmin={true} onLogout={() => auth.signOut().then(() => window.location.href = "/")} />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
                Platform <span className="gradient-neon-text">Command Center</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Central hub for users, finances, and growth.</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2 border-primary/20 bg-primary/5 text-primary">
                <Activity className="w-4 h-4 mr-2" />
                System Operational
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
            <TabsList className="glass-strong p-1 rounded-xl border-white/5 inline-flex w-full md:w-auto h-auto scrollbar-hide overflow-x-auto">
              <TabsTrigger value="overview" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" /> User Base
              </TabsTrigger>
              <TabsTrigger value="finance" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <Wallet className="w-4 h-4 mr-2" /> Revenue
              </TabsTrigger>
              <TabsTrigger value="analytics" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" /> Insights
              </TabsTrigger>
              <TabsTrigger value="blog" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" /> Content
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="overview" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} trend={{ value: 12, positive: true }} />
                    <StatCard title="Total Revenue" value={`${(stats?.totalRevenue || 0).toLocaleString()} LRD`} icon={Wallet} variant="accent" />
                    <StatCard title="Pending Payouts" value={`${(stats?.pendingPayouts || 0).toLocaleString()} LRD`} icon={CreditCard} variant="warning" />
                    <StatCard title="Total Network" value={stats?.totalReferrals || 0} icon={TrendingUp} variant="success" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <AdminTable
                        users={formattedUsers.slice(0, 5)}
                        onApprove={(id) => approveMutation.mutate(id)}
                        onBlock={(id, status) => statusMutation.mutate({ id, status: status === 'blocked' ? 'active' : 'blocked' })}
                        onDelete={(id) => deleteUserMutation.mutate(id)}
                      />
                    </div>
                    <div className="glass rounded-2xl p-6 neon-border-cyan flex flex-col justify-center text-center">
                      <h3 className="text-xl font-bold mb-4">Quick Insights</h3>
                      <p className="text-muted-foreground mb-6">User growth is up 12% this week. Payout processing is current.</p>
                      <Button variant="outline" className="border-primary/50" onClick={() => setActiveTab('analytics')}>
                        View Full Reports
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <AdminTable
                    users={formattedUsers}
                    onBlock={(id, status) => statusMutation.mutate({ id, status: status === 'blocked' ? 'active' : 'blocked' })}
                    onDelete={(id) => deleteUserMutation.mutate(id)}
                  />
                </TabsContent>

                <TabsContent value="finance" className="space-y-8">
                  {financeAnalytics && <AdminAnalytics financeData={financeAnalytics} behaviorData={behaviorAnalytics} />}

                  <div className="glass rounded-2xl p-6 neon-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-yellow-500" />
                      Pending Payout Requests
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingPayouts.map(payout => (
                        <div key={payout.id} className="p-4 rounded-xl glass-strong border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="font-bold">{payout.user?.firstName || payout.user?.email}</p>
                            <p className="text-sm text-muted-foreground">{payout.paymentPhone} • {payout.paymentProvider}</p>
                          </div>
                          <div className="text-right flex flex-col gap-2">
                            <p className="font-display font-bold text-green-500">{payout.amount} LRD</p>
                            {payout.status === 'pending' ? (
                              <Button size="sm" onClick={() => approveMutation.mutate(payout.id)} disabled={approveMutation.isPending}>
                                Approve
                              </Button>
                            ) : (
                              <Button size="sm" variant="success" onClick={() => completeMutation.mutate(payout.id)} disabled={completeMutation.isPending}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {pendingPayouts.length === 0 && <p className="text-muted-foreground col-span-full py-8 text-center italic">All payouts are cleared.</p>}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics">
                  {financeAnalytics && behaviorAnalytics ? (
                    <AdminAnalytics financeData={financeAnalytics} behaviorData={behaviorAnalytics} />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 opacity-50">
                      <BarChart3 className="w-12 h-12 mb-4 animate-pulse" />
                      <p>Crunching system numbers...</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="blog">
                  <BlogManager />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

