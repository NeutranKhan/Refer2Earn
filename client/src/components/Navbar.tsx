import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Zap, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ADMIN_PATH } from "@shared/constants";
import { NotificationDropdown } from "@/components/NotificationDropdown";

import { useAuth } from "@/providers/AuthProvider";

interface NavbarProps {
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Navbar({ onLogin, onLogout }: NavbarProps) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = Boolean(user?.isAdmin);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = isAuthenticated
    ? [
      { href: "/", label: "Home" },
      { href: "/tracker", label: "Tracker" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/wallet", label: "Wallet" },
      { href: "/goals", label: "Goals" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/network", label: "Network" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/blog", label: "Blog" },
      ...(isAdmin ? [{ href: ADMIN_PATH, label: "Admin" }] : []),
    ]
    : [
      { href: "/", label: "Home" },
      { href: "/network", label: "Network" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/blog", label: "Blog" },
    ];

  const allLinks = navLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-neon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-neon-text">
              WealthBridge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 gradient-neon rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={onLogout} data-testid="button-logout">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onLogin} data-testid="button-login">
                  Login
                </Button>
                <Button className="neon-glow" onClick={onLogin} data-testid="button-get-started">
                  Get Started
                </Button>
              </>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong border-l-0 w-full sm:w-80">
              <div className="flex flex-col h-full pt-8">
                <div className="flex flex-col gap-2">
                  {allLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                        location === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto pb-8 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link href="/settings" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          onLogout?.();
                          setIsOpen(false);
                        }}
                        data-testid="button-mobile-logout"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          onLogin?.();
                          setIsOpen(false);
                        }}
                        data-testid="button-mobile-login"
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full neon-glow"
                        onClick={() => {
                          onLogin?.();
                          setIsOpen(false);
                        }}
                        data-testid="button-mobile-get-started"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
