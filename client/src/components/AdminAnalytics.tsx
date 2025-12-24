import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

interface AdminAnalyticsProps {
    financeData: {
        revenueByDay: { date: string; amount: number }[];
        payoutByDay: { date: string; amount: number }[];
        subscriptionBreakdown: { name: string; value: number }[];
    };
    behaviorData: {
        signupsByDay: { date: string; count: number }[];
        activationsByDay: { date: string; count: number }[];
        referralLeaderboard: { name: string; count: number }[];
    };
}

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function AdminAnalytics({ financeData, behaviorData }: AdminAnalyticsProps) {
    return (
        <div className="space-y-8">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-6 neon-border-cyan"
                >
                    <h3 className="text-lg font-display font-bold text-foreground mb-6">Revenue Trend (LRD)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financeData.revenueByDay}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis stroke="#ffffff50" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                    itemStyle={{ color: '#06b6d4' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-6 neon-border"
                >
                    <h3 className="text-lg font-display font-bold text-foreground mb-6">Subscription Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={financeData.subscriptionBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {financeData.subscriptionBreakdown.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Behavioral Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-6 neon-border-cyan"
                >
                    <h3 className="text-lg font-display font-bold text-foreground mb-6">User Signups vs Activations</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={behaviorData.signupsByDay}>
                                <defs>
                                    <linearGradient id="colorSign" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis stroke="#ffffff50" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSign)" strokeWidth={3} name="Signups" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-6 neon-border"
                >
                    <h3 className="text-lg font-display font-bold text-foreground mb-6">Referral Leaderboard</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={behaviorData.referralLeaderboard}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                <XAxis type="number" stroke="#ffffff50" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={12} width={100} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                />
                                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
