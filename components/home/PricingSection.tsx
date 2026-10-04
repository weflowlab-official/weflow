import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/Reveal'
import PlanCard from '@/components/PlanCard'
import { makePlans, renewPlan } from '@/data/pricing'

/**
 * 제작 플랜 & 가격 섹션 — data/pricing.ts의 플랜을 카드로 나열한다.
 * 제작 플랜 3장 + 리뉴얼 1장. 관리자 페이지 옵션은 /pricing 에만 두고 메인에는 싣지 않는다.
 * 카드 본문은 components/PlanCard.tsx 하나를 /pricing 과 공유한다.
 * highlight 플랜은 테두리 강조 + 별 배지 + 반짝이 애니메이션.
 */

// 메인에서는 아직 결정 단계가 아니라 상담 폼 대신 가격 페이지로 넘긴다
const CTA_STYLE = {
  justifyContent: 'center',
  width: '100%',
  marginTop: '1.5rem',
  borderRadius: '9999px',
  // /pricing 플랜 카드 버튼(.plan-cta)과 같은 크기
  padding: '1rem 1.2rem',
  fontSize: '1.15rem',
} as const

const detailCta = (highlight: boolean) => (
  <Link
    href="/pricing"
    className={highlight ? 'btn-primary' : 'btn-outline'}
    style={CTA_STYLE}
  >
    자세히 보기
    {/* btn 클래스의 기본 gap(0.5rem)을 빼서 상담 버튼과 같은 0.35rem 간격으로 맞춘다 */}
    <ArrowRight size={19} strokeWidth={2.6} className="pcta-arrow" style={{ marginLeft: '-0.15rem' }} />
  </Link>
)

