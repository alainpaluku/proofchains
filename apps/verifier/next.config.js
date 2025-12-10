/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@proofchain/ui', '@proofchain/chain', '@proofchain/shared'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.io',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');

        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
        };

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
