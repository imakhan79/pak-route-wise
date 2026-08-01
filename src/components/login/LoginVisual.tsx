import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ship, Plane, Truck, Train, Warehouse, Container, Satellite, Radar } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import logo from '@/assets/zicon-logo.png';

const NODES = [
  { x: 12, y: 22 }, { x: 32, y: 12 }, { x: 55, y: 24 }, { x: 78, y: 15 },
  { x: 88, y: 40 }, { x: 68, y: 55 }, { x: 40, y: 62 }, { x: 18, y: 48 },
  { x: 50, y: 40 },
];
const ROUTES: [number, number][] = [
  [0, 8], [8, 1], [1, 2], [2, 8], [8, 5], [5, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [6, 8],
];

const FLOATING_ICONS = [
  { Icon: Ship, top: '14%', left: '10%', delay: 0 },
  { Icon: Plane, top: '10%', left: '70%', delay: 0.8 },
  { Icon: Truck, top: '62%', left: '8%', delay: 1.4 },
  { Icon: Train, top: '70%', left: '62%', delay: 0.5 },
  { Icon: Warehouse, top: '40%', left: '85%', delay: 1.9 },
  { Icon: Container, top: '48%', left: '4%', delay: 1.1 },
];

const STATS = [
  { target: 100, suffix: '+', label: 'Countries Served' },
  { target: 500, suffix: '+', label: 'Enterprise Customers' },
  { target: 1, suffix: 'M+', label: 'Shipments Managed' },
  { target: 9999, suffix: '%', label: 'System Availability', decimals: 2 },
];

function StatItem({ stat }: { stat: (typeof STATS)[number] }) {
  const { ref, value } = useCountUp(stat.target);
  const display = stat.decimals ? (value / 100).toFixed(2) : value;
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="text-2xl font-bold text-white sm:text-3xl">{display}{stat.suffix}</div>
      <div className="mt-1 text-xs text-white/50">{stat.label}</div>
    </div>
  );
}

export function LoginVisual() {
  const particles = useMemo(
    () => Array.from({ length: 24 }).map((_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 2.5 + 1, duration: Math.random() * 18 + 12, delay: Math.random() * 8,
    })),
    []
  );

  return (
    <div className="relative hidden h-full w-full overflow-hidden bg-[hsl(1,20%,8%)] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Gradient blobs */}
      <motion.div
        className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(1 58% 27% / 0.5), transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(36 89% 53% / 0.35), transparent 70%)' }}
        animate={{ scale: [1.1, 1, 1.1], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Network / supply chain visualization */}
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        {ROUTES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
            stroke="hsl(36 89% 53%)" strokeWidth="0.15" strokeDasharray="1.2 1.4" className="route-flow"
          />
        ))}
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={i === 8 ? 1.1 : 0.6} fill="hsl(36 89% 53%)">
            <animate attributeName="r" values={`${i === 8 ? 1.1 : 0.6};${i === 8 ? 1.6 : 1};${i === 8 ? 1.1 : 0.6}`} dur="3s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -26, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* Floating logistics icons */}
      {FLOATING_ICONS.map(({ Icon, top, left, delay }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-white/15"
          style={{ top, left }}
          animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          <Icon className="h-9 w-9" strokeWidth={1.2} />
        </motion.div>
      ))}

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
        <img src={logo} alt="Zicon Technology" className="h-11 w-auto rounded-lg" />
      </motion.div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-md"
        >
          <Satellite className="h-3 w-3" /> Live Global Operations Network
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
          className="text-3xl font-bold leading-tight text-white xl:text-4xl"
        >
          Welcome to{' '}
          <span className="bg-gradient-to-r from-[hsl(36,89%,53%)] to-[hsl(1,58%,45%)] bg-clip-text text-transparent">
            Zicon Logistics Management System
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-md text-sm leading-relaxed text-white/60"
        >
          One intelligent platform to manage Logistics, Freight Forwarding, Courier, Customs Clearance,
          Warehousing, Fleet, Shipping, and Supply Chain Operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-10 grid grid-cols-4 gap-6 border-t border-white/10 pt-6"
        >
          {STATS.map((s) => <StatItem key={s.label} stat={s} />)}
        </motion.div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-[11px] text-white/30">
        <Radar className="h-3 w-3" /> GPS Tracking · Ports · Airports · Distribution Centers · Live
      </div>
    </div>
  );
}
