import { AD_CAROUSEL_JSON_LD } from '@/lib/adCarouselJsonLd'

/**
 * WEFLOW 강점 캐러셀 구조화 데이터(JSON-LD) 한 줄.
 * 네이버 광고 '웹사이트정보' 확장소재가 광고 연결 URL에서 이걸 수집한다.
 * 공통 껍데기(ClientLayout)에서 관리자 페이지를 뺀 모든 페이지에 한 번씩 싣는다.
 * 클라이언트 페이지에서 불러도 서버 렌더링 HTML 에 그대로 실려 크롤러가 읽을 수 있다.
 */
export default function AdCarouselJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(AD_CAROUSEL_JSON_LD) }}
    />
  )
}
