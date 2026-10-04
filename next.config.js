/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    // Vercel 이미지 최적화 한도를 넘겨(402) 사진이 전부 깨지던 것을 막는다.
    // 끄면 public 의 원본을 그대로 내보낸다 — 리사이즈·WebP 변환이 없으므로
    // 원본 자체를 가볍게 유지해야 한다.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // 없앤 페이지의 옛 주소 — 검색 결과·광고·즐겨찾기로 들어오는 사람이 끊기지 않게 새 자리로 넘긴다.
  async redirects() {
    return [
      // 서비스 안내는 WEFLOW 혜택과 내용이 겹쳐 혜택 페이지로 합쳤다
      { source: '/service', destination: '/benefits', permanent: true },
    ]
  },

  // 모든 페이지에 붙는 보안 헤더.
  // HTTPS 강제(strict-transport-security)는 Vercel 이 자동으로 넣어주므로 여기선 생략.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 다른 사이트가 우리 페이지를 iframe 으로 끼워 넣지 못하게 (클릭재킹 차단)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // 브라우저가 파일 형식을 제멋대로 추측하지 않게 (스크립트로 오인식되는 것 방지)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 외부 사이트로 이동할 때 도메인까지만 넘기고 전체 주소는 감춘다
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // 쓰지 않는 기기 권한은 아예 막아 둔다
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
