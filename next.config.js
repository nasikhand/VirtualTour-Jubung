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
    domains: ['localhost', '127.0.0.1'],
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
    ],
  },
  
  // Output optimization
  output: 'standalone',
  
  // Disable telemetry
  telemetry: {
    enabled: false,
  },
};

module.exports = nextConfig;
