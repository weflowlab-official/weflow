// /service 전용 메타데이터.
// 페이지 본문(page.tsx)이 'use client'라 metadata를 직접 export할 수 없어
// 레이아웃에서 대신 정의한다.
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '서비스 안내 · WEFLOW',
  // 짧으면 네이버가 버리고 본문을 긁어 온다 — 그대로 쓰이는 /difference(88자) 수준으로 맞춘다
  description:
    '기획·디자인·개발부터 운영 관리까지, WEFLOW가 홈페이지를 만드는 여섯 단계를 순서대로 안내합니다. 각 단계에서 무엇을 하는지 확인하세요.',
  alternates: { canonical: '/service' },
  openGraph: {
    title: '서비스 안내 · WEFLOW',
    description:
      '기획·디자인·개발부터 운영 관리까지, WEFLOW의 홈페이지 제작 서비스 전 과정을 안내합니다.',
    url: '/service',
    // 전용 og 그림이 아직 없다. 적지 않으면 루트 것까지 덮여 미리보기가 빈칸이 되므로
    // 루트와 같은 그림을 명시해 둔다 — 전용 그림이 생기면 이 줄만 갈아 끼우면 된다
    images: [{ url: '/images/main/og-logo-2.jpg', width: 1200, height: 630 }],
  },
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children
}
