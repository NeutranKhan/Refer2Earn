import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Landing } from "@/pages/Landing";
import { NetworkPage } from "@/pages/NetworkPage";
import TrackerPage from "@/pages/TrackerPage";
import { Dashboard } from "@/pages/Dashboard";
import SavingsGoals from "@/pages/SavingsGoals";
import Settings from "@/pages/Settings";
import Wallet from "@/pages/Wallet";
import Leaderboard from "@/pages/Leaderboard";
import { Admin } from "@/pages/Admin";
import { About } from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Refunds from "@/pages/Refunds";
import Careers from "@/pages/Careers";
import Blog from "@/pages/Blog";
import PostDetail from "@/pages/PostDetail";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { ADMIN_PATH } from "@shared/constants";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/network" component={NetworkPage} />
        <Route path="/about" component={About} />
        <Route path="/how-it-works" component={NetworkPage} />
        <Route path="/pricing" component={NetworkPage} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/refunds" component={Refunds} />
        <Route path="/careers" component={Careers} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={PostDetail} />

        {/* Protected Routes */}
        <Route path="/dashboard">
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <Dashboard />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path="/goals">
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <SavingsGoals />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path="/leaderboard">
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <Leaderboard />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path="/settings">
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <Settings />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path="/wallet">
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <Wallet />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path="/tracker">
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <TrackerPage />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path={ADMIN_PATH}>
          {isLoading ? (
            <div>Loading...</div>
          ) : isAuthenticated ? (
            <Admin />
          ) : (
            <Landing />
          )}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

import { AuthProvider } from "@/providers/AuthProvider";

// ... Router function ...

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
