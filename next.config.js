/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gutenberg.org',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.gutenberg.org',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;

