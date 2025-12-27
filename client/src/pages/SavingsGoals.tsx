import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { SavingsGoal, insertSavingsGoalSchema, type InsertSavingsGoal } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Plus, Target, Wallet, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const addFundsSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
    }),
});

export default function SavingsGoals() {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await import("@/lib/firebase").then(m => m.auth.signOut());
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const { data: goals, isLoading } = useQuery<SavingsGoal[]>({
        queryKey: ["/api/savings-goals"],
    });

    const form = useForm<InsertSavingsGoal>({
        resolver: zodResolver(insertSavingsGoalSchema),
        defaultValues: {
            title: "",
            targetAmount: 0,
            currency: "LRD",
            category: "General",
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/savings-goals", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
            toast({
                title: "Goal Created",
                description: "Your savings goal has been created successfully.",
            });
            setIsCreateOpen(false);
            form.reset();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create goal",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: InsertSavingsGoal) => {
        createMutation.mutate(data);
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/savings-goals/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
            toast({
                title: "Goal Deleted",
                description: "Your savings goal has been removed.",
            });
        },
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar onLogout={handleLogout} />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-foreground">
                                Savings <span className="gradient-neon-text">Goals</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Set targets and track your progress towards financial freedom.
                            </p>
                        </div>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="neon-glow gap-2">
                                    <Plus className="w-5 h-5" />
                                    Create New Goal
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-strong border-white/10 sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Savings Goal</DialogTitle>
                                    <DialogDescription>
                                        Set a target amount and category for your new savings goal.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Goal Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Vacation, New Laptop" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="targetAmount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Target Amount</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="currency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Currency</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select currency" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="LRD">LRD</SelectItem>
                                                                <SelectItem value="USD">USD</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="General">General</SelectItem>
                                                                <SelectItem value="Travel">Travel</SelectItem>
                                                                <SelectItem value="Electronics">Electronics</SelectItem>
                                                                <SelectItem value="Emergency">Emergency Fund</SelectItem>
                                                                <SelectItem value="Education">Education</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="deadline"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Target Date (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => {
                                                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                                                    field.onChange(date);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full neon-glow" disabled={createMutation.isPending}>
                                            {createMutation.isPending ? "Creating..." : "Create Goal"}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-[200px] rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : goals?.length === 0 ? (
                        <GlassCard className="text-center py-16">
                            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-medium mb-2">No Savings Goals Yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Start your journey by creating your first savings goal today.
                            </p>
                            <Button
                                className="neon-glow"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Goal
                            </Button>
                        </GlassCard>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {goals?.map((goal) => (
                                <GoalCard key={goal.id} goal={goal} onDelete={() => deleteMutation.mutate(goal.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

function GoalCard({ goal, onDelete }: { goal: SavingsGoal; onDelete: () => void }) {
    const { toast } = useToast();
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

    const addFundsForm = useForm({
        defaultValues: { amount: "" },
        resolver: zodResolver(addFundsSchema),
    });

    const addFundsMutation = useMutation({
        mutationFn: async (data: any) => {
            const amount = Number(data.amount);
            const res = await apiRequest("PATCH", `/api/savings-goals/${goal.id}`, {
                currentAmount: goal.currentAmount + amount,
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
            toast({
                title: "Funds Added",
                description: `Successfully added funds to ${goal.title}`,
            });
            setIsAddFundsOpen(false);
            addFundsForm.reset();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: "Failed to add funds",
                variant: "destructive",
            });
        },
    });

    const onAddFunds = (data: any) => {
        addFundsMutation.mutate(data);
    };

    // Calculate weekly savings needed
    const getWeeklySavings = () => {
        if (!goal.deadline) return null;
        const today = new Date();
        const deadline = new Date(goal.deadline);
        const diffTime = Math.abs(deadline.getTime() - today.getTime());
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

        if (diffWeeks <= 0) return null;

        const remaining = goal.targetAmount - goal.currentAmount;
        if (remaining <= 0) return 0;

        return Math.ceil(remaining / diffWeeks);
    };

    const weeklySavings = getWeeklySavings();

    return (
        <GlassCard className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold font-display">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={onDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <Target className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-lg font-bold">
                            {goal.currency} {goal.currentAmount.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="text-lg font-bold">
                            {goal.currency} {goal.targetAmount.toLocaleString()}
                        </p>
                    </div>
                </div>

                {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 p-2 rounded-lg">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Target: {format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                    </div>
                )}

                {weeklySavings !== null && weeklySavings > 0 && (
                    <div className="text-xs text-primary bg-primary/10 p-2 rounded border border-primary/20">
                        Save <strong>{goal.currency} {weeklySavings.toLocaleString()}</strong> per week to reach your goal on time.
                    </div>
                )}

                <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                            <Wallet className="w-4 h-4 mr-2" />
                            Add Funds
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-strong border-white/10">
                        <DialogHeader>
                            <DialogTitle>Add Funds to {goal.title}</DialogTitle>
                            <DialogDescription>
                                How much would you like to add to this savings goal?
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...addFundsForm}>
                            <form onSubmit={addFundsForm.handleSubmit(onAddFunds)} className="space-y-4 pt-4">
                                <FormField
                                    control={addFundsForm.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount ({goal.currency})</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full neon-glow" disabled={addFundsMutation.isPending}>
                                    {addFundsMutation.isPending ? "Adding..." : "Add Funds"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </GlassCard>
    );
}
