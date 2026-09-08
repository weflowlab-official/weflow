import { CASES_CAROUSEL_JSON_LD } from '@/lib/casesJsonLd'

/**
 * 제작 사례 캐러셀 구조화 데이터(JSON-LD) 한 줄.
 * 네이버 광고 '웹사이트정보' 확장소재가 광고 연결 URL에서 이걸 수집하므로
 * 광고가 떨어지는 페이지(메인·상담·예약·사례)에 넣는다. 한 페이지에 하나만.
 * 클라이언트 페이지에서 불러도 서버 렌더링 HTML 에 그대로 실려 크롤러가 읽을 수 있다.
 */
export default function CasesCarouselJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(CASES_CAROUSEL_JSON_LD) }}
    />
  )
}
