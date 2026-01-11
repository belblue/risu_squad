interface StatsCardProps {
  title: string;
  subtitle?: string; //optional
  value: string;
}

export function StatsCard({ title, subtitle, value }: StatsCardProps) {
  return (
    <div className="bg-secondary reounded-xl border border-surface/20">
      <h1 className=" text-xl text-primary">{title}</h1>
      {subtitle && <h2 className="text-lg text-secondary">{subtitle}</h2>}
      <p>{value}</p>
    </div>
  );
}
