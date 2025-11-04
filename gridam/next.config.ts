import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental : {
      serverActions : {
        // 모든 출처에서 허용한 상태로 추후 도메인 변경 필요
        // allowedOrigins: ['https://example.com']
          allowedOrigins:['*']
      }
  }
};

export default nextConfig;