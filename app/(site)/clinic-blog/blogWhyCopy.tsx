import type { ReactNode } from 'react'

/**
 * '그래서, 웹블로그'(BlogWhy.tsx) 글귀 — 병의원 페이지는 치과 예시(CLINIC_WHY),
 * 메인 사이트 '웹블로그란?'(app/(site)/webblog)은 수학학원 예시(GENERAL_WHY)를 쓴다 —
 * 같은 페이지의 다른 예시(휴대폰 AI 대화: 인테리어, PC 검색: 세무)와 업종이 겹치지 않게.
 * 카드 안 화면(데모)에 들어가는 가게 이름·글 제목·배너 문구와, 오른쪽 설명·맺음 문구가 모두 여기 있다.
 */

type Post = { tag: string; title: string; excerpt: string; meta: string }
type ListPost = { title: string; excerpt: string; meta: string }

/** 카드 안 화면 다섯 개에 들어가는 예시 */
export type DemoCopy = {
  brand: string // 가게 이름 (블로그 이름 · 홈페이지 로고)
  domain: string
  oldUrl: string // 01 — 지워지는 빌린 블로그 주소
  ownChip: string
  posts: Post[] // 01 — 글 세 개 (첫 글은 02 AI 답변의 출처, 04 의 글로도 쓰인다)
  q: string // 02 — AI 에게 묻는 말
  a: string
  tabs: string[] // 03 — 카테고리 탭 셋과 탭마다 글 셋
  lists: ListPost[][]
  rsv: { path: string; tag: string; title: [string, string] } // 04 — 글 주소 뒷부분 · 분류 · 두 줄 제목
  home: { nav: string[]; small: string; title: string; cta: string; quick: string[]; now: string; hours: string; notice: string }
  adm: { newPost: string; posts: [string, string]; oldBanner: [string, string]; newBanner: [string, string]; button: string; section: string }
}

export type BlogWhyCopy = {
  where: string // '웹블로그는 ○○ 안의 블로그입니다'
  answers: Record<'search' | 'reserve' | 'own' | 'admin' | 'category', { title: string; desc: ReactNode }>
  end: { eyebrow: string; lead: string; accent: string; desc: string; chips: string[]; href: string; label: string }
  demo: DemoCopy
}

