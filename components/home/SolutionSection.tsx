// 솔루션 섹션 — 헤더 → 신뢰 통계 밴드 → 실시간 문의 → 강점 6종.
// 강조 두 개(100% 맞춤 제작 · 무료 홈페이지 상담)는 파란 카드로, 모바일에서는 첫 줄에 온다.
import {
  Code2,
  Palette,
  Ruler,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
} from 'lucide-react'
import Reveal from '@/components/Reveal'
import CountUp from '@/components/CountUp'
import CharReveal from '@/components/CharReveal'
import LiveInquiries from './LiveInquiries'
import TrustTailStamp from './TrustTailStamp'
import { STRENGTH, TRUST, type StrengthIconName } from '@/data/solution'

// 모바일에서 색 부각 칸을 앞으로 끌어올린 시각 순서 (배열 순서는 PC 배치 그대로 둔다)
const MOBILE_SEQ = TRUST.map((_, i) => i).sort(
  (a, b) => Number(!!TRUST[b].highlight) - Number(!!TRUST[a].highlight),
)

const ICONS: Record<StrengthIconName, typeof Ruler> = {
  ruler: Ruler,
  userCheck: UserRoundCheck,
  code: Code2,
  palette: Palette,
  shield: ShieldCheck,
  stethoscope: Stethoscope,
}

