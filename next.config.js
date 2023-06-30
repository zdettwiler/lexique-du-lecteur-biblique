/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/lexique-du-lecteur-biblique',
}

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    config.module.rules.push({ test: /\.csv$/, use: 'raw-loader'  });
    return config;
  },
}


