import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // 모든 출처에서 허용한 상태로 추후 도메인 변경 필요
      // allowedOrigins: ['https://example.com']
      allowedOrigins: ['*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'usdumrvpdudznlkvmufn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/diary-images/**',
      },
    ],
    // 또는 전체 Supabase 스토리지를 허용하고 싶으면:
    // domains: ['usdumrvpdudznlkvmufn.supabase.co'],
  },
}

export default nextConfig
