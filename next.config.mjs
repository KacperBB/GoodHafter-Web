// For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
if (
    process.env.LD_LIBRARY_PATH == null ||
    !process.env.LD_LIBRARY_PATH.includes(
        `${process.env.PWD}/node_modules/canvas/build/Release:`,
    )
) {
    process.env.LD_LIBRARY_PATH = `${
        process.env.PWD
    }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.pixabay.com'],
    },
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