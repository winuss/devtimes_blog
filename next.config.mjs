/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true, // S3 호스팅을 위해 이미지 최적화 비활성화
    domains: ['pagead2.googlesyndication.com'], // AdSense 도메인 추가
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/search-index.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=86400', // 5분 캐시, 24시간 stale-while-revalidate
          },
        ],
      },
    ];
  }
};

// Merge MDX config with Next.js config
export default nextConfig;
