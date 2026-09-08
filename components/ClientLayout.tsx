'use client'
import { usePathname } from 'next/navigation'
import PromoBanner from './PromoBanner'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import PcPromoWidgets from './PcPromoWidgets'
import AdCarouselJsonLd from './AdCarouselJsonLd'

/**
 * 모든 페이지를 감싸는 공통 껍데기 — 상단 배너·헤더 · 본문 · 푸터 · 하단 바.
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
      <div style={{ position: 'sticky', top: 0, zIndex: 201 }}>
        <PromoBanner />
        <Navbar />
      </div>
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <PcPromoWidgets />
    </>
  )
}
