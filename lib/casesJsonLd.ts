// 제작 사례 캐러셀 구조화 데이터 — 네이버 검색광고 '웹사이트정보' 확장소재용.
//
// 네이버는 광고 연결 URL 페이지에서 구조화 데이터(캐러셀 ListItem)를 수집해 확장소재로 쓴다.
// 서치어드바이저 캐러셀 가이드 기준:
//  - ItemList > ListItem, item 안에 name / image / url
//  - image 는 필수 (원본 이미지, 로고·썸네일 금지, 항목끼리 겹치지 않게)
//  - url 은 상대경로가 아닌 절대 URL
//  - position 은 정수, 한 페이지에 ItemList 하나만, 항목 수가 너무 적으면 안 됨
// 광고가 떨어지는 메인·상담·예약 페이지와 /cases 가 같은 데이터를 쓴다.
import { portfolios } from '@/data/cases'

const BASE = 'https://weflowlab.kr'

/** 실제 제작 사례만 (참고용 샘플 제외) — 캐러셀은 진짜 사례여야 한다 */
const realCases = portfolios.filter(p => !p.placeholder && p.images.length > 0)

export const CASES_CAROUSEL_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'WEFLOW 홈페이지 제작 사례',
  description: 'WEFLOW가 직접 제작한 홈페이지 사례 목록.',
  numberOfItems: realCases.length,
  itemListElement: realCases.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'WebSite',
      name: `${p.name} 홈페이지 제작`,
      // 사례 대표 화면(원본 캡처) — 절대 URL
      image: `${BASE}${p.images[0]}`,
      // 상세 페이지가 있으면 우리 사이트 안 상세로, 없으면 실제 사이트로
      url: p.detail ? `${BASE}/cases/${p.slug}` : p.url,
      description: `${p.desc} — ${p.category} 업종, ${p.plan} 플랜으로 제작.`,
    },
  })),
}
