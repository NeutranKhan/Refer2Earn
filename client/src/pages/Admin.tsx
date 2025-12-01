import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { AdminTable } from "@/components/AdminTable";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Wallet, TrendingUp, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AdminProps {
  onLogout?: () => void;
}

export function Admin({ onLogout }: AdminProps) {
  const { toast } = useToast();

  const mockUsers = [
    {
      id: "1",
      name: "Kwame Johnson",
      email: "kwame@example.com",
      phone: "+231 77 123 4567",
      referralCode: "REF-KW8X4",
      referralsCount: 5,
      subscriptionStatus: "free" as const,
      totalEarnings: 3500,
      joinedDate: "Oct 15, 2024",
    },
    {
      id: "2",
      name: "Fatou Williams",
      email: "fatou@example.com",
      phone: "+231 88 234 5678",
      referralCode: "REF-FT2M9",
      referralsCount: 2,
      subscriptionStatus: "active" as const,
      totalEarnings: 1000,
      joinedDate: "Nov 1, 2024",
    },
    {
      id: "3",
      name: "Prince Cooper",
      email: "prince@example.com",
      phone: "+231 77 345 6789",
      referralCode: "REF-PC7K3",
      referralsCount: 0,
      subscriptionStatus: "pending" as const,
      totalEarnings: 0,
      joinedDate: "Nov 25, 2024",
    },
    {
      id: "4",
      name: "Mary Weah",
      email: "mary@example.com",
      phone: "+231 88 456 7890",
      referralCode: "REF-MW4L6",
      referralsCount: 1,
      subscriptionStatus: "expired" as const,
      totalEarnings: 500,
      joinedDate: "Sep 20, 2024",
    },
    {
      id: "5",
      name: "John Doe",
      email: "john@example.com",
      phone: "+231 77 567 8901",
      referralCode: "REF-JD1N5",
      referralsCount: 8,
      subscriptionStatus: "free" as const,
      totalEarnings: 7500,
      joinedDate: "Aug 10, 2024",
    },
    {
      id: "6",
      name: "Sarah Cole",
      email: "sarah@example.com",
      phone: "+231 88 678 9012",
      referralCode: "REF-SC3P8",
      referralsCount: 3,
      subscriptionStatus: "free" as const,
      totalEarnings: 0,
      joinedDate: "Nov 15, 2024",
    },
    {
      id: "7",
      name: "David Brown",
      email: "david@example.com",
      phone: "+231 77 789 0123",
      referralCode: "REF-DB9Q2",
      referralsCount: 4,
      subscriptionStatus: "free" as const,
      totalEarnings: 500,
      joinedDate: "Oct 5, 2024",
    },
  ];

  const pendingPayouts = [
    { id: "1", userName: "Kwame Johnson", amount: 1000, phone: "+231 77 123 4567" },
    { id: "2", userName: "John Doe", amount: 2500, phone: "+231 77 567 8901" },
    { id: "3", userName: "David Brown", amount: 500, phone: "+231 77 789 0123" },
  ];

  const handleApprove = (userId: string) => {
    toast({
      title: "User Approved",
      description: `User ${userId} has been approved.`,
    });
  };

  const handleBlock = (userId: string) => {
    toast({
      title: "User Blocked",
      description: `User ${userId} has been blocked.`,
      variant: "destructive",
    });
  };

  const handleApprovePayout = (payoutId: string) => {
    toast({
      title: "Payout Approved",
      description: "The payout has been initiated via Mobile Money.",
    });
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.subscriptionStatus === "active" || u.subscriptionStatus === "free").length;
  const totalRevenue = mockUsers.filter((u) => u.subscriptionStatus === "active").length * 1500;
  const totalPayouts = pendingPayouts.reduce((acc, p) => acc + p.amount, 0);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  Admin <span className="gradient-neon-text">Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage users, payouts, and platform analytics
                </p>
              </div>
              <Badge variant="outline" className="w-fit bg-primary/10 text-primary border-primary/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {pendingPayouts.length} Pending Payouts
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={totalUsers}
              subtitle={`${activeUsers} active`}
              icon={Users}
              trend={{ value: 15, positive: true }}
            />
            <StatCard
              title="Monthly Revenue"
              value={`${totalRevenue.toLocaleString()} LRD`}
              icon={Wallet}
              variant="accent"
              trend={{ value: 22, positive: true }}
            />
            <StatCard
              title="Pending Payouts"
              value={`${totalPayouts.toLocaleString()} LRD`}
              subtitle={`${pendingPayouts.length} users`}
              icon={CreditCard}
              variant="warning"
            />
            <StatCard
              title="Total Earnings Paid"
              value="45,500 LRD"
              icon={TrendingUp}
              variant="success"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <AdminTable
                users={mockUsers}
                onApprove={handleApprove}
                onBlock={handleBlock}
              />
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 neon-border-cyan">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Pending Payouts
                </h3>
                <div className="space-y-3">
                  {pendingPayouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-4 rounded-xl glass-strong"
                      data-testid={`payout-item-${payout.id}`}
                    >
                      <div>
                        <p className="font-medium text-foreground">{payout.userName}</p>
                        <p className="text-sm text-muted-foreground">{payout.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-green-500">
                          {payout.amount.toLocaleString()} LRD
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleApprovePayout(payout.id)}
                          data-testid={`button-approve-payout-${payout.id}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 neon-glow" data-testid="button-process-all-payouts">
                  Process All Payouts
                </Button>
              </div>

              <div className="glass rounded-2xl p-6 neon-border">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Free Users</span>
                    <span className="font-display font-bold text-foreground">
                      {mockUsers.filter((u) => u.subscriptionStatus === "free").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paying Users</span>
                    <span className="font-display font-bold text-foreground">
                      {mockUsers.filter((u) => u.subscriptionStatus === "active").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pending Verification</span>
                    <span className="font-display font-bold text-yellow-500">
                      {mockUsers.filter((u) => u.subscriptionStatus === "pending").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expired Subscriptions</span>
                    <span className="font-display font-bold text-red-500">
                      {mockUsers.filter((u) => u.subscriptionStatus === "expired").length}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Referrals</span>
                      <span className="font-display font-bold text-primary">
                        {mockUsers.reduce((acc, u) => acc + u.referralsCount, 0)}
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
