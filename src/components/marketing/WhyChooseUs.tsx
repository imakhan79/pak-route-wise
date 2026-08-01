import { motion } from 'framer-motion';
import { Cpu, Radar, Cloud, ShieldCheck, TrendingUp, Building2, Warehouse, GitBranch, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

const REASONS = [
  { icon: Cpu, title: 'AI Automation', desc: 'Automate dispatch, routing, and exception handling with intelligent agents.' },
  { icon: Radar, title: 'Real-time Tracking', desc: 'Sub-10-second location updates across your entire fleet.' },
  { icon: Cloud, title: 'Cloud Ready', desc: 'Deploy anywhere - zero infrastructure to manage.' },
  { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Role-based access, audit trails, and encrypted data at rest.' },
  { icon: TrendingUp, title: 'Scalable', desc: 'From 10 to 10,000 vehicles without re-architecting.' },
  { icon: Building2, title: 'Multi Company', desc: 'Operate multiple legal entities from one workspace.' },
  { icon: Warehouse, title: 'Multi Warehouse', desc: 'Centralized visibility across every facility you run.' },
  { icon: GitBranch, title: 'Multi Branch', desc: 'Branch-level permissions and reporting, globally consolidated.' },
  { icon: Zap, title: 'High Performance', desc: 'Sub-second dashboard loads, even at enterprise scale.' },
];

export function WhyChooseUs() {
  return (
    <section className="relative bg-[hsl(1,20%,10%)] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Why enterprises choose Zicon</h2>
          <p className="mt-4 text-white/50">Built for the demands of global logistics operations.</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="bg-[hsl(1,20%,10%)] p-8"
            >
              <Icon className="h-6 w-6 text-[hsl(36,89%,53%)]" strokeWidth={1.75} />
              <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
