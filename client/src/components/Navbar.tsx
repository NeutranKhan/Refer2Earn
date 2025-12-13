import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Navbar({ isLoggedIn = false, isAdmin = false, onLogin, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = isLoggedIn
    ? [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/about", label: "About Us" },
      ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    ]
    : [
      { href: "/", label: "Home" },
      { href: "/about", label: "About Us" },
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
            <span className="font-display font-bold text-lg md:text-xl gradient-neon-text">
              Refer2Earn
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
            {isLoggedIn ? (
              <Button variant="outline" onClick={onLogout} data-testid="button-logout">
                Logout
              </Button>
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
                  {isLoggedIn ? (
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
