// 메인 솔루션 섹션(월계수 밴드 + 신뢰 지표 + 강점 6종)에 쓰는 데이터.
// 숫자를 여기 한곳에 모아둔 이유 — 월계수 문구와 통계 밴드가 같은 값을 쓰기 때문에
// 따로 적어두면 한쪽만 고쳐져 서로 어긋난다.

// 실제 숫자가 정해지면 아래 두 값만 숫자로 바꾸면 된다.
// 월계수 문구와 통계 밴드가 같은 값을 참조하므로 한쪽만 어긋날 일이 없다.
export const CAREER_YEARS: number | 'N' = 'N' // 홈페이지 제작 연차
export const TOTAL_PROJECTS: number | 'N' = 'N' // 누적 제작 건수

export type TrustStat = {
  /** 숫자가 아니면('N'·'AI' 등) 플레이스홀더·문자 그대로 노출 */
  end: number | string
  suffix: string
  label: string
  /** 천 단위 콤마 */
  format?: boolean
  /** 뷰포트 진입 시 카운트업 (숫자일 때만 동작) */
  animate?: boolean
  /** 색 부각 칸 — 파란 배경, 모바일에서는 첫 줄로 끌어올린다 */
  highlight?: boolean
  /** 값 위에 별점(★★★★★) 한 줄 */
  stars?: boolean
  /** 숫자 뒤에 붙는 문구 — 카운트업과 같은 속도로 글자가 드러난다 (예: '할인') */
  tail?: string
  /** 값에 형광펜 밑줄 (tail 이 있으면 자동 적용) */
  pen?: boolean
}

export const TRUST: TrustStat[] = [
  { end: 50, suffix: '%', tail: '할인', label: '특별 프로모션', animate: true, stars: true },
  { end: 100, suffix: '%', label: '고객 맞춤 제작', animate: true, stars: true, pen: true },
  { end: '최신 기술 활용', suffix: '', label: '위플로우를 선택해야 하는 이유', animate: true, highlight: true, stars: true },
  { end: '희망 오픈일 맞춤', suffix: '', label: '제작 시기', animate: true, highlight: true, stars: true },
  { end: 100, suffix: '%', label: 'PC·모바일 최적화', animate: true },
  { end: 0, suffix: '원', label: '무료 상담 비용' },
]

export type StrengthIconName =
  | 'ruler'
  | 'userCheck'
  | 'code'
  | 'palette'
  | 'shield'
  | 'stethoscope'

export type Strength = {
  icon: StrengthIconName
  title: string
  desc: string
  /** 파란 카드로 강조 */
  highlight?: boolean
}

export const STRENGTH: {
  eyebrow: string
  intro: string
  items: Strength[]
} = {
  eyebrow: 'SOLUTION',
  intro: 'WEFLOW_위플로우는',
  // 이 배열 순서 = PC(6열) 배치 순서다. 강조 두 칸이 가운데(3·4번째)에 오도록 짜여 있다.
  // 모바일(2열)에서는 강조 두 칸에 order:-1 이 걸려 맨 윗줄로 올라온다 — SolutionSection 의 CSS 참고.
  items: [
    {
      icon: 'code',
      title: '전문 개발자 직접 제작',
      desc: '외주 없이 개발자가\n직접 설계하고 구현',
    },
    {
      icon: 'palette',
      title: '트렌디한 디자인',
      desc: '최신 흐름을 반영한\n브랜드 맞춤 디자인',
    },
    {
      icon: 'ruler',
      title: '100% 맞춤 제작',
      desc: '템플릿이 아닌\n브랜드에 맞춘 설계',
      highlight: true,
    },
    {
      icon: 'userCheck',
      title: '1:1 집중 관리',
      desc: '전담 담당자가\n처음부터 끝까지 함께',
      highlight: true,
    },
    {
      icon: 'shield',
      title: '꼼꼼한 마무리',
      desc: '제작 후에도 책임지는\n유지보수와 관리',
    },
    {
      icon: 'stethoscope',
      title: '무료 홈페이지 상담',
      desc: '현재 상태를 먼저 살펴보고\n투명한 비용 안내',
    },
  ],
}

// 실시간 문의 보드(연출용) — 업종 × 마스킹 이름 × 문의 유형을 무작위로 조합해 띄운다.
// 홈페이지 제작은 원격이라 지역은 의미가 없다. 대신 제작 사례의 업종 칩과 같은 축을 쓴다.
// 같은 항목을 여러 번 넣어 등장 확률을 가중한다 — 기업/비즈니스가 가장 자주 보이게
export const LIVE_INDUSTRIES = [
  '기업/비즈니스 업종',
  '기업/비즈니스 업종',
  '기업/비즈니스 업종',
  '기업/비즈니스 업종',
  '인테리어 업종',
  '차량/모빌리티 업종',
  '캠핑 업종',
  '금융 업종',
  '역사 관련 업종',
]

export const LIVE_SURNAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍',
  '유', '고', '문', '양', '손', '배', '백', '허', '남', '심',
]

// 실제 폼의 제작 종류(projectTypes)와 같은 이름을 쓴다 — 연출이라도 실제 선택지와 어긋나지 않게.
// 중복 개수 = 등장 비중: 신규 제작 20% · 리뉴얼 80%
export const LIVE_INQUIRY_TYPES = [
  '신규 제작',
  '리뉴얼',
  '리뉴얼',
  '리뉴얼',
  '리뉴얼',
]
