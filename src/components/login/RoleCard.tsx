import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleCardProps {
  label: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}

export function RoleCard({ label, description, icon: Icon, active, onClick }: RoleCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl border p-3 text-center transition-colors',
        active ? 'border-primary/40 bg-primary/5 shadow-[0_0_0_1px_hsl(1,58%,27%,0.15)]' : 'border-black/5 bg-white hover:border-primary/20'
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100',
        )}
        style={{ background: 'var(--gradient-primary)' }}
      />
      <div
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="relative text-[11px] font-semibold leading-tight">{label}</span>
      <span className="relative text-[9px] leading-tight text-muted-foreground">{description}</span>
    </motion.button>
  );
}
