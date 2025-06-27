import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
  },
  // Increase timeouts for development
  async rewrites() {
    return []
  },
  // Configure for database connections
  env: {
    DATABASE_TIMEOUT: '30000', // 30 seconds
  },
};

export default nextConfig;
