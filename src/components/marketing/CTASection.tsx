import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Reveal } from './Reveal';
import { MagneticButton } from './MagneticButton';

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section id="cta" className="relative overflow-hidden bg-[hsl(1,20%,8%)] py-28">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 50%, hsl(1 58% 27% / 0.5), transparent), radial-gradient(40% 60% at 80% 20%, hsl(36 89% 53% / 0.3), transparent)',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to Transform Your Logistics Business?</h2>
          <p className="mt-5 text-white/60">
            Join enterprise logistics teams running their entire operation on Zicon Technology.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton variant="secondary" onClick={() => navigate('/portal/register')}>Schedule Demo</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => navigate('/login')}>Start Free Trial</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
