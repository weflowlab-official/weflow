// /booking 전용 메타데이터 (page.tsx가 'use client'라 여기서 정의한다)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '상담 예약 · WEFLOW',
  description:
    '원하는 날짜와 시간을 골라 WEFLOW 홈페이지 제작 상담을 예약하세요.',
  alternates: { canonical: '/booking' },
  // 메뉴에서 내린 페이지 — 검색 결과에도 나오지 않게 한다 (주소로 직접 오는 건 그대로)
  robots: { index: false, follow: false },
  openGraph: {
    title: '상담 예약 · WEFLOW',
    description: '원하는 날짜와 시간을 골라 WEFLOW 홈페이지 제작 상담을 예약하세요.',
    url: '/booking',
    // 전용 og 그림이 아직 없다. 적지 않으면 루트 것까지 덮여 미리보기가 빈칸이 된다
    images: [{ url: '/images/main/og-logo-2.webp', width: 1200, height: 630 }],
  },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children
}
