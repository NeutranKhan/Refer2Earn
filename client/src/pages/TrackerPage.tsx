import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PaymentCard } from "@/components/PaymentCard";
import { apiRequest } from "@/lib/queryClient";
import { FinanceRecord, InsertFinanceRecord } from "@shared/schema";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Filter, PieChart as PieIcon, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { auth } from "@/lib/firebase";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];
const CATEGORIES = ["Salary", "Business", "Food", "Transport", "Shopping", "Bills", "Other"];

export default function TrackerPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [activeCurrency, setActiveCurrency] = useState<"LRD" | "USD">("LRD");
    const [dateRange, setDateRange] = useState<"7days" | "30days" | "all">("30days");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const { user: currentUser } = useAuth();

    const searchParams = new URLSearchParams(window.location.search);
    const targetUserId = searchParams.get("userId");
    const isViewMode = Boolean(targetUserId && currentUser?.isAdmin);

    // Fetch target user info if in view mode
    const { data: targetUser } = useQuery<any>({
        queryKey: [`/api/admin/users/${targetUserId}/profile`],
        enabled: isViewMode,
    });

    const displayUser = isViewMode ? targetUser : currentUser;
    const isSubscribed = displayUser?.subscription?.status === 'active';

    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const { data: records, isLoading, isError, error } = useQuery<FinanceRecord[]>({
        queryKey: [isViewMode ? `/api/admin/users/${targetUserId}/finance-records` : "/api/finance"],
    });

    const createMutation = useMutation({
        mutationFn: async (record: InsertFinanceRecord) => {
            const res = await apiRequest("POST", "/api/finance", record);
            const data = await res.json();
            if (res.status === 400 && data.message === "Invalid record data") {
                throw new Error("Invalid record data");
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/finance"] });
            setIsAddOpen(false);
            toast({
                title: "Transaction added",
                description: "Your transaction has been recorded successfully.",
            });
        },
        onError: (error) => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to add transaction. Please try again.",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/finance/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/finance"] });
            toast({
                title: "Transaction deleted",
                description: "Transaction removed successfully.",
            });
        },
        onError: (error) => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete transaction.",
                variant: "destructive",
            });
        },
    });

    // Filtering Logic
    const filteredRecords = useMemo(() => {
        if (!records) return [];
        let result = records.filter(r => r.currency === activeCurrency);

        // Date Filter
        const now = new Date();
        if (dateRange === "7days") {
            const limit = subDays(now, 7);
            result = result.filter(r => isAfter(parseISO(r.date.toString()), limit));
        } else if (dateRange === "30days") {
            const limit = subDays(now, 30);
            result = result.filter(r => isAfter(parseISO(r.date.toString()), limit));
        }

        // Category Filter
        if (categoryFilter !== "all") {
            result = result.filter(r => r.category === categoryFilter);
        }

        return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [records, activeCurrency, dateRange, categoryFilter]);

    // Derived Stats
    const totalIncome = filteredRecords
        .filter(r => r.type === "income")
        .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalExpense = filteredRecords
        .filter(r => r.type === "expense")
        .reduce((sum, r) => sum + Number(r.amount), 0);

    const balance = totalIncome - totalExpense;

    // Chart Data Preparation
    const categoryData = useMemo(() => {
        const expenseRecords = filteredRecords.filter(r => r.type === "expense");
        const aggregation: Record<string, number> = {};
        expenseRecords.forEach(r => {
            aggregation[r.category] = (aggregation[r.category] || 0) + Number(r.amount);
        });
        return Object.entries(aggregation).map(([name, value]) => ({ name, value }));
    }, [filteredRecords]);

    const incomeVsExpenseData = [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense }
    ];

    if (isLoading) {
        return <div className="p-8 text-center bg-background min-h-screen text-foreground">Loading tracker...</div>;
    }

    if (isError) {
        return (
            <div className="p-8 text-center text-destructive bg-background min-h-screen">
                <h2 className="text-xl font-bold">Error Loading Tracker</h2>
                <p>{error?.message}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar onLogout={handleLogout} />

            <main className="flex-grow pt-20 md:pt-24 pb-12 px-4 md:px-8">
                <div className="container mx-auto max-w-7xl animate-in fade-in duration-500">

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-display font-bold text-foreground">
                                Finance Tracker
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {isViewMode ? `Viewing perspective of ${displayUser?.firstName || 'User'}` : "Manage your wealth with advanced analytics"}
                            </p>
                            {isViewMode && (
                                <Badge variant="outline" className="mt-2 text-[10px] h-5 border-primary/50 text-primary bg-primary/5 font-bold uppercase tracking-widest">
                                    Admin View Mode (Read Only)
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <Tabs value={activeCurrency} onValueChange={(v) => setActiveCurrency(v as "LRD" | "USD")} className="w-auto">
                                <TabsList>
                                    <TabsTrigger value="LRD">LRD</TabsTrigger>
                                    <TabsTrigger value="USD">USD</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                                <SelectTrigger className="w-[120px] glass">
                                    <SelectValue placeholder="Date Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7days">Last 7 Days</SelectItem>
                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                    <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[140px] glass">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            {!isViewMode && (
                                <AddTransactionDialog
                                    isOpen={isAddOpen}
                                    onOpenChange={setIsAddOpen}
                                    onSubmit={createMutation.mutate}
                                    isPending={createMutation.isPending}
                                    defaultCurrency={activeCurrency}
                                />
                            )}
                        </div>
                    </div>

                    {/* Stats Overview */}
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
                            className="text-green-500 bg-green-500/5 border-green-500/10"
                        />
                        <StatsCard
                            title="Total Expenses"
                            amount={totalExpense}
                            currency={activeCurrency}
                            icon={TrendingDown}
                            className="text-red-500 bg-red-500/5 border-red-500/10"
                        />
                    </div>

                    {/* Charts Section */}
                    {filteredRecords.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Expense Breakdown */}
                            <Card className="glass-strong">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieIcon className="w-5 h-5 text-primary" />
                                        Expense Breakdown
                                    </CardTitle>
                                    <CardDescription>Distribution by category</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    {categoryData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value: number) => `${activeCurrency} ${value.toLocaleString()}`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            No expenses recorded
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Income vs Expense */}
                            <Card className="glass-strong">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart2 className="w-5 h-5 text-primary" />
                                        Cash Flow
                                    </CardTitle>
                                    <CardDescription>Income vs Expenses</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={incomeVsExpenseData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                            <RechartsTooltip
                                                formatter={(value: number) => `${activeCurrency} ${value.toLocaleString()}`}
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {incomeVsExpenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#22c55e' : '#ef4444'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Transactions List */}
                    <Card className="glass-strong">
                        <CardHeader>
                            <CardTitle>Transactions History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredRecords.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-12">
                                        No transactions found for this period.
                                    </p>
                                ) : (
                                    filteredRecords.map((record) => (
                                        <div
                                            key={record.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-background/40 hover:bg-background/60 transition-all border border-transparent hover:border-primary/10 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${record.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {record.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{record.title}</h3>
                                                    <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                                                        <span className="bg-primary/5 px-2 py-0.5 rounded text-primary">{record.category}</span>
                                                        <span>•</span>
                                                        <span>{format(new Date(record.date), "PPP")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`font-bold text-lg ${record.type === 'income' ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {record.type === 'income' ? '+' : '-'} {record.amount.toLocaleString()} {record.currency}
                                                </span>
                                                {!isViewMode && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                                        onClick={() => deleteMutation.mutate(record.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
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

            <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogContent className="glass-strong border-primary/20 sm:max-w-md p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-xl font-display font-bold">
                            Pay Subscription
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 pt-4">
                        <PaymentCard
                            onPaymentComplete={() => setShowPayment(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatsCard({ title, amount, currency, icon: Icon, className = "" }: any) {
    return (
        <Card className={`glass border-none shadow-lg ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h2 className="text-3xl font-bold mt-2 font-display">
                            {amount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{currency}</span>
                        </h2>
                    </div>
                    <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-sm">
                        <Icon size={24} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function AddTransactionDialog({ isOpen, onOpenChange, onSubmit, isPending, defaultCurrency }: any) {
    const initialData = {
        title: "",
        amount: "",
        currency: defaultCurrency,
        type: "expense" as "income" | "expense",
        category: "",
        date: new Date().toISOString().split('T')[0],
    };

    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialData);
        }
    }, [isOpen]);

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
                <Button className="neon-glow gap-2 shadow-neon active:scale-95 transition-transform">
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Transaction</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong sm:max-w-md border-primary/20">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-1 bg-muted/30 rounded-lg">
                            <Button
                                type="button"
                                variant={formData.type === "income" ? "default" : "ghost"}
                                className={`w-full rounded-md transition-all ${formData.type === "income" ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" : "hover:bg-white/5"}`}
                                onClick={() => setFormData({ ...formData, type: "income" })}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Income
                            </Button>
                            <Button
                                type="button"
                                variant={formData.type === "expense" ? "default" : "ghost"}
                                className={`w-full rounded-md transition-all ${formData.type === "expense" ? "bg-red-600 hover:bg-red-700 text-white shadow-lg" : "hover:bg-white/5"}`}
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
                            className="glass"
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
                                className="glass"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(v) => setFormData({ ...formData, currency: v })}
                            >
                                <SelectTrigger className="glass">
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
                            <SelectTrigger className="glass">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                            className="glass"
                        />
                    </div>

                    <Button type="submit" className="w-full neon-glow font-bold text-lg h-12" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Transaction"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
