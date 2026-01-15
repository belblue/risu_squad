interface StatsCardProps {
  title: string;
  subtitle?: string; //optional
  value: string;
}

export function StatsCard({ title, subtitle, value }: StatsCardProps) {
  return (
    <div className="bg-secondary reounded-xl border border-surface/20">
      <p className=" text-lg text-primary">{title}</p>
      {subtitle && <p className="text-md text-secondary">{subtitle}</p>}
      <p>{value}</p>
    </div>
  );
}
