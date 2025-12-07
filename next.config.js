/** @type {import('next').NextConfig} */
const nextConfig = {
  // 완전 정적 사이트로 변경
  output: 'export',
  trailingSlash: true,
  distDir: 'out',

  images: {
    // 정적 호스팅을 위해 unoptimized 설정 (Cloudflare 이미지 최적화 대체)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'noticon-static.tammolo.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
      },
    ],
  },

  // 성능 최적화 설정
  poweredByHeader: false,
  compress: true,

  // 빌드 최적화 (swcMinify는 기본값이라 제거)

  // 헤더 최적화는 export 모드에서 지원되지 않음
  // Cloudflare Pages에서 캐시 설정으로 대체
}

export default nextConfig
