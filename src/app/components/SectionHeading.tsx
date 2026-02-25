'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { children: React.ReactNode; className?: string; noDivider?: boolean; animatedDivider?: boolean };

export default function SectionHeading({ children, className = '', noDivider, animatedDivider }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [ratio, setRatio] = useState(animatedDivider ? 0 : 1);

  useEffect(() => {
    if (!animatedDivider) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setRatio(entry.isIntersecting ? 1 : 0),
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animatedDivider]);

  const headingClass = noDivider
    ? `section-heading section-heading--no-divider ${className}`
    : animatedDivider
      ? `section-heading section-heading--animated-divider ${className}`
      : `section-heading ${className}`;

  return (
    <h2
      ref={ref}
      className={headingClass.trim()}
      style={{ '--divider-ratio': ratio } as React.CSSProperties}
    >
      {children}
    </h2>
  );
}
