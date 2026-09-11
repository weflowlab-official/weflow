// 전체 페이지를 감싸는 루트 레이아웃.
// 사이트 공통 메타데이터(SEO·OG·네이버 인증)를 정의하고,
// 헤더·푸터 등 공통 UI(ClientLayout)와 방문 통계 스크립트를 얹는다.
import type { Metadata } from 'next'
import '../styles/globals.css'
import ClientLayout from '@/components/ClientLayout'
import Analytics from '@/components/Analytics'
import NaverAds from '@/components/NaverAds'
import Smartlog from '@/components/Smartlog'
import PageTracker from '@/components/PageTracker'
import FontLoader from '@/components/FontLoader'
import { makePlans } from '@/data/pricing'
import { SEO_KEYWORDS } from '@/lib/keywords'

/**
 * 리뉴얼 미리보기 사이트(weflow-pied.vercel.app)를 검색에서 가린다.
 * Vercel 환경변수 NOINDEX=1 이 걸린 프로젝트에서만 동작하므로,
 * 이 코드가 main 에 합쳐져도 운영 사이트(weflowlab.kr)는 영향받지 않는다.
 */
const isNoindex = process.env.NOINDEX === '1'

// 사이트 공통 메타 — 개별 페이지에서 title 등을 덮어쓴다
export const metadata: Metadata = {
  metadataBase: new URL('https://weflowlab.kr'),
  ...(isNoindex && { robots: { index: false, follow: false } }),
  title: '위플로우(WEFLOW) — 내가 진짜 원하는 페이지, 우리만의 플로우를 담다',
  description: '위플로우(WEFLOW)는 홈페이지 제작부터 광고 연동·운영 관리까지, 단순 제작이 아닌 문의 구조까지 설계합니다.',
  keywords: SEO_KEYWORDS.join(', '),
  // 쿼리스트링·www 변형이 별개 URL로 색인되지 않도록 대표 주소를 지정한다.
  // './' 는 각 페이지 경로에 맞춰 자동으로 해석된다.
  alternates: { canonical: './' },
  // 탭 제목 글자와 나란히 놓이므로 로고를 살짝 내려 그린 전용 파일을 쓴다.
  // 구글 검색은 48px 배수 규격이 있어야 결과 목록의 원을 꽉 채워 그리므로 48/96/192를 함께 올린다.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/favicon-192.png',
  },
  // 카톡·SNS 링크 미리보기 — 제목은 짧게, 설명에 히어로 문구를 그대로 싣는다
  openGraph: {
    title: '위플로우 WEFLOW',
    description: '내가 진짜 원하는 페이지 - 우리만의 플로우를 담다, WEFLOW',
    url: 'https://weflowlab.kr',
    siteName: 'WEFLOW',
    images: [{ url: '/images/main/og-logo-2.webp', width: 1200, height: 630 }],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '위플로우 WEFLOW',
    description: '내가 진짜 원하는 페이지 - 우리만의 플로우를 담다, WEFLOW',
    images: ['/images/main/og-logo-2.webp'],
  },
  verification: {
    other: {
      'naver-site-verification': '273b65c0c97f6eb30704a68b165015c3e1c7d5fb',
    },
  },
}

// 검색엔진에 넘기는 사업자 정보 (구글 지식 패널·리치 결과용).
// 화면에 보이는 /about 의 사업자 정보와 값을 맞춰야 한다.
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'WEFLOW',
  alternateName: '위플로우',
  url: 'https://weflowlab.kr',
  logo: 'https://weflowlab.kr/logo.png',
  image: 'https://weflowlab.kr/images/main/og-logo-2.webp',
  description:
    '홈페이지 제작부터 광고 연동·운영 관리까지, 단순 제작이 아닌 문의 구조까지 설계하는 홈페이지 제작 전문 업체.',
  email: 'contact@weflowlab.kr',
  telephone: '+82-10-2971-7280',
  founder: { '@type': 'Person', name: '신서준' },
  taxID: '884-07-03480',
  // 판매가를 화면에서 숨긴 상태(price: "?")라 금액 범위 대신 상담 안내로 둔다.
  // 가격을 다시 공개하면 원래대로 makePlans 에서 조합해 넣는다.
  priceRange: '상담 문의',
  areaServed: { '@type': 'Country', name: '대한민국' },
  serviceType: ['홈페이지 제작', '랜딩페이지 제작', '광고 운영 대행'],
}

// html·body 뼈대 — 공통 UI로 감싸고 방문 추적기를 함께 실행한다
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <FontLoader />
        {/*
         * 브라우저의 스크롤 위치 복원을 끈다.
         * 화면이 그려지기 전(HTML 파싱 중)에 실행돼야 복원 자체가 일어나지 않는다.
         * 하이드레이션 이후에 끄면 이미 복원된 뒤라, 되돌리려고 맨 위로 튕기는 동작이 필요해진다.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual'}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <NaverAds />
        <Smartlog />
        <PageTracker />
      </body>
    </html>
  )
}
