import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign } from "lucide-react";

interface PublicPayout {
    id: string;
    username: string;
    amount: number;
    timestamp: string;
}

export function PayoutNotification() {
    const { data: payouts, isLoading } = useQuery<PublicPayout[]>({
        queryKey: ["/api/public/payouts"],
        refetchInterval: 30000, // Refresh every 30s
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!payouts || payouts.length === 0) return;

        // Show random payout every 8-12 seconds
        const interval = setInterval(() => {
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), 5000); // Hide after 5s

            // Move to next payout (cycle)
            setCurrentIndex((prev) => (prev + 1) % payouts.length);
        }, 12000);

        return () => clearInterval(interval);
    }, [payouts]);

    if (isLoading || !payouts || payouts.length === 0) return null;

    const payout = payouts[currentIndex];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-6 z-50 pointer-events-none"
                >
                    <div className="glass-card flex items-center gap-4 p-4 pr-6 rounded-full border border-primary/20 bg-background/80 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <DollarSign className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">
                                {payout.username}
                            </span>
                            <span className="text-xs text-green-300">
                                Just withdrew <span className="font-bold">{payout.amount} LRD</span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
