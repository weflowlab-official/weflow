/**
 * 제작 사례 데이터 — 목록(/cases)과 상세(/cases/[slug])가 함께 쓴다.
 *
 * 카드를 누르면 실제 사이트로 바로 나가는 대신 상세 페이지로 들어온다.
 * 완성 화면만 보여주는 것보다 "어떤 요청을 어떻게 풀었는지"가 실력 증명에 낫고,
 * 사이트 안에 머무는 동안 문의로 이어질 자리를 만들 수 있다.
 *
 * detail 이 없는 사례는 상세 페이지를 만들지 않고 예전처럼 실제 사이트로 바로 연결한다.
 * 내용을 다 채우기 전에도 목록이 정상 동작하도록 하기 위함이다.
 */

/** 가격표(/pricing)의 제작 플랜과 같은 이름을 쓴다 — 사례와 가격을 바로 이어 보게 */
export type Plan = '랜딩페이지' | '랜딩형 홈페이지' | '홈페이지'

/** 상세 페이지에서 "무엇에 집중했나" 로 나가는 한 덩어리 */
export interface CasePoint {
  /** 짧게 던지는 소제목 */
  title: string
  /** 한두 문장으로 받는 본문 */
  body: string
}

/**
 * 상세 상단 포스터 배색 — 사례의 브랜드 색으로 첫 화면을 채운다.
 * 스크린샷만 놓는 것보다 "이 프로젝트의 포스터"처럼 보여야 첫인상이 남는다.
 */
export interface CasePoster {
  /** 배경 그라데이션 시작 색 — 더 짙은 쪽 */
  from: string
  /** 배경 그라데이션 끝 색 */
  to: string
  /** 포스터 위 글자 색 — 배경이 어두우면 밝게, 밝으면 어둡게 */
  ink: string
  /** 배경에 크게 깔리는 워터마크 글자 */
  mark: string
}

/** 상세 페이지에만 쓰는 내용 — 없으면 상세를 만들지 않는다 */
export interface CaseDetail {
  /** 상단 한 줄 요약 — 목록의 desc 보다 길게 써도 된다 */
  summary: string
  /** 제작 기간 (예: '1주') */
  duration: string
  /** 상단 포스터 배색 */
  poster: CasePoster
  /**
   * 고객이 실제로 보내온 말 — 각색하지 않고 받은 그대로 쓴다.
   * 지어낸 문장을 따옴표에 넣으면 사실과 달라지므로, 실제 대화가 있을 때만 채운다.
   */
  quotes?: string[]
  /** 어떤 요청이었나 — 위 인용을 받아 상황을 설명한다 */
  background: string
  /** 무엇에 집중했나 — 2~4개 */
  points: CasePoint[]
  /** 제공한 기능 칩 */
  features: string[]
  /** "이렇게 나왔습니다" 에 거는 대표 화면들 — images 중에서 고른 것 */
  results: string[]
}

// 실제 제작 사례 — 사진 여러 장을 한 칸에서 자동 전환한다
export interface Portfolio {
  /** 상세 페이지 주소(/cases/[slug])로도 쓰인다 */
  slug: string
  name: string
  /** 업종 칩으로 거를 때 쓰는 분류 */
  category: string
  /** 어떤 플랜으로 만든 사례인지 — 사진 위 배지로 띄워 가격표와 이어 준다 */
  plan: Plan
  /** 카드 이름 밑 한 줄 소개 */
  desc: string
  /** 상세 페이지의 '사이트 바로가기' 가 여는 실제 제작 사이트 */
  url: string
  /** 한 칸에서 자동 전환되는 화면 사진들 */
  images: string[]
  /** 상세 페이지 내용 — 채워진 사례만 상세로 연결된다 */
  detail?: CaseDetail
  /** 참고용 샘플 카드 — 실제 사례가 아니라서 누를 수 없다 */
  placeholder?: boolean
}

/**
 * 업종 칩을 늘어놓는 순서 — 여기 적힌 차례 그대로 노출된다.
 * 카드 순서(아래 portfolios)와 따로 노니 여기서 정해준다.
 * 여기 없는 업종은 뒤에 붙는다.
 */
// 칩 목록 — 아직 사례가 없는 업종도 포함해 보여준다 (사례는 채워지는 대로 추가)
export const categoryOrder = [
  '기업/비즈니스', '쇼핑몰/결제', '인테리어', '캠핑/레저', '차량/모빌리티', '보험',
  '의료/병원', '뷰티/미용', '학원/교육', '음식점/카페', '법률/세무', '부동산',
  '펜션/숙박', '헬스/피트니스', '반려동물', '제조/공장', '웨딩/스튜디오', '청소/이사',
]