export const CLINIC_WHY: BlogWhyCopy = {
  where: '우리 병원 홈페이지 안',
  answers: {
    search: { title: 'SEO·AEO·GEO\n구조 설계', desc: <>네이버·구글은 물론 AI 답변에서도,{'\n'}우리 병원 글이 출처로 인용되도록<br className="bwy-mo" /> 구조부터 설계합니다.</> },
    reserve: { title: '읽다가 바로\n홈페이지로 연결', desc: '글마다 병원 홈페이지로 가는 버튼이 붙어,\n마음먹은 순간을 놓치지 않습니다.' },
    own: { title: '병원 자산으로\n남는 글', desc: '빌린 블로그가 아니라 병원 주소 아래에 쌓여,\n플랫폼 정책이 바뀌어도 그대로 남습니다.' },
    admin: { title: '관리자 페이지에서\n직접 작성 · 수정', desc: '블로그 글은 물론 홈페이지의 사진과 문구도,\n관리자 페이지에서 바로 바꿉니다.' },
    category: { title: '진료과목별\n카테고리 정리', desc: '환자가 검색하는 말 그대로 나눠,\n관련 글을 이어서 읽게 합니다.' },
  },
  end: { eyebrow: 'WEFLOW FOR CLINIC', lead: '블로그를, ', accent: '병원 안으로.', desc: '우리 병원도 웹블로그로 바꿔 볼까요?', chips: ['AI 검색 인용', '홈페이지 연결', '병원 자산으로', '직접 관리'], href: '#contact-form', label: '무료 견적 신청' },
  demo: {
    brand: '우리병원치과',
    domain: '우리병원.com',
    oldUrl: 'blog.플랫폼.com/우리병원',
    ownChip: '우리 병원 소유',
    posts: [
      { tag: '임플란트', title: '임플란트 수술 후 일주일, 이것만 지켜 주세요', excerpt: '수술 직후 2~3일은 붓기가 가장 심합니다. 냉찜질은 20분씩…', meta: '2026.10.12 · 조회 1,284' },
      { tag: '스케일링', title: '스케일링, 얼마나 자주 받아야 할까요?', excerpt: '건강보험으로 1년에 한 번 받을 수 있는 스케일링, 주기는…', meta: '2026.10.05 · 조회 862' },
      { tag: '사랑니', title: '사랑니는 꼭 빼야 하나요?', excerpt: '똑바로 난 사랑니라면 굳이 뺄 필요는 없습니다. 다만…', meta: '2026.09.28 · 조회 2,031' },
    ],
    q: '임플란트 하고 붓기 며칠 가?',
    a: '보통 2~3일째 가장 붓고, 일주일 안에 가라앉아요.',
    tabs: ['임플란트', '교정', '잇몸치료'],
    lists: [
      [
        { title: '임플란트 수술 후 일주일, 이것만 지켜 주세요', excerpt: '수술 직후 2~3일은 붓기가 가장 심합니다…', meta: '2026.10.12 · 조회 1,284' },
        { title: '임플란트 수명은 얼마나 될까요?', excerpt: '관리만 잘하면 10년 이상 쓰는 경우가 많습니다…', meta: '2026.09.30 · 조회 945' },
        { title: '뼈이식이 필요한 경우', excerpt: '잇몸뼈가 부족하면 임플란트를 단단히 심기 어렵…', meta: '2026.09.18 · 조회 611' },
      ],
      [
        { title: '투명교정과 일반교정, 무엇이 다를까요?', excerpt: '눈에 덜 띄는 대신 하루 착용 시간을 지켜야…', meta: '2026.10.08 · 조회 1,102' },
        { title: '교정 중에 양치하는 법', excerpt: '장치 사이에 낀 음식물은 치간칫솔로…', meta: '2026.09.25 · 조회 734' },
        { title: '성인 교정, 늦지 않았을까요?', excerpt: '잇몸과 뼈가 건강하다면 나이는 크게 상관없…', meta: '2026.09.11 · 조회 1,560' },
      ],
      [
        { title: '양치할 때 피가 난다면 확인할 3가지', excerpt: '잇몸에서 피가 나는 건 염증의 첫 신호일 수…', meta: '2026.10.10 · 조회 2,214' },
        { title: '잇몸이 내려앉는 이유', excerpt: '세게 문지르는 칫솔질이 원인이 되기도 합니다…', meta: '2026.09.27 · 조회 873' },
        { title: '스케일링 후 이가 시린 이유', excerpt: '치석이 덮고 있던 부분이 드러나면서 잠시…', meta: '2026.09.14 · 조회 1,038' },
      ],
    ],
    rsv: { path: 'implant', tag: '임플란트', title: ['임플란트 수술 후 일주일,', '이것만 지켜 주세요'] },
    home: { nav: ['병원 소개', '진료 안내', '블로그'], small: '강남역 3번 출구 · 야간 진료', title: '건강한 미소를 오래 지켜드립니다', cta: '진료 예약', quick: ['진료 시간', '오시는 길', '의료진'], now: '지금 진료 중', hours: '평일 09:30 – 19:00 · 토 09:30 – 14:00', notice: '10월 9일(목) 한글날 휴진 안내' },
    adm: { newPost: '사랑니는 꼭 빼야 하나요?', posts: ['임플란트 수술 후 일주일', '스케일링, 얼마나 자주?'], oldBanner: ['건강한 미소를', '오래 지켜드립니다'], newBanner: ['10월부터', '야간 진료 시작'], button: '진료 예약하기', section: '의료진 소개' },
  },
}

