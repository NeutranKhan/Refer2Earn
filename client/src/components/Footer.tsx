import { Link } from "wouter";
import { Zap, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const links = {
    product: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "FAQ", href: "/faq" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refunds" },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg gradient-neon">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-neon-text">
                WealthBridge
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Liberia&apos;s premier referral earning platform. Turn your network into income with our simple and transparent system.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+231 77 000 0000</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@wealthbridge.lr</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Monrovia, Liberia</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2024 WealthBridge Liberia. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MTN</span>
                </div>
                <span className="text-sm text-muted-foreground">Lonestar Cell</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">OM</span>
                </div>
                <span className="text-sm text-muted-foreground">Orange Money</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
