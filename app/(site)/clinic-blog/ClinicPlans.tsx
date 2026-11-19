import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PlanCard from '@/components/PlanCard'
import PlanButton from './PlanButton'

/**
 * 제작 플랜 & 가격 안내 — PREMIER(웹블로그) / SIGNATURE(홈페이지) / ALL-IN-ONE(둘 다, 추천) 카드 세 장.
 * WHY WEFLOW 02 바로 아래, WHY NOW 01 앞.
 *
 * 예전에는 '홈페이지와 함께하면'(WithHomepage) 맨 아래에 붙어 있었는데, 광고로 온 분이 가격대를 일찍 볼 수 있게
 * 따로 떼어 위로 올렸다 (2026-11-19). 카드는 메인 가격 안내(/pricing)와 같은 components/PlanCard 를 쓰고,
 * 겉모습(.pricing-card 계열)도 /pricing 과 같은 값으로 아래 <style> 에 둔다 — 강조색만 이 페이지 파랑(#1f63d6).
 * 버튼을 누르면 상담 폼의 문의 유형이 미리 골라진다 (PlanButton → InquiryForm).
 */

// 가격 아래 단서 줄 — 세 플랜이 같다
const NOTE = '월 운영관리 · VAT 별도'

// plan: 상담 폼(InquiryForm 의 PLANS)의 문의 유형 값 — 글자가 같아야 미리 골라진다.
// price: 제작 시작 가격. 금액을 바꾸면 상담 폼의 예산 구간(InquiryForm 의 BUDGETS)도 같이 본다.
// features: PREMIER 4 · SIGNATURE 5 · ALL-IN-ONE 6 — 위로 갈수록 한 줄씩 늘어난다.
const PLANS = [
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

// 전 업종용(웹블로그 메인 /blog) 구성 항목 — 순서는 PLANS 와 같다 (PREMIER · SIGNATURE · ALL-IN-ONE)
const GENERAL_FEATURES = [
  ['카테고리별 웹블로그', '쉬운 글쓰기 관리자 화면', '기존 홈페이지와 연결', 'SEO·AEO·GEO 구조 설계'],
  ['업종 맞춤 디자인 홈페이지', '회사 소개 · 서비스 안내 · 오시는 길', '문의·상담 접수', '반응형 PC & 모바일 최적화', 'SEO·AEO·GEO 구조 설계'],
  ['맞춤 홈페이지 + 카테고리별 웹블로그', '기획부터 함께 설계해 디자인 통일', '관리자 화면 하나로 모두 관리', '문의·상담이 한곳에 쌓임', '반응형 PC & 모바일 최적화', 'SEO·AEO·GEO 구조 설계'],
]

/**
 * children: 카드 아래에 붙는 것 — 병의원 랜딩은 간편 견적 띠(QuickQuote)를 넣는다
 * general: 전 업종용 — 구성 항목을 병의원 말 대신 일반 말로
 * cta: 카드 맨 아래 버튼을 바꿔 끼운다 — 웹블로그 메인은 자기 견적 폼으로 가는 버튼을 넣는다 (안 주면 병의원 랜딩의 PlanButton)
 */
export default function ClinicPlans({ children, general = false, cta }: { children?: ReactNode; general?: boolean; cta?: (plan: string, best: boolean) => ReactNode }) {
  return (
    <section id="plans" className="cp" aria-labelledby="cp-title">
      <div className="cp-inner">
        <p className="cb-chapter">PRICING</p>
        <h2 id="cp-title" className="cp-title">제작 플랜 & <span>가격 안내</span></h2>
        <div className="pricing-grid">
          {PLANS.map((p, i) => (
            <PlanCard
              key={p.name}
              icon={p.img}
              title={p.name}
              subtitle={p.tagline}
              price={p.price}
              foot={NOTE}
              features={general ? GENERAL_FEATURES[i] : p.features}
              highlight={p.best}
              tagLabel="추천"
              cta={cta ? cta(p.plan, p.best) : <PlanButton plan={p.plan} fill={p.best} />}
            />
          ))}
        </div>
        {/* WEFLOW 가 만든 홈페이지 견본 — 광고 랜딩이라 이 페이지를 떠나지 않게 새 탭으로 연다 */}
        <a href="/" target="_blank" rel="noopener noreferrer" className="ch-home-link">
          WEFLOW가 만든 홈페이지 보기 <ArrowUpRight size={16} />
        </a>
        {children && <div className="cp-after">{children}</div>}
      </div>

      <style>{`
        /* 앞 섹션(왜 WEFLOW?)도 흰 바탕이라 선으로 나눈다.
           사이트 색 변수는 어두운 바탕용이라, 이 섹션 안에서만 밝은 바탕용 값으로 덮어쓴다 — 플랜 카드(PlanCard) 안의 글씨·체크 색이 이 값을 따라간다 */
        .cp {
          --text: #111418; --text-secondary: #4b5360; --text-muted: #8a919c; --accent: #1f63d6;
          background: #fff; padding: 96px 20px; text-align: center; border-top: 1px solid #e9ebef;
        }
        @media (min-width: 960px) { .cp { padding: 140px 20px; } }
        .cp-inner { max-width: 1120px; margin: 0 auto; }
        /* 플랜 카드(PlanCard) 글자 모양 — 사이트 공통 CSS 의 값 그대로. 웹블로그 메인(/blog)은 그 CSS 를 싣지 않아 여기서도 정해 둔다 */
        .cp .headline { margin: 0; font-size: 1.0625rem; font-weight: 600; letter-spacing: -0.01em; line-height: 1.4; color: var(--text); }
        .cp .title-2 { font-size: clamp(1.35rem, 3vw, 1.5rem); font-weight: 500; letter-spacing: -0.02em; line-height: 1.25; color: var(--text); }
        .cp .callout { font-size: 0.9375rem; font-weight: 400; line-height: 1.55; color: var(--text-secondary); }
        .cp .caption-1 { font-size: 0.75rem; font-weight: 500; line-height: 1.35; color: var(--text-muted); }
        .cp .c-muted { color: var(--text-muted); }
        .cp .emphasized { font-weight: 700; }
        .cp-title { margin: 0; font-size: clamp(1.7rem, 3.8vw, 2.5rem); line-height: 1.32; font-weight: 800; letter-spacing: -0.035em; color: #111418; }
        .cp-title span { color: #1f63d6; }
        .cp-after { margin-top: clamp(3.5rem, 7vw, 5rem); }

        /* ── 플랜 카드 — /pricing 과 같은 짜임. 바탕만 회색 대신 흰 카드 · 옅은 파란 테두리로 (회색은 이 페이지에서 탁해 보였다), 추천 카드는 파란 테두리에 위쪽이 옅은 파랑 ── */
        .cp .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(0.85rem, 1.8vw, 1.4rem); align-items: stretch; margin-top: 56px; text-align: left; }
        .cp .pricing-card { position: relative; display: flex; flex-direction: column; background: #fff; border: 2px solid #e1e8f2; box-shadow: 0 10px 30px rgba(17,20,24,.04); border-radius: clamp(18px, 2.2vw, 28px); padding: clamp(1.5rem, 2.6vw, 2rem); transition: border-color .15s; }
        /* 올리거나(PC) 누르면(휴대폰) 추천 카드와 같은 두께(2px)의 파란 테두리 — 두께는 처음부터 2px 로 두고 색만 바꿔, 테두리가 생길 때 카드 안이 밀리지 않는다 */
        .cp .pricing-card:hover, .cp .pricing-card:active { border-color: var(--accent); }
        .cp .pricing-card.is-highlight { border: 2px solid var(--accent); background: linear-gradient(180deg, #f1f7ff 0%, #fff 55%); z-index: 0; box-shadow: 0 18px 44px rgba(31,99,214,.16); }
        /* 반짝이 레이어 — 카드 안쪽으로만 보이게(클립), 글자·버튼 뒤 */
        .cp .hl-sparkle-layer { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; z-index: -1; pointer-events: none; }
        .cp .hl-sparkle { position: absolute; color: #a9c8f7; fill: currentColor; pointer-events: none; opacity: 0; animation: cp-twinkle 2.6s ease-in-out infinite; }
        .cp .hl-sparkle-1 { top: 2rem; right: -0.5rem; animation-delay: 0s; }
        .cp .hl-sparkle-2 { top: 9rem; left: -1rem; animation-delay: .9s; }
        .cp .hl-sparkle-3 { bottom: 3rem; right: 0; animation-delay: 1.7s; }
        @keyframes cp-twinkle { 0%, 100% { opacity: 0; transform: scale(.5) rotate(-8deg); } 50% { opacity: .4; transform: scale(1) rotate(8deg); } }
        /* 별 다섯 개 태그 — 카드 상단 가운데 */
        .cp .pricing-tag { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 2px; background: linear-gradient(120deg, #1f63d6, #4f8ff5, #7db0ff, #4f8ff5, #1f63d6); background-size: 250% 100%; animation: cp-tag-flow 3.5s ease infinite; padding: 4px 11px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(31,99,214,.34); }
        @keyframes cp-tag-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @media (prefers-reduced-motion: reduce) { .cp .hl-sparkle { animation: none; opacity: .25; } .cp .pricing-tag { animation: none; } }
        /* 좁은 화면 — 한 장씩 */
        @media (max-width: 860px) { .cp .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; gap: 1.6rem; margin-top: 40px; }
          /* 한 줄로 쌓이니 비싼 순으로 — ALL-IN-ONE(추천) → SIGNATURE(홈페이지) → PREMIER(웹블로그). 넓은 화면은 적힌 순서(가격 낮은 순) 그대로 */
          .cp .pricing-card.is-highlight { order: -1; }
          .cp .pricing-card:first-child { order: 1; }
        }

        /* 견적 신청 버튼 — 카드 맨 아래. 추천 카드는 채운 버튼 */
        .ch-plan-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 1.75rem; padding: 15px 20px; border-radius: 999px; border: 1.5px solid #d5d9df; background: #fff; color: #111418; font: inherit; font-weight: 700; text-decoration: none; cursor: pointer; transition: border-color .15s, background .15s, color .15s; }
        .ch-plan-btn:hover { border-color: #111418; }
        .ch-plan-btn--fill { background: #111418; border-color: #111418; color: #fff; }
        .ch-plan-btn--fill:hover { background: #1f63d6; border-color: #1f63d6; }
        .ch-plan-btn svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .ch-plan-btn:hover svg { transform: translateX(3px); }
        .ch-home-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 32px; font-size: .95rem; font-weight: 700; color: #4b5360; text-decoration: underline; text-decoration-color: #c9ced6; text-underline-offset: 5px; transition: color .15s, text-decoration-color .15s; }
        .ch-home-link:hover { color: #1f63d6; text-decoration-color: #1f63d6; }
      `}</style>
    </section>
  )
}
