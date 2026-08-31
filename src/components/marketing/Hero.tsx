import { useRef, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Truck, Ship, Plane, Package, PlayCircle, ArrowRight } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { MagneticButton } from './MagneticButton';

const FLOATING_ICONS = [
  { Icon: Truck, top: '18%', left: '8%', delay: 0, duration: 6 },
  { Icon: Ship, top: '68%', left: '12%', delay: 1.2, duration: 7 },
  { Icon: Plane, top: '14%', left: '88%', delay: 0.6, duration: 6.5 },
  { Icon: Package, top: '72%', left: '90%', delay: 1.8, duration: 5.5 },
];

export function Hero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden bg-[hsl(1,20%,8%)] pt-28"
    >
      <AnimatedBackground />

      {FLOATING_ICONS.map(({ Icon, top, left, delay, duration }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-10 hidden text-white/20 lg:block"
          style={{ top, left }}
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
        >
          <Icon className="h-12 w-12" strokeWidth={1.2} />
        </motion.div>
      ))}

      <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(36,89%,53%)]" />
            AI-Powered Enterprise Logistics Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Transform Global Logistics Into{' '}
            <span className="bg-gradient-to-r from-[hsl(36,89%,53%)] via-[hsl(20,75%,45%)] to-[hsl(1,58%,45%)] bg-clip-text text-transparent">
              Intelligent Digital Operations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/60"
          >
            Digitize transportation, fleet, warehouse, inventory, finance, dispatch, procurement, and customer
            operations through one powerful AI-driven enterprise platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton variant="secondary" onClick={() => navigate('/login')}>
              <span className="flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </span>
            </MagneticButton>
            <MagneticButton variant="primary" onClick={() => navigate('/portal/register')}>Book Live Demo</MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => document.getElementById('platform-tour')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" /> Watch Platform Tour
              </span>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Floating glass dashboard mockup */}
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Live Fleet Overview</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Active Shipments', value: '1,248', color: 'hsl(36,89%,53%)' },
                { label: 'Fleet Utilization', value: '87%', color: 'hsl(1,58%,45%)' },
                { label: 'On-Time Rate', value: '98.2%', color: 'hsl(142,71%,45%)' },
                { label: 'Warehouses', value: '42', color: 'hsl(0,0%,66%)' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-[11px] text-white/50">{stat.label}</div>
                  <div className="mt-3 h-1 rounded-full bg-white/10">
                    <div className="h-1 rounded-full" style={{ width: '70%', background: stat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* floating badge */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-6 -left-8 rounded-xl border border-white/15 bg-[hsl(1,20%,10%)]/90 px-4 py-3 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[hsl(36,89%,53%)]" />
              <span className="text-xs font-medium text-white">GPS-4471 · En Route</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/40"
      >
        <div className="h-9 w-5 rounded-full border border-white/30 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
