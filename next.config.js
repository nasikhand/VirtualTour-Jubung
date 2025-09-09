/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },

  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    domains: [
      'localhost',
      '127.0.0.1',
      'wisatajubung.com',
      'virtualtour.wisatajubung.com',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'wisatajubung.com',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'virtualtour.wisatajubung.com',
        pathname: '/storage/**',
      },
    ],
  },

  output: 'standalone',

  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://api.wisatajubung.com',
    NEXT_PUBLIC_VTOUR_API_URL:
      process.env.NEXT_PUBLIC_VTOUR_API_URL || 'https://virtualtour.wisatajubung.com',
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
