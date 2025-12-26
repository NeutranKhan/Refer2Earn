import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bell, Info, CheckCircle, AlertTriangle, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function NotificationDropdown() {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ["/api/notifications"],
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("PATCH", `/api/notifications/${id}/read`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        },
    });

    const clearMutation = useMutation({
        mutationFn: async () => {
            return apiRequest("DELETE", "/api/notifications/clear", {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        },
    });

    const unreadCount = notifications?.filter((n) => !n.read).length || 0;

    const typeConfig = {
        info: { icon: Info, color: "text-blue-400" },
        success: { icon: CheckCircle, color: "text-green-400" },
        warning: { icon: AlertTriangle, color: "text-yellow-400" },
        alert: { icon: AlertCircle, color: "text-red-400" },
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 text-[10px] bg-red-500 hover:bg-red-500 text-white font-bold animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-strong border-white/10 p-0">
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="font-display font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <p className="text-[10px] text-muted-foreground">{unreadCount} unread</p>
                        )}
                    </div>
                    {notifications && notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => clearMutation.mutate()}
                            disabled={clearMutation.isPending}
                        >
                            {clearMutation.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <><Trash2 className="w-3 h-3 mr-1" /> Clear</>)}
                        </Button>
                    )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <AnimatePresence>
                            {notifications.slice(0, 10).map((notif) => {
                                const Icon = typeConfig[notif.type]?.icon || Info;
                                const color = typeConfig[notif.type]?.color || "text-muted-foreground";
                                return (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => {
                                            if (!notif.read) {
                                                markReadMutation.mutate(notif.id);
                                            }
                                        }}
                                        className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!notif.read ? "bg-primary/5" : ""}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-sm font-medium truncate ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    ) : (
                        <div className="py-8 text-center">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
