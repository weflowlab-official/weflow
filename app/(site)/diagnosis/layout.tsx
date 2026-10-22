// /diagnosis 전용 메타데이터 (page.tsx가 'use client'라 여기서 정의한다)
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '홈페이지 맞춤 견적 · WEFLOW',
  // 짧으면 네이버가 버리고 본문을 긁어 온다 — 그대로 쓰이는 /difference(88자) 수준으로 맞춘다
  description:
    '간단한 정보만 남기시면 24시간 이내에 연락드립니다. 지금 쓰는 홈페이지 검토부터 업종에 맞는 제작 방향과 맞춤 견적까지 무료로 안내해 드립니다.',
  alternates: { canonical: '/diagnosis' },
  openGraph: {
    title: '홈페이지 맞춤 견적 · WEFLOW',
    description:
      '지금 쓰는 홈페이지를 무료로 검토받고, 업종에 맞는 제작 방향과 맞춤 견적을 받아보세요.',
    url: '/diagnosis',
    // openGraph 를 정의하면 루트의 것을 통째로 덮어쓴다 — 이미지도 여기서 다시 지정해야 한다
    images: [{ url: '/images/og/diagnosis.jpg', width: 1200, height: 630 }],
  },
}

export default function DiagnosisLayout({ children }: { children: React.ReactNode }) {
  return children
}
