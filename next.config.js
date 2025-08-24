/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimasi untuk deployment 2GB
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Optimasi build
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    domains: ['localhost', '127.0.0.1', 'wisatajubung.com', 'vtour.wisatajubung.com'],
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
        hostname: 'vtour.wisatajubung.com',
        pathname: '/storage/**',
      },
    ],
  },
  
  // Output optimization
  output: 'standalone',
  
  // Disable telemetry
  telemetry: {
    enabled: false,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://wisatajubung.com/api',
    NEXT_PUBLIC_VTOUR_API_URL: process.env.NEXT_PUBLIC_VTOUR_API_URL || 'https://wisatajubung.com/api',
  },

  // Webpack configuration untuk Pannellum
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
