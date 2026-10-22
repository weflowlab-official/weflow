// 업종 구조의 단일 출처. 큰 업종 = 블로그 카테고리(메뉴바), 세부업종 = 글의 '세부업종' 칸.
// 세부업종 이름은 홈페이지 제작사례(data/cases.ts 의 categoryOrder)와 같은 말을 쓴다 — 사례 페이지와 블로그가 같은 업종 이름으로 이어지게.
// 예외: 병의원은 따로 큰 업종으로 빼고 진료과를 세부업종으로 둔다 (사례의 '의료/병원' 한 칸으로는 좁다).
// - 시드: 큰 업종을 카테고리로 만든다 (slug·이름·설명·순서)
// - Posts 컬렉션: 세부업종 선택지
// - 프론트: 메뉴 드롭다운, 카테고리 페이지의 세부업종 칩
// 큰 업종 slug 를 관리자에서 바꾸면 세부업종 연결이 끊기므로 바꾸지 않는다 (이름·설명은 관리자에서 바꿔도 된다).

export type SubIndustry = { slug: string; name: string };
export type IndustryGroup = { slug: string; name: string; description: string; subs: SubIndustry[] };

export const INDUSTRY_GROUPS: IndustryGroup[] = [
  {
    // 병의원은 웹블로그 수요가 가장 큰 업종이라 맨 앞 (홍보 페이지 /clinic-blog 와 이어진다). 세부업종은 진료과
    slug: "clinic",
    name: "병의원",
    description: "치과·피부과·한의원·정형외과처럼 환자가 먼저 검색하고 찾아오는 병의원의 웹블로그",
    subs: [
      { slug: "dental", name: "치과" },
      { slug: "dermatology", name: "피부과·성형외과" },
      { slug: "korean-medicine", name: "한의원" },
      { slug: "orthopedics", name: "정형외과·통증의학과" },
      { slug: "ophthalmology", name: "안과" },
      { slug: "internal-pediatrics", name: "내과·소아청소년과" },
    ],
  },
  {
    slug: "car-leisure",
    name: "차량·레저",
    description: "타이어·정비·렌터카·특장차부터 캠핑장까지, 차량·레저 업종에 웹블로그가 필요한 이유",
    subs: [
      { slug: "car-tire", name: "차량/타이어" },
      { slug: "camping-leisure", name: "캠핑/레저" },
    ],
  },
  {
    slug: "finance-pro",
    name: "금융·전문직",
    description: "보험설계사·금융 상담·법률·세무·부동산처럼 신뢰가 먼저인 업종의 웹블로그",
    subs: [
      { slug: "finance-insurance", name: "금융/보험" },
      { slug: "law-tax", name: "법률/세무" },
      { slug: "real-estate", name: "부동산" },
    ],
  },
  {
    slug: "business",
    name: "기업·제조",
    description: "회사 소개를 넘어 검색에서 거래처를 만나는 기업·제조·쇼핑몰 웹블로그",
    subs: [
      { slug: "corporate", name: "기업/비즈니스" },
      { slug: "manufacturing", name: "제조/공장" },
      { slug: "shopping-mall", name: "쇼핑몰/결제" },
    ],
  },
  {
    slug: "life-service",
    name: "생활·서비스",
    description: "인테리어·청소·이사·반려동물·웨딩·행사처럼 지역 검색으로 고객을 만나는 업종",
    subs: [
      { slug: "interior", name: "인테리어" },
      { slug: "cleaning-moving", name: "청소/이사" },
      { slug: "pet", name: "반려동물" },
      { slug: "wedding-studio", name: "웨딩/스튜디오" },
      { slug: "event", name: "이벤트/행사" },
    ],
  },
  {
    slug: "health-beauty",
    name: "뷰티·헬스",
    description: "미용실·네일·피부관리·피트니스처럼 고객이 먼저 찾아보고 결정하는 업종의 웹블로그",
    subs: [
      { slug: "beauty", name: "뷰티/미용" },
      { slug: "fitness", name: "헬스/피트니스" },
    ],
  },
  {
    slug: "edu-food-stay",
    name: "교육·외식·숙박",
    description: "학원·음식점·카페·펜션처럼 후기와 정보로 선택받는 업종의 웹블로그",
    subs: [
      { slug: "academy", name: "학원/교육" },
      { slug: "restaurant-cafe", name: "음식점/카페" },
      { slug: "pension-stay", name: "펜션/숙박" },
    ],
  },
  {
    slug: "guide",
    name: "웹블로그 가이드",
    description: "웹블로그가 검색엔진에 등록되는 과정, SEO·AEO·GEO, AI 검색 인용까지 업종과 상관없이 알아 두면 좋은 이야기",
    subs: [],
  },
];

export const ALL_SUB_INDUSTRIES: (SubIndustry & { group: string })[] = INDUSTRY_GROUPS.flatMap((g) =>
  g.subs.map((s) => ({ ...s, group: g.slug })),
);

export const subIndustriesOf = (groupSlug: string): SubIndustry[] => INDUSTRY_GROUPS.find((g) => g.slug === groupSlug)?.subs ?? [];

export const subIndustryName = (slug?: string | null): string | undefined =>
  slug ? ALL_SUB_INDUSTRIES.find((s) => s.slug === slug)?.name : undefined;

// 관리자 선택지: "차량·레저 › 차량/타이어"
export const SUB_INDUSTRY_OPTIONS = INDUSTRY_GROUPS.flatMap((g) => g.subs.map((s) => ({ label: `${g.name} › ${s.name}`, value: s.slug })));
