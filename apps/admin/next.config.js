/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@proofchain/ui', '@proofchain/chain', '@proofchain/shared'],
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io'],
    unoptimized: true, // Required for static export
  },
  // Static export for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
};

module.exports = nextConfig;
