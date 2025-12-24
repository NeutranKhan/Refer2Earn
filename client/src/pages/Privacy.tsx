import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";

export default function Privacy() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isAuthenticated} />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-4xl px-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong p-8 md:p-12 rounded-3xl">
                        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
                        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">1. Data Collection</h2>
                                <p>We collect basic information such as your name, phone number, and financial records you choose to input. This data is used solely to provide and improve our services.</p>
                            </section>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">2. Financial Data Security</h2>
                                <p>Your personal finance data is encrypted and stored securely. We do not share your individual spending habits or income details with third parties for marketing purposes.</p>
                            </section>
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">3. Mobile Money Information</h2>
                                <p>We process phone numbers for payment purposes through regulated mobile money providers (Lonestar Cell MTN and Orange Money). We do not store PINs or other sensitive security credentials.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
