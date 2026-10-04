import { Check, Minus } from "lucide-react";
import { makePlans, renewPlan } from "@/data/pricing";
import PlanCard from "@/components/PlanCard";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import ServiceCTA from "@/components/service/ServiceCTA";

/**
 * /pricing — 제작 플랜 & 가격 안내 페이지.
 * 머리말 → 제작 플랜 카드 3장(LANDING · BRAND · SIGNATURE) → 리뉴얼 카드 1장 → 플랜 상세 비교표
 * → 자주 묻는 질문(메인과 같은 것) → CTA 순으로 이어진다.
 * 메인과 같은 형식으로 그린다 — 흰 바탕, 영문 머리표 + 굵은 제목, 테두리 없는 옅은 회색 카드.
 * 가격은 data/pricing.ts 를 그대로 쓰고, 스타일은 파일 하단 <style> 에 모아뒀다.
 *
 * 없앤 것: 50% 할인 프로모션 표시, 관리자 페이지 옵션 섹션(관리자 페이지는 플랜 구성 안에 들어 있다),
 * 카드마다 있던 '무료 상담 신청' 버튼(상담은 맨 아래 CTA 에서 받는다),
 * '안내사항' 상자(내용을 자주 묻는 질문의 답에 녹였다 — data/faq.ts).
 */

// 비교표의 칸 — true 는 체크, false 는 줄(해당 없음), 글자는 그대로 찍는다
type Cell = boolean | string;
// 모든 플랜에 똑같이 들어가는 줄
const ALL: Cell[] = [true, true, true];

/**
 * 플랜 상세 비교표 — 칸 순서는 makePlans 순서(LANDING · BRAND · SIGNATURE)와 같다.
 * 위 플랜 카드에 적힌 구성과, 혜택 탭(/benefits)에서 "기본으로 챙긴다"고 안내하는 항목만 적는다.
 * 카드·혜택 탭에 없는 내용을 여기에만 적으면 안 된다 (상담에서 말이 엇갈린다).
 */
const COMPARE: { group: string; rows: { label: string; desc?: string; cells: Cell[] }[] }[] = [
  {
    group: "제작 규모",
    rows: [
      { label: "페이지 구성", cells: ["원페이지", "페이지 수 제한 없음", "페이지 수 제한 없음"] },
      { label: "100% 맞춤 제작", desc: "템플릿 없이 직접 설계·개발", cells: ALL },
    ],
  },
  {
    group: "기본 제공",
    rows: [
      { label: "반응형 디자인", desc: "PC·모바일 최적화", cells: ALL },
      { label: "희망 SNS 문의폼 연동", desc: "카카오톡·인스타그램 등", cells: ALL },
      { label: "1:1 전담 담당자", cells: ALL },
      { label: "24시간 상담", cells: ALL },
    ],
  },
  {
    group: "플랜별 구성",
    rows: [
      { label: "헤더 앵커 이동 구성", cells: [true, false, false] },
      { label: "각 페이지별 URL 생성", cells: [false, true, true] },
      { label: "페이지 로딩 속도 최적화", cells: [false, true, true] },
      { label: "SEO·AEO·GEO 구조 설계", cells: [false, false, true] },
      { label: "관리자 페이지", cells: ["희망 시 제공", "희망 시 제공", "맞춤형 제공"] },
    ],
  },
  {
    group: "월 운영관리",
    rows: [
      { label: "서버 관리", cells: ALL },
      { label: "보안 관리", cells: ALL },
      { label: "정기 점검", cells: ALL },
      { label: "수정", desc: "문구·사진·링크 등 경미한 수정", cells: ALL },
      { label: "장애 대응", cells: ALL },
    ],
  },
  {
    group: "제작 비용",
    rows: [{ label: "금액", desc: "VAT 별도", cells: makePlans.map((p) => p.price) }],
  },
];

