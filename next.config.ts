import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      '@prisma/internals': 'commonjs @prisma/internals',
    });
    return config;
  },
};

export default nextConfig;
