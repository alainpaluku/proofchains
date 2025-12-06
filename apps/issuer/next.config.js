/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@proofchain/ui', '@proofchain/chain', '@proofchain/shared'],
    images: {
        domains: ['gateway.pinata.cloud', 'ipfs.io'],
        unoptimized: true, // Required for Cloudflare Pages
    },
    // Cloudflare Pages compatibility
    output: 'standalone',
    webpack: (config, { isServer }) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');

        // Enable WebAssembly support for lucid-cardano
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
        };

        // Fix for Blockfrost and other Node.js modules in browser
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                dns: false,
                os: false,
                child_process: false,
                http2: false,
            };
        }

        return config;
    },
};

module.exports = nextConfig;
