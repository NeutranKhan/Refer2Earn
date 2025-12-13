import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Landing } from "@/pages/Landing";
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
      <Route path="/about" component={About} />
      <Route path="/how-it-works" component={Landing} />
      <Route path="/pricing" component={Landing} />

      {isLoading ? (
        <Route path="/dashboard" component={() => <div>Loading...</div>} />
      ) : isAuthenticated ? (
        <>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
        </>
      ) : (
        <>
          <Route path="/dashboard" component={() => { window.location.href = "/"; return null; }} />
          <Route path="/admin" component={() => { window.location.href = "/"; return null; }} />
        </>
      )}

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
