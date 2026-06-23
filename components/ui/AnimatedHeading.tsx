'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedHeadingProps {
  children: ReactNode;
  /** Which direction the element slides in FROM when entering the viewport. */
  direction?: 'left' | 'right' | 'up';
  className?: string;
  /** Optional stagger delay in ms before the in-animation starts. */
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
}

export function AnimatedHeading({
  children,
  direction = 'up',
  className = '',
  delay = 0,
  as: Tag = 'div',
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* ── Hidden position (where element sits before/after animating) ── */
    const hiddenTransform =
      direction === 'left'
        ? 'translateX(-70px)'
        : direction === 'right'
        ? 'translateX(70px)'
        : 'translateY(48px)';

    /* ── Transition curves ──────────────────────────────────────────────
       IN  : slow ease-out spring — feels premium and deliberate
       OUT : slightly faster ease-in — quick retract on reverse scroll   */
    const IN_TRANSITION = `
      opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
      transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms
    `;
    const OUT_TRANSITION = `
      opacity 0.65s ease-in,
      transform 0.65s ease-in
    `;

    /* ── Set initial hidden state ─────────────────────────────────────── */
    el.style.opacity = '0';
    el.style.transform = hiddenTransform;
    el.style.willChange = 'opacity, transform';

    /* Track whether this is the very first IntersectionObserver callback.
       If the element is ALREADY in the viewport when the page loads we
       show it instantly so the hero heading never "pops in" on load.     */
    let initialFire = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (initialFire) {
          initialFire = false;

          if (entry.isIntersecting) {
            /* Element was visible the moment the page rendered → no animation */
            el.style.transition = 'none';
            el.style.opacity = '1';
            el.style.transform = 'translate(0, 0)';
            return;
          }
          /* Element starts off-screen → leave it hidden, wait for scroll */
        }

        if (entry.isIntersecting) {
          /* ── Scrolled INTO view → slide in ── */
          el.style.transition = IN_TRANSITION;
          el.style.opacity = '1';
          el.style.transform = 'translate(0, 0)';
        } else {
          /* ── Scrolled OUT of view (reverse scroll) → slide back out ── */
          el.style.transition = OUT_TRANSITION;
          el.style.opacity = '0';
          el.style.transform = hiddenTransform;
        }
      },
      {
        threshold: 0.12,
        /* Fire the OUT callback a little BEFORE the element fully leaves
           at the top so it exits smoothly, not abruptly.                 */
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay]);

  return (
    // @ts-ignore – polymorphic ref assignment
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
