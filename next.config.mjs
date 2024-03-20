/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.externals = [
            ...config.externals,
            ({ context, request }, callback) => {
                if (request === 'canvas') {
                    return callback(null, 'commonjs canvas');
                }
                callback();
            },
        ];

        return config;
    },
};

export default nextConfig;