import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@homechef/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // @homechef/shared ships TS source and imports with `.js` specifiers
  // (NodeNext style). Let webpack resolve those `.js` imports to `.ts` files.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      ...(config.resolve.extensionAlias ?? {}),
    };
    return config;
  },
};

export default nextConfig;
