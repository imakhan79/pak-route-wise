import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  trend?: number;
  sparkline?: number[];
  color?: string;
}

export function KPICard({ label, value, prefix = '', suffix = '', decimals = 0, icon: Icon, trend, sparkline, color = 'hsl(1 58% 27%)' }: KPICardProps) {
  const { ref, value: animated } = useCountUp(Math.round(value * Math.pow(10, decimals)));
  const display = (animated / Math.pow(10, decimals)).toLocaleString(undefined, { maximumFractionDigits: decimals });
  const sparkData = (sparkline || [4, 6, 5, 8, 7, 9, 10]).map((v) => ({ v }));

  return (
    <motion.div
      ref={ref as any}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${color}, hsl(36 89% 53%))` }}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend != null && (
          <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{prefix}{display}{suffix}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`spark-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${label.replace(/\s/g, '')})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
