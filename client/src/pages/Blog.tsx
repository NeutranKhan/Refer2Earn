import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function Blog() {
    const { isAuthenticated } = useAuth();

    const posts = [
        {
            title: "5 Tips for Managing Your Finances in LRD",
            excerpt: "Learn how to navigate currency fluctuations and make the most of your Liberian Dollars...",
            author: "System Admin",
            date: "Dec 20, 2024",
            category: " Finance"
        },
        {
            title: "How to Build a Strong Referral Network",
            excerpt: "Success on WealthBridge starts with a solid community. Here's how to grow yours effectively...",
            author: "Community Lead",
            date: "Dec 15, 2024",
            category: "Strategy"
        },
        {
            title: "The Future of Mobile Money in Liberia",
            excerpt: "Exploring the growth of digital payments and how it's empowering local entrepreneurs...",
            author: "Tech Team",
            date: "Dec 10, 2024",
            category: "Economy"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isAuthenticated} />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                        <h1 className="text-5xl font-display font-bold mb-4 text-center">WealthBridge <span className="gradient-neon-text">Insights</span></h1>
                        <p className="text-muted-foreground text-center text-lg">Financial tips, community stories, and platform updates.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <motion.article
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-3xl overflow-hidden group hover:neon-border transition-all cursor-pointer"
                            >
                                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-8">
                                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-primary font-bold text-center">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                        Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
