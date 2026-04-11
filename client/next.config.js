/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json'
  },
  swcMinify: true,
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' }];
  },
};
module.exports = nextConfig;
