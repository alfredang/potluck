import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@homechef/shared', '@homechef/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },
};

export default nextConfig;
