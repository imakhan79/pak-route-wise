import { useRef, useState, ReactNode, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const VARIANT_CLASS: Record<NonNullable<MagneticButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-[hsl(1,58%,27%)] to-[hsl(1,58%,20%)] text-white shadow-[0_0_30px_hsl(1,58%,27%,0.4)]',
  secondary:
    'bg-gradient-to-r from-[hsl(36,89%,53%)] to-[hsl(36,89%,45%)] text-white shadow-[0_0_30px_hsl(36,89%,53%,0.4)]',
  ghost: 'bg-white/10 text-white border border-white/30 backdrop-blur-md',
};

export function MagneticButton({ children, className, onClick, variant = 'primary', type = 'button', disabled }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setPos({ x, y });
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    }
    onClick?.();
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={handleClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.3 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative overflow-hidden rounded-full px-8 py-4 font-semibold text-sm tracking-wide transition-shadow duration-300 hover:shadow-2xl disabled:opacity-60 disabled:pointer-events-none',
        VARIANT_CLASS[variant],
        className
      )}
    >
      {ripple && (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => setRipple(null)}
          className="pointer-events-none absolute h-4 w-4 rounded-full bg-white/60"
          style={{ left: ripple.x - 8, top: ripple.y - 8 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
