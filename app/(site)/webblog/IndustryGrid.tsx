import { ArrowUpRight, Stethoscope, Car, Scale, Factory, Sofa, Sparkles, GraduationCap, LayoutGrid, type LucideIcon } from 'lucide-react'
import { Fragment } from 'react'
import { INDUSTRY_GROUPS } from '@/blog/lib/industries'
import InView from '../clinic-blog/InView'

/**
 * '우리 업종에도 필요할까요?' — 웹블로그(/blog)의 업종 분류를 그대로 카드로 보여 준다.
 * 업종 목록은 blog/lib/industries.ts 하나에서 가져와, 웹블로그에 업종이 늘면 여기도 같이 는다 ('웹블로그 가이드' 는 업종이 아니라 뺀다).
 * 카드마다 업종 아이콘 + 연한 색 바탕, 세부 업종은 가운뎃점으로 잇는다.
 * 카드를 누르면 그 업종의 실제 웹블로그 글 목록이 새 탭으로 열린다 — 이 페이지를 떠나지 않게.
 * 앞(홈페이지와 함께)·뒤(견적 CTA)가 흰 바탕이라 이 섹션은 연회색.
 */
// 이 페이지에서만 앞에 둘 업종 — 병의원 다음에 생활·서비스, 차량·레저 (웹블로그 메뉴 순서는 그대로 둔다)
const FIRST = ['clinic', 'life-service', 'car-leisure']
const rank = (slug: string) => (FIRST.includes(slug) ? FIRST.indexOf(slug) : FIRST.length)
const GROUPS = INDUSTRY_GROUPS.filter(g => g.subs.length > 0).sort((a, b) => rank(a.slug) - rank(b.slug))

/** 업종 묶음별 아이콘·색 — 목록에 없는 새 업종은 기본 모양으로 */
const LOOK: Record<string, { Icon: LucideIcon; tint: string; bg: string }> = {
  clinic: { Icon: Stethoscope, tint: '#1f63d6', bg: '#eaf2ff' },
  'car-leisure': { Icon: Car, tint: '#0e8a6a', bg: '#e6f6f0' },
  'finance-pro': { Icon: Scale, tint: '#6b4fd8', bg: '#f0ecff' },
  business: { Icon: Factory, tint: '#475569', bg: '#eef1f5' },
  'life-service': { Icon: Sofa, tint: '#c2610c', bg: '#fdf0e3' },
  'health-beauty': { Icon: Sparkles, tint: '#d1386b', bg: '#fdeaf1' },
  'edu-food-stay': { Icon: GraduationCap, tint: '#0b7fa8', bg: '#e5f4fa' },
}
const DEFAULT_LOOK = { Icon: LayoutGrid, tint: '#1f63d6', bg: '#eaf2ff' }
/** 휴대폰에서 이 세부 업종 앞에서 줄을 바꾼다 — 병의원은 한 줄을 다 쓰는 카드라 '안과' 부터 둘째 줄로 */
const MOBILE_BREAK = new Set(['ophthalmology'])

