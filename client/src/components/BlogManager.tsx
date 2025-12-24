import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Globe, Lock, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BlogPost, InsertBlogPost } from "@shared/schema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export function BlogManager() {
    const { toast } = useToast();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: posts, isLoading } = useQuery<BlogPost[]>({
        queryKey: ["/api/admin/blog"],
    });

    const saveMutation = useMutation({
        mutationFn: async (post: InsertBlogPost & { id?: string }) => {
            if (post.id) {
                return apiRequest("PATCH", `/api/admin/blog/${post.id}`, post);
            }
            return apiRequest("POST", "/api/admin/blog", post);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
            queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
            setIsModalOpen(false);
            setEditingPost(null);
            toast({ title: "Success", description: "Blog post saved successfully" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("DELETE", `/api/admin/blog/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
            toast({ title: "Deleted", description: "Post removed permanently" });
        },
    });

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-foreground">Content Factory</h3>
                <Button onClick={handleCreate} className="neon-glow">
                    <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts?.map((post) => (
                    <div key={post.id} className="glass rounded-2xl p-6 neon-border flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Badge variant={post.published ? "success" : "secondary"}>
                                    {post.published ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                                    {post.published ? "Published" : "Draft"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{new Date(post.createdAt!).toLocaleDateString()}</span>
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{post.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt || 'No excerpt provided.'}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                            <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleEdit(post)}>
                                <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this post?')) {
                                        deleteMutation.mutate(post.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}

                {posts?.length === 0 && (
                    <div className="col-span-full py-20 text-center glass rounded-2xl border-dashed border-2 border-white/10">
                        <p className="text-muted-foreground">No blog posts yet. Start creating!</p>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="glass-strong border-primary/20 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display font-bold">
                            {editingPost ? 'Refine Post' : 'Draft New Insight'}
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        className="space-y-4 pt-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data: InsertBlogPost = {
                                title: formData.get('title') as string,
                                excerpt: formData.get('excerpt') as string,
                                content: formData.get('content') as string,
                                author: 'Admin', // Default for now
                                published: formData.get('published') === 'on',
                                coverImage: formData.get('coverImage') as string,
                                tags: [],
                            };
                            saveMutation.mutate(editingPost ? { ...data, id: editingPost.id } : data);
                        }}
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Title</label>
                            <Input name="title" defaultValue={editingPost?.title} className="glass-strong" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Cover Image URL</label>
                            <Input name="coverImage" defaultValue={editingPost?.coverImage || ''} placeholder="https://..." className="glass-strong" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Excerpt (Brief summary)</label>
                            <Input name="excerpt" defaultValue={editingPost?.excerpt || ''} className="glass-strong" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Content (Markdown supported)</label>
                            <textarea
                                name="content"
                                defaultValue={editingPost?.content}
                                className="w-full min-h-[200px] rounded-xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="published" defaultChecked={editingPost?.published} id="published-check" />
                            <label htmlFor="published-check" className="text-sm font-medium text-foreground">Publish immediately</label>
                        </div>

                        <DialogFooter className="pt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="neon-glow" disabled={saveMutation.isPending}>
                                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                {editingPost ? 'Update Post' : 'Create Post'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
