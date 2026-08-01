import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function useCountUp(target: number, durationMs = 2000) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, durationMs]);

  return { ref, value };
}
