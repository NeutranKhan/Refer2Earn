import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "default" | "success" | "warning" | "accent";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  const variantClasses = {
    default: "neon-border",
    success: "border border-green-500/50",
    warning: "border border-yellow-500/50",
    accent: "neon-border-cyan",
  };

  const iconVariantClasses = {
    default: "text-primary",
    success: "text-green-500",
    warning: "text-yellow-500",
    accent: "text-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass rounded-2xl p-6",
        variantClasses[variant]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.positive ? "text-green-500" : "text-red-500"
            )}>
              <span>{trend.positive ? "+" : ""}{trend.value}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl glass-strong",
          iconVariantClasses[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
