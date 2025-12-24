import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
    const { isAuthenticated } = useAuth();

    const { data: posts, isLoading } = useQuery<BlogPost[]>({
        queryKey: ["/api/blog"],
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isAuthenticated} />
            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                        <h1 className="text-5xl font-display font-bold mb-4 text-center">WealthBridge <span className="gradient-neon-text">Insights</span></h1>
                        <p className="text-muted-foreground text-center text-lg">Financial tips, community stories, and platform updates.</p>
                    </motion.div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {posts?.map((post, i) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass rounded-3xl overflow-hidden group hover:neon-border transition-all cursor-pointer flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        {post.coverImage ? (
                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-primary/40" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 h-fit bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                                            {post.tags?.[0] || 'Updates'}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4 uppercase tracking-widest font-bold">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt!).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
                                        <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                                            Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}

                    {!isLoading && posts?.length === 0 && (
                        <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/5">
                            <p className="text-muted-foreground italic">No stories published yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

