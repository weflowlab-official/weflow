'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import PcPromoWidgets from './PcPromoWidgets'
import AdCarouselJsonLd from './AdCarouselJsonLd'
import ScrollRestorer from './ScrollRestorer'
import WebBlogPopup from './WebBlogPopup'

/**
 * 모든 페이지를 감싸는 공통 껍데기 — 헤더 · 본문 · 푸터 · 하단 바.
 * 관리자(/admin)는 이 껍데기 없이 본문만 그린다.
 * 병·의원 블로그 홍보 페이지(/clinic-blog)도 메인 사이트와 이어지지 않는 단독 페이지라 껍데기를 뺀다.
 */
const BARE_PATHS = ['/admin', '/clinic-blog']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBare = BARE_PATHS.some(p => pathname.startsWith(p))

  if (isBare) {
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
      {/* 메인 홈에서만 뜨는 '웹블로그란?' 새 탭 알림 */}
      <WebBlogPopup />
    </>
  )
}
