import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, DollarSign, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { PayoutNotification } from "@/components/PayoutNotification";

export function Landing() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [_location, setLocation] = useLocation();

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass neon-border mb-8 hover:bg-white/5 transition-colors cursor-default"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium">Live: WealthBridge Tracker</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
                  Your Path to <br />
                  <span className="gradient-neon-text">Financial Freedom</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  WealthBridge empowers you to master your LRD & USD finances while earing passive income.
                  <span className="block mt-4 text-primary font-semibold text-2xl">
                    Start today for just 500 LRD/week.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <Button size="lg" className="neon-glow text-lg h-14 px-8 rounded-full" onClick={() => setLocation("/tracker")}>
                      Go to Dashboard <ArrowRight className="ml-2" />
                    </Button>
                  ) : (
                    <Button size="lg" className="neon-glow text-lg h-14 px-8 rounded-full" onClick={handleLogin}>
                      Start Your Journey <ArrowRight className="ml-2" />
                    </Button>
                  )}
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full glass hover:bg-white/10" onClick={() => setLocation("/network")}>
                    Explore Network
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                {/* Animated Finance Card */}
                <div className="relative z-10 glass-strong rounded-[2.5rem] p-8 border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl animate-float">
                  {/* Card Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-20 -z-10" />

                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-1">Total Balance</p>
                      <h3 className="text-4xl font-display font-bold text-white">15,450 <span className="text-lg text-gray-400">LRD</span></h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/5">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Weekly Income", amount: "+25,000", type: "income", date: "Today" },
                      { title: "Grocery Shopping", amount: "-3,500", type: "expense", date: "Yesterday" },
                      { title: "Transport", amount: "-500", type: "expense", date: "Yesterday" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.2) }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {item.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${item.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                          {item.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 p-4 rounded-2xl glass-strong bg-black/60 border border-green-500/30 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-bold text-green-400">+25% Growth</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Why Choose WealthBridge?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The only platform in Liberia that combines smart financial tracking with powerful earning opportunities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={DollarSign}
                title="Dual Currency Support"
                description="Seamlessly handle Liberian Dollars (LRD) and US Dollars (USD) in one unified dashboard."
                delay={0}
              />
              <FeatureCard
                icon={PieChart}
                title="Smart Analytics"
                description="Visualize your spending habits with beautiful charts and gain insights to save more."
                delay={0.2}
              />
              <FeatureCard
                icon={Wallet}
                title="Integrated Earnings"
                description="Pay your subscription automatically with earnings from our referral network."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-black/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Start in 3 Simple Steps
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20" />

              {[
                { step: "1", title: "Sign Up", desc: "Create your secure account. Subscription is just 500 LRD/week." },
                { step: "2", title: "Log Finances", desc: "Track daily income & expenses in real-time." },
                { step: "3", title: "Earn & Grow", desc: "Invite friends to cover your costs and build wealth." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center relative z-10"
                >
                  <div className="w-24 h-24 mx-auto glass-strong rounded-full flex items-center justify-center border-4 border-background mb-8 shadow-xl">
                    <span className="text-3xl font-display font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed px-4">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Network Marketing Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-primary/20" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto glass-strong rounded-[3rem] p-12 md:p-16 border border-white/10"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">
                Turn Your Network into Net Worth
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join our Referral Network and earn <span className="text-white font-bold">250 LRD</span> for every active member you invite.
                Pay for your tools, then pay yourself.
              </p>
              <Button size="lg" className="h-16 px-10 text-lg rounded-full neon-glow" onClick={() => setLocation("/network")}>
                <DollarSign className="w-5 h-5 mr-2" /> Start Earning Now
              </Button>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setLocation("/tracker")}
      />
      <PayoutNotification />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 rounded-3xl glass hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 border border-white/5"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </motion.div>
  );
}
