/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Fix live reload on Windows: file watcher often misses changes without polling
    if (dev && (process.env.NEXT_WEBPACK_USEPOLLING === 'true' || process.platform === 'win32')) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