export default function IndustryGrid() {
  return (
    <section id="industries" className="wbi" aria-labelledby="wbi-title">
      <div className="cb-wrap wbi-wrap">
        <p className="cb-chapter">FOR EVERY BUSINESS</p>
        <h2 id="wbi-title" className="cb-h2">우리 업종에도 필요할까요?{'\n'}<span className="cb-hl">검색으로 손님을 찾는다면,</span> 필요합니다</h2>
        <p className="cb-body">
          업종마다 손님이 검색하는 말이 다릅니다.<br />
          그 말에 맞춰 <br className="cb-mo" />카테고리와 글 구조를 설계합니다.
        </p>

        <InView className="wbi-grid">
          {GROUPS.map((g, i) => {
            const { Icon, tint, bg } = LOOK[g.slug] ?? DEFAULT_LOOK
            return (
              <a
                key={g.slug}
                href={`/blog/${g.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wbi-card"
                style={{ '--i': i, '--tint': tint, '--bg': bg } as React.CSSProperties}
              >
                <span className="wbi-icon"><Icon size={26} strokeWidth={1.8} /></span>
                <strong className="wbi-name">{g.name}</strong>
                <span className="wbi-subs">
                  {g.subs.map((s, k) => (
                    <Fragment key={s.slug}>
                      {k > 0 && (MOBILE_BREAK.has(s.slug) ? <><span className="wbi-dot"> · </span><br className="wbi-mo" /></> : ' · ')}
                      {s.name}
                    </Fragment>
                  ))}
                </span>
                <span className="wbi-go">글 보기 <ArrowUpRight size={15} /></span>
              </a>
            )
          })}
        </InView>
      </div>

      <style>{`
        /* 앞(홈페이지와 함께)·뒤(견적 CTA)가 흰 바탕이라 연회색으로 나눈다 */
        .wbi { padding: 96px 0; text-align: center; background: var(--cb-soft); }
        @media (min-width: 960px) { .wbi { padding: 140px 0; } }
        .wbi-wrap { max-width: 1160px; }
        .wbi .cb-body { font-size: 1.15rem; }

        /* 넓은 화면은 첫 줄 셋, 둘째 줄 넷 (일곱 개) */
        .wbi-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 48px; text-align: left; }
        .wbi-card { flex: 1 1 calc(50% - 6px); max-width: calc(50% - 6px); }
        @media (min-width: 1024px) {
          .wbi-grid { gap: 18px; margin-top: 64px; }
          .wbi-card { flex-basis: calc(25% - 13.5px); max-width: calc(25% - 13.5px); }
          .wbi-card:nth-child(-n+3) { flex-basis: calc(33.333% - 12px); max-width: calc(33.333% - 12px); }
        }

        .wbi-card { position: relative; display: flex; flex-direction: column; min-height: 220px; padding: 26px 24px 22px; border-radius: 22px; background: var(--bg); color: var(--cb-text); text-decoration: none; overflow: hidden;
          opacity: 0; transform: translateY(16px); transition: opacity .5s ease, transform .5s ease, box-shadow .25s ease; transition-delay: calc(var(--i) * .07s), calc(var(--i) * .07s), 0s; }
        .wbi-grid.is-in .wbi-card { opacity: 1; transform: none; }
        .wbi-grid.is-in .wbi-card:hover { transform: translateY(-4px); transition-delay: 0s; box-shadow: 0 18px 40px rgba(17,20,24,.08); }
        .wbi-icon { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 16px; background: #fff; color: var(--tint); box-shadow: 0 6px 16px rgba(17,20,24,.06); }
        .wbi-name { margin-top: 22px; font-size: 1.3rem; font-weight: 800; letter-spacing: -0.03em; }
        .wbi-subs { margin-top: 8px; font-size: .92rem; line-height: 1.6; color: var(--cb-sub); word-break: keep-all; }
        .wbi-go { display: inline-flex; align-items: center; gap: 3px; margin-top: auto; padding-top: 18px; font-size: .88rem; font-weight: 700; color: var(--tint); }
        .wbi-go svg { transition: transform .25s ease; }
        .wbi-card:hover .wbi-go svg { transform: translate(2px, -2px); }

        /* 두 칸 화면(1024px 미만) — 첫 카드(병의원)는 한 줄을 다 쓰고, 나머지 여섯은 둘씩 */
        @media (max-width: 1023px) { .wbi-card:first-child { flex-basis: 100%; max-width: 100%; } }
        /* 휴대폰 — 두 칸에 맞게 작게 */
        @media (max-width: 639px) {
          .wbi-grid { gap: 10px; }
          .wbi-card { flex-basis: calc(50% - 5px); max-width: calc(50% - 5px); min-height: 0; padding: 20px 16px 16px; border-radius: 18px; }
          .wbi-icon { width: 44px; height: 44px; border-radius: 13px; }
          .wbi-icon svg { width: 22px; height: 22px; }
          .wbi-name { margin-top: 16px; font-size: 1.08rem; }
          .wbi-subs { font-size: .8rem; }
          .wbi-go { padding-top: 14px; font-size: .8rem; }
        }
        .wbi-mo { display: none; }
        @media (max-width: 639px) { .wbi-mo { display: inline; } .wbi-dot { display: none; } }
        @media (prefers-reduced-motion: reduce) { .wbi-card { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </section>
  )
}
