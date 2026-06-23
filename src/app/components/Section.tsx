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
  fractalRotationDeg?: number
  fractalSteps?: number
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
  fractalRotationDeg,
  fractalSteps,
  headingNoDivider,
  animatedDivider,
  firstSection = false,
}: SectionProps) {
  const showFractal = fractalVariant != null
  // When a fractal is present, the inflow wrapper supplies the inter-section gap
  // (with the fractal centered in it), so the extra top margin is dropped to keep
  // equal vertical spacing before and after the fractal.
  const marginTop = firstSection || showFractal ? '' : ' mt-[100px]'
  const sectionClasses = `w-full pointer-events-none${marginTop}`

  return (
    <section className={`${sectionClasses} ${className}`.trim()} aria-label={ariaLabel}>
      {showFractal && (
        <div className="fractal-wrapper--section-inflow">
          <FractalBackground
            className="fractal-wrapper--section"
            variant={fractalVariant ?? 'fibonacci'}
            rotationDeg={fractalRotationDeg ?? 0}
            steps={fractalSteps}
            align="center"
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
