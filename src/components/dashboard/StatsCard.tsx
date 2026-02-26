interface StatsCardProps {
  title: string;
  subtitle?: string; //optional
  value: string;
  highlight?: boolean;
}

export function StatsCard({ title, subtitle, value, highlight }: StatsCardProps) {
  return (
    <div className={`${highlight ? "bg-primary/15 border-primary/30" : "bg-secondary/60 border-surface/10"} rounded-xl border px-5 py-4`}>
      <p className="text-xs text-surface/50 uppercase tracking-wider">{title}</p>
      <p className={`text-xl font-bold mt-1 ${highlight ? "text-primary" : "text-surface"}`}>{value}</p>
      {subtitle && <p className="text-xs text-surface/40 mt-1">{subtitle}</p>}
    </div>
  );
}
