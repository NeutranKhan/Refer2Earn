import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Clock, Ban, MoreHorizontal, ChevronLeft, ChevronRight, Trash2, HelpCircle, Users as UsersIcon, Loader2, Wallet, History, ShieldAlert, Save, LayoutDashboard, LineChart } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referralsCount: number; // For backward compatibility
  activeReferrals: number;
  totalReferrals: number;
  subscriptionStatus: "active" | "pending" | "expired" | "free" | "none";
  status: "active" | "blocked" | "restricted";
  totalEarnings: number;
  joinedDate: string;
}

interface AdminTableProps {
  users: User[];
  onApprove?: (userId: string) => void;
  onBlock?: (userId: string, currentStatus: string) => void;
  onDelete?: (userId: string) => void;
}

export function AdminTable({ users, onApprove, onBlock, onDelete }: AdminTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.referralCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      user.subscriptionStatus === statusFilter ||
      (statusFilter === "pending" && user.subscriptionStatus === "none");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    expired: {
      label: "Expired",
      icon: XCircle,
      className: "bg-red-500/10 text-red-500 border-red-500/30",
    },
    free: {
      label: "Free",
      icon: CheckCircle,
      className: "bg-primary/10 text-primary border-primary/30",
    },
    none: {
      label: "Pending",
      icon: Clock,
      className: "bg-muted text-muted-foreground border-white/10 opacity-70",
    },
  };

  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isReferralsOpen, setIsReferralsOpen] = useState(false);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [balanceType, setBalanceType] = useState("credit");
  const [overrideStatus, setOverrideStatus] = useState("active");

  const { data: referrals, isLoading: referralsLoading } = useQuery<any[]>({
    queryKey: [`/api/admin/users/${selectedUserId}/referrals`],
    enabled: !!selectedUserId && isReferralsOpen,
  });

  const { data: transactions, isLoading: historyLoading } = useQuery<any[]>({
    queryKey: [`/api/admin/users/${selectedUserId}/transactions`],
    enabled: !!selectedUserId && isHistoryOpen,
  });

  const adjustBalanceMutation = useMutation({
    mutationFn: async (data: { id: string; amount: number; type: string; description: string }) => {
      return apiRequest("POST", `/api/admin/users/${data.id}/adjust-balance`, {
        amount: data.amount,
        type: data.type,
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      setIsBalanceOpen(false);
      toast({ title: "Success", description: "Balance adjusted successfully" });
    },
  });

  const overrideSubscriptionMutation = useMutation({
    mutationFn: async (data: { id: string; status: string; endDate?: string }) => {
      return apiRequest("POST", `/api/admin/users/${data.id}/subscription`, {
        status: data.status,
        endDate: data.endDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsSubscriptionOpen(false);
      toast({ title: "Success", description: "Subscription overridden" });
    },
  });

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="glass rounded-2xl p-6 neon-border">
      {/* ... previous content ... */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            User Management
          </h3>
          <p className="text-muted-foreground">
            {filteredUsers.length} users found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-strong w-full sm:w-64"
              data-testid="input-search-users"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 glass-strong" data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Referral Code
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                Referrals
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Account
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                Earnings
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => {
              const status = statusConfig[user.subscriptionStatus as keyof typeof statusConfig] || {
                label: user.subscriptionStatus || "Unknown",
                icon: HelpCircle,
                className: "bg-gray-500/10 text-gray-500 border-gray-500/30",
              };
              const StatusIcon = status.icon;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5"
                  data-testid={`table-row-${user.id}`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-neon flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                      {user.referralCode}
                    </code>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsReferralsOpen(true);
                      }}
                      className="group flex flex-col items-start gap-1 hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-foreground group-hover:text-primary">
                          {user.activeReferrals ?? user.referralsCount} / {user.totalReferrals ?? user.referralsCount}
                        </span>
                        <UsersIcon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Active / Total</span>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className={`gap-1.5 ${status.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={(user.status || 'active') === 'active' ? 'success' : 'destructive'} className="text-[10px] px-2 py-0">
                      {(user.status || 'active').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <span className="font-display font-bold text-green-500">
                      {user.totalEarnings.toLocaleString()} LRD
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.subscriptionStatus === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onApprove?.(user.id)}
                          className="text-green-500 hover:text-green-400"
                          data-testid={`button-approve-${user.id}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onBlock?.(user.id, user.status)}
                        className={`${user.status === 'blocked' ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'}`}
                        data-testid={`button-block-${user.id}`}
                      >
                        {user.status === 'blocked' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Permanently delete this user? This cannot be undone.')) {
                            onDelete?.(user.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-500 hover:bg-red-500/10"
                        data-testid={`button-delete-${user.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-more-${user.id}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong border-white/10">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setIsReferralsOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <UsersIcon className="w-4 h-4 mr-2" />
                            View Referrals
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setIsHistoryOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <History className="w-4 h-4 mr-2" />
                            Transaction History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setBalanceType("credit");
                              setIsBalanceOpen(true);
                            }}
                            className="cursor-pointer text-cyan-400 focus:text-cyan-300"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Adjust Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setOverrideStatus(user.subscriptionStatus || "active");
                              setIsSubscriptionOpen(true);
                            }}
                            className="cursor-pointer text-primary focus:text-primary/80"
                          >
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Manual Subscription
                          </DropdownMenuItem>

                          <div className="h-px bg-white/5 my-1" />

                          <DropdownMenuItem
                            onClick={() => window.open(`/dashboard?userId=${user.id}`, '_blank')}
                            className="cursor-pointer text-blue-400 focus:text-blue-300"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            View Dashboard
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => window.open(`/tracker?userId=${user.id}`, '_blank')}
                            className="cursor-pointer text-indigo-400 focus:text-indigo-300"
                          >
                            <LineChart className="w-4 h-4 mr-2" />
                            View Tracker
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm('Permanently delete this user?')) {
                                onDelete?.(user.id);
                              }
                            }}
                            className="cursor-pointer text-red-400 focus:text-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {paginatedUsers.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10 mt-4">
            <p className="text-muted-foreground italic">No users found matching your criteria.</p>
          </div>
        )}
      </div>

      <Dialog open={isReferralsOpen} onOpenChange={setIsReferralsOpen}>
        <DialogContent className="glass-strong border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {selectedUser?.name}'s Referrals ({referrals?.length || 0})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {referralsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p>Fetching referral tree...</p>
              </div>
            ) : referrals && referrals.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {referrals.map((ref: any) => (
                  <div key={ref.id} className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {(ref.referredUser?.firstName || ref.referredUser?.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{ref.referredUser?.firstName || ref.referredUser?.email || "Unknown User"}</p>
                        <p className="text-xs text-muted-foreground">Joined: {new Date(ref.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant={ref.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">
                      {ref.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass rounded-2xl border border-dashed border-white/10">
                <p className="text-muted-foreground italic">This user hasn't referred anyone yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBalanceOpen} onOpenChange={setIsBalanceOpen}>
        <DialogContent className="glass-strong border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-cyan-400">Adjust Balance</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              adjustBalanceMutation.mutate({
                id: selectedUserId!,
                amount: Number(formData.get('amount')),
                type: balanceType,
                description: formData.get('description') as string,
              });
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <Select value={balanceType} onValueChange={setBalanceType}>
                <SelectTrigger className="glass-strong">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit (Add)</SelectItem>
                  <SelectItem value="debit">Debit (Subtract)</SelectItem>
                  <SelectItem value="adjustment">Internal Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Amount (LRD)</label>
              <Input name="amount" type="number" placeholder="500" required className="glass-strong" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Reason / Description</label>
              <Input name="description" placeholder="Referral bonus correctio" required className="glass-strong" />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsBalanceOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={adjustBalanceMutation.isPending}>
                {adjustBalanceMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Apply Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubscriptionOpen} onOpenChange={setIsSubscriptionOpen}>
        <DialogContent className="glass-strong border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-primary">Override Subscription</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              overrideSubscriptionMutation.mutate({
                id: selectedUserId!,
                status: overrideStatus,
                endDate: String(formData.get('endDate')) || undefined,
              });
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={overrideStatus} onValueChange={setOverrideStatus}>
                <SelectTrigger className="glass-strong">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Paid)</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="expired">Expired / Cancelled</SelectItem>
                  <SelectItem value="free">Complimentary / Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Expiry Date (Optional)</label>
              <Input name="endDate" type="date" className="glass-strong" />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsSubscriptionOpen(false)}>Cancel</Button>
              <Button type="submit" className="neon-glow" disabled={overrideSubscriptionMutation.isPending}>
                Update Subscription
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="glass-strong border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Transaction History: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p>Loading ledger...</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${tx.type === 'credit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {tx.type === 'credit' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tx.description || tx.type.toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`font-display font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'debit' ? '-' : ''}{tx.amount.toLocaleString()} LRD
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass rounded-2xl border border-dashed border-white/10">
                <p className="text-muted-foreground italic">No transactions recorded for this user.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
