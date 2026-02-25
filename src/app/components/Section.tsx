'use client';

import SectionHeading from './SectionHeading'
import FractalBackground, { type FractalVariant } from './FractalBackground'

type SectionProps = {
  title: React.ReactNode
  ariaLabel: string
  children: React.ReactNode
  titleAfterSlash?: React.ReactNode
  className?: string
  headingClassName?: string
  variant?: 'default' | 'compact'
  fractalVariant?: FractalVariant
  fractalAngleDeg?: number
  fractalRotationDeg?: number
  headingNoDivider?: boolean
  animatedDivider?: boolean
  firstSection?: boolean
}

export default function Section({
  title,
  ariaLabel,
  children,
  titleAfterSlash,
  className = '',
  headingClassName,
  variant = 'default',
  fractalVariant,
  fractalAngleDeg,
  fractalRotationDeg,
  headingNoDivider,
  animatedDivider,
  firstSection = false,
}: SectionProps) {
  const marginTop = firstSection ? '' : ' mt-[100px]'
  const sectionClasses = `w-full pointer-events-none${marginTop}`

  const showFractal = fractalVariant !== undefined && fractalVariant !== null ||
    (fractalAngleDeg !== undefined && fractalAngleDeg !== null)

  return (
    <section className={`${sectionClasses} ${className}`.trim()} aria-label={ariaLabel}>
      {showFractal && (
        <div className="fractal-wrapper--section-inflow">
          <FractalBackground
            className="fractal-wrapper--section"
            variant={fractalVariant ?? 'tree'}
            angleDeg={fractalAngleDeg ?? 60}
            rotationDeg={fractalRotationDeg ?? 0}
            align="left"
          />
        </div>
      )}
      <div className="relative z-10">
        <SectionHeading className={headingClassName} noDivider={headingNoDivider} animatedDivider={animatedDivider}>
          {title}
          <span className="text-theme-yellow">/</span>
          {titleAfterSlash}
        </SectionHeading>
        {children}
      </div>
    </section>
  );
}
