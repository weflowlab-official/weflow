import Link from "next/link";
import HeroBackground from "./HeroBackground";
import HeroLine1 from "./HeroLine1";

// 글자 단위 등장 — 자리는 유지하고 투명→나타남 (start: 앞선 글자 수, step: 글자 간격)
function Chars({
  text,
  start = 0,
  step = 0.03,
}: {
  text: string;
  start?: number;
  step?: number;
}) {
  return (
    <>
      {Array.from(text.replace(/ /g, " ")).map((ch, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ animationDelay: `${(start + i) * step}s` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

// 좌상단 '고객만족도 1위' 엠블럼 — 텍스트를 둥글게 감싸는 원형 월계수 리스.
// 줄기(반지름 40 호)를 따라 잎을 원 바깥·안쪽에 번갈아 ±34° 기울여 깃털처럼 단다
// (줄기 위에 겹쳐 놓으면 그냥 동그라미로 보인다). 오른쪽 가지는 좌우 반전.
const WREATH_LEAVES: [number, number, number][] = [
  [30.5, 92.0, -8], [34.4, 83.9, 60], [17.1, 82.0, 14], [23.8, 75.9, 82],
  [8.4, 67.7, 35], [16.8, 64.5, 103], [5.5, 51.2, 57], [14.5, 51.4, 125],
  [8.9, 34.9, 79], [17.2, 38.3, 147], [18.2, 20.9, 100], [24.6, 27.2, 168],
  [31.9, 11.3, 122], [35.6, 19.6, 190],
];

function AwardWreath() {
  const branch = (
    <>
      {/* 줄기 — 원둘레(268°→108°)를 따라 도는 얇은 호 */}
      <path
        d="M48.6 91.98 A40 40 0 0 1 34.5 15.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {WREATH_LEAVES.map(([x, y, a]) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          rx="5.6"
          ry="2.2"
          fill="currentColor"
          transform={`rotate(${a} ${x} ${y})`}
        />
      ))}
    </>
  );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="hero-award__wreath">
      {branch}
      <g transform="scale(-1 1) translate(-100 0)">{branch}</g>
    </svg>
  );
}

// 히어로 타이틀 문구 — 세 토막을 이어 한 문장으로 등장시킨다
const LINE1 = "내가 진짜 원하는 페이지";
const LINE2A = "우리만의 플로우를 담다,";
const LINE2B = "WEFLOW";

/**
 * 메인 페이지 최상단 히어로 — 배경 영상 위에 타이틀·CTA 두 개(사이트 점검/차별점)를 얹고,
 * 아래에 대표 이미지 캐러셀을 붙인다.
 */
export default function HeroBanner() {
  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--section-a)",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* 배경 애니메이션 (네트워크 + 와이어프레임) */}
      <HeroBackground />
      {/* 가독성 오버레이 — 위아래를 살짝 눌러 헤더·하단 캐러셀 글씨를 보호한다 */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(6,10,20,0.5) 0%, rgba(6,10,20,0) 40%, rgba(6,10,20,0) 60%, rgba(6,10,20,0.55) 100%)",
          zIndex: 1,
        }}
      />

      {/* 고객만족도 1위 엠블럼 — 원형 월계수 리스 + 보석 왕관, 히어로 좌상단 고정 */}
      <span className="hero-award" aria-hidden="true">
        <AwardWreath />
        <svg viewBox="0 0 32 26" className="hero-award__crown">
          {/* 본체 — 세 봉우리 */}
          <path d="M4 18 L7 7.5 L12 12.5 L16 4.5 L20 12.5 L25 7.5 L28 18 Z" fill="currentColor" />
          {/* 꼭짓점 보석 — 가운데가 가장 크고 밝게 */}
          <circle cx="7" cy="5.6" r="1.7" fill="#edd9ae" />
          <circle cx="16" cy="2.6" r="2" fill="#f5e6c4" />
          <circle cx="25" cy="5.6" r="1.7" fill="#edd9ae" />
          {/* 밑단 밴드 + 박힌 보석 */}
          <rect x="3.4" y="19.6" width="25.2" height="3.4" rx="1.7" fill="currentColor" />
          <circle cx="9.5" cy="21.3" r="1" fill="#6d5427" />
          <circle cx="16" cy="21.3" r="1" fill="#6d5427" />
          <circle cx="22.5" cy="21.3" r="1" fill="#6d5427" />
        </svg>
        <span className="hero-award__label">고객만족도</span>
        <strong className="hero-award__rank">1위</strong>
      </span>

      <div
        className="hero-inner"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1150px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 아이브로우 — 데스크탑은 두 칩을 나란히, 모바일은 신규 칩을 위로 쌓는다 */}
        <div className="hero-eyebrow">
          <span className="tag-badge hero-chip--new">리뉴얼 · 신규 제작</span>
          <span className="tag-badge">홈페이지 메인 제작 솔루션</span>
        </div>

        {/* 메인 타이틀 — 리드 문구(낮은 계층) → weflow(최상위 계층) */}
        <h1
          className="hero-title"
          style={{
            margin: 0,
            wordBreak: "keep-all",
          }}
        >
          <span
            className="title-2"
            style={{
              display: "block",
              color: "#fff",
              fontSize: "clamp(1.4rem, 4.8vw, 2.9rem)",
            }}
          >
            {/* 유입 키워드가 있으면 클라이언트에서 맞춤 문구로 교체 (예: "인테리어 홈페이지 제작") */}
            <HeroLine1 fallback={LINE1} />
          </span>
          <span
            className="hero-line2"
            style={{
              display: "block",
              marginTop: "0.95rem",
            }}
          >
            <span
              className="large-title"
              style={{
                color: "#fff",
                fontSize: "clamp(1.65rem, 7.8vw, 4.6rem)",
                whiteSpace: "nowrap",
              }}
            >
              <Chars text={LINE2A} start={LINE1.length} />
            </span>
            <span
              className="large-title hero-weflow"
              style={{
                color: "#fff",
                fontSize: "clamp(2.8rem, 11.8vw, 5.5rem)",
                fontWeight: 900,
                letterSpacing: "0.02em",
                marginLeft: "0.12em",
                verticalAlign: "-0.06em",
                textShadow:
                  "0 0 30px rgba(88,138,226,0.9), 0 0 12px rgba(88,138,226,0.7), 0 3px 12px rgba(0,0,0,0.3)",
              }}
            >
              <Chars text={LINE2B} start={LINE1.length + LINE2A.length} />
            </span>
          </span>
        </h1>

        {/* 서브 카피 */}
        {/* <p
          style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            margin: 'clamp(1rem, 3vw, 1.5rem) 0 0',
            maxWidth: '640px',
            wordBreak: 'keep-all',
          }}
        >
          홈페이지 제작부터 광고 연동·운영 관리까지, <br/> 단순 제작이 아닌 문의로 이어지는 구조까지 설계합니다.
        </p> */}

        {/* CTA 버튼 */}
        <div
          className="hero-cta"
          style={{
            display: "flex",
            gap: "0.9rem",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "clamp(2.75rem, 5vw, 3.5rem)",
          }}
        >
          <Link
            href="/diagnosis"
            className="btn-primary hero-btn hero-btn--gold hero-btn--accent"
            style={{ width: "min(240px, 80vw)" }}
          >
            <span className="hero-btn__label">홈페이지 제작 문의</span>
          </Link>

          <Link
            href="/difference"
            className="btn-primary hero-btn hero-btn--gold"
            style={{ width: "min(240px, 80vw)" }}
          >
            <span className="hero-btn__label">우리가 특별한 이유</span>
          </Link>
        </div>

      </div>

      <style>{`
        /* 히어로 버튼 — 영상 위 어두운 화면이라 제목과 같은 흰 글씨로 맞춘다.
           사이트 기본 파랑(--accent)은 밝아서 흰 글씨가 안 읽히므로 여기서만 진한 파랑을 쓴다. */
        .hero-btn {
          font-size: 1.3rem;
          border-radius: 9999px;
          padding: 1.15rem 1rem;
          white-space: nowrap;
          justify-content: center;
          background: var(--accent-strong);   /* 상단 프로모션 띠와 같은 파랑 */
          color: var(--on-accent-strong);
          border: 1.5px solid transparent;
        }
        .hero-btn:hover { background: #2262cc; }

        /* 보조 버튼 — 영상이 비쳐 보이도록 반투명 테두리형 */
        .hero-btn--ghost {
          background: rgba(255, 255, 255, 0.10);
          border-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(4px);
        }
        .hero-btn--ghost:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #ffffff;
        }

        /* 금색 버튼 — 헤더 상담 버튼과 같은 처리: 유리 질감 바탕에 밝은 금색 테두리,
           글씨는 금장 광택. (면을 금색으로 채우면 영상 위에서 탁해 보여 테두리·글씨에만 쓴다) */
        .hero-btn--gold {
          background: rgba(227, 201, 158, 0.10);
          border-color: rgba(240, 220, 174, 0.95);
          backdrop-filter: blur(4px);
          box-shadow: 0 0 22px rgba(227, 201, 158, 0.22);
        }
        .hero-btn--gold:hover {
          background: rgba(227, 201, 158, 0.2);
          border-color: #fff8e6;
        }
        /* 주 버튼(제작 사례) — 금색 테두리·글씨는 그대로 두고 바탕만 원래의 반투명 파랑(68%)으로 채운다.
           금색 규칙 뒤에 선언해야 배경이 파랑으로 이긴다 */
        .hero-btn--gold.hero-btn--accent {
          background: rgba(37, 99, 235, 0.68);
        }
        .hero-btn--gold.hero-btn--accent:hover {
          background: rgba(37, 99, 235, 0.82);
        }
        .hero-btn__label {
          display: inline-block;
          background: linear-gradient(115deg, #d9bc88 0%, #e9d3a6 38%, #fff8e6 50%, #e9d3a6 62%, #d9bc88 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: cGoldSheen 2.8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-btn__label { animation: none; }
        }

        /* 높이는 부모(.first-screen)가 정한다 — 히어로는 신뢰 밴드를 뺀 나머지를
           flex 로 받아 채운다. 여백을 8vh → 3vh 로 줄여 밴드가 올라올 자리를 만든다
           (글자 크기는 그대로 두고 낭비되던 빈 공간만 걷어냈다). */
        .hero-section {
          justify-content: center;
          padding: clamp(1rem, 3vh, 2.5rem) 1.25rem;
        }

        /* 고객만족도 1위 엠블럼 — 히어로 좌상단 고정, 다른 요소보다 맨 앞.
           원형 리스는 배경으로 깔고 왕관·문구를 그 중앙에 쌓는다 */
        .hero-award {
          position: absolute;
          top: clamp(0.9rem, 3vh, 1.8rem);
          left: clamp(1.2rem, 3vw, 2.6rem);
          z-index: 5;
          width: 108px;
          height: 108px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          color: #c9a878;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .hero-award__wreath {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        /* 왕관 — 리스가 열려 있는 원 상단 중앙에 얹는다 (글씨는 원 정중앙) */
        .hero-award__crown {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 27px;
          height: 22px;
          filter: drop-shadow(0 0 4px rgba(227, 201, 158, 0.45));
        }
        .hero-award__label {
          margin-top: 6px; /* 글씨 묶음을 원 중앙에서 살짝 아래로 */
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          white-space: nowrap;
          color: #d7bd94;
        }
        .hero-award__rank {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1;
          color: #e3c99e;
        }
        /* 모바일 — 작게 줄여 좌상단 유지, 맨 앞(z-index 5)이라 안 가려진다 */
        @media (max-width: 768px) {
          .hero-award {
            width: 56px;
            height: 56px;
            top: 0.6rem;
            left: 0.8rem;
          }
          .hero-award__crown { width: 13px; height: 10.5px; top: 0; }
          .hero-award__label { margin-top: 2px; font-size: 0.4rem; }
          .hero-award__rank { font-size: 0.78rem; }
        }

        /* 아이브로우 배지 — 데스크탑은 가로 배치(신규 칩이 오른쪽), 아래 여백 (모바일에서 축소 → 타이틀 세 줄 위로) */
        .hero-eyebrow {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 1.4rem;
        }
        /* 두 칩의 높이를 강제로 동일하게 — 글리프별 라인박스 차이 방지 */
        .hero-eyebrow .tag-badge {
          font-size: 0.95rem;
          height: 2.1rem;
          line-height: 1;
          white-space: nowrap;
          padding-top: 0;
          padding-bottom: 0;
        }

        /* 모바일은 타이틀이 세 줄이라 PC(1.2)보다는 넉넉하게 둔다.
           1.5 는 줄 사이 빈 공간이 과해 여백을 깎게 만들었다 */
        .hero-title { line-height: 1.35; }

        /* 데스크톱: 타이틀 2번째 줄 한 줄 유지 */
        .hero-line2 { white-space: nowrap; }
        @media (min-width: 769px) {
          /* PC 는 두 줄뿐이라 줄 간격을 좁혀도 답답하지 않다.
             1.5 → 1.2 로 낮추면 큰 글자(WEFLOW) 위아래에 붙던 빈 공간이 사라져
             글자 크기를 그대로 두고도 히어로가 60px 남짓 줄어든다. */
          .hero-title { line-height: 1.2; }
          /* 칩·버튼 여백도 한 단계 줄여 밴드가 올라올 자리를 마저 만든다 */
          .hero-eyebrow { margin-bottom: 1rem; }
          .hero-cta { margin-top: 2rem !important; }
          /* 아래쪽 여백을 더 줘서 콘텐츠를 위로 올린다 —
             기하학적 중앙(justify-content:center)은 눈에는 살짝 내려앉아 보인다.
             transform 으로 당기면 overflow:hidden 에 잘리므로 패딩으로 민다. */
          .hero-section { padding-bottom: calc(clamp(1rem, 3vh, 2.5rem) + 1rem); }
        }

        /* 모바일: WEFLOW를 다음 줄로 + 2번째 줄 줄바꿈 허용(넘침·잘림 방지) */
        @media (max-width: 768px) {
          /* 모바일은 높이를 부모(.first-screen)가 정한다 — 위 min-height 를 걷어내
             신뢰 밴드와 첫 화면을 나눠 갖게 한다. 여백은 좁혀 자리를 만든다 */
          .hero-section {
            min-height: 0;
            /* 첫 화면 하단이 신뢰 밴드 첫 줄("N년차 홈페이지 제작") 직후에서 끊기도록
               위아래를 조금 더 벌린다 — 둘째 줄이 반쯤 걸쳐 보이는 것보다 낫다 */
            padding-top: calc(1.78rem + 0.75cm);
            /* 아래만 0.7cm 좁혀 월계수 밴드를 그만큼 위로 끌어올린다 */
            padding-bottom: calc(1.78rem + 0.05cm);
          }
          /* 칩·타이틀에 걸려 있던 translateY 보정은 걷어냈다 — 타이틀만 내려가 있으면
             위 간격은 그만큼 벌어지고 아래 간격은 좁아져, CSS 값과 실제가 어긋난다.
             지금은 아래 margin 값이 곧 화면에 보이는 간격이다.

             칩 ↔ 첫 줄 = 23.2px + line-height 가 글자 위에 남기는 3.9px ≒ 27px */
          .hero-eyebrow {
            gap: 0.4rem;
            margin-bottom: 1.45rem;
          }
          /* 콘텐츠를 3px 위로 당기던 보정도 걷어냈다 —
             위 여백만 3px 줄고 아래가 3px 늘어 위아래가 6px 어긋나 있었다.
             지금은 padding 이 위아래 같으므로 정확히 대칭이다. */
          .hero-eyebrow .tag-badge {
            font-size: clamp(0.72rem, 3.4vw, 0.95rem);
            height: 1.9rem;
            padding-left: 10px;
            padding-right: 10px;
          }
          /* 줄 간격·버튼 여백을 좁혀, 신뢰 밴드까지 한 화면에 들어갈 자리를 만든다 */
          .hero-line2 { white-space: normal; margin-top: 0.7rem !important; }
          /* WEFLOW 를 다음 줄로 내리되, 위 두 줄 간격과 맞춘다.
             데스크탑용 margin-left 는 여기서 0 으로 되돌려 중앙 정렬을 지킨다 */
          .hero-weflow { display: block; margin-top: 0.7rem; margin-left: 0; line-height: 1.1; }
          /* WEFLOW ↔ 버튼 = 24.8px + line-height 가 글자 아래 남기는 2.3px ≒ 27px
             (위 칩 간격과 같은 값) */
          .hero-cta {
            margin-top: 1.55rem !important;
            /* 가로 폭이 넉넉해져도(가로 모드·큰 모바일) 두 버튼을 세로로 쌓는다 */
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
