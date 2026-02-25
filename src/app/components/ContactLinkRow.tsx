import CtaLink from './CtaLink';

type ContactLinkRowProps = {
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ContactLinkRow({ children, className = '', ...linkProps }: ContactLinkRowProps) {
  return (
    <>
      <hr className="border-0 border-b border-theme-dark/25 w-full shrink-0" />
      <div>
        <CtaLink className={`block w-full py-3 text-base md:text-lg ${className}`.trim()} {...linkProps}>
          {children}
        </CtaLink>
      </div>
    </>
  );
}
