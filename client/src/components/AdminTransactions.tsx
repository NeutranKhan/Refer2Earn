import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    Filter,
    Download,
    Wallet,
    Loader2,
    Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface GlobalTransaction {
    id: string;
    userId: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
    user: {
        firstName?: string;
        lastName?: string;
        email: string;
    } | null;
}

export function AdminTransactions() {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const { data: transactions, isLoading } = useQuery<GlobalTransaction[]>({
        queryKey: ["/api/admin/transactions"],
        refetchOnWindowFocus: true,
    });

    const filteredTransactions = (transactions || []).filter(tx => {
        const matchesSearch =
            (tx.user?.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (tx.user?.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (tx.user?.email.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (tx.description || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "all" || tx.type === typeFilter;

        return matchesSearch && matchesType;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="font-display text-lg animate-pulse text-primary/80">Syncing global financial ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-cyan-400" />
                        Global Financial Ledger
                    </h3>
                    <p className="text-muted-foreground">Monitor and manage all system-wide financial activity.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by user or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 glass-strong w-full sm:w-64"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-40 glass-strong">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="credit">Credits</SelectItem>
                            <SelectItem value="debit">Debits</SelectItem>
                            <SelectItem value="payout">Payouts</SelectItem>
                            <SelectItem value="adjustment">Adjustments</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="glass-strong border-white/10 hidden sm:flex">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden neon-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="py-4 px-6 text-xs uppercase font-bold text-muted-foreground tracking-widest">Date & Time</th>
                                <th className="py-4 px-6 text-xs uppercase font-bold text-muted-foreground tracking-widest">User</th>
                                <th className="py-4 px-6 text-xs uppercase font-bold text-muted-foreground tracking-widest">Activity</th>
                                <th className="py-4 px-6 text-xs uppercase font-bold text-muted-foreground tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTransactions.map((tx) => (
                                <motion.tr
                                    key={tx.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                                            <div>
                                                <p className="text-sm font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                                {(tx.user?.firstName || tx.user?.email || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold truncate">
                                                    {tx.user ? `${tx.user.firstName || ""} ${tx.user.lastName || ""}`.trim() || tx.user.email : "Unknown User"}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate">{tx.user?.email || tx.userId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="text-sm">{tx.description || tx.type.toUpperCase()}</p>
                                            <Badge variant="outline" className={`text-[9px] h-4 mt-1 font-bold ${tx.type === 'credit' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                                                tx.type === 'debit' ? 'border-red-500/30 text-red-400 bg-red-500/5' :
                                                    'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'
                                                }`}>
                                                {tx.type === 'credit' ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownLeft className="w-2.5 h-2.5 mr-0.5" />}
                                                {tx.type.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <p className={`font-display font-bold text-lg ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                            {tx.type === 'debit' ? '-' : '+'}{tx.amount.toLocaleString()} <span className="text-[10px] ml-0.5">LRD</span>
                                        </p>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <Wallet className="w-12 h-12 mb-4" />
                                            <p className="text-lg font-display mb-1">No financial records found</p>
                                            <p className="text-xs">Adjustments and payouts will appear here in real-time.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
