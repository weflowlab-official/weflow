// 히어로 바로 아래 신뢰 밴드 — 좌우 월계수 장식 + 강조 문구 한 줄.

// 월계수 잎 금장 — 사이트 파랑 대신 이 장식에만 쓰는 포인트 골드.
const GOLD = '#b8976b'

// 스타일라이즈드 월계수 가지 (줄기 + 잎). flip 으로 좌우 대칭.
const LEAVES: [number, number, number][] = [
  [11, 66, -40], [24, 60, 30], [9, 52, -45], [22, 45, 25],
  [8, 37, -50], [21, 30, 20], [9, 22, -55], [19, 15, 15], [13, 8, -60],
]

function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 80"
      aria-hidden="true"
      className="laurel"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M26 76 C13 62 9 42 14 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {LEAVES.map(([x, y, a]) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          rx="6"
          ry="2.4"
          fill="currentColor"
          transform={`rotate(${a} ${x} ${y})`}
        />
      ))}
    </svg>
  )
}

export default function TrustBand() {
  return (
    <section
      aria-label="WEFLOW 신뢰 지표"
      style={{
        background: 'var(--section-b)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="trustband-inner">
        <span className="laurel-wrap" style={{ color: GOLD }}>
          <Laurel />
        </span>

        <div style={{ minWidth: 0 }}>
          <p
            className="caption-1"
            style={{
              margin: 0,
              color: 'var(--accent)',
              letterSpacing: '0.14em',
            }}
          >
            수많은 고객이 선택한 WEFLOW_위플로우
          </p>
          <p className="trustband-headline">
            최신 기술 활용<span className="hide-mobile"> · </span>
            <br className="br-mobile" />
            SEO·AEO·GEO 구조 설계
          </p>
          <p className="body trustband-sub">
            고객의 브랜드를 가장 효과적으로 완성합니다
          </p>
        </div>

        <span className="laurel-wrap" style={{ color: GOLD }}>
          <Laurel flip />
        </span>
      </div>

      <style>{`
        .trustband-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.75rem, 3vw, 2rem);
          max-width: 900px;
          margin: 0 auto;
          padding: clamp(1rem, 2vw, 1.25rem) 1.25rem;
          text-align: center;
        }
        .laurel-wrap { flex-shrink: 0; display: block; }
        .laurel {
          display: block;
          /* SVG 는 32:80 비율을 유지하므로 세로를 키우려면 가로도 함께 키운다 */
          width: clamp(1.9rem, 4.7vw, 3rem);
          height: clamp(5.4rem, 12.9vw, 8.2rem);
        }
        .trustband-sub {
          margin: 0.75rem 0 0;
          color: var(--text-secondary);
        }
        /* 모바일: 월계수 두 개가 좌우를 먹어 폭이 좁다 —
           글씨를 화면 폭에 맞춰 줄여 한 줄로 떨어지게 한다 */
        @media (max-width: 768px) {
          .trustband-sub {
            font-size: clamp(0.58rem, 2.9vw, 0.95rem);
            white-space: nowrap;
          }
          /* 월계수를 크게. SVG 는 비율(32:80)을 유지하며 맞춰지므로
             세로만 늘리면 가로에 걸려 안 커진다 — 가로·세로를 2.5:1 로 함께 키운다 */
          .laurel {
            width: clamp(2.5rem, 10.2vw, 2.95rem);
            height: clamp(6.25rem, 25.5vw, 7.4rem);
          }
        }
        /* 아주 좁은 화면(SE 등)은 월계수가 커진 만큼 글씨를 한 단계 더 줄인다 */
        @media (max-width: 360px) {
          .trustband-sub { font-size: 2.75vw; }
        }
        .trustband-headline {
          margin: 0.7rem 0 0;
          font-size: clamp(1.15rem, 3.6vw, 1.9rem);
          font-weight: 800;
          line-height: 1.4;
          word-break: keep-all;
          /* 양옆 월계수와 같은 금장 톤 그라데이션 + 좌→우로 훑고 지나가는 광택.
             좁고 밝은 띠(#fff6da)가 있어야 광택이 눈에 띈다 */
          background: linear-gradient(115deg, #b8976b 0%, #c9a262 38%, #fff6da 50%, #c9a262 62%, #b8976b 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 1px 8px rgba(201, 162, 98, 0.3));
          animation: tbSheen 2.8s linear infinite;
        }
        /* 배경 위치가 줄어들수록 광택 띠는 왼쪽 → 오른쪽으로 이동한다
           (타일 양 끝 색이 같아 반복 이음새 없음) */
        @keyframes tbSheen {
          from { background-position: 250% center; }
          to { background-position: 0% center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .trustband-headline { animation: none; }
        }
      `}</style>
    </section>
  )
}
