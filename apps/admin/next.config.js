/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@proofchain/ui', '@proofchain/chain', '@proofchain/shared'],
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io'],
    unoptimized: true, // Required for Cloudflare Pages
  },
  // Cloudflare Pages compatibility
  output: 'standalone',
};

module.exports = nextConfig;
