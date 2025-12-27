import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";

interface LeaderboardUser {
    id: string;
    username: string;
    referralCount: number;
    totalEarnings?: number;
}

export default function Leaderboard() {
    const { data: users, isLoading } = useQuery<LeaderboardUser[]>({
        queryKey: ["/api/leaderboard"],
    });

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 1: return <Medal className="h-6 w-6 text-gray-400" />;
            case 2: return <Award className="h-6 w-6 text-amber-700" />;
            default: return <span className="font-bold text-muted-foreground">#{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-white glow-text">
                        Top Referrers
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        See who's leading the pack in community growth and earnings.
                    </p>
                </div>

                <Card className="glass-card border-none max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Global Leaderboard</CardTitle>
                        <CardDescription>Rankings based on active referrals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead className="w-[100px]">Rank</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-right">Referrals</TableHead>
                                        <TableHead className="text-right">Earnings</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users?.map((user, index) => (
                                        <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center justify-center w-8">
                                                    {getRankIcon(index)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border border-white/10">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                                                        <AvatarFallback>{user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-white">
                                                            {user.username}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Member
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-primary text-lg">
                                                {user.referralCount || 0}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-400 text-lg">
                                                {user.totalEarnings ? `$${user.totalEarnings.toLocaleString()} LRD` : '0 LRD'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div >
    );
}
