const CTA_CLASSES =
  'inline-block shrink-0 text-lg md:text-xl text-theme-dark font-normal tracking-wide transition-colors duration-300 focus:outline-none';

type CtaLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function CtaLink({ children, className = '', ...props }: CtaLinkProps) {
  return (
    <a className={`${CTA_CLASSES} ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}
