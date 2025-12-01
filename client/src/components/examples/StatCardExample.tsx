import { StatCard } from "../StatCard";
import { Users, Wallet, TrendingUp, CheckCircle } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Referrals"
        value={5}
        subtitle="2 pending activation"
        icon={Users}
        trend={{ value: 25, positive: true }}
      />
      <StatCard
        title="Monthly Credits"
        value="2,500 LRD"
        icon={Wallet}
        variant="accent"
      />
      <StatCard
        title="Total Earnings"
        value="15,000 LRD"
        icon={TrendingUp}
        variant="success"
        trend={{ value: 40, positive: true }}
      />
      <StatCard
        title="Subscription Status"
        value="Active"
        subtitle="Free (3+ referrals)"
        icon={CheckCircle}
        variant="success"
      />
    </div>
  );
}
