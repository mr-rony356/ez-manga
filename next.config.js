const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const path = require("path");
const createJiti = require("jiti");

const jiti = createJiti(__dirname);
jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: process.env.BUILD_DIR || ".next",
    cacheHandler:
        require.resolve("./cache-handler.mjs"),
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    cacheMaxMemorySize: 0, // disable default in-memory caching
    sassOptions: {
        includePaths: [path.join(__dirname, "src", "app")],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        formats: ["image/avif", "image/webp"],
    },
    async headers() {
        return [
            {
                source: "/:path*{/}?",
                headers: [
                    {
                        key: "X-Accel-Buffering",
                        value: "no",
                    },
                ],
            },
        ];
    },
};

module.exports = withBundleAnalyzer(nextConfig);
