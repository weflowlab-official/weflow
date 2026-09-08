// WEFLOW 강점 캐러셀 구조화 데이터 — 네이버 검색광고 '웹사이트정보' 확장소재용.
//
// 네이버는 광고 연결 URL 페이지에서 구조화 데이터(캐러셀 ListItem)를 수집해 광고 아래 슬라이드로 붙인다.
// 서치어드바이저 캐러셀 가이드 기준:
//  - ItemList > ListItem, 각 항목에 image 필수 (원본 이미지, 로고 금지, 항목끼리 겹치지 않게)
//  - name·url 은 선택 — 강점 타일엔 링크를 넣지 않고(광고 연결 URL 로만 가게), 메인 타일만 메인으로 연결
//  - image 는 절대 URL, position 은 정수, 한 페이지에 ItemList 하나만
// 이미지는 public/images/ads/strength-0N.webp — 강점 문구를 큼직하게 넣은 600×600 타일 9장.
// 문구·이미지를 바꾸려면 타일을 다시 만들어 같은 파일명으로 올리고 아래 name 만 맞춘다.

const BASE = 'https://weflowlab.kr'

/** 타일 순서대로(메인 다음 흰·남색 번갈아) — 파일명 strength-01 ~ 09 와 짝 */
const STRENGTHS = [
  '최신 기술 활용 — 고퀄리티 기술 직접 개발',
  '전문 개발자 직접 제작 — 템플릿 없이 처음부터',
  '1:1 집중 관리 — 전담 담당자 배정',
  '희망 오픈일 맞춤 — 일정에 맞춰 완성',
  'PC·모바일 최적화 — 모바일에서도 빠른 로딩',
  '고객 맞춤 제작 — 원하는 기능은 무엇이든',
  '네이버·구글 상위 노출 — 검색에 잡히는 구조 설계',
  '나만의 관리자 페이지 — 문의·예약·유입 통계',
  '무료 상담 — 연중무휴 24시간 상담',
]

export const AD_CAROUSEL_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'WEFLOW 홈페이지 제작 강점',
  description: 'WEFLOW 홈페이지 제작 서비스의 강점 9가지.',
  numberOfItems: STRENGTHS.length + 1,
  itemListElement: [
    // 1번은 메인 — 이것만 링크를 단다 (public/images/ads/main.webp)
    {
      '@type': 'ListItem',
      position: 1,
      name: 'WEFLOW 홈페이지 제작 — 내가 진짜 원하는 페이지',
      image: `${BASE}/images/ads/main.webp`,
      url: `${BASE}/`,
    },
    ...STRENGTHS.map((name, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name,
      image: `${BASE}/images/ads/strength-0${i + 1}.webp`,
    })),
  ],
}
