import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/providers/AuthProvider";
import { apiRequest } from "@/lib/queryClient";
import { FinanceRecord, InsertFinanceRecord } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { auth } from "@/lib/firebase";

export default function TrackerPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [activeCurrency, setActiveCurrency] = useState<"LRD" | "USD">("LRD");

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const { data: records, isLoading } = useQuery<FinanceRecord[]>({
        queryKey: ["/api/finance"],
    });

    // ... (existing mutations) ...

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar isLoggedIn={true} onLogout={handleLogout} />

            <main className="flex-grow pt-20 md:pt-24 pb-12 px-4 md:px-8">
                <div className="container mx-auto max-w-7xl animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-foreground">
                                Finance Tracker
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Track your income and expenses in LRD and USD
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tabs value={activeCurrency} onValueChange={(v) => setActiveCurrency(v as "LRD" | "USD")}>
                                <TabsList>
                                    <TabsTrigger value="LRD">LRD</TabsTrigger>
                                    <TabsTrigger value="USD">USD</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <AddTransactionDialog
                                isOpen={isAddOpen}
                                onOpenChange={setIsAddOpen}
                                onSubmit={createMutation.mutate}
                                isPending={createMutation.isPending}
                                defaultCurrency={activeCurrency}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatsCard
                            title="Total Balance"
                            amount={balance}
                            currency={activeCurrency}
                            icon={DollarSign}
                            className="from-primary/20 to-primary/5 border-primary/20"
                        />
                        <StatsCard
                            title="Total Income"
                            amount={totalIncome}
                            currency={activeCurrency}
                            icon={TrendingUp}
                            className="text-green-500"
                        />
                        <StatsCard
                            title="Total Expenses"
                            amount={totalExpense}
                            currency={activeCurrency}
                            icon={TrendingDown}
                            className="text-red-500"
                        />
                    </div>

                    <Card className="glass-strong">
                        <CardHeader>
                            <CardTitle>Recent Transactions ({activeCurrency})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredRecords.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No transactions found for {activeCurrency}</p>
                                ) : (
                                    filteredRecords.map((record) => (
                                        <div
                                            key={record.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-background/40 hover:bg-background/60 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${record.type === 'income' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {record.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{record.title}</h3>
                                                    <div className="flex gap-2 text-sm text-muted-foreground">
                                                        <span>{format(new Date(record.date), "PPP")}</span>
                                                        <span>•</span>
                                                        <span>{record.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`font-bold ${record.type === 'income' ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {record.type === 'income' ? '+' : '-'} {record.amount.toLocaleString()} {record.currency}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => deleteMutation.mutate(record.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function StatsCard({ title, amount, currency, icon: Icon, className = "" }: any) {
    return (
        <Card className={`glass ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h2 className="text-2xl font-bold mt-2">
                            {amount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{currency}</span>
                        </h2>
                    </div>
                    <div className="p-3 rounded-full bg-background/20">
                        <Icon size={24} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function AddTransactionDialog({ isOpen, onOpenChange, onSubmit, isPending, defaultCurrency }: any) {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        currency: defaultCurrency,
        type: "expense",
        category: "",
        date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="neon-glow gap-2">
                    <Plus size={16} /> Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-1 bg-muted/30 rounded-lg">
                            <Button
                                type="button"
                                variant={formData.type === "income" ? "default" : "ghost"}
                                className={`w-full ${formData.type === "income" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                onClick={() => setFormData({ ...formData, type: "income" })}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Income
                            </Button>
                            <Button
                                type="button"
                                variant={formData.type === "expense" ? "default" : "ghost"}
                                className={`w-full ${formData.type === "expense" ? "bg-red-600 hover:bg-red-700" : ""}`}
                                onClick={() => setFormData({ ...formData, type: "expense" })}
                            >
                                <TrendingDown className="w-4 h-4 mr-2" />
                                Expense
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            required
                            placeholder="e.g. Salary, Rent, Lunch"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                                required
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(v) => setFormData({ ...formData, currency: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LRD">LRD</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Salary">Salary</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Transport">Transport</SelectItem>
                                <SelectItem value="Shopping">Shopping</SelectItem>
                                <SelectItem value="Bills">Bills</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full neon-glow" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Transaction"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
