/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    config.module.rules.push({ test: /\.csv$/, use: 'raw-loader'  });
    return config;
  },
}