export default function PricingSection() {
  return (
    <section style={{ background: 'var(--section-a)', padding: 'clamp(3rem, 7vw, 5.5rem) 1.25rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* 헤더 */}
        <Reveal variant="up" style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <span className="footnote emphasized c-accent">제작 플랜 &amp; 가격</span>
          <h2 className="title-1" style={{ marginTop: '0.75rem', textAlign: 'left', wordBreak: 'keep-all' }}>
            목표에 맞는 <span className="c-accent tilt-hl">플랜</span>을 골라보세요
          </h2>
        </Reveal>

        {/* 플랜 카드 */}
        <Reveal as="div" stagger className="pricing-grid">
          {makePlans.map(plan => (
            <PlanCard
              key={plan.id}
              icon={plan.img}
              title={plan.sub}
              subtitle={plan.tagline}
              price={plan.price}
              foot={plan.note}
              features={plan.features}
              highlight={plan.highlight}
              cta={detailCta(plan.highlight)}
            />
          ))}
        </Reveal>

        {/* 리뉴얼 — 신규 제작과 성격이 다른 상품이라 3장과 한 줄에 섞지 않고
            구분선 아래에 한 장으로 떨어뜨린다 (가운데 칸 정렬) */}
        <div className="pricing-solo-head">
          <span className="footnote emphasized">기존 홈페이지가 있다면</span>
        </div>
        <Reveal as="div" stagger className="pricing-solo">
          <PlanCard
            icon={renewPlan.img}
            title={renewPlan.sub}
            subtitle={renewPlan.tagline}
            price={renewPlan.price}
            foot={renewPlan.note}
            features={renewPlan.features}
            highlight
            tone="violet"
            tagLabel="추천"
            cta={detailCta(true)}
          />
        </Reveal>

        {/* 전체 플랜 링크 */}
        <div style={{ marginTop: 'clamp(2.5rem, 5vw, 3.25rem)', textAlign: 'center' }}>
          <Link href="/pricing" className="subhead emphasized c-accent" style={{ textDecoration: 'none', fontSize: '1.1rem' }}>
            플랜 전체 보기 ›
          </Link>
        </div>
      </div>

      <style>{`
        /* 화살표가 옆으로 살짝살짝 — 눌러야 다음이 있다는 신호 */
        .pcta-arrow { animation: pctaNudge 1.3s ease-in-out infinite; }
        @keyframes pctaNudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pcta-arrow { animation: none; }
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.1rem;
          align-items: stretch;
        }
        /* 리뉴얼 단독 카드 — 위 3장과 폭·간격을 정확히 맞추려고 같은 3열 그리드를 깔고
           가운데 칸에만 카드를 놓는다 (고정 px 로 계산하면 중간 화면폭에서 어긋난다) */
        .pricing-solo {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.1rem;
          align-items: stretch;
        }
        .pricing-solo > * { grid-column: 2; }
        /* 구분선 — 새 제작과 성격이 다른 상품이라는 걸 시각적으로 끊어준다 */
        .pricing-solo-head {
          display: flex; align-items: center; gap: 0.9rem;
          margin: clamp(2rem, 4vw, 2.75rem) 0;
          color: var(--text-muted);
        }
        .pricing-solo-head::before,
        .pricing-solo-head::after {
          content: ""; flex: 1; height: 1px; background: var(--border);
        }
        .pricing-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: 1.6rem;
        }
        .pricing-card.is-highlight {
          border: 2px solid var(--accent);
          z-index: 0; /* 반짝이 레이어를 담는 스태킹 컨텍스트 */
          box-shadow: 0 16px 42px rgba(106, 146, 215,0.3);
        }
        .pricing-card.is-highlight:hover {
          box-shadow: 0 20px 50px rgba(106, 146, 215,0.4);
        }
        /* 리뉴얼 카드 — 강조 서식은 그대로 두고 색만 바이올렛으로 갈아끼운다.
           .is-highlight 와 특정도가 같으므로 반드시 그 아래에 와야 덮어쓴다. */
        .pricing-card.is-violet {
          border-color: #c4b5fd;
          box-shadow: 0 16px 42px rgba(196,181,253,0.28);
        }
        .pricing-card.is-violet:hover {
          box-shadow: 0 20px 50px rgba(196,181,253,0.38);
        }
        .pricing-card.is-violet .pricing-tag {
          background: linear-gradient(120deg, #9575f0, #b39dfb, #ddd6fe, #b39dfb, #9575f0);
          background-size: 250% 100%;
          box-shadow: 0 4px 10px rgba(196,181,253,0.42);
        }
        /* 반짝이도 라벤더로 — 파란 카드의 금빛을 그대로 두면 강조색과 따로 논다 */
        .pricing-card.is-violet .hl-sparkle { color: #e9e0ff; }
        /* 반짝이 레이어 — 카드 안쪽으로만 보이게(클립), 텍스트·버튼 뒤 */
        .hl-sparkle-layer {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }
        .hl-sparkle {
          position: absolute;
          color: #ffe6a3;
          fill: currentColor;
          pointer-events: none;
          opacity: 0;
          animation: hl-twinkle 2.6s ease-in-out infinite;
        }
        .hl-sparkle-1 { top: 2rem; right: -0.5rem; animation-delay: 0s; }
        .hl-sparkle-2 { top: 9rem; left: -1rem; animation-delay: 0.9s; }
        .hl-sparkle-3 { bottom: 3rem; right: 0rem; animation-delay: 1.7s; }
        @keyframes hl-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(-8deg); }
          50%      { opacity: 0.28; transform: scale(1) rotate(8deg); }
        }
        .pricing-tag {
          position: absolute;
          top: -12px;
          /* 카드 상단 가운데 — 리뉴얼은 단독 카드라 왼쪽에 붙으면 무게가 한쪽으로 쏠린다 */
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: linear-gradient(120deg, #2f66cf, #4f8ff5, #7db0ff, #4f8ff5, #2f66cf);
          background-size: 250% 100%;
          animation: tag-flow 3.5s ease infinite;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 11px;
          border-radius: 9999px;
          box-shadow: 0 4px 10px rgba(106, 146, 215,0.35);
        }
        @keyframes tag-flow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hl-sparkle { animation: none; opacity: 0.2; }
          .pricing-tag { animation: none; }
        }
        @media (max-width: 860px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
          .pricing-solo {
            grid-template-columns: 1fr; max-width: 420px; margin: 0 auto;
          }
          .pricing-solo > * { grid-column: auto; }
          .pricing-solo-head { max-width: 420px; margin-left: auto; margin-right: auto; }
        }
      `}</style>
    </section>
  )
}
