/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  allowedDevOrigins: ['26.247.111.81'],
}

module.exports = nextConfig