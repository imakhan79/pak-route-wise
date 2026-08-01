import { useCountUp } from '@/hooks/useCountUp';

interface Stat {
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const STATS: Stat[] = [
  { target: 500, suffix: '+', label: 'Enterprise Clients' },
  { target: 1, suffix: 'M+', label: 'Shipments', decimals: 0 },
  { target: 120, suffix: '+', label: 'Countries' },
  { target: 25, suffix: 'M+', label: 'Orders' },
  { target: 9999, suffix: '%', label: 'Uptime', decimals: 2 },
];

function StatItem({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.target);
  const display = stat.decimals ? (value / 100).toFixed(2) : value;

  return (
    <div ref={ref as any} className="text-center">
      <div className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
        {display}
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm text-white/50">{stat.label}</div>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="relative border-y border-white/10 bg-[hsl(1,20%,8%)] py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
