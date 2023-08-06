/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/lexique-du-lecteur-biblique',
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.net = false
      config.resolve.fallback.child_process = false
    }

    return config
  },
}

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    // config.node = {
    //   fs: 'empty',
    //   child_process: 'empty',
    //   net: 'empty',
    //   dns: 'empty',
    //   tls: 'empty',
    // };
    return config;
  },
}


