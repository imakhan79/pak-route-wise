import { motion } from 'framer-motion';
import { useMemo } from 'react';

/** Living animated background: morphing gradient blobs, drifting particles, subtle grid overlay. */
export function AnimatedBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* morphing gradient blobs */}
      <motion.div
        className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(1 58% 27% / 0.55), transparent 70%)' }}
        animate={{ scale: [1, 1.25, 1], x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(36 89% 53% / 0.4), transparent 70%)' }}
        animate={{ scale: [1.1, 1, 1.1], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(0 0% 66% / 0.25), transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* light rays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(1,20%,8%)]" />

      {/* drifting particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </div>
  );
}
