import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";

export default function Contact() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-4xl font-display font-bold mb-6">Get in Touch</h1>
                            <p className="text-muted-foreground text-lg mb-8">Have questions about your account or how the referral system works? Our team is here to help.</p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-xl glass gradient-neon">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Call Us</p>
                                        <p className="text-muted-foreground">+231 77 000 0000</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-xl glass gradient-neon">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Email Support</p>
                                        <p className="text-muted-foreground">support@wealthbridge.lr</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-xl glass gradient-neon">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Office</p>
                                        <p className="text-muted-foreground">Monrovia, Liberia</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-3xl">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input placeholder="Your Name" className="glass-strong" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input placeholder="your@email.com" className="glass-strong" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input placeholder="How can we help?" className="glass-strong" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea placeholder="Type your message here..." className="glass-strong min-h-[150px]" />
                                </div>
                                <Button className="w-full neon-glow py-6 text-lg">
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
