// 캐러셀 구조화 데이터 — 네이버 검색 결과와 검색광고 '웹사이트정보' 확장소재에 쓰인다.
//
// 네이버는 페이지에서 ItemList(ListItem)를 읽어 가로 카드 띠로 그린다.
// 서치어드바이저 캐러셀 가이드 기준:
//  - ItemList > ListItem, 각 항목에 image 필수(절대 URL). name·url·position 은 선택
//  - 한 페이지에 ItemList 하나만
//  - 개수가 적은 listItem 은 쓰지 않는다
//  - 이미지는 원본을 쓰고, 항목끼리 겹치지 않게. 로고·기본 이미지는 쓰지 않는다
//  - 노출 여부와 형식은 보장하지 않는다 (가이드에 명시)
//
// 2026-09-16 에 아임웹(imweb.me)을 뜯어보고 알게 된 것 — 그전에 여기 적어 둔 추측 두 개가 틀렸다:
//  - 띠는 가로로 스크롤된다. 오른쪽 화살표가 붙는다.
//    "앞 5칸이 전부"라고 적어 두고 그 근거로 타일을 5장까지 줄였는데, 근거가 없었다
//  - 띠가 꼭 ItemList 에서 나오는 것도 아니다. imweb.me/blog 는 구조화 데이터가 한 줄도 없는데
//    네이버가 본문 글 목록(썸네일+제목)을 읽어 스스로 띠를 그린다
//
// 네이버가 그림을 고르는 순서로 보이는 것:
//  리스트형 페이지 → 카드 띠 (og 는 무시) / 그 외 → og:image / 둘 다 없으면 본문 이미지
//
// 이미지 형식이 중요하다. imweb 은 사이트 전체에 WebP 가 한 장도 없고(PNG 272·JPG 119)
// og 와 카드가 모두 검색 결과에 나온다. 우리는 전부 WebP 였고 한 장도 안 나왔다.
// 그래서 카드는 PNG(글자라 무손실이 선명하다), og 는 JPG(사진)로 내보낸다.
//
// 캐러셀은 강점 페이지 세 곳에만 단다. 나머지 여섯 곳은 페이지 전용 og 이미지를 달았다
// (리스트형이 아니라 og 가 쓰이는 쪽이다).

const BASE = 'https://weflowlab.kr'

/** 타일 한 장 — 이미지는 필수, 나머지는 선택 */
interface Tile {
  name: string
  /** public 기준 경로. 절대 URL 로 바꿔서 내보낸다 */
  img: string
  /** 누를 곳이 있는 항목만 */
  url?: string
}

/**
 * 강점 페이지 세 곳 전용 카드 — 페이지마다 다섯 장씩 찍었다.
 *
 * 배열 순서가 곧 검색 결과에 깔리는 순서다. 파일명 끝 번호도 같은 순서로 붙어 있어
 * (service-01 … service-05) 순서를 바꾸려면 줄과 파일을 함께 옮겨야 한다.
 *
 * 카드 문구가 그림 안에 글자로 박혀 있다. 그래서 name 은 카드에 적힌 제목·설명을
 * 그대로 옮긴 것이다 — 여기만 고치면 검색 결과의 글자와 그림이 어긋난다.
 *
 * 카드 배색이 남·흰으로 번갈아 간다. 순서를 바꾸면 같은 색이 붙을 수 있다.
 * 열다섯 장이 페이지끼리 한 장도 겹치지 않는다.
 */
const SERVICE_TILES: Tile[] = [
  /* 남 */ { name: '희망 오픈일 맞춤 — 일정에 맞춰 완성', img: '/images/ads/service-01.png' },
  /* 흰 */ { name: '1:1 집중 관리 — 전담 담당자 배정', img: '/images/ads/service-02.png' },
  /* 남 */ { name: '고객의 소리 — 진짜 원하는 것을 먼저 반영', img: '/images/ads/service-03.png' },
  /* 흰 */ { name: 'PC·모바일 최적화 — 모바일에서도 빠른 로딩', img: '/images/ads/service-04.png' },
  /* 남 */ { name: 'SNS 연동 — 카카오톡·인스타 자유롭게 연결', img: '/images/ads/service-05.png' },
]

const DIFFERENCE_TILES: Tile[] = [
  /* 남 */ { name: '전문 개발자 직접 개발 — 템플릿 없이 처음부터', img: '/images/ads/difference-01.png' },
  /* 흰 */ { name: '최신 기술 활용 — 고퀄리티 기술 직접 개발', img: '/images/ads/difference-02.png' },
  /* 남 */ { name: '고객 맞춤 제작 — 원하는 기능은 무엇이든', img: '/images/ads/difference-03.png' },
  /* 흰 */ { name: '네이버·구글 상위 노출 — 검색에 잡히는 구조 설계', img: '/images/ads/difference-04.png' },
  /* 남 */ { name: '나만의 관리자 페이지 — 문의·예약 유입 통계', img: '/images/ads/difference-05.png' },
]

const BENEFITS_TILES: Tile[] = [
  /* 남 */ { name: '50% 특가 프로모션 — 전상품 50% 할인', img: '/images/ads/benefits-01.png' },
  /* 흰 */ { name: '월 유지보수 무제한 — 고객 맞춤 이미지·문구 수정', img: '/images/ads/benefits-02.png' },
  /* 남 */ { name: '무료 상담 — 연중무휴 24시간 상담', img: '/images/ads/benefits-03.png' },
  /* 흰 */ { name: '합리적 가성비 — 필요한 기능만 부담 없이 시작', img: '/images/ads/benefits-04.png' },
  /* 남 */ { name: '제휴 마케팅 연결 — 블로그·인스타 플레이스까지', img: '/images/ads/benefits-05.png' },
]

/**
 * 경로 → 그 페이지가 쓸 타일. 여기 없는 페이지는 캐러셀을 달지 않는다.
 *
 * 지금은 다섯 장씩이다. 원래 열다섯 장을 다 실었다가 "앞 5칸이 전부"라는 잘못된 전제로
 * 줄인 것이라, 가이드의 "개수가 적은 listItem 은 쓰지 않는다" 에 걸릴 수 있다.
 * 형식(WebP→PNG)을 바꾼 효과를 먼저 확인한 뒤, 안 되면 개수를 되돌려 본다.
 */
const BY_PATH: { prefix: string; tiles: Tile[]; name: string }[] = [
  { prefix: '/service', tiles: SERVICE_TILES, name: 'WEFLOW 홈페이지 제작 서비스' },
  { prefix: '/difference', tiles: DIFFERENCE_TILES, name: 'WEFLOW 제작 방식의 차이' },
  { prefix: '/benefits', tiles: BENEFITS_TILES, name: 'WEFLOW 홈페이지 제작 혜택' },
]

/** 타일 묶음을 네이버가 읽는 ItemList 로 바꾼다 */
function toItemList(tiles: Tile[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: tiles.length,
    itemListElement: tiles.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      image: t.img.startsWith('http') ? t.img : `${BASE}${t.img}`,
      ...(t.url ? { url: t.url } : {}),
    })),
  }
}

/**
 * 현재 경로에 맞는 캐러셀 하나 — 한 페이지에 ItemList 는 하나만 둔다.
 * 캐러셀을 달지 않는 페이지에서는 null 을 준다.
 */
export function adCarouselJsonLd(pathname: string) {
  const match = BY_PATH.find(x => pathname === x.prefix || pathname.startsWith(`${x.prefix}/`))
  return match ? toItemList(match.tiles, match.name) : null
}
