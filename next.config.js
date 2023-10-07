/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.child_process = false
      config.resolve.fallback.net = false
      // config.resolve.fallback.http2 = false
    }
    return config
  },
  env: {
    CREDS: process.env.CREDS,
  },
};

module.exports = nextConfig;


