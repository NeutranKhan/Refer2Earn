import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Send, Users, User, Info, AlertTriangle, CheckCircle, AlertCircle, Loader2, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
    const [isBroadcast, setIsBroadcast] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"info" | "success" | "warning" | "alert">("info");

    const { data: notifications, isLoading: notifLoading } = useQuery<Notification[]>({
        queryKey: ["/api/admin/notifications"],
    });

    const { data: users } = useQuery<AdminUser[]>({
        queryKey: ["/api/admin/users"],
    });

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
            setSelectedUserId("");
        },
        onError: (error: any) => {
            toast({
                title: "Failed to Send",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) {
            toast({ title: "Missing Fields", description: "Please fill in title and message.", variant: "destructive" });
            return;
        }
        sendMutation.mutate({
            title,
            message,
            type,
            broadcast: isBroadcast,
            userId: isBroadcast ? null : selectedUserId,
        });
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
                        {/* Target Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
                            <div className="flex items-center gap-3">
                                {isBroadcast ? <Users className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-cyan-400" />}
                                <div>
                                    <p className="font-bold">{isBroadcast ? "Broadcast to All" : "Target Specific User"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {isBroadcast ? "Every user will receive this notification" : "Only the selected user will see this"}
                                    </p>
                                </div>
                            </div>
                            <Switch checked={!isBroadcast} onCheckedChange={(checked) => setIsBroadcast(!checked)} />
                        </div>

                        {/* User Selector (if targeted) */}
                        {!isBroadcast && (
                            <div className="space-y-2">
                                <Label>Select User</Label>
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger className="glass">
                                        <SelectValue placeholder="Choose a user..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.firstName || user.email} {user.lastName || ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            {sendMutation.isPending ? "Sending..." : "Send Notification"}
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
