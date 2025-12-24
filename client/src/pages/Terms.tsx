import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";

export default function Terms() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isAuthenticated} />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-4xl px-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong p-8 md:p-12 rounded-3xl">
                        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
                        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                                <p>By accessing and using WealthBridge, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                            </section>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">2. Subscription & Payments</h2>
                                <p>Membership requires a weekly subscription of 500 LRD. Payments are non-refundable once processed. Failure to maintain an active subscription may result in limited access to features and referral credits.</p>
                            </section>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">3. Referral Program</h2>
                                <p>Referral credits are earned only from active, paying subscribers. Any attempt to game the system through fake accounts or fraudulent activity will result in immediate permanent suspension without payout.</p>
                            </section>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitation of Liability</h2>
                                <p>WealthBridge is a financial management tool and referral platform. We are not responsible for financial losses or decisions made based on the data tracked within the application.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
