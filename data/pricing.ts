/**
 * 가격 데이터 — 제작 플랜(LANDING · BRAND · SIGNATURE)과 리뉴얼 플랜 정의.
 * /pricing 의 플랜 카드, 검색용 구조화 데이터(app/pricing/layout.tsx · app/layout.tsx), llms.txt 가 함께 쓴다.
 * 금액은 계산하지 않고 표시용 문자열 그대로 둔다("690,000원") — 숫자만 뽑아 구조화 데이터에 쓰므로
 * "69만원"처럼 줄여 쓰면 안 된다 (69 로 읽힌다).
 *
 * 50% 할인 프로모션과 관리자 페이지 옵션 가격은 없앴다 — 정가·할인율·옵션 금액 필드도 같이 지웠다.
 * 관리자 페이지는 이제 플랜 구성 안에 들어 있다 (LANDING·BRAND 는 희망 시, SIGNATURE 는 맞춤형 제공).
 */

/** 플랜 카드 한 장에 들어가는 값 */
export interface MakePlan {
  // 리스트 key
  id: string;
  // 카드 제목에 뜨는 상품명 (LANDING, BRAND …) — 대외적으로 이 플랜을 부르는 이름이다
  sub: string;
  // 상품명 아래 한 줄 (원페이지형, 브랜드형 …)
  tagline: string;
  // 카드 좌측 3D 아이콘
  img: string;
  // 인기 플랜 여부 — 파란 테두리·별 태그·반짝이 표시
  highlight: boolean;
  // 카드 안 체크리스트 항목
  features: string[];
  // 판매가
  price: string;
  // 가격 아래 단서 줄 — 한 줄에 하나씩 (월 운영관리 포함 · VAT 별도 …)
  note: string[];
}

// 가격 아래 단서 두 줄 — 모든 플랜이 같다. 첫 줄은 월 운영관리 포함과 VAT, 둘째 줄은 운영관리에 들어가는 일
const NOTE = ["월 운영관리 포함 · VAT 별도", "서버·보안 관리, 정기 점검, 수정, 장애 대응"];

// SIGNATURE 의 체크리스트 — 리뉴얼 플랜도 같은 구성으로 안내하므로 한 곳에 두고 같이 쓴다
const SIGNATURE_FEATURES = [
  "페이지 수 제한 없음",
  "SEO·AEO·GEO 구조 설계",
  "반응형 PC & 모바일 최적화",
  "희망 SNS 문의폼 연동",
  "각 페이지별 URL 생성",
  "페이지 로딩 속도 최적화",
  "맞춤형 관리자 페이지 제공",
];

/**
 * 제작 플랜 3종 — 배열 순서가 곧 카드 배치 순서.
 * 체크리스트를 고치면 /pricing 의 '플랜 상세 비교' 표(app/pricing/page.tsx 의 COMPARE)도 같이 맞춰야 한다.
 */
export const makePlans: MakePlan[] = [
  {
    id: "landing",
    sub: "LANDING",
    tagline: "원페이지형",
    img: "/images/3d-icon/image-3.svg",
    highlight: false,
    features: [
      "원페이지",
      "반응형 PC & 모바일 최적화",
      "희망 SNS 문의폼 연동",
      "헤더 앵커 이동 구성",
      "희망 시 관리자 페이지 제공",
    ],
    price: "690,000원",
    note: NOTE,
  },
  {
    id: "brand",
    sub: "BRAND",
    tagline: "브랜드형",
    img: "/images/3d-icon/image-4.svg",
    highlight: false,
    features: [
      "페이지 수 제한 없음",
      "반응형 PC & 모바일 최적화",
      "희망 SNS 문의폼 연동",
      "각 페이지별 URL 생성",
      "페이지 로딩 속도 최적화",
      "희망 시 관리자 페이지 제공",
    ],
    price: "1,690,000원",
    note: NOTE,
  },
  {
    id: "signature",
    sub: "SIGNATURE",
    tagline: "풀패키지",
    img: "/images/3d-icon/image-5.svg",
    highlight: true,
    features: SIGNATURE_FEATURES,
    price: "2,190,000원",
    note: NOTE,
  },
];

/**
 * 리뉴얼 플랜 — 신규 제작이 아니라 "기존 사이트 개편"이라 규모 사다리(LANDING → BRAND → SIGNATURE)와
 * 축이 달라 makePlans 배열에 넣지 않고 따로 둔다. 화면에서도 3장 아래에 한 장으로 떨어뜨린다.
 * 섞으면 안 되는 실무적 이유도 있다 — app/pricing/layout.tsx 가 makePlans 의 price 를 숫자로
 * 파싱해 구조화 데이터의 lowPrice·highPrice 를 만드는데, "가격 협의"는 NaN 이 된다.
 * 금액이 확정되면 아래 문자열만 채우면 카드가 그대로 따라온다.
 */
export const renewPlan: MakePlan = {
  id: "renew",
  sub: "홈페이지 리뉴얼",
  tagline: "기존 사이트 개편형",
  img: "/images/3d-icon/renew.png",
  highlight: false,
  // SIGNATURE 와 동일 구성으로 안내한다
  features: SIGNATURE_FEATURES,
  price: "가격 협의",
  note: NOTE,
};
