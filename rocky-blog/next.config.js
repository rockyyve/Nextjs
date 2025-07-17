/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xfwbckdyojiphfscxbnz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 添加通用的 Supabase 域名模式以防项目ID改变
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
}

module.exports = nextConfig 