export const GENERAL_WHY: BlogWhyCopy = {
  where: '우리 회사 홈페이지 안',
  answers: {
    search: { title: 'SEO·AEO·GEO\n구조 설계', desc: <>네이버·구글은 물론 AI 답변에서도,{'\n'}우리 글이 출처로 인용되도록<br className="bwy-mo" /> 구조부터 설계합니다.</> },
    reserve: { title: '읽다가 바로\n홈페이지로 연결', desc: '글마다 홈페이지로 가는 버튼이 붙어,\n마음먹은 순간을 놓치지 않습니다.' },
    own: { title: '우리 자산으로\n남는 글', desc: '빌린 블로그가 아니라 우리 주소 아래에 쌓여,\n플랫폼 정책이 바뀌어도 그대로 남습니다.' },
    admin: { title: '관리자 페이지에서\n직접 작성 · 수정', desc: '블로그 글은 물론 홈페이지의 사진과 문구도,\n관리자 페이지에서 바로 바꿉니다.' },
    category: { title: '서비스별\n카테고리 정리', desc: '손님이 검색하는 말 그대로 나눠,\n관련 글을 이어서 읽게 합니다.' },
  },
  end: { eyebrow: 'WEFLOW WEB BLOG', lead: '블로그를, ', accent: '우리 사이트 안으로.', desc: '우리 업종도 웹블로그로 바꿔 볼까요?', chips: ['AI 검색 인용', '홈페이지 연결', '우리 자산으로', '직접 관리'], href: '/diagnosis', label: '맞춤 견적 받기' },
  demo: {
    brand: '우리수학학원',
    domain: '우리수학학원.com',
    oldUrl: 'blog.플랫폼.com/우리수학학원',
    ownChip: '우리 학원 소유',
    posts: [
      { tag: '중등', title: '중학생 수학, 선행보다 중요한 것', excerpt: '개념을 정확히 이해하지 못한 채 진도만 나가면…', meta: '2026.10.12 · 조회 1,284' },
      { tag: '고등', title: '고1 첫 모의고사, 이렇게 준비하세요', excerpt: '3월 모의고사는 중학교 범위가 많이 나옵니다…', meta: '2026.10.05 · 조회 862' },
      { tag: '학습법', title: '수학 오답노트, 제대로 쓰는 법', excerpt: '틀린 문제를 옮겨 적기만 해서는 실력이…', meta: '2026.09.28 · 조회 2,031' },
    ],
    q: '중학생 수학 선행 얼마나 해야 돼?',
    a: '한 학기 정도가 보통이고, 지금 학기 개념을 먼저 다지는 게 좋아요.',
    tabs: ['중등', '고등', '학습법'],
    lists: [
      [
        { title: '중학생 수학, 선행보다 중요한 것', excerpt: '개념을 정확히 이해하지 못한 채 진도만…', meta: '2026.10.12 · 조회 1,284' },
        { title: '중2 수학이 어려워지는 이유', excerpt: '함수와 도형 증명이 한꺼번에 나오면서…', meta: '2026.09.30 · 조회 945' },
        { title: '중학교 내신, 서술형 대비법', excerpt: '풀이 과정을 끝까지 쓰는 연습이…', meta: '2026.09.18 · 조회 611' },
      ],
      [
        { title: '고1 첫 모의고사, 이렇게 준비하세요', excerpt: '3월 모의고사는 중학교 범위가 많이…', meta: '2026.10.08 · 조회 1,102' },
        { title: '수학 1등급, 문제집보다 중요한 것', excerpt: '많이 푸는 것보다 다시 푸는 것이…', meta: '2026.09.25 · 조회 734' },
        { title: '문과도 미적분을 들어야 할까요?', excerpt: '희망 학과에 따라 선택 과목이 달라…', meta: '2026.09.11 · 조회 1,560' },
      ],
      [
        { title: '수학 오답노트, 제대로 쓰는 법', excerpt: '틀린 문제를 옮겨 적기만 해서는…', meta: '2026.10.10 · 조회 2,214' },
        { title: '시험 전날, 수학은 이렇게 정리하세요', excerpt: '새 문제보다 틀렸던 문제를 다시…', meta: '2026.09.27 · 조회 873' },
        { title: '계산 실수를 줄이는 습관 3가지', excerpt: '검산을 따로 하기보다 풀이를 또박또박…', meta: '2026.09.14 · 조회 1,038' },
      ],
    ],
    rsv: { path: 'middle-math', tag: '중등', title: ['중학생 수학,', '선행보다 중요한 것'] },
    home: { nav: ['학원 소개', '수업 안내', '블로그'], small: '중등·고등 수학 전문 · 소수 정예', title: '개념부터 탄탄하게 잡아 드립니다', cta: '상담 예약', quick: ['수업 시간표', '오시는 길', '강사 소개'], now: '지금 상담 가능', hours: '평일 14:00 – 22:00 · 토 10:00 – 18:00', notice: '겨울방학 특강 모집 안내' },
    adm: { newPost: '수학 내신, 서술형 대비법', posts: ['중학생 수학, 선행보다 중요한 것', '고1 첫 모의고사 준비'], oldBanner: ['개념부터', '탄탄하게 잡아 드립니다'], newBanner: ['겨울방학', '특강 모집 시작'], button: '상담 예약하기', section: '강사 소개' },
  },
}
