import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Reveal } from './Reveal';

const TESTIMONIALS = [
  {
    quote:
      'Zicon replaced four disconnected tools overnight. Our dispatch team now sees the whole fleet in one screen, and on-time delivery is up double digits.',
    name: 'Operations Director',
    company: 'National Freight Group',
    initials: 'OD',
  },
  {
    quote:
      'The live GPS tracking alone paid for the platform in the first quarter - we finally know where every truck is, every minute.',
    name: 'Fleet Manager',
    company: 'Continental Logistics',
    initials: 'FM',
  },
  {
    quote:
      'Rolling out across three countries took weeks, not months. The multi-branch model just works the way our business actually operates.',
    name: 'VP of Supply Chain',
    company: 'Meridian Trading Co.',
    initials: 'VP',
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative bg-[hsl(1,20%,8%)] py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Trusted by logistics leaders</h2>
        </Reveal>

        <div className="relative mt-14 h-72 sm:h-56">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl sm:p-10"
            >
              <Quote className="mx-auto h-6 w-6 text-[hsl(36,89%,53%)]" />
              <p className="mt-4 text-lg leading-relaxed text-white/80">"{TESTIMONIALS[index].quote}"</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(36,89%,53%)] to-[hsl(1,58%,27%)] text-xs font-bold text-white">
                  {TESTIMONIALS[index].initials}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{TESTIMONIALS[index].name}</div>
                  <div className="text-xs text-white/50">{TESTIMONIALS[index].company}</div>
                </div>
                <div className="ml-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[hsl(36,89%,53%)] text-[hsl(36,89%,53%)]" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-[hsl(36,89%,53%)]' : 'w-1.5 bg-white/20'
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
