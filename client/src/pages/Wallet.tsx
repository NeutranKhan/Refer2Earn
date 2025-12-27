
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from "lucide-react";
import { format } from "date-fns";
import { Transaction } from "@shared/schema";

interface BalanceResponse {
    balance: number;
    currency: string;
}

export default function Wallet() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawPhone, setWithdrawPhone] = useState(user?.paymentPhone || user?.phone || "");

    const { data: balanceData, isLoading: isBalanceLoading } = useQuery<BalanceResponse>({
        queryKey: ["/api/wallet/balance"],
    });

    const { data: transactions, isLoading: isTransactionsLoading } = useQuery<Transaction[]>({
        queryKey: ["/api/wallet/transactions"],
    });

    const withdrawMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/wallet/payout", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
            queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
            toast({
                title: "Withdrawal Requested",
                description: "Your payout request has been submitted successfully.",
            });
            setIsWithdrawOpen(false);
            setWithdrawAmount("");
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to request withdrawal",
                variant: "destructive",
            });
        },
    });

    const handleWithdraw = () => {
        if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid withdrawal amount.",
                variant: "destructive",
            });
            return;
        }

        withdrawMutation.mutate({
            amount: Number(withdrawAmount),
            paymentPhone: withdrawPhone,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "text-green-500";
            case "pending": return "text-yellow-500";
            case "failed": return "text-red-500";
            default: return "text-muted-foreground";
        }
    };

    const getTypeIcon = (type: string) => {
        if (type === 'payout') return <ArrowUpRight className="h-4 w-4 text-red-400" />;
        if (type === 'subscription_payment') return <ArrowUpRight className="h-4 w-4 text-red-400" />;
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white glow-text">
                            My Wallet
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your earnings and request payouts
                        </p>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="glass-card border-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Current Balance
                            </CardTitle>
                            <WalletIcon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            {isBalanceLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : (
                                <>
                                    <div className="text-3xl font-bold text-white">
                                        {balanceData?.currency} {balanceData?.balance?.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Available for withdrawal
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-none flex flex-col justify-center items-center p-6">
                        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full h-12 text-lg neon-glow" size="lg">
                                    <DollarSign className="mr-2 h-5 w-5" />
                                    Request Payout
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card border-white/10">
                                <DialogHeader>
                                    <DialogTitle>Request Withdrawal</DialogTitle>
                                    <DialogDescription>
                                        Enter the amount you wish to withdraw and your Mobile Money number.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (LRD)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            className="glass-strong"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Mobile Money Number</Label>
                                        <Input
                                            id="phone"
                                            value={withdrawPhone}
                                            onChange={(e) => setWithdrawPhone(e.target.value)}
                                            placeholder="088..."
                                            className="glass-strong"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>Cancel</Button>
                                    <Button onClick={handleWithdraw} disabled={withdrawMutation.isPending} className="neon-glow">
                                        {withdrawMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Confirm Withdrawal
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                            Minimum withdrawal: 500 LRD
                        </p>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Recent activity on your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isTransactionsLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : transactions?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No transactions found.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead className="text-muted-foreground">Date</TableHead>
                                        <TableHead className="text-muted-foreground">Type</TableHead>
                                        <TableHead className="text-muted-foreground">Description</TableHead>
                                        <TableHead className="text-muted-foreground">Status</TableHead>
                                        <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions?.map((tx) => (
                                        <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-medium text-white/80">
                                                {tx.createdAt ? format(new Date(tx.createdAt), "MMM d, yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="capitalize text-white/80 flex items-center gap-2">
                                                {getTypeIcon(tx.type)}
                                                {tx.type.replace('_', ' ')}
                                            </TableCell>
                                            <TableCell className="text-white/60 truncate max-w-[200px]" title={tx.description || ""}>
                                                {tx.description || "-"}
                                            </TableCell>
                                            <TableCell className={getStatusColor(tx.status)}>
                                                {tx.status}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${tx.amount > 0 ? "text-green-400" : "text-white"}`}>
                                                {tx.amount > 0 ? "+" : ""}{tx.amount} LRD
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
