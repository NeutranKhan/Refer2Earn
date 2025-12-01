import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Landing } from "@/pages/Landing";
import { Dashboard } from "@/pages/Dashboard";
import { Admin } from "@/pages/Admin";
import { AuthModal } from "@/components/AuthModal";
import NotFound from "@/pages/not-found";

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleLogin = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <Switch>
        <Route path="/">
          <Landing
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </Route>
        <Route path="/dashboard">
          <Dashboard onLogout={handleLogout} />
        </Route>
        <Route path="/admin">
          <Admin onLogout={handleLogout} />
        </Route>
        <Route path="/how-it-works">
          <Landing
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </Route>
        <Route path="/pricing">
          <Landing
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </Route>
        <Route component={NotFound} />
      </Switch>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
