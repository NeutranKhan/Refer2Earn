import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, InsertUser } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { User as UserIcon, Shield, CreditCard, Save, Loader2 } from "lucide-react";

// Schema for profile update
const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    bio: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    publicUsername: z.string().optional(),
});

const billingSchema = z.object({
    paymentPhone: z.string().min(1, "Payment phone number is required"),
});

export default function Settings() {
    const { user: currentUser } = useAuth();
    const { toast } = useToast();

    // Fetch latest user data
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ["/api/auth/user"],
        initialData: currentUser || undefined,
    });

    // Logout Helper
    const handleLogout = async () => {
        try {
            await import("@/lib/firebase").then(m => m.auth.signOut());
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar onLogout={handleLogout} />
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-foreground">
                            Account <span className="gradient-neon-text">Settings</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Manage your profile, security, and billing preferences.
                        </p>
                    </div>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 glass-strong border-white/10 mb-8">
                            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
                                <UserIcon className="w-4 h-4 mr-2" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="data-[state=active]:bg-primary/20">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Billing
                            </TabsTrigger>
                            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
                                <Shield className="w-4 h-4 mr-2" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <ProfileForm user={user} />
                        </TabsContent>

                        <TabsContent value="billing">
                            <BillingForm user={user} />
                        </TabsContent>

                        <TabsContent value="security">
                            <SecuritySection user={user} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ProfileForm({ user }: { user: User }) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            bio: user.bio || "",
            phone: user.phone || "",
            dateOfBirth: user.dateOfBirth || "",
            publicUsername: user.publicUsername || "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof profileSchema>) => {
            const res = await apiRequest("PATCH", "/api/users/profile", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            toast({ // Use the hook toast, not global if possible, or global is fine
                title: "Profile Updated",
                description: "Your profile details have been saved.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive",
            });
        },
    });

    function onSubmit(data: z.infer<typeof profileSchema>) {
        mutation.mutate(data);
    }

    return (
        <GlassCard>
            <div className="mb-6">
                <h3 className="text-xl font-bold font-display">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Update your public profile details.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="publicUsername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Public Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username (for leaderboard)" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This name will be shown on the leaderboard instead of your real name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little about yourself..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This will be displayed on your profile if you appear on leaderboards.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-2">
                        <Button type="submit" className="neon-glow" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </GlassCard>
    );
}

function BillingForm({ user }: { user: User }) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof billingSchema>>({
        resolver: zodResolver(billingSchema),
        defaultValues: {
            paymentPhone: user.paymentPhone || user.phone || "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof billingSchema>) => {
            const res = await apiRequest("PATCH", "/api/users/profile", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            toast({
                title: "Billing Updated",
                description: "Your payment preferences have been saved.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update billing info.",
                variant: "destructive",
            });
        },
    });

    function onSubmit(data: z.infer<typeof billingSchema>) {
        mutation.mutate(data);
    }

    return (
        <GlassCard>
            <div className="mb-6">
                <h3 className="text-xl font-bold font-display">Billing Preferences</h3>
                <p className="text-sm text-muted-foreground">Manage your payout and payment details.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="paymentPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Default Mobile Money Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="088..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This number will be pre-filled when you request payouts or pay subscriptions.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="pt-2">
                        <Button type="submit" className="neon-glow" disabled={mutation.isPending}>
                            {mutation.isPending ? "Saving..." : "Save Preferences"}
                        </Button>
                    </div>
                </form>
            </Form>
        </GlassCard>
    );
}

function SecuritySection({ user }: { user: User }) {
    const { toast } = useToast();
    const [notifEnabled, setNotifEnabled] = useState(user.notificationsEnabled ?? true);

    const mutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            const res = await apiRequest("PATCH", "/api/users/profile", { notificationsEnabled: enabled });
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            toast({
                title: "Settings Updated",
                description: `Notifications ${data.notificationsEnabled ? "enabled" : "disabled"}.`,
            });
            setNotifEnabled(data.notificationsEnabled);
        }
    });

    const toggleNotifications = () => {
        mutation.mutate(!notifEnabled);
    }

    return (
        <GlassCard>
            <div className="mb-6">
                <h3 className="text-xl font-bold font-display">Security & Preferences</h3>
                <p className="text-sm text-muted-foreground">Manage password, notifications, and verification.</p>
            </div>

            <div className="space-y-6">
                <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-foreground">Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive updates about earnings and referrals.</p>
                    </div>
                    <Button
                        variant={notifEnabled ? "default" : "outline"}
                        className={notifEnabled ? "bg-green-600 hover:bg-green-700 neon-glow" : ""}
                        onClick={toggleNotifications}
                        disabled={mutation.isPending}
                    >
                        {notifEnabled ? "Enabled" : "Disabled"}
                    </Button>
                </div>

            </div>

            <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-foreground">Password</h4>
                    <p className="text-sm text-muted-foreground">Change your account password via email provider.</p>
                </div>
                <Button variant="outline" disabled title="Use Firebase Auth UI">Change</Button>
            </div>

            <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" disabled>Coming Soon</Button>
            </div>
        </GlassCard >
    );
}
