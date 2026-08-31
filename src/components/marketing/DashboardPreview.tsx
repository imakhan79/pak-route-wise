import { useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Reveal } from './Reveal';

const REVENUE_DATA = [
  { v: 40 }, { v: 55 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 74 }, { v: 68 }, { v: 82 }, { v: 90 },
];

const UTILIZATION_DATA = [
  { name: 'active', value: 87 },
  { name: 'idle', value: 13 },
];

const WAREHOUSE_DATA = [
  { v: 65 }, { v: 78 }, { v: 52 }, { v: 90 }, { v: 71 }, { v: 60 },
];

const UTIL_COLORS = ['hsl(36 89% 53%)', 'rgba(255,255,255,0.08)'];

const HEATMAP_CELLS = Array.from({ length: 42 }).map(() => Math.random());

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section id="platform-tour" className="relative overflow-hidden bg-[hsl(1,20%,10%)] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">See your entire operation, live.</h2>
          <p className="mt-4 text-white/50">Every shipment, every vehicle, every dollar - one real-time view.</p>
        </Reveal>

        <Reveal delay={0.15}>
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            style={{ rotateX, rotateY, transformPerspective: 1400 }}
            className="relative mx-auto mt-16 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              {/* Revenue */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Revenue Trend</span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp className="h-3 w-3" /> +18.2%
                  </span>
                </div>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                      <defs>
                        <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(36 89% 53%)" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="hsl(36 89% 53%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="hsl(36 89% 53%)" strokeWidth={2} fill="url(#rev-gradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Fleet utilization */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Fleet Utilization</span>
                <div className="relative h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={UTILIZATION_DATA} dataKey="value" innerRadius={32} outerRadius={44} startAngle={90} endAngle={-270}>
                        {UTILIZATION_DATA.map((entry, i) => (
                          <Cell key={entry.name} fill={UTIL_COLORS[i]} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">87%</div>
                </div>
              </div>

              {/* Live GPS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Live GPS</span>
                <div className="mt-4 flex h-28 flex-col items-center justify-center gap-2">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="absolute h-10 w-10 animate-ping rounded-full bg-emerald-400/30" />
                    <span className="relative h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-white/50">1,248 vehicles online</span>
                </div>
              </div>

              {/* Warehouse occupancy */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Warehouse Occupancy</span>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WAREHOUSE_DATA}>
                      <Bar dataKey="v" fill="hsl(1 58% 45%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heat map */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Regional Demand Heatmap</span>
                <div className="mt-4 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
                  {HEATMAP_CELLS.map((v, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-sm"
                      style={{ background: `hsl(36 89% 53% / ${0.1 + v * 0.6})` }}
                    />
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="rounded-2xl border border-[hsl(36,89%,53%)]/30 bg-gradient-to-br from-[hsl(1,58%,27%)]/30 to-transparent p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[hsl(36,89%,53%)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/70">AI Insight</span>
                </div>
                <p className="text-xs leading-relaxed text-white/60">
                  Route KHI-LHR trending 12% faster this week. Consider reallocating 2 vehicles for higher throughput.
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
