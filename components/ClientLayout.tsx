'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import PcPromoWidgets from './PcPromoWidgets'
import AdCarouselJsonLd from './AdCarouselJsonLd'
import ScrollRestorer from './ScrollRestorer'

/**
 * 모든 페이지를 감싸는 공통 껍데기 — 헤더 · 본문 · 푸터 · 하단 바.
 * 관리자(/admin)는 이 껍데기 없이 본문만 그린다.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {/* 네이버 광고 '웹사이트정보' 확장소재용 강점 캐러셀 — 광고 연결 주소가 어느 페이지든 읽어 갈 수 있게 공통으로 싣는다 */}
      <AdCarouselJsonLd />
      {/* 뒤로·앞으로 갈 때 보고 있던 자리로 되돌린다 (브라우저의 스크롤 복원은 꺼 두었다) */}
      <ScrollRestorer />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <PcPromoWidgets />
    </>
  )
}