export default function PricingPage() {
  return (
    // .pr-page 가 색 변수를 밝은 바탕용으로 덮어쓴다 — 플랜 카드(PlanCard) 안의 글씨·체크 색이 이 값을 따라간다
    <div className="pr-page">
      {/* ─── 제작 플랜 ─── */}
      <section className="pr-section pr-hero">
        <div className="pr-inner">
          <header className="pr-head">
            <Reveal variant="up">
              <p className="pr-eyebrow">PRICING</p>
            </Reveal>
            {/* 이 페이지의 대표 제목이라 h1 */}
            <SplitText
              as="h1"
              className="pr-title"
              segments={[
                { text: "제작 플랜 & " },
                { text: "가격 안내", className: "pr-hl" },
              ]}
            />
            <Reveal variant="up" delay={0.1}>
              <p className="pr-lead">
                <span className="pr-gold">최신 기술로 만드는 홈페이지, 규모에 맞는 플랜</span>
              </p>
            </Reveal>
          </header>

          {/* 제작 플랜 카드 3장 — 순서대로 하나씩 등장 */}
          <Reveal as="div" stagger className="pricing-grid">
            {makePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                icon={plan.img}
                title={plan.sub}
                subtitle={plan.tagline}
                price={plan.price}
                foot={plan.note}
                features={plan.features}
                highlight={plan.highlight}
              />
            ))}
          </Reveal>

          {/* 리뉴얼 — 신규 제작과 성격이 다른 상품이라 3장과 한 줄에 섞지 않고
              구분선 아래에 한 장으로 떨어뜨린다 (가운데 칸 정렬) */}
          <div className="pricing-solo-head">
            <span>기존 홈페이지가 있다면</span>
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
            />
          </Reveal>
        </div>
      </section>

      {/* ─── 플랜 상세 비교표 ─── */}
      <section className="pr-section">
        <div className="pr-inner">
          <Reveal as="header" variant="up" className="pr-head">
            <p className="pr-eyebrow">COMPARE</p>
            <h2 className="pr-title pr-title--sub">플랜 상세 비교</h2>
          </Reveal>

          <Reveal variant="up" className="pr-table-wrap">
            <table className="pr-table">
              <caption className="pr-sr">제작 플랜 세 가지의 구성과 가격 비교</caption>
              <colgroup>
                <col className="pr-col-label" />
                {makePlans.map((p) => (
                  <col key={p.id} className={p.highlight ? "pr-col-hl" : undefined} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="pr-sr">항목</span>
                  </th>
                  {makePlans.map((p) => (
                    <th key={p.id} scope="col">
                      <span className="pr-th-name">{p.sub}</span>
                      <span className="pr-th-sub">{p.tagline}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              {COMPARE.map(({ group, rows }) => (
                <tbody key={group}>
                  <tr className="pr-group">
                    <th scope="colgroup" colSpan={makePlans.length + 1}>
                      {group}
                    </th>
                  </tr>
                  {rows.map(({ label, desc, cells }) => (
                    <tr key={label}>
                      <th scope="row">
                        {label}
                        {desc && <span className="pr-row-desc">{desc}</span>}
                      </th>
                      {cells.map((c, i) => (
                        <td key={i}>
                          {c === true ? (
                            <Check className="pr-yes" size={20} strokeWidth={2.6} aria-label="포함" />
                          ) : c === false ? (
                            <Minus className="pr-no" size={18} strokeWidth={2.2} aria-label="해당 없음" />
                          ) : (
                            // 금액 뒤의 "~"는 카드와 같게 한 칸 띄워 보여 준다
                            c.replace(/~$/, " ~")
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </Reveal>
        </div>
      </section>

      {/* ─── 자주 묻는 질문 — 메인과 같은 섹션·같은 내용(data/faq) ─── */}
      <HomeFaqSection />

      {/* 마무리 CTA — 카드에서 상담 버튼을 뺐으므로 상담·전화는 여기서 받는다. 모양은 혜택 탭 맨 아래와 같다 */}
      <ServiceCTA
        title="어떤 플랜이 맞을지 모르겠다면"
        sub={
          <>
            업종과 목표를 알려주시면 필요한 구성과{" "}
            <br className="svc-cta__br" />
            예상 비용을 함께 정리해 드립니다.
          </>
        }
      />

      <style>{`
        /* ── 메인과 같은 규격 — 흰 바탕 #fff · 글씨 #111 · 본문 회색 #5c6066 · 강조 파랑 #3f8fe0 ──
           사이트 색 변수는 어두운 바탕용이라, 이 페이지 안에서만 밝은 바탕용 값으로 덮어쓴다.
           플랜 카드(PlanCard)는 변수로 색을 쓰므로 여기 값만 바꾸면 카드 안이 다 따라온다 */
        .pr-page {
          --text: #111;
          --text-secondary: #5c6066;
          --text-muted: #8a8a8a;
          --accent: #3f8fe0;
          --accent-light: #e3effc;
          --on-accent: #fff;
          --border: #e3e5e8;
          --surface: #f5f6f8;
          --surface-container: #eceef1;
          background: #fff;
          color: #111;
        }
        /* 흰 섹션이 연달아 오므로 여백은 아래쪽에만 둔다 (위아래 다 주면 사이가 두 배가 된다) */
        .pr-section { padding: 0 1.5rem clamp(4.5rem, 10vw, 8.5rem); }
        .pr-hero { padding-top: clamp(3.5rem, 7vw, 6rem); }
        .pr-inner { max-width: 1120px; margin: 0 auto; }

        /* ── 머리말 — 영문 머리표 + 굵은 제목 ── */
        .pr-head { text-align: center; margin-bottom: clamp(2.5rem, 6vw, 4rem); }
        .pr-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .pr-title {
          margin: 0;
          color: #111;
          font-size: clamp(2.1rem, 5.4vw, 3.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          word-break: keep-all;
        }
        .pr-hl { color: #3f8fe0; }
        .pr-lead {
          margin: clamp(1.1rem, 2.4vw, 1.6rem) 0 0;
          font-size: clamp(0.98rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          color: #5c6066;
          word-break: keep-all;
        }

        /* 금색 글씨 — 사이트 금색(.c-gold)은 어두운 바탕용이라 흰 바탕에서는 밝은 부분이 안 읽힌다.
           흰 헤더의 상담 버튼과 같은 중간 톤 금색으로, 광택이 왼쪽에서 오른쪽으로 흐른다 */
        .pr-gold {
          display: inline-block;
          font-weight: 700;
          background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #dcbc7c 50%, #b8914e 62%, #a8823e 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: cGoldSheen 2.8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .pr-gold { animation: none; }
        }

        /* ── 플랜 카드 — 옅은 회색 카드에 회색 테두리 (강조 카드는 파란 테두리, 리뉴얼은 바이올렛) ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
          align-items: stretch;
        }
        .pricing-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #f5f6f8;
          border: 2.5px solid #dfe2e6;
          border-radius: clamp(18px, 2.2vw, 28px);
          padding: clamp(1.5rem, 2.6vw, 2rem);
        }
        /* 마우스를 올리면 테두리가 파랗게 */
        .pricing-card:hover { border-color: var(--accent); }
        .pricing-card.is-violet:hover { border-color: #b39dfb; }
        /* 강조(가장 인기) 카드 — 항상 켜진 파란 테두리 */
        .pricing-card.is-highlight {
          border-color: var(--accent);
          z-index: 0; /* 반짝이 레이어를 담는 스태킹 컨텍스트 */
          box-shadow: 0 16px 42px rgba(63, 143, 224, 0.2);
        }
        /* 리뉴얼 카드 — 강조 서식은 그대로 두고 색만 바이올렛으로 갈아끼운다.
           SIGNATURE(파랑)와 다른 축의 상품임을 색으로 알린다.
           .is-highlight 와 특정도가 같으므로 반드시 그 아래에 와야 덮어쓴다. */
        .pricing-card.is-violet {
          border-color: #b39dfb;
          box-shadow: 0 16px 42px rgba(179, 157, 251, 0.24);
        }
        .pricing-card.is-violet .pricing-tag {
          background: linear-gradient(120deg, #9575f0, #b39dfb, #ddd6fe, #b39dfb, #9575f0);
          background-size: 250% 100%;
          box-shadow: 0 4px 10px rgba(179, 157, 251, 0.42);
        }
        /* 반짝이도 라벤더로 — 파란 카드의 하늘색을 그대로 두면 강조색과 따로 논다 */
        .pricing-card.is-violet .hl-sparkle { color: #c9bbfb; }
        /* 반짝이 레이어 — 카드 안쪽으로만 보이게(클립), 텍스트·버튼 뒤 */
        .hl-sparkle-layer {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          z-index: -1;
          pointer-events: none;
        }
        /* 작은 반짝이 — 카드 곳곳에서 깜빡깜빡 */
        .hl-sparkle {
          position: absolute;
          color: #a9d4ff;
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
          50%      { opacity: 0.4; transform: scale(1) rotate(8deg); }
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
          box-shadow: 0 4px 10px rgba(63, 143, 224, 0.38);
        }
        @keyframes tag-flow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hl-sparkle { animation: none; opacity: 0.25; }
          .pricing-tag { animation: none; }
        }

        /* 리뉴얼 단독 카드 — 위 3장과 폭·간격을 정확히 맞추려고 같은 3열 그리드를 깔고
           가운데 칸에만 카드를 놓는다 (고정 px 로 계산하면 중간 화면폭에서 어긋난다) */
        .pricing-solo {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
          align-items: stretch;
        }
        .pricing-solo > * { grid-column: 2; }
        /* 구분선 — 새 제작과 성격이 다른 상품이라는 걸 시각적으로 끊어준다 */
        .pricing-solo-head {
          display: flex; align-items: center; gap: 0.9rem;
          margin: clamp(2.5rem, 5vw, 3.5rem) 0;
          color: #8a8a8a;
          font-size: 0.875rem;
          font-weight: 700;
        }
        .pricing-solo-head::before,
        .pricing-solo-head::after {
          content: ""; flex: 1; height: 1px; background: #e3e5e8;
        }
        @media (max-width: 860px) {
          .pr-section { padding-left: 1.25rem; padding-right: 1.25rem; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; gap: 1.6rem; }
          .pricing-solo {
            grid-template-columns: 1fr; max-width: 420px; margin: 0 auto;
          }
          .pricing-solo > * { grid-column: auto; }
          .pricing-solo-head { max-width: 420px; margin-left: auto; margin-right: auto; }
        }

        /* ── 플랜 상세 비교표 — 가는 가로줄로만 나눈 표. 강조 플랜 칸은 옅은 파랑으로 깐다 ── */
        .pr-title--sub { font-size: clamp(1.75rem, 4vw, 3rem); line-height: 1.3; }
        /* 화면에는 안 보이고 읽어 주는 기기에만 들리는 글 */
        .pr-sr {
          position: absolute;
          width: 1px; height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        /* 표 폭은 위 플랜 카드 줄(본문 폭)과 같다 */
        .pr-table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          font-size: clamp(0.82rem, 1.25vw, 1rem);
          line-height: 1.5;
          color: #111;
          word-break: keep-all;
        }
        .pr-col-label { width: 31%; }
        .pr-col-hl { background: #f1f7fe; }
        .pr-table th, .pr-table td {
          padding: clamp(0.8rem, 1.6vw, 1.1rem) clamp(0.4rem, 1.2vw, 1rem);
          border-bottom: 1px solid #e3e5e8;
          text-align: center;
          vertical-align: middle;
        }
        /* 머리 줄 — 플랜 이름과 한 줄 설명 */
        .pr-table thead th { border-bottom: 1px solid #111; padding-top: clamp(1rem, 2vw, 1.4rem); }
        .pr-th-name {
          display: block;
          font-size: clamp(0.95rem, 1.7vw, 1.3rem);
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .pr-th-sub { display: block; margin-top: 0.15rem; font-size: 0.85em; font-weight: 500; color: #8a8a8a; }
        /* 묶음 이름 줄 — 옅은 회색 띠 (강조 칸 색 위에도 덮이게 칸 자체에 칠한다) */
        .pr-group th {
          background: #f5f6f8;
          padding-top: 0.6rem;
          padding-bottom: 0.6rem;
          text-align: left;
          font-size: 0.85em;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #5c6066;
        }
        /* 항목 이름 칸 */
        .pr-table tbody th[scope="row"] { text-align: left; font-weight: 700; }
        .pr-row-desc { display: block; margin-top: 0.1rem; font-size: 0.85em; font-weight: 400; color: #8a8a8a; }
        .pr-table td { color: #5c6066; font-weight: 600; }
        /* 체크·줄 아이콘 — svg 가 블록이라 글자 정렬(text-align)을 안 따른다. 좌우 여백으로 칸 가운데에 둔다 */
        .pr-yes, .pr-no { display: block; margin: 0 auto; }
        .pr-yes { color: #3f8fe0; }
        .pr-no { color: #c4c8ce; }

        /* ── 자주 묻는 질문 — 위 섹션이 이미 아래 여백을 두므로 위 여백은 뺀다 ── */
        .pr-page .hf-section { padding-top: 0; }
      `}</style>
    </div>
  );
}
