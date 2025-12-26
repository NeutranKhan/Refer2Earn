import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Loader2, BookOpen, Clock, Tag } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();

    const { data: post, isLoading } = useQuery<BlogPost>({
        queryKey: [`/api/blog/${id}`],
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Insight Not Found</h2>
                <p className="text-muted-foreground mb-8">This post might have been moved or unpublished.</p>
                <Link href="/blog">
                    <Button className="neon-glow">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container mx-auto max-w-4xl px-4">
                    <Link href="/blog">
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </motion.button>
                    </Link>

                    <article>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 mb-12"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                {post.tags?.map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                        {tag}
                                    </span>
                                )) || (
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                            Update
                                        </span>
                                    )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-white/5 py-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full gradient-neon flex items-center justify-center text-white font-bold text-xs">
                                        {post.author.charAt(0)}
                                    </div>
                                    <span className="font-medium">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.createdAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {Math.ceil(post.content.split(' ').length / 200)} min read
                                </div>
                            </div>
                        </motion.div>

                        {post.coverImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="aspect-video rounded-3xl overflow-hidden glass mb-12 border border-white/5"
                            >
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="prose prose-invert prose-primary max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80"
                        >
                            <div className="whitespace-pre-wrap text-lg text-muted-foreground leading-relaxed">
                                {post.content}
                            </div>
                        </motion.div>
                    </article>

                    <footer className="mt-20 pt-10 border-t border-white/5">
                        <div className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Love what you're reading?</h3>
                                <p className="text-muted-foreground">Share this insight with your network and earn together.</p>
                            </div>
                            <Link href="/dashboard">
                                <Button className="neon-glow px-8 h-12">
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                    </footer>
                </div>
            </main>

            <Footer />
        </div>
    );
}