// 목록 페이지의 PortfolioShowcase가 그리는 실제 제작 사례 목록
export const portfolios: Portfolio[] = [
  {
    slug: 'atelier',
    name: '커튼장인',
    category: '인테리어',
    plan: '랜딩형 홈페이지',
    desc: '공간에 맞춰 실측·제작하는 커튼·블라인드 전문',
    url: 'https://ateliercurtain.kr/',
    images: [
      '/images/cases/cases-atelier/cases-atelier-01.webp',
      '/images/cases/cases-atelier/cases-atelier-02.webp',
      '/images/cases/cases-atelier/cases-atelier-03.webp',
      '/images/cases/cases-atelier/cases-atelier-04.webp',
      '/images/cases/cases-atelier/cases-atelier-05.webp',
      '/images/cases/cases-atelier/cases-atelier-06.webp',
      '/images/cases/cases-atelier/cases-atelier-07.webp',
      '/images/cases/cases-atelier/cases-atelier-08.webp',
      '/images/cases/cases-atelier/cases-atelier-09.webp',
      '/images/cases/cases-atelier/cases-atelier-10.webp',
      '/images/cases/cases-atelier/cases-atelier-11.webp',
    ],
    detail: {
      summary: '상담 요청을 받는 데 집중한 홈페이지입니다.',
      duration: '1주',
      poster: { from: '#faf6ed', to: '#eadfcb', ink: '#4b3a27', mark: 'ATELIER' },
      quotes: [
        '예약이랑 상담 문의를 받는 게 목적이에요',
        '뉴트럴·베이지 톤으로 따뜻했으면 좋겠어요',
        '깔끔하고 신뢰감 주는 모던한 스타일로',
        '가독성 좋게 배치해주세요',
      ],
      background:
        '커튼은 공간을 직접 보고 실측해야 값이 나옵니다. 그래서 이 홈페이지의 역할은 판매가 아니라 상담 요청을 받는 것이었습니다.\n광고도 함께 준비하고 있어, 들어온 분이 문의까지 이어지는 흐름이 중요했습니다.',
      points: [
        {
          title: '따뜻하면서 단정하게',
          body:
            '베이지와 아이보리처럼 튀지 않는 색으로 바탕을 깔고, 원단 사진을 크게 넣었습니다. 화면이 조용해야 커튼 색과 질감이 제대로 보입니다.',
        },
        {
          title: '한 화면에 한 가지만',
          body:
            '정보를 빽빽하게 채우는 대신 여백을 넉넉히 두었습니다. 스크롤을 따라 하나씩 나오도록 배치했습니다.',
        },
        {
          title: '광고에서 상담까지',
          body:
            '광고를 보고 들어온 분이 첫 화면에서 무엇을 하는 곳인지 바로 알 수 있게 했습니다. 어디서 읽기를 멈추더라도 상담 버튼이 손에 닿습니다.',
        },
        {
          title: '경력을 숫자로',
          body:
            '오랜 경력과 누적 시공 건수를 상단에 배치했습니다. 긴 설명보다 숫자 하나가 먼저 신뢰를 만듭니다.',
        },
      ],
      features: ['관리자 페이지', '상담 문의 접수', 'FAQ 직접 관리', '제품 갤러리', '방문자 통계', '엑셀 내보내기'],
      results: [
        '/images/cases/cases-atelier/cases-atelier-04.webp',
        '/images/cases/cases-atelier/cases-atelier-07.webp',
        '/images/cases/cases-atelier/cases-atelier-08.webp',
        '/images/cases/cases-atelier/cases-atelier-09.webp',
        '/images/cases/cases-atelier/cases-atelier-10.webp',
      ],
    },
  },
  {
    slug: 'kpsc',
    name: 'KPSC',
    category: '기업/비즈니스',
    plan: '홈페이지',
    desc: '지속 가능한 미래 에너지 생태계 구축',
    url: 'https://kpschelpus.vercel.app/',
    images: [
      '/images/cases/cases-kpsc/cases-kpsc-01.webp',
      '/images/cases/cases-kpsc/cases-kpsc-02.webp',
      '/images/cases/cases-kpsc/cases-kpsc-03.webp',
      '/images/cases/cases-kpsc/cases-kpsc-04.webp',
      '/images/cases/cases-kpsc/cases-kpsc-05.webp',
      '/images/cases/cases-kpsc/cases-kpsc-06.webp',
      '/images/cases/cases-kpsc/cases-kpsc-07.webp',
      '/images/cases/cases-kpsc/cases-kpsc-08.webp',
      '/images/cases/cases-kpsc/cases-kpsc-09.webp',
      '/images/cases/cases-kpsc/cases-kpsc-10.webp',
    ],
    detail: {
      summary: '보이는 모습은 그대로 두고, 속만 새로 지었습니다.',
      duration: '2주',
      poster: { from: '#0e2c63', to: '#2266cf', ink: '#f2f7ff', mark: 'KPSC' },
      quotes: [
        '지금 홈페이지 구성은 그대로 유지하고 싶어요',
        '주소창에 안전하지 않다고 뜨는 게 신경 쓰입니다',
        '오래된 방식이라 손보기가 어렵다고 하더라고요',
      ],
      background:
        '이미 쓰고 계신 홈페이지가 있었습니다. 다만 10년 전 기술로 만들어져 보안 연결이 되지 않았고, 브라우저가 방문자에게 경고를 띄우는 상태였습니다. 구성은 익숙한 그대로 두면서 기반만 바꾸는 리뉴얼이었습니다.',
      points: [
        {
          title: '보안 경고부터 없애기',
          body:
            '암호화되지 않은 연결이라 방문자에게 "안전하지 않음"이 표시되고 있었습니다. 보안 연결로 옮겨 그 문구가 사라지게 했습니다.\n기관 홈페이지에서는 이 한 줄이 신뢰를 좌우합니다.',
        },
        {
          title: '익숙한 구성은 그대로',
          body:
            '메뉴와 화면 구성을 기존과 같게 유지했습니다. 리뉴얼했다고 이용하시던 분들이 헤매면 안 되니까요. 바뀐 것은 눈에 보이지 않는 부분입니다.',
        },
        {
          title: '앞으로 고칠 수 있는 구조로',
          body:
            '오래된 방식은 수정할 때마다 손이 많이 갑니다. 지금 쓰이는 기술로 다시 세워, 내용을 바꾸거나 기능을 더할 때 부담이 적어졌습니다.',
        },
      ],
      features: ['보안 연결(HTTPS)', '관리자 페이지', '회원가입·로그인', '공지·소식 관리', '갤러리', '문의 접수'],
      results: [
        '/images/cases/cases-kpsc/cases-kpsc-01.webp',
        '/images/cases/cases-kpsc/cases-kpsc-02.webp',
        '/images/cases/cases-kpsc/cases-kpsc-05.webp',
        '/images/cases/cases-kpsc/cases-kpsc-09.webp',
        '/images/cases/cases-kpsc/cases-kpsc-10.webp',
      ],
    },
  },
  {
    slug: 'saedure',
    name: '새두레',
    category: '기업/비즈니스',
    plan: '랜딩페이지',
    desc: '역사와 첨단기술을 잇는 융복합 공연 문화기업',
    url: 'https://mazigut.com/',
    images: [
      '/images/cases/cases-saedure/cases-saedure-01.webp',
      '/images/cases/cases-saedure/cases-saedure-02.webp',
      '/images/cases/cases-saedure/cases-saedure-03.webp',
      '/images/cases/cases-saedure/cases-saedure-04.webp',
      '/images/cases/cases-saedure/cases-saedure-05.webp',
      '/images/cases/cases-saedure/cases-saedure-06.webp',
      '/images/cases/cases-saedure/cases-saedure-07.webp',
      '/images/cases/cases-saedure/cases-saedure-08.webp',
      '/images/cases/cases-saedure/cases-saedure-09.webp',
      '/images/cases/cases-saedure/cases-saedure-10.webp',
      '/images/cases/cases-saedure/cases-saedure-11.webp',
      '/images/cases/cases-saedure/cases-saedure-12.webp',
      '/images/cases/cases-saedure/cases-saedure-13.webp',
      '/images/cases/cases-saedure/cases-saedure-14.webp',
    ],
    detail: {
      summary: '읽는 홈페이지가 아니라, 넘겨 보는 홈페이지로 만들었습니다.',
      duration: '1주',
      poster: { from: '#100e2a', to: '#332c66', ink: '#f2edda', mark: 'SAEDURE' },
      quotes: [
        '글로 읽는 게 아니라 그림책 보듯이 넘어갔으면 좋겠어요',
        '이미지를 최대한 활용해주세요',
      ],
      background:
        '공연을 다루는 팀이라 글보다 장면이 먼저 와닿습니다. 설명을 길게 늘어놓는 대신, 한 장씩 넘겨 보는 그림책처럼 만들어 달라는 요청이었습니다.',
      points: [
        {
          title: '한 장에 한 장면',
          body:
            '화면 하나에 이미지 하나를 크게 두었습니다. 스크롤을 내리는 동작이 책장을 넘기는 것처럼 느껴지도록 간격을 잡았습니다.',
        },
        {
          title: '글은 최소한으로',
          body:
            '설명을 짧게 덜어내 이미지가 먼저 눈에 들어오게 했습니다. 문장이 길어질수록 장면의 힘이 약해집니다.',
        },
        {
          title: '넘기다 보면 이해되도록',
          body:
            '뿌리에서 프로젝트, 협업으로 이어지는 순서를 잡았습니다. 따로 읽지 않아도 넘기다 보면 어떤 팀인지 전해집니다.',
        },
      ],
      features: ['이미지 중심 구성', '스크롤 전환 연출', '프로젝트 소개'],
      results: [
        '/images/cases/cases-saedure/cases-saedure-02.webp',
        '/images/cases/cases-saedure/cases-saedure-06.webp',
        '/images/cases/cases-saedure/cases-saedure-07.webp',
        '/images/cases/cases-saedure/cases-saedure-08.webp',
        '/images/cases/cases-saedure/cases-saedure-10.webp',
      ],
    },
  },
  {
    slug: 'ksmobility',
    name: 'OO맨',
    category: '차량/모빌리티',
    plan: '랜딩페이지',
    desc: '프리미엄 특장 카니발 전문',
    url: 'https://teukjangman.kr/',
    images: [
      '/images/cases/cases-ksmobility/cases-ksmobility-01.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-02.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-03.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-04.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-05.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-06.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-07.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-08.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-09.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-10.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-11.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-12.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-13.webp',
      '/images/cases/cases-ksmobility/cases-ksmobility-14.webp',
    ],
    detail: {
      summary: '차의 값어치가 화면에서도 느껴지도록 만들었습니다.',
      duration: '1주',
      poster: { from: '#121317', to: '#3a3e46', ink: '#f5f6f7', mark: 'CARNIVAL' },
      quotes: [
        'SNS 활동을 한다는 걸로 신뢰감을 주고 싶어요',
        '고객 나이대를 고려한 구성이랑 글씨였으면 좋겠어요',
        '고객이 문의를 남기는 게 가장 큰 목적이에요',
        '블랙&화이트로 모던하고 고급스럽게',
      ],
      background:
        '네 가지 요청이었지만 결국 하나로 모였습니다. 믿음이 가는 화면을 만들어 달라는 것이었습니다. 고가의 차량을 다루는 만큼, 방문자가 처음 마주하는 화면에서 신뢰가 만들어져야 했습니다.',
      points: [
        {
          title: 'SNS를 페이지 안으로',
          body:
            '채널을 보니 꾸준히 활동하고 계셨습니다. 그 모습이 홈페이지에서도 보이도록 안에 담았습니다. 소개 문구보다 실제 활동이 더 잘 전달됩니다.',
        },
        {
          title: '검정과 흰색으로',
          body:
            '색을 절제하고 여백을 넓혀 차량 사진이 앞에 서게 했습니다. 화면이 조용할수록 차가 돋보입니다.',
        },
        {
          title: '글씨는 크게, 정보는 덜어내고',
          body:
            '고객 나이대를 고려해 본문 글씨를 키우고 한 화면에 담는 내용을 줄였습니다. 편하게 읽혀야 문의까지 이어집니다.',
        },
        {
          title: '문의 하나로 모이게',
          body:
            '브랜드 소개를 읽든 제품을 보든 결국 한 곳으로 향하도록 구성했습니다. 어디서 멈추더라도 문의 버튼이 손에 닿습니다.',
        },
      ],
      features: ['관리자 페이지', '공지·FAQ 직접 관리', '문의 접수', '방문자 통계', '엑셀 내보내기'],
      results: [
        '/images/cases/cases-ksmobility/cases-ksmobility-04.webp',
        '/images/cases/cases-ksmobility/cases-ksmobility-05.webp',
        '/images/cases/cases-ksmobility/cases-ksmobility-07.webp',
        '/images/cases/cases-ksmobility/cases-ksmobility-11.webp',
        '/images/cases/cases-ksmobility/cases-ksmobility-13.webp',
      ],
    },
  },
  {
    slug: 'hrentcar',
    name: 'H렌터카',
    category: '차량/모빌리티',
    plan: '홈페이지',
    desc: '경기·서울 전 지역 합리적인 가격의 렌터카',
    url: 'https://1666-6304.com/',
    images: [
      '/images/cases/cases-hrentcar/cases-hrentcar-01.webp',
      '/images/cases/cases-hrentcar/cases-hrentcar-02.webp',
      '/images/cases/cases-hrentcar/cases-hrentcar-03.webp',
      '/images/cases/cases-hrentcar/cases-hrentcar-04.webp',
      '/images/cases/cases-hrentcar/cases-hrentcar-05.webp',
      '/images/cases/cases-hrentcar/cases-hrentcar-06.webp',
      '/images/cases/cases-hrentcar/cases-hrentcar-07.webp',
    ],
    detail: {
      summary: '쓰던 홈페이지의 뼈대는 살리고, 렌터카에 맞게 다시 입혔습니다.',
      duration: '1주',
      poster: { from: '#0f2a55', to: '#2f5fa8', ink: '#f5f7fb', mark: 'RENT' },
      quotes: [
        '기존 홈페이지 구성은 그대로 두고, 업종만 렌터카로 바꾸고 싶어요',
        '전화 상담 버튼이 어느 화면에서든 바로 보였으면 해요',
        '전문적이고 신뢰감 있으면서도 편안한 분위기였으면 해요',
        '깔끔하고 가독성 좋은 디자인으로 부탁드려요',
      ],
      background:
        '이미 쓰고 있던 홈페이지가 있었습니다. 구성은 마음에 드니 그대로 두고, 업종을 렌터카로 바꿔 달라는 요청이었습니다. 새로 짓는 것보다 어려운 건 "그대로"의 기준입니다. 익숙한 흐름은 지키면서, 렌터카 손님이 먼저 찾는 정보가 앞에 오도록 다시 짰습니다.',
      points: [
        {
          title: '뼈대는 그대로, 내용은 렌터카로',
          body:
            '메뉴 구조와 화면 흐름은 기존 홈페이지를 따랐습니다. 대신 보유 차량과 1일 요금, 영업 지역처럼 렌터카 손님이 먼저 찾는 정보로 채웠습니다.',
        },
        {
          title: '차급별로 나눠 보이게',
          body:
            '경차·소형부터 승합까지 차급별 페이지를 두고 요금을 같은 자리에 붙였습니다. 원하는 차를 빨리 찾고, 전화하기 전에 금액을 가늠할 수 있습니다.',
        },
        {
          title: '전화 한 통으로 이어지게',
          body:
            '24시간 상담이 강점이라 화면 어디서든 전화 상담 버튼이 보이게 했습니다. 이용 절차와 자격·서류를 미리 안내해 상담이 짧아지도록 했습니다.',
        },
        {
          title: '신뢰감은 정돈에서',
          body:
            '남색과 흰색으로 색을 절제하고, 표와 여백으로 정보를 정리했습니다. 화려함보다 읽기 편한 화면이 전문성과 편안함을 함께 줍니다.',
        },
      ],
      features: ['차급별 보유 차량·1일 요금', '영업 지역 안내', '이용 절차 안내', '대여 자격·보험·서류 안내', '자주 묻는 질문', '24시간 전화 상담 연결'],
      results: [
        '/images/cases/cases-hrentcar/cases-hrentcar-01.webp',
        '/images/cases/cases-hrentcar/cases-hrentcar-02.webp',
        '/images/cases/cases-hrentcar/cases-hrentcar-05.webp',
        '/images/cases/cases-hrentcar/cases-hrentcar-06.webp',
        '/images/cases/cases-hrentcar/cases-hrentcar-07.webp',
      ],
    },
  },
  {
    slug: 'cambiocamp',
    name: 'CAMP OO',
    category: '캠핑/레저',
    plan: '홈페이지',
    desc: 'OOO 캠핑장',
    url: 'https://cambiocamp.vercel.app/',
    images: [
      '/images/cases/cases-cambiocamp/cases-cambiocamp-01.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-02.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-03.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-04.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-05.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-06.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-07.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-08.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-09.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-10.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-11.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-12.webp',
      '/images/cases/cases-cambiocamp/cases-cambiocamp-13.webp',
    ],
    detail: {
      summary: '첫 화면에서 쉬고 싶어지는 캠핑장 홈페이지입니다.',
      duration: '1주',
      poster: { from: '#152b1d', to: '#3c684a', ink: '#edf8ef', mark: 'CAMP' },
      quotes: [
        '메인 화면에서 휴식하는 감정이 느껴졌으면 좋겠어요',
        '정보는 깔끔하게 전달됐으면 합니다',
        '그린 계열로 자연스럽고 따뜻하게',
      ],
      background:
        '캠핑장을 찾는 사람은 정보를 확인하기 전에 먼저 분위기를 느낍니다. 좋은 곳이라는 인상이 생긴 뒤에야 객실과 이용 안내를 읽습니다. 그래서 감정이 먼저, 정보가 그다음인 순서로 잡았습니다.',
      points: [
        {
          title: '첫 화면은 쉬는 장면으로',
          body:
            '설명 대신 공간이 주는 느낌을 크게 담았습니다. 들어오자마자 쉬고 싶다는 마음이 들어야 그다음을 읽습니다.',
        },
        {
          title: '그린 계열로 자연스럽게',
          body:
            '초록을 바탕에 두고 색을 절제했습니다. 자연을 다루는 곳이니 화면도 조용해야 어울립니다.',
        },
        {
          title: '정보는 박스로 깔끔하게',
          body:
            '객실과 이용 안내를 이미지 박스 형태로 정리했습니다. 누를 곳이 분명하게 보여야 헤매지 않습니다.',
        },
        {
          title: '보다가 바로 예약',
          body:
            '객실을 둘러보는 동안 예약 버튼이 항상 화면에 남아 있게 했습니다. 마음이 정해진 순간 다른 곳을 찾지 않아도 됩니다.',
        },
      ],
      features: ['관리자 페이지', '객실 소개', '갤러리', '예약 문의', '공지 관리', '방문자 통계'],
      results: [
        '/images/cases/cases-cambiocamp/cases-cambiocamp-01.webp',
        '/images/cases/cases-cambiocamp/cases-cambiocamp-10.webp',
        '/images/cases/cases-cambiocamp/cases-cambiocamp-11.webp',
        '/images/cases/cases-cambiocamp/cases-cambiocamp-12.webp',
        '/images/cases/cases-cambiocamp/cases-cambiocamp-13.webp',
      ],
    },
  },
  {
    slug: 'incar',
    name: 'OO 금융서비스',
    category: '보험',
    plan: '랜딩형 홈페이지',
    desc: '보험설계사 신입 · 경력 공개채용',
    url: 'https://incarr.vercel.app/',
    images: [
      '/images/cases/cases-incar/cases-incar-01.webp',
      '/images/cases/cases-incar/cases-incar-02.webp',
      '/images/cases/cases-incar/cases-incar-03.webp',
      '/images/cases/cases-incar/cases-incar-04.webp',
      '/images/cases/cases-incar/cases-incar-05.webp',
      '/images/cases/cases-incar/cases-incar-06.webp',
      '/images/cases/cases-incar/cases-incar-07.webp',
      '/images/cases/cases-incar/cases-incar-08.webp',
      '/images/cases/cases-incar/cases-incar-09.webp',
      '/images/cases/cases-incar/cases-incar-10.webp',
    ],
    detail: {
      summary: '직업을 바꾸는 결정에 필요한 답을 순서대로 놓았습니다.',
      duration: '1주',
      poster: { from: '#101f3c', to: '#2a4f88', ink: '#eaf2ff', mark: 'RECRUIT' },
      quotes: [
        '설계사 채용이 목적이에요',
        '블루 계열로 신뢰감 있게 해주세요',
        '고급스럽고 전문적인 느낌이면 좋겠습니다',
      ],
      background:
        '직업을 바꾸는 결정이라 방문자가 신중해집니다. 모집 공고만 올려두면 "정말 괜찮은 곳인가"라는 질문이 남습니다.\n궁금해할 순서대로 답을 놓는 것이 중요했습니다.',
      points: [
        {
          title: '블루 계열로 잡은 신뢰감',
          body:
            '금융을 다루는 곳인 만큼 색을 절제하고 파란 계열로 통일했습니다. 화면이 단정할수록 전문적으로 보입니다.',
        },
        {
          title: '궁금한 순서대로 배치',
          body:
            '모집 요강에서 시작해 강점, 지원 혜택, 실지급 사례로 이어지게 했습니다. 읽어 내려가면서 의문이 하나씩 풀리는 순서입니다.',
        },
        {
          title: '문턱을 낮춘 면담 신청',
          body:
            '지원이 아니라 면담 신청으로 첫 단계를 잡았습니다. 부담이 적을수록 연락이 늘어납니다.',
        },
      ],
      features: ['관리자 페이지', '면담 신청 접수', '지원 절차 안내', '방문자 통계'],
      results: [
        '/images/cases/cases-incar/cases-incar-02.webp',
        '/images/cases/cases-incar/cases-incar-04.webp',
        '/images/cases/cases-incar/cases-incar-08.webp',
      ],
    },
  },
  {
    slug: 'leesiyeon',
    name: 'OOO 설계사',
    category: '보험',
    plan: '랜딩형 홈페이지',
    desc: '보장분석 · 연금 · 자산관리 보험 설계',
    url: 'https://leesiyeon.vercel.app/',
    images: [
      '/images/cases/cases-leesiyeon/cases-leesiyeon-01.webp',
      '/images/cases/cases-leesiyeon/cases-leesiyeon-02.webp',
      '/images/cases/cases-leesiyeon/cases-leesiyeon-03.webp',
      '/images/cases/cases-leesiyeon/cases-leesiyeon-04.webp',
      '/images/cases/cases-leesiyeon/cases-leesiyeon-05.webp',
      '/images/cases/cases-leesiyeon/cases-leesiyeon-06.webp',
    ],
    detail: {
      summary: '보험 이야기를 부드럽게 풀어 상담으로 잇습니다.',
      duration: '1주',
      poster: { from: '#eaf6ec', to: '#c9e9d3', ink: '#1d5c38', mark: 'INSURANCE' },
      quotes: [
        '상담 문의를 받는 게 목적이에요',
        '그린 계열이랑 파스텔톤으로 부드럽게',
        '따뜻하면서도 전문적인 느낌이면 좋겠습니다',
      ],
      background:
        '보험은 어렵고 딱딱하다는 인상이 먼저 옵니다. 그 인상을 걷어내지 못하면 상담까지 가지 않습니다.\n전문성은 지키되 문턱을 낮추는 것이 과제였습니다.',
      points: [
        {
          title: '파스텔톤으로 낮춘 문턱',
          body:
            '초록과 파스텔 계열을 써서 딱딱함을 덜어냈습니다. 금융을 다루는 화면이 부드러워지면 물어보기가 쉬워집니다.',
        },
        {
          title: '어려운 말을 덜어내고',
          body:
            '전문 용어 대신 일상적인 표현으로 바꿨습니다. 이해되지 않으면 상담까지 이어지지 않습니다.',
        },
        {
          title: '언제 상담해야 하는지',
          body:
            '결혼, 출산처럼 보험을 점검해야 하는 시기를 짚어 주었습니다. 방문자가 지금이 그때인지 스스로 판단할 수 있게 했습니다.',
        },
      ],
      features: ['관리자 페이지', '상담 신청 접수', '공지 관리', '방문자 통계'],
      results: [
        '/images/cases/cases-leesiyeon/cases-leesiyeon-01.webp',
        '/images/cases/cases-leesiyeon/cases-leesiyeon-02.webp',
        '/images/cases/cases-leesiyeon/cases-leesiyeon-03.webp',
      ],
    },
  },
  {
    slug: 'ruricompany',
    name: 'OO컴퍼니',
    category: '차량/모빌리티',
    plan: '랜딩페이지',
    desc: '신차 할부 · 리스 · 장기렌트 상담',
    url: 'https://ruricompany.vercel.app/',
    images: [
      '/images/cases/cases-ruricompany/cases-ruricompany-01.webp',
      '/images/cases/cases-ruricompany/cases-ruricompany-02.webp',
      '/images/cases/cases-ruricompany/cases-ruricompany-03.webp',
      '/images/cases/cases-ruricompany/cases-ruricompany-04.webp',
      '/images/cases/cases-ruricompany/cases-ruricompany-05.webp',
      '/images/cases/cases-ruricompany/cases-ruricompany-06.webp',
    ],
    detail: {
      summary: '금액을 앞세우지 않고, 오래 머무르게 만들었습니다.',
      duration: '1주',
      poster: { from: '#0b1424', to: '#223c5f', ink: '#e8f0fb', mark: 'MOBILITY' },
      quotes: [
        '고객이 오래 머무르면서 편하게 상담을 남겼으면 해요',
        '조잡해 보이거나 금액이 그대로 노출되는 건 피하고 싶습니다',
        '블루 계열, 파스텔톤으로 신뢰감 있게',
      ],
      background:
        '차량 견적 페이지는 금액을 크게 붙이는 경우가 많습니다. 그러면 가격 비교만 하고 떠나기 쉽고, 화면도 어수선해집니다.\n금액을 앞세우지 않으면서 상담까지 끌고 가는 것이 과제였습니다.',
      points: [
        {
          title: '금액 대신 판단 기준을',
          body:
            '가격을 크게 붙이는 대신 할부·리스·장기렌트를 견줄 수 있게 정리했습니다. 숫자보다 기준이 있어야 상담으로 이어집니다.',
        },
        {
          title: '차분한 화면으로',
          body:
            '파란 계열과 파스텔톤을 써서 색을 절제했습니다. 정보가 많은 업종일수록 화면이 조용해야 오래 머무릅니다.',
        },
        {
          title: '문의는 짧게',
          body:
            '빠른 견적 문의를 따로 두어 최소한의 정보만 남기면 되도록 했습니다. 입력할 것이 많으면 도중에 그만둡니다.',
        },
      ],
      features: ['관리자 페이지', '견적 문의 접수', '차량 소개', '프로모션 관리', '방문자 통계'],
      results: [
        '/images/cases/cases-ruricompany/cases-ruricompany-01.webp',
        '/images/cases/cases-ruricompany/cases-ruricompany-02.webp',
        '/images/cases/cases-ruricompany/cases-ruricompany-03.webp',
      ],
    },
  },
  {
    slug: 'parknara',
    name: 'OOO 컨설턴트',
    category: '보험',
    plan: '랜딩형 홈페이지',
    desc: '보장분석 · 연금 · 자산관리 보험 설계',
    url: 'https://parknara.vercel.app/',
    images: [
      '/images/cases/cases-parknara/cases-parknara-01.webp',
      '/images/cases/cases-parknara/cases-parknara-02.webp',
      '/images/cases/cases-parknara/cases-parknara-03.webp',
      '/images/cases/cases-parknara/cases-parknara-04.webp',
      '/images/cases/cases-parknara/cases-parknara-05.webp',
    ],
    detail: {
      summary: '끝까지 책임진다는 인상을 화면으로 만들었습니다.',
      duration: '1주',
      poster: { from: '#0a0c11', to: '#1c2740', ink: '#eef3ff', mark: 'TRUST' },
      quotes: [
        '끝까지 책임진다는 느낌을 주고 싶어요',
        '블랙 바탕에 블루 계열 포인트로',
        '깔끔하면서 고급스럽고 신뢰감 있게',
        '상담 문의를 받는 게 목적입니다',
      ],
      background:
        '보험은 가입할 때보다 그 뒤가 중요합니다. 하지만 대부분의 페이지가 가입 권유에서 끝나다 보니, 오래 관리한다는 점을 어떻게 전달할지가 과제였습니다.',
      points: [
        {
          title: '검정 바탕에 파란 포인트',
          body:
            '어두운 화면에 파란색만 절제해서 얹었습니다. 색이 적을수록 단정해 보이고, 단정한 화면이 신뢰로 이어집니다.',
        },
        {
          title: '끝까지 책임진다는 이야기',
          body:
            '재산관리부터 보장분석까지 이어지는 관리 영역을 앞에 두었습니다. 상품이 아니라 관계를 먼저 이야기했습니다.',
        },
        {
          title: '기억에 남는 연락처',
          body:
            '24시 상담번호를 외우기 쉬운 형태로 강조했습니다. 급할 때 떠오르는 번호가 되도록 했습니다.',
        },
        {
          title: '카카오톡이라는 문턱 낮은 선택지',
          body:
            '전화가 부담스러운 사람을 위해 카카오톡 상담을 나란히 두었습니다. 시작이 가벼울수록 연락이 늘어납니다.',
        },
      ],
      features: ['관리자 페이지', '상담 신청 접수', '카카오톡 연결', '방문자 통계'],
      results: [
        '/images/cases/cases-parknara/cases-parknara-01.webp',
        '/images/cases/cases-parknara/cases-parknara-02.webp',
        '/images/cases/cases-parknara/cases-parknara-03.webp',
      ],
    },
  },

  // ── 참고용 샘플 사례 — 실제 계약 사례가 아니며 카드가 눌리지 않는다 ──
  {
    slug: 'sample-shop-1',
    name: 'OO스토어',
    category: '쇼핑몰/결제',
    plan: '홈페이지',
    desc: '상품 판매와 온라인 결제 중심의 쇼핑몰',
    url: '',
    images: ['/images/cases/samples/sample-shop-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-shop-2',
    name: 'OO파츠',
    category: '쇼핑몰/결제',
    plan: '홈페이지',
    desc: '규격 부품 실시간 견적·카드 결제 주문 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-shop-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-interior-1',
    name: 'OO인테리어',
    category: '인테리어',
    plan: '홈페이지',
    desc: '시공 사례 갤러리 중심의 인테리어 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-interior-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-car-1',
    name: 'OO오토케어',
    category: '차량/모빌리티',
    plan: '홈페이지',
    desc: '수입차 정비·디테일링 예약 문의 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-car-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-camp-1',
    name: 'OO캠핑장',
    category: '캠핑/레저',
    plan: '홈페이지',
    desc: '사이트 소개와 실시간 예약 안내 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-camp-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-insure-1',
    name: 'OO보험설계',
    category: '보험',
    plan: '홈페이지',
    desc: '보장 분석 상담 신청 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-insure-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-medi-1',
    name: 'OO의원',
    category: '의료/병원',
    plan: '홈페이지',
    desc: '진료 안내와 예약 문의 중심의 병원 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-medi-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-medi-2',
    name: 'OO치과',
    category: '의료/병원',
    plan: '홈페이지',
    desc: '진료 과목·의료진 소개 치과 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-medi-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-beauty-1',
    name: 'OO헤어살롱',
    category: '뷰티/미용',
    plan: '홈페이지',
    desc: '디자이너 소개와 예약 안내 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-beauty-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-beauty-4',
    name: 'OO바버샵',
    category: '뷰티/미용',
    plan: '홈페이지',
    desc: '시그니처 컷 소개·예약 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-beauty-4.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-edu-1',
    name: 'OO영어학원',
    category: '학원/교육',
    plan: '홈페이지',
    desc: '커리큘럼과 상담 신청 중심의 학원 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-edu-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-edu-4',
    name: 'OO코딩스쿨',
    category: '학원/교육',
    plan: '홈페이지',
    desc: '커리큘럼 로드맵 안내 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-edu-4.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-food-2',
    name: 'OO베이커리',
    category: '음식점/카페',
    plan: '홈페이지',
    desc: '시그니처 메뉴 소개 베이커리 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-food-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-food-4',
    name: 'OO브루잉',
    category: '음식점/카페',
    plan: '홈페이지',
    desc: '브랜드 스토리 중심의 브루어리 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-food-4.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-law-1',
    name: 'OO법률사무소',
    category: '법률/세무',
    plan: '홈페이지',
    desc: '분야별 승소 사례와 상담 신청 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-law-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-law-2',
    name: 'OO세무회계',
    category: '법률/세무',
    plan: '홈페이지',
    desc: '기장·신고 서비스 안내 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-law-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-estate-4',
    name: 'OO분양',
    category: '부동산',
    plan: '홈페이지',
    desc: '분양 정보·관심고객 등록 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-estate-4.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-estate-2',
    name: 'OO부동산',
    category: '부동산',
    plan: '홈페이지',
    desc: '단지 정보 중심의 부동산 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-estate-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-stay-3',
    name: 'OO풀빌라',
    category: '펜션/숙박',
    plan: '홈페이지',
    desc: '프라이빗 풀빌라 예약 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-stay-3.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-stay-4',
    name: 'OO게스트하우스',
    category: '펜션/숙박',
    plan: '홈페이지',
    desc: '여행자 커뮤니티형 숙소 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-stay-4.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-fit-1',
    name: 'OO짐',
    category: '헬스/피트니스',
    plan: '홈페이지',
    desc: 'PT·회원권 상담 중심의 헬스장 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-fit-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-fit-2',
    name: 'OO필라테스',
    category: '헬스/피트니스',
    plan: '홈페이지',
    desc: '레슨 소개와 상담 예약 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-fit-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-pet-1',
    name: 'OO펫살롱',
    category: '반려동물',
    plan: '홈페이지',
    desc: '미용 예약 중심의 펫살롱 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-pet-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-pet-2',
    name: 'OO애견유치원',
    category: '반려동물',
    plan: '홈페이지',
    desc: '등하원·알림장 안내 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-pet-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-fact-1',
    name: 'OO정밀',
    category: '제조/공장',
    plan: '홈페이지',
    desc: '가공 설비와 견적 문의 중심의 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-fact-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-fact-2',
    name: 'OO금속',
    category: '제조/공장',
    plan: '홈페이지',
    desc: '설비 현황·시공 사례 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-fact-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-wed-2',
    name: 'OO스튜디오',
    category: '웨딩/스튜디오',
    plan: '홈페이지',
    desc: '촬영 갤러리 중심의 스튜디오 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-wed-2.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-wed-1',
    name: 'OO웨딩홀',
    category: '웨딩/스튜디오',
    plan: '홈페이지',
    desc: '홀 투어 예약 안내 웨딩홀 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-wed-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-clean-1',
    name: 'OO클린',
    category: '청소/이사',
    plan: '홈페이지',
    desc: '입주 청소 견적 문의 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-clean-1.webp'],
    placeholder: true,
  },
  {
    slug: 'sample-clean-2',
    name: 'OO이사',
    category: '청소/이사',
    plan: '홈페이지',
    desc: '포장이사 견적 상담 홈페이지',
    url: '',
    images: ['/images/cases/samples/sample-clean-2.webp'],
    placeholder: true,
  },
]
