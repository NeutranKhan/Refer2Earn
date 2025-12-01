import { GlassCard } from "../GlassCard";

export default function GlassCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GlassCard neonBorder="purple" hoverable>
        <h3 className="text-lg font-display font-semibold text-foreground">Purple Neon Card</h3>
        <p className="text-muted-foreground mt-2">Hoverable glass card with purple neon border</p>
      </GlassCard>
      <GlassCard neonBorder="cyan" hoverable>
        <h3 className="text-lg font-display font-semibold text-foreground">Cyan Neon Card</h3>
        <p className="text-muted-foreground mt-2">Hoverable glass card with cyan neon border</p>
      </GlassCard>
    </div>
  );
}
