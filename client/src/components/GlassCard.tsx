import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  neonBorder?: "purple" | "cyan" | "pink" | "none";
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className,
  neonBorder = "none",
  hoverable = false,
}: GlassCardProps) {
  const neonClasses = {
    purple: "neon-border",
    cyan: "neon-border-cyan",
    pink: "border border-pink-500/50",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        "glass rounded-2xl p-6",
        neonClasses[neonBorder],
        hoverable && "cursor-pointer transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
