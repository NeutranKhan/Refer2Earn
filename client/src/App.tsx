import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Landing } from "@/pages/Landing";
import { NetworkPage } from "@/pages/NetworkPage";
import TrackerPage from "@/pages/TrackerPage";
import { Dashboard } from "@/pages/Dashboard";
import { Admin } from "@/pages/Admin";
import { About } from "@/pages/About";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/providers/AuthProvider";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/network" component={NetworkPage} />
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={NetworkPage} />
      <Route path="/pricing" component={NetworkPage} />

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

      <Route path="/tracker">
        {isLoading ? (
          <div>Loading...</div>
        ) : isAuthenticated ? (
          <TrackerPage />
        ) : (
          <Landing />
        )}
      </Route>

      <Route path="/admin">
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
