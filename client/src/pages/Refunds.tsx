import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";

export default function Refunds() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-4xl px-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong p-8 md:p-12 rounded-3xl text-center">
                        <h1 className="text-4xl font-display font-bold mb-8 text-left">Refund Policy</h1>
                        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-left">
                            <p>At WealthBridge, we strive to provide the best possible service for our community. Please review our refund policy below:</p>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Subscription Refunds</h2>
                                <p>Weekly subscriptions (500 LRD) are non-refundable once activated. As the service is provided immediately upon payment, we cannot offer partial or full refunds for the remaining duration of the week.</p>
                            </section>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">Technical Issues</h2>
                                <p>If you experience a technical failure where a payment was successfully made but your subscription was not activated, please contact support immediately for manual activation or credit.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
