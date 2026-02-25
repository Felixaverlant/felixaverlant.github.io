'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setRatio(entry.isIntersecting ? 1 : 0),
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full shrink-0 overflow-hidden">
      <div
        className="border-0 border-b border-theme-dark/25 w-full origin-left"
        style={{
          transform: `scaleX(${ratio})`,
          transition: 'transform var(--animate-duration-divider) ease-out'
        }}
      />
    </div>
  );
}
