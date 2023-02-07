/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons'],
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    }
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
