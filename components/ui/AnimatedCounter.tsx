'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  /** Animation duration in ms. Default 2200ms for a satisfying count-up. */
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2200,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Use IntersectionObserver so the counter fires:
       - immediately if the element is already on screen when the page loads
       - OR when it scrolls into view for the first time
       Once animated, it never resets (hasAnimated ref).                    */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            /* easeOutExpo — fast at start, slows dramatically at end      */
            const eased =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.round(eased * target));

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      /* threshold: 0 → fires as soon as ANY part of the element is visible */
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
