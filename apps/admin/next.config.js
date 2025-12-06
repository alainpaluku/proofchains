/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@proofchain/ui', '@proofchain/chain', '@proofchain/shared'],
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io'],
  },
};

module.exports = nextConfig;
