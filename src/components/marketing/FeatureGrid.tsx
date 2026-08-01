import { motion } from 'framer-motion';
import {
  Truck,
  Warehouse,
  MapPin,
  Package,
  Radar,
  Wallet,
  Calculator,
  Users,
  Sparkles,
  BarChart3,
  FileBarChart,
  Navigation,
} from 'lucide-react';
import { Reveal } from './Reveal';

const FEATURES = [
  { icon: Truck, title: 'Transportation Management', desc: 'Plan, dispatch, and optimize every shipment across road, sea, air, and rail.' },
  { icon: Warehouse, title: 'Warehouse Management', desc: 'Real-time inventory, GRN/GIN, and bonded warehouse control from one console.' },
  { icon: MapPin, title: 'Fleet Management', desc: 'Track vehicle health, documents, and utilization across your entire fleet.' },
  { icon: Package, title: 'Inventory', desc: 'Live stock visibility with automated reorder points and audit trails.' },
  { icon: Radar, title: 'Shipment Tracking', desc: 'End-to-end visibility from booking to proof of delivery.' },
  { icon: Navigation, title: 'GPS Tracking', desc: 'Live vehicle location, speed, and idle detection reported every few seconds.' },
  { icon: Wallet, title: 'Finance', desc: 'Invoicing, duty payments, and demurrage tracking built for freight operations.' },
  { icon: Calculator, title: 'Accounting', desc: 'Automated reconciliation and financial reporting across every branch.' },
  { icon: Users, title: 'CRM', desc: 'Manage customers, contracts, and service history in a unified workspace.' },
  { icon: Sparkles, title: 'AI Assistant', desc: 'Natural-language insights and anomaly detection across your operations.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Executive dashboards with drill-down into every operational metric.' },
  { icon: FileBarChart, title: 'Reporting', desc: 'Scheduled, exportable reports for compliance and stakeholder review.' },
];

export function FeatureGrid() {
  return (
    <section className="relative bg-[hsl(1,20%,8%)] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">One platform. Every operation.</h2>
          <p className="mt-4 text-white/50">
            Every module your logistics business needs, deeply integrated and built for scale.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <motion.div
                whileHover={{ y: -8, rotate: -0.6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-[hsl(36,89%,53%)]/40"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle, hsl(36 89% 53% / 0.35), transparent 70%)' }}
                />
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(1,58%,27%)] to-[hsl(1,58%,18%)] text-white shadow-lg">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="relative text-lg font-semibold text-white">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/50">{desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
