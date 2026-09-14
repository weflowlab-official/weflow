'use client'
import { usePathname } from 'next/navigation'
import { adCarouselJsonLd } from '@/lib/adCarouselJsonLd'

/**
 * 캐러셀 구조화 데이터(JSON-LD) 한 줄.
 * 네이버가 검색 결과와 광고 '웹사이트정보' 확장소재에서 이걸 읽어 가로 카드 띠로 그린다.
 *
 * 캐러셀은 /service·/difference·/benefits 세 곳에만 단다. 나머지 페이지는
 * 전용 og 이미지를 달았고, 검색 결과에서 둘이 같은 자리를 두고 다투므로 싣지 않는다.
 * 가이드가 "한 페이지에 ItemList 하나" 를 권하므로 항상 하나만 싣는다.
 * 클라이언트 컴포넌트지만 서버 렌더링 HTML 에 그대로 실려 크롤러가 읽을 수 있다.
 */
export default function AdCarouselJsonLd() {
  const pathname = usePathname()
  const data = adCarouselJsonLd(pathname)
  // 캐러셀을 달지 않는 페이지 — 빈 script 도 남기지 않는다
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