export default function SolutionSection() {
  return (
    // 위·아래 패딩 동일 — 모바일(clamp 최소값)은 살짝 여유 있게
    <section id="solution" style={{ background: 'var(--section-a)', padding: 'clamp(2.75rem, 4.5vw, 3.75rem) 0' }}>
      {/* 섹션 헤더 */}
      <div style={{ padding: '0 clamp(1.25rem, 4vw, 3rem)' }}>
        <Reveal variant="up" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span
            className="caption-1 emphasized"
            style={{ color: 'var(--accent)', letterSpacing: '0.16em' }}
          >
            {STRENGTH.eyebrow}
          </span>
          <p
            className="callout semibold"
            style={{ margin: '0.9rem 0 0', color: 'var(--text-secondary)' }}
          >
            {STRENGTH.intro}
          </p>
          <h2 className="solution-heading">
            믿을 수 있는 전문가가 직접
            <br className="br-mobile" /> 기획·디자인·제작합니다
          </h2>
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              width: '48px',
              height: '1px',
              margin: '1.5rem auto 0',
              background: 'var(--accent)',
            }}
          />
        </Reveal>
      </div>

      {/* 신뢰 통계 밴드 — 화면 끝까지 이어지는 면 */}
      <Reveal
        variant="up"
        delay={0.1}
        style={{
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--section-b)',
        }}
      >
        <ul className="trust-grid">
          {TRUST.map((t, i) => {
            // 모바일(2열 3행) 시각 순서 — 색 부각 칸이 첫 줄로 온다 (CSS order 와 같은 규칙).
            // 구분선은 시각 위치 기준이라 order 로 섞인 뒤의 자리를 미리 계산해 클래스를 단다.
            const mpos = MOBILE_SEQ.indexOf(i)
            return (
            <li key={t.label || String(t.end)} className={`trust-cell${t.highlight ? ' trust-cell--hl' : ''}${mpos < 4 ? ' trust-cell--mtop' : ''}${mpos % 2 === 1 ? ' trust-cell--mleft' : ''}`}>
              {/* 문자 값(SEO·AEO·GEO 등)은 숫자보다 길어서 한 단계 작은 크기로, 별점 값은 더 작게.
                  별 한 줄은 값 상자 안(문구 바로 위)에 넣어 다른 칸과 값·라벨 라인이 맞는다 */}
              <span className={`trust-num${typeof t.end === 'string' ? ' trust-num--text' : ''}${t.end === '★★★★★' ? ' trust-num--stars' : ''}`}>
                {t.stars && (
                  <span className="trust-stars" aria-hidden="true">
                    <CharReveal text="★★★★★" />
                  </span>
                )}
                {/* 숫자 + animate 는 카운트업, 문자 + animate 는 같은 속도의 글자 드러내기 */}
                {t.animate && typeof t.end === 'number' ? (
                  <>
                    {/* 스탬프 딸린 칸은 숫자를 빨리(0.7s) 끝내고 남은 시간에 테두리·글자를
                        이어 그려, 전체가 옆 100% 카운트업(1.6s)과 같이 끝난다.
                        값 전체(50% 할인)에는 형광펜 밑줄을 깐다 */}
                    {t.tail || t.pen ? (
                      <span className="trust-hl">
                        <CountUp end={t.end} suffix={t.suffix} format={t.format} duration={t.tail ? 700 : undefined} />
                        {t.tail && <TrustTailStamp text={t.tail} />}
                      </span>
                    ) : (
                      <CountUp end={t.end} suffix={t.suffix} format={t.format} />
                    )}
                  </>
                ) : t.animate && t.end === '★★★★★' ? (
                  // 별점 값 — 하이라이트 없이 노란 별만
                  <CharReveal text={t.end + t.suffix} />
                ) : t.animate && typeof t.end === 'string' ? (
                  // 월계수 밴드 헤드라인과 같은 금장 그라데이션 + 광택
                  <span className="trust-gold"><CharReveal text={t.end + t.suffix} /></span>
                ) : (
                  <>
                    {typeof t.end === 'number' && t.format
                      ? t.end.toLocaleString('ko-KR')
                      : t.end}
                    {t.suffix}
                  </>
                )}
              </span>
              {t.label && <span className="trust-label">{t.label}</span>}
            </li>
            )
          })}
        </ul>
      </Reveal>

      {/* 실시간 문의 보드 */}
      <Reveal
        variant="up"
        delay={0.15}
        style={{ margin: 'clamp(1.5rem, 3vw, 2rem) auto 0', padding: '0 clamp(1rem, 4vw, 3rem)' }}
      >
        <LiveInquiries />
      </Reveal>

      {/* 강점 6종 */}
      <div style={{ padding: '0 clamp(1rem, 4vw, 3rem)' }}>
        <Reveal as="ul" stagger className="strength-grid">
          {STRENGTH.items.map((item) => {
            const Icon = ICONS[item.icon]
            const hl = !!item.highlight
            return (
              <li key={item.title} className={`strength-item${hl ? ' strength-item--hl' : ''}`}>
                <div className={`strength-card${hl ? ' strength-card--hl' : ''}`}>
                  <span className="strength-icon">
                    <Icon size={44} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <h3 className="strength-title">{item.title}</h3>
                  <p className="strength-desc">{item.desc}</p>
                </div>
              </li>
            )
          })}
        </Reveal>
      </div>

      <style>{`
        .solution-heading {
          margin: 0.7rem 0 0;
          font-size: clamp(1.5rem, 4.2vw, 2.6rem);
          font-weight: 700;
          line-height: 1.4;
          color: var(--text);
          word-break: keep-all;
        }

        /* 통계 밴드 — 모바일 2열 3행, PC 6열 한 줄 */
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          list-style: none;
        }
        .trust-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(1.5rem, 3vw, 2.25rem) 0.5rem;
          text-align: center;
        }
        /* 모바일 구분선 — 1·2번째 줄 아래, 2열 왼쪽 */
        .trust-cell--mtop { border-bottom: 1px solid var(--border-subtle); }
        .trust-cell--mleft { border-left: 1px solid var(--border-subtle); }
        /* 색 부각 칸 — 강점 카드와 같은 파란 면, 모바일에서는 첫 줄로 */
        .trust-cell--hl { order: -1; background: var(--accent-strong); }
        .trust-cell--hl .trust-num { color: #fff; }
        .trust-cell--hl .trust-label { color: rgba(255,255,255,0.8); }
        .trust-num {
          display: block;
          text-align: center;
          font-size: clamp(1.75rem, 4.5vw, 2.5rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--accent);
        }
        /* 별점 줄 — 숫자 칸(50% 할인)에서도 값 위에 제 줄로 올라간다 */
        .trust-num .trust-stars { display: block; }
        /* 문자 값 — 제목 굵기, 항상 한 줄.
           별·문구·라벨이 한 덩어리로 칸 세로 중앙에 오도록 흐름 안에 쌓는다 */
        .trust-num--text {
          font-size: clamp(1.3rem, 3.4vw, 1.6rem);
          font-weight: 700;
          letter-spacing: normal;
          line-height: 1.2;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        /* 별점 값 칸(최신 기술 활용) — 문구 값과 같은 크기의 노란 별.
           .trust-cell--hl .trust-num 의 흰색보다 우선해야 하므로 셀 클래스까지 붙인다 */
        .trust-num--stars,
        .trust-cell--hl .trust-num--stars {
          letter-spacing: 0.12em;
          color: #ffd166;
        }
        /* 별점 — 문구 바로 위 한 줄 (레이아웃 안에 두어 그룹 전체가 중앙 정렬) */
        .trust-stars {
          margin-bottom: 0.35rem;
          font-size: clamp(0.7rem, 1.8vw, 0.82rem);
          letter-spacing: 0.12em;
          color: #ffd166;
        }
        /* 숫자 뒤 스탬프('할인') — 노란 쿠폰 도장. 테두리는 SVG 선으로 먼저 그려지고
           (dashoffset 100→0), 글자는 그 뒤에 한 자씩 나타난다 */
        .trust-tail {
          position: relative;
          display: inline-block;
          margin-left: 0.22em; /* 숫자와의 간격 — 공백 문자 대신 여백으로 좁게 */
          font-size: 0.58em;
          font-weight: 700;
          padding: 0.1em 0.32em;
          color: #ffd166; /* 별점과 같은 노랑 */
          vertical-align: 0.2em;
        }
        .trust-tail__box {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .trust-tail__box rect {
          x: 1px;
          y: 1px;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          rx: 5px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          /* 102 로 살짝 겹치게 — 정확히 100 이면 끝점이 시작점에 닿지 못해 이음새가 보인다 */
          stroke-dasharray: 102;
          stroke-dashoffset: 102;
          /* 숫자(0.7s)가 끝난 뒤 그려지기 시작 → 1.25s 에 완성 */
          transition: stroke-dashoffset 0.55s ease-in-out 0.7s;
        }
        .trust-tail--on .trust-tail__box rect { stroke-dashoffset: 0; }
        .trust-tail__ch { opacity: 0; transition: opacity 0.25s; }
        .trust-tail--on .trust-tail__ch { opacity: 1; }
        /* 형광펜 밑줄 — 전역 tilt-hl 과 같은 색·두께, 사선 없이 직선 */
        .trust-hl { position: relative; z-index: 0; display: inline-block; }
        .trust-hl::before {
          content: '';
          position: absolute;
          z-index: -1;
          left: -4px;
          right: -4px;
          bottom: 0.06em;
          height: 42%;
          background: rgba(245, 179, 1, 0.3);
        }
        /* 금장 그라데이션 + 좌→우 광택 — 월계수 밴드 헤드라인(TrustBand)과 동일 */
        .trust-gold {
          display: inline-block;
          background: linear-gradient(115deg, #b8976b 0%, #c9a262 38%, #fff6da 50%, #c9a262 62%, #b8976b 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 1px 8px rgba(201, 162, 98, 0.3));
          animation: trustGoldSheen 2.8s linear infinite;
        }
        @keyframes trustGoldSheen {
          from { background-position: 250% center; }
          to { background-position: 0% center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-gold { animation: none; }
        }
        .trust-label {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          word-break: keep-all;
        }

        /* 강점 그리드 — 모바일 2열 / 태블릿 3열 / PC 6열 */
        .strength-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          max-width: 1200px;
          margin: clamp(2.5rem, 5vw, 4rem) auto 0;
          padding: 0;
          list-style: none;
        }
        .strength-item { height: 100%; }
        /* 모바일·태블릿: 강조 두 칸을 맨 윗줄로 끌어올린다 (PC 에서는 아래에서 되돌림) */
        .strength-item--hl { order: -1; }
        .strength-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          padding: clamp(1.5rem, 3vw, 2rem) 0.75rem;
          text-align: center;
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          background: var(--surface);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .strength-card--hl {
          border-color: transparent;
          background: var(--accent-strong);
          box-shadow: 0 8px 24px rgba(27, 78, 167, 0.28);
        }
        .strength-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.45); }
        .strength-icon {
          display: inline-flex;
          margin-bottom: 1.1rem;
          color: var(--accent);
          transition: transform 0.3s;
        }
        .strength-card--hl .strength-icon { color: #fff; }
        .strength-card:hover .strength-icon { transform: scale(1.1); }
        .strength-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          word-break: keep-all;
        }
        .strength-card--hl .strength-title { color: #fff; }
        .strength-desc {
          margin: 0.5rem 0 0;
          font-size: 0.8rem;
          line-height: 1.6;
          white-space: pre-line;
          color: var(--text-muted);
          word-break: keep-all;
        }
        .strength-card--hl .strength-desc { color: rgba(255,255,255,0.78); }

        /* 모바일 2열: '무료 홈페이지 상담'처럼 긴 제목이 두 줄로 꺾이면
           옆 카드와 본문 시작 위치가 어긋나 글씨가 내려와 보인다 — 한 줄에 들어가게 줄인다 */
        @media (max-width: 640px) {
          .strength-title { font-size: clamp(0.78rem, 3.6vw, 0.95rem); white-space: nowrap; }
        }
        @media (min-width: 641px) {
          .strength-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }
        @media (min-width: 1025px) {
          .trust-grid { grid-template-columns: repeat(6, 1fr); max-width: 1320px; }
          .trust-cell--mtop { border-bottom: none; }
          /* PC 전용 배치 — 최적화 · 프로모션 · 선택 이유 · 검색 노출 · 맞춤 제작 · 상담 비용.
             배열(=모바일 순서)은 그대로 두고 order 로만 재배치한다 */
          .trust-cell:nth-child(1) { order: 2; } /* 50% 특별 프로모션 */
          .trust-cell:nth-child(2) { order: 5; } /* 100% 고객 맞춤 제작 */
          .trust-cell:nth-child(3) { order: 3; } /* 최신 기술 활용 */
          .trust-cell:nth-child(4) { order: 4; } /* SEO·AEO·GEO */
          .trust-cell:nth-child(5) { order: 1; } /* 100% PC·모바일 최적화 */
          .trust-cell:nth-child(6) { order: 6; } /* 0원 무료 상담 비용 */
          /* 구분선 — order 로 섞였으니 DOM 이웃 대신 전 칸에 긋고 시각상 첫 칸만 뺀다 */
          .trust-cell { border-left: 1px solid var(--border-subtle); }
          .trust-cell:nth-child(5) { border-left: none; }
          /* 6열은 카드가 좁아진다 — 그리드 폭을 넓히고 간격을 줄여 카드 가로를 키운다.
             (통계 밴드도 같은 1320px 를 써서 좌우 선이 맞는다) */
          .strength-grid { grid-template-columns: repeat(6, 1fr); gap: 0.65rem; max-width: 1320px; }
          /* PC: order 를 되돌려 배열 순서대로 놓으면 강조 두 칸이 3·4번째(가운데)에 온다 */
          .strength-item--hl { order: 0; }
          /* PC 는 6열이라 카드가 작아 보인다 — 여백·아이콘·글씨를 한 단계씩 키운다 */
          .strength-card { padding: 2.5rem 1rem; }
          .strength-icon { margin-bottom: 1.4rem; }
          .strength-icon svg { width: 54px; height: 54px; }
          .strength-title { font-size: 1.05rem; }
          .strength-desc { margin-top: 0.65rem; font-size: 0.875rem; }
        }
      `}</style>
    </section>
  )
}
