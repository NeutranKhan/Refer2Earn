import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, CheckCircle, Clock, XCircle } from "lucide-react";

interface Referral {
  id: string;
  name: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  joinedDate: string;
  earnings: number;
}

interface ReferralListProps {
  referrals: Referral[];
}

export function ReferralList({ referrals }: ReferralListProps) {
  const statusConfig = {
    active: {
      label: "Active",
      icon: CheckCircle,
      className: "bg-green-500/10 text-green-500 border-green-500/30",
    },
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    },
    inactive: {
      label: "Inactive",
      icon: XCircle,
      className: "bg-red-500/10 text-red-500 border-red-500/30",
    },
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 neon-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Your Referrals
          </h3>
          <p className="text-muted-foreground mt-1">
            {referrals.filter((r) => r.status === "active").length} active referrals
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {referrals.length} Total
        </Badge>
      </div>

      <div className="space-y-3">
        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No referrals yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Share your code to start earning!
            </p>
          </div>
        ) : (
          referrals.map((referral, index) => {
            const status = statusConfig[referral.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass-strong"
                data-testid={`referral-item-${referral.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-neon flex items-center justify-center text-white font-display font-bold text-lg">
                    {referral.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.phone}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined {referral.joinedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className={`font-display font-bold ${referral.status === 'active' ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {referral.status === 'active' ? `+${referral.earnings.toLocaleString()} LRD` : '---'}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`gap-1.5 ${status.className}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
