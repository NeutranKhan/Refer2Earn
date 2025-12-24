import { useState } from "react";
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
import { Search, CheckCircle, XCircle, Clock, Ban, MoreHorizontal, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referralsCount: number;
  subscriptionStatus: "active" | "pending" | "expired" | "free";
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.referralCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.subscriptionStatus === statusFilter;

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
  };

  return (
    <div className="glass rounded-2xl p-6 neon-border">
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
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
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
              const status = statusConfig[user.subscriptionStatus];
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
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <span className="font-display font-bold text-foreground">
                      {user.referralsCount}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className={`gap-1.5 ${status.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'destructive'} className="text-[10px] px-2 py-0">
                      {user.status.toUpperCase()}
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
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid={`button-more-${user.id}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
