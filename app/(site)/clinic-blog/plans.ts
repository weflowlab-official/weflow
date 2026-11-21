/**
 * 병의원 제작 플랜 세 가지 — 가격 안내 카드(ClinicPlans.tsx)와 /llms.txt(app/llms.txt/route.ts)가 같이 쓴다.
 * 따로 적어 두면 값을 고칠 때 한쪽만 남으므로 여기 하나만 고친다.
 */

// 가격 아래 단서 줄 — 세 플랜이 같다
export const CLINIC_PLAN_NOTE = '월 운영관리 · VAT 별도'

// plan: 상담 폼(InquiryForm 의 PLANS)의 문의 유형 값 — 글자가 같아야 미리 골라진다.
// price: 제작 시작 가격. 금액을 바꾸면 상담 폼의 예산 구간(InquiryForm 의 BUDGETS)도 같이 본다.
// features: PREMIER 4 · SIGNATURE 5 · ALL-IN-ONE 6 — 위로 갈수록 한 줄씩 늘어난다.
export const CLINIC_PLANS = [
  {
    name: 'PREMIER',
    tagline: '웹블로그',
    plan: '웹블로그만',
    img: '/images/3d-icon/image-3.webp',
    best: false,
    price: '1,500,000원~',
    features: [
      '진료과목별 웹블로그',
      '쉬운 글쓰기 관리자 화면',
      '기존 홈페이지와 연결',
      'SEO·AEO·GEO 구조 설계',
    ],
  },
  {
    name: 'SIGNATURE',
    tagline: '홈페이지',
    plan: '홈페이지만',
    img: '/images/3d-icon/image-4.webp',
    best: false,
    price: '3,000,000원~',
    features: [
      '병원 맞춤 디자인 홈페이지',
      '의료진 · 진료 안내 · 오시는 길',
      '문의·예약 접수',
      '반응형 PC & 모바일 최적화',
      'SEO·AEO·GEO 구조 설계',
    ],
  },
  {
    name: 'ALL-IN-ONE',
    tagline: '웹블로그 + 홈페이지',
    plan: '웹블로그 + 홈페이지',
    img: '/images/3d-icon/image-5.webp',
    best: true,
    price: '5,000,000원~',
    features: [
      '병원 맞춤 홈페이지 + 진료과목별 웹블로그',
      '기획부터 함께 설계해 디자인 통일',
      '관리자 화면 하나로 모두 관리',
      '문의·예약이 한곳에 쌓임',
      '반응형 PC & 모바일 최적화',
      'SEO·AEO·GEO 구조 설계',
    ],
  },
]
