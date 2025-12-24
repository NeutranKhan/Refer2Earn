import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";

export default function Careers() {
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const jobs = [
        { title: "Financial Analyst", type: "Full-time", location: "Monrovia", dept: "Operations" },
        { title: "Mobile Developer", type: "Contract", location: "Remote/Liberia", dept: "Engineering" },
        { title: "Community Manager", type: "Full-time", location: "Monrovia", dept: "Marketing" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isAuthenticated} onLogin={() => setShowAuthModal(true)} />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-5xl px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                        <h1 className="text-5xl font-display font-bold mb-6">Join the <span className="gradient-neon-text">Mission</span></h1>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Help us build the future of financial empowerment in Liberia. We're looking for passionate individuals to join our growing team.</p>
                    </motion.div>

                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:neon-border transition-all group"
                            >
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.dept}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">{job.type}</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="group-hover:bg-primary group-hover:text-white border-primary/50">
                                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-8 glass rounded-3xl border-primary/30 text-center">
                        <h2 className="text-2xl font-bold mb-4">Don't see a fit?</h2>
                        <p className="text-muted-foreground mb-6">We're always looking for talented people. Send your CV to careers@wealthbridge.lr</p>
                        <Button variant="link" className="text-primary font-bold">Contact Talent Acquisition</Button>
                    </div>
                </div>
            </main>
            <Footer />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
}
