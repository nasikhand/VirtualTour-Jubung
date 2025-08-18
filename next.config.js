/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos'], // <-- WAJIB agar aman
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-cgk2-1.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-cgk2-2.cdninstagram.com',
        pathname: '/**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};

module.exports = nextConfig;
