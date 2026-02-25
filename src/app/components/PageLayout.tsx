import FractalBackground from './FractalBackground';

type PageLayoutProps = {
  children: React.ReactNode;
  fractalInContent?: boolean;
};

export default function PageLayout({ children, fractalInContent }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {!fractalInContent && <FractalBackground />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
