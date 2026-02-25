import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  compress: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['tailwind-merge'],
  },
};

export default nextConfig;
