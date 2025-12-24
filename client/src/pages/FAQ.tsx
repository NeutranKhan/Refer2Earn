import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";

export default function FAQ() {
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Navbar onLogin={() => setShowAuthModal(true)} />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-3xl px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h1>
                        <p className="text-muted-foreground">Everything you need to know about WealthBridge.</p>
                    </motion.div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="item-1" className="glass px-6 rounded-xl border-none shadow-lg">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline">What is WealthBridge?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                WealthBridge is a dual-purpose platform designed for Liberians. It provides a Smart Finance Tracker to manage your LRD and USD, and a Referral Network that lets you earn passive income.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="glass px-6 rounded-xl border-none shadow-lg">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline">How much does it cost?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Subscription is just 500 LRD per week. This grants you full access to all tracking tools and the referral program.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="glass px-6 rounded-xl border-none shadow-lg">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline">How do I earn money?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                You earn 250 LRD for every person who signs up using your referral code and pays their first subscription. If you have 2 active referrals, your own subscription is covered!
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="glass px-6 rounded-xl border-none shadow-lg">
                            <AccordionTrigger className="text-lg font-bold hover:no-underline">How do I get paid?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                Once you have at least 3 active referrals, you can request a cash payout. Payouts are sent directly to your Lonestar Cell MTN or Orange Money account.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
            <Footer />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
}
