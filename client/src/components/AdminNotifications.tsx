import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Send, Users, User, Info, AlertTriangle, CheckCircle, AlertCircle, Loader2, Clock, Search, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    userId: string | null;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "alert";
    read: boolean;
    createdAt: string;
}

interface AdminUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export function AdminNotifications() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isBroadcast, setIsBroadcast] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"info" | "success" | "warning" | "alert">("info");

    const { data: notifications, isLoading: notifLoading } = useQuery<Notification[]>({
        queryKey: ["/api/admin/notifications"],
    });

    const { data: users } = useQuery<AdminUser[]>({
        queryKey: ["/api/admin/users"],
    });

    // Filter users based on search and exclude already selected
    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const selectedIds = new Set(selectedUsers.map(u => u.id));
        return users.filter(user => {
            if (selectedIds.has(user.id)) return false;
            const searchLower = userSearch.toLowerCase();
            const name = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
            return name.includes(searchLower) || user.email.toLowerCase().includes(searchLower);
        });
    }, [users, userSearch, selectedUsers]);

    const addUser = (user: AdminUser) => {
        setSelectedUsers(prev => [...prev, user]);
        setUserSearch("");
    };

    const removeUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    const sendMutation = useMutation({
        mutationFn: async (data: any) => {
            return apiRequest("POST", "/api/admin/notifications", data);
        },
        onSuccess: async (res) => {
            const result = await res.json();
            queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
            toast({
                title: "Notification Sent!",
                description: result.message || "Your notification has been delivered.",
            });
            setTitle("");
            setMessage("");
            setType("info");
            setSelectedUsers([]);
            setIsBroadcast(false);
        },
        onError: (error: any) => {
            toast({
                title: "Failed to Send",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) {
            toast({ title: "Missing Fields", description: "Please fill in title and message.", variant: "destructive" });
            return;
        }
        if (!isBroadcast && selectedUsers.length === 0) {
            toast({ title: "No Recipients", description: "Please select at least one user or enable broadcast.", variant: "destructive" });
            return;
        }

        if (isBroadcast) {
            // Single broadcast request
            sendMutation.mutate({ title, message, type, broadcast: true });
        } else {
            // Send to each selected user
            for (const user of selectedUsers) {
                await apiRequest("POST", "/api/admin/notifications", {
                    title, message, type, broadcast: false, userId: user.id
                });
            }
            queryClient.invalidateQueries({ queryKey: ["/api/admin/notifications"] });
            toast({
                title: "Notifications Sent!",
                description: `Sent to ${selectedUsers.length} user(s).`,
            });
            setTitle("");
            setMessage("");
            setType("info");
            setSelectedUsers([]);
        }
    };

    const typeConfig = {
        info: { icon: Info, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
        success: { icon: CheckCircle, color: "text-green-400 bg-green-500/10 border-green-500/30" },
        warning: { icon: AlertTriangle, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
        alert: { icon: AlertCircle, color: "text-red-400 bg-red-500/10 border-red-500/30" },
    };

    return (
        <div className="space-y-8">
            {/* Send Notification Card */}
            <Card className="glass-strong neon-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-display">
                        <Bell className="w-6 h-6 text-primary" />
                        Send Notification
                    </CardTitle>
                    <CardDescription>
                        Compose and deliver notifications to your users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Broadcast Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
                            <div className="flex items-center gap-3">
                                <Users className={`w-5 h-5 ${isBroadcast ? "text-primary" : "text-muted-foreground"}`} />
                                <div>
                                    <p className="font-bold">Broadcast to All Users</p>
                                    <p className="text-xs text-muted-foreground">
                                        Send this notification to every user on the platform
                                    </p>
                                </div>
                            </div>
                            <Switch checked={isBroadcast} onCheckedChange={setIsBroadcast} />
                        </div>

                        {/* Multi-User Selector (if not broadcast) */}
                        {!isBroadcast && (
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Select Recipients ({selectedUsers.length} selected)
                                </Label>

                                {/* Selected Users */}
                                {selectedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-3 rounded-xl glass border border-white/5">
                                        <AnimatePresence>
                                            {selectedUsers.map(user => (
                                                <motion.div
                                                    key={user.id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="pl-3 pr-1 py-1.5 flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20"
                                                    >
                                                        <span className="truncate max-w-[150px]">
                                                            {user.firstName || user.email}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeUser(user.id)}
                                                            className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users by name or email..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className="pl-10 glass"
                                    />
                                </div>

                                {/* Search Results */}
                                {userSearch && filteredUsers.length > 0 && (
                                    <div className="max-h-[200px] overflow-y-auto rounded-xl glass border border-white/10 divide-y divide-white/5">
                                        {filteredUsers.slice(0, 10).map(user => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => addUser(user)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                        {(user.firstName || user.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {user.firstName || ""} {user.lastName || ""}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                                <Plus className="w-4 h-4 text-primary" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {userSearch && filteredUsers.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No users found matching "{userSearch}"</p>
                                )}
                            </div>
                        )}

                        {/* Type Selector */}
                        <div className="space-y-2">
                            <Label>Notification Type</Label>
                            <div className="grid grid-cols-4 gap-3">
                                {(["info", "success", "warning", "alert"] as const).map((t) => {
                                    const Icon = typeConfig[t].icon;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`flex flex-col items-center p-3 rounded-xl border transition-all ${type === t ? typeConfig[t].color + " ring-2 ring-offset-2 ring-offset-background ring-primary/50" : "glass border-white/10 hover:border-white/20"}`}
                                        >
                                            <Icon className="w-5 h-5 mb-1" />
                                            <span className="text-xs capitalize">{t}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Title & Message */}
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder="e.g. Weekly Update"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="glass"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                placeholder="Write your notification message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="glass min-h-[100px]"
                            />
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full neon-glow h-12 text-lg font-bold" disabled={sendMutation.isPending}>
                            {sendMutation.isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <Send className="w-5 h-5 mr-2" />
                            )}
                            {sendMutation.isPending ? "Sending..." : isBroadcast ? "Broadcast to All" : `Send to ${selectedUsers.length} User(s)`}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Notification History */}
            <Card className="glass-strong">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        Notification History
                    </CardTitle>
                    <CardDescription>Recently sent notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    {notifLoading ? (
                        <div className="flex items-center justify-center py-12 opacity-50">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {notifications.slice(0, 20).map((notif) => {
                                const Icon = typeConfig[notif.type]?.icon || Info;
                                return (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-start gap-3 p-4 rounded-xl border ${typeConfig[notif.type]?.color || "glass border-white/10"}`}
                                    >
                                        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-sm truncate">{notif.title}</p>
                                                <Badge variant="outline" className="text-[9px] h-4 shrink-0">
                                                    {notif.userId ? "Targeted" : "Broadcast"}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass rounded-xl border border-dashed border-white/10">
                            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-muted-foreground italic">No notifications sent yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
