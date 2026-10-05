"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

type Benefit = {
  title: string;
  points: string[];
  /** 옆에 놓이는 큰 사진 — 카드 순서를 바꿔도 사진이 따라오게 카드마다 적어 둔다.
   *  사람(얼굴·몸)이 나오지 않는 사진만 쓴다 — 화면·기기만 나오거나, 나와도 손까지만 */
  img: string;
  cta?: { label: string; href: string };
};

// 혜택 아홉 가지 — 맨 앞 둘은 WEFLOW 가 다른 곳과 갈리는 지점(검색 구조 설계 · 최신 기술)이라 먼저 보여 준다.
// 그 뒤는 실제 제작 순서대로 놓는다: 상담 → 견적 → 디자인 → 개발(연동·관리자 페이지) → 유지보수,
// 그리고 언제든 열려 있는 24시간 상담을 마지막에 둔다.
// 예전 '강점' 카드 섹션(ServiceFeatures)과 내용이 겹쳐 그 섹션을 내리고,
// 거기에만 있던 '관리자 페이지 제공 (선택형)' 이름과 'SNS 연동' · '24시간 상담 대기'를 여기로 옮겨 왔다
const BENEFITS: Benefit[] = [
  {
    title: "SEO·AEO·GEO 구조 설계",
    points: [
      "검색과 AI 답변에 잡히는 구조부터 설계",
      "페이지마다 제목·설명·구조화 데이터를 직접 구성",
    ],
    img: "/images/service/service1.webp",
    cta: { label: "내 사이트 점검하기", href: "/check" },
  },
  {
    title: "최신 기술로 제작",
    points: [
      "대기업 서비스에 쓰이는 React·Next.js로 제작",
      "템플릿 없이 처음부터 직접 설계·개발",
    ],
    // 메인 솔루션 카드와 같은 사진 (코드 화면 — 사람이 나오지 않는다)
    img: "/images/main/solution/main-solution-tech.webp",
    cta: { label: "차이점 보기", href: "/difference" },
  },
  {
    title: "고객의 소리 · 1:1 관리 시스템",
    points: [
      "충분한 소통으로 고객의 니즈 파악",
      "전담 담당자가 고객 한 분을 1:1로 전담",
    ],
    img: "/images/service/service12.webp",
  },
  {
    title: "합리적 가성비",
    points: [
      "꼭 필요한 기능만 골라 담는 맞춤 구성",
      "부담 없이 시작하는 합리적인 비용",
    ],
    img: "/images/service/service8.webp",
    cta: { label: "제작 플랜 보기", href: "/pricing" },
  },
  {
    title: "반응형 디자인 (PC / MO)",
    points: [
      "PC·모바일 등 모든 기기에서 최적화",
      "화면 잘림 없는 깔끔한 반응형 전환",
    ],
    img: "/images/service/service3.webp",
  },
  {
    title: "SNS 연동",
    points: [
      "카카오톡, 인스타그램 등 원하는 플랫폼 연동",
      "필요한 채널만 골라 자유롭게 구성",
    ],
    img: "/images/service/service4.webp",
  },
  {
    title: "관리자 페이지 제공 (선택형)",
    points: [
      "관리자 DB로 고객 정보 자산화",
      "문의·예약 접수 내역을 한곳에서 관리",
      "통계로 유입·전환 추이를 한눈에 파악",
    ],
    img: "/images/service/service22.webp",
  },
  {
    title: "각 상품별 전용 유지보수",
    points: [
      "3가지 상품별 맞춤 유지보수 제공",
      "서버·보안 관리 지원",
      "텍스트 문구 / 이미지 수정 지원",
    ],
    img: "/images/benefits/benefits6.webp",
  },
  {
    title: "24시간 상담 대기",
    points: [
      "연중무휴 24시간 상담 대기",
      "언제 문의하셔도 빠르게 응답",
    ],
    img: "/images/benefits/benefits8.webp",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 혜택 상세 — 혜택 아홉 가지를 스크롤하며 하나씩 읽는 화면. 바로 위 인트로(BENEFITS)가 제목 노릇을 하므로
 * 따로 머리말을 두지 않는다.
 *
 * 넓은 화면: 왼쪽에 하늘색 판(사진)이 화면 가운데쯤에 붙어 따라오고, 오른쪽에 아홉 항목이 세로로 지나간다.
 * 항목 하나의 높이를 사진 판과 똑같이 잡고 글을 그 안의 위아래 가운데에 두어서, 항목이 판 옆에 나란히 올 때
 * 글이 사진의 한가운데에 놓인다. 판에 가장 가까운 항목이 '지금 읽는 항목'이 되어 또렷해지고(나머지는 흐려진다),
 * 왼쪽 사진·번호·진행 막대가 그 항목에 맞춰 바뀐다.
 * 좁은 화면: 붙는 판 없이, 항목마다 제 사진을 위에 달고 차례로 쌓인다.
 *
 * ('제휴 마케팅 연결'과, 아래에 붙어 있던 '24시간 상담 대기' 띠는 내렸다)
 * 섹션 여백은 혜택 탭 공용 스타일(.svc-*, app/benefits/page.tsx)을 쓴다.
 */
export default function BenefitDetails() {
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // 사진 판의 가운데 높이에 가장 가까운 항목을 고른다
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const frame = frameRef.current;
      if (!frame) return;
      const fr = frame.getBoundingClientRect();
      // 좁은 화면에서는 판이 감춰져 있다 (높이 0) — 고를 것이 없다
      if (!fr.height) return;
      const mid = fr.top + fr.height / 2;
      let best = 0;
      let bestD = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="svc-section bd-section">
      <div className="svc-inner bd-wrap">
        {/* 왼쪽 — 붙어 따라오는 사진 판. 같은 사진·글이 오른쪽 목록에 있으므로 보조 기술에는 숨긴다 */}
        <div className="bd-stage" aria-hidden="true">
          <div ref={frameRef} className="bd-frame">
            <div className="bd-shots">
              {BENEFITS.map((b, i) => (
                <div key={b.title} className={i === active ? "bd-shot is-on" : "bd-shot"}>
                  <Image
                    src={b.img}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 1px, 520px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bd-meter">
            <p className="bd-count">
              <b>{pad(active + 1)}</b> / {pad(BENEFITS.length)}
            </p>
            <span className="bd-bar">
              <span style={{ width: `${((active + 1) / BENEFITS.length) * 100}%` }} />
            </span>
          </div>
        </div>

        {/* 오른쪽 — 혜택 목록 */}
        <ol className="bd-list">
          {BENEFITS.map((b, i) => (
            <li
              key={b.title}
              ref={(node) => {
                itemRefs.current[i] = node;
              }}
              className={i === active ? "bd-item is-on" : "bd-item"}
            >
              {/* 좁은 화면에서만 보이는 사진 */}
              <div className="bd-item__photo">
                <Image
                  src={b.img}
                  alt={b.title}
                  fill
                  sizes="(max-width: 860px) 100vw, 1px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="bd-num">{pad(i + 1)}</p>
              <h2>{b.title}</h2>
              <ul>
                {b.points.map((p) => (
                  <li key={p}>
                    <Check size={18} strokeWidth={2.6} aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              {b.cta && (
                <Link href={b.cta.href} className="bd-btn">
                  {b.cta.label}
                  <ArrowRight size={16} />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        /* 두 칸의 폭이 같아야 한다 — 오른쪽 항목이 왼쪽 판과 같은 폭에서 같은 비율로 높이를 잡는다 */
        .bd-wrap {
          --bd-gap: clamp(2rem, 6vw, 6rem);
          /* 사진 판의 높이 ÷ 폭 — 위아래 여백 3.5% × 2 + 사진(폭의 93%, 16:9).
             .bd-frame 의 padding 을 바꾸면 이 값도 같이 바꿔야 글이 사진 가운데에 맞는다 */
          --bd-ratio: 0.593125;
          /* 사진 판의 높이(어림값) — 판을 화면 가운데쯤에 붙일 때만 쓴다 */
          --bd-h: calc((min(100vw - 3rem, 1120px) - var(--bd-gap)) / 2 * var(--bd-ratio));
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: var(--bd-gap);
          align-items: start;
        }

        /* ── 왼쪽 판 — 화면 위아래 가운데쯤에 붙는다 (아래 번호 줄 몫만큼 조금 올린다) ── */
        .bd-stage { position: sticky; top: calc(50vh - var(--bd-h) / 2 - 1.5rem); }
        /* 파스텔 하늘색 판 위에 사진을 띄운다 (메인 '왜 WEFLOW' 시연 카드와 같은 색) */
        .bd-frame {
          padding: 3.5%;
          border-radius: clamp(18px, 2.2vw, 28px);
          background: linear-gradient(135deg, #d6ebff 0%, #9ccbf7 100%);
        }
        /* 사진 자리 — 원본이 16:9 라 같은 비율로 둬야 잘리지 않는다. 아홉 장을 겹쳐 두고 하나만 보인다 */
        .bd-shots {
          position: relative;
          aspect-ratio: 16 / 9;
          border-radius: clamp(10px, 1.4vw, 16px);
          overflow: hidden;
          background: #e9ebee;
          box-shadow: 0 10px 40px rgba(20, 60, 110, 0.28);
        }
        .bd-shot {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.06);
          transition:
            opacity 0.6s ease,
            transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bd-shot.is-on { opacity: 1; transform: none; }
        /* 번호와 진행 막대 */
        .bd-meter { display: flex; align-items: center; gap: 1rem; margin-top: 1.25rem; }
        .bd-count {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #b9bdc4;
        }
        .bd-count b { font-weight: 800; color: #111; }
        .bd-bar { flex: 1; height: 2px; border-radius: 2px; overflow: hidden; background: #e3e5e8; }
        .bd-bar span {
          display: block;
          height: 100%;
          background: #111;
          transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── 오른쪽 목록 — 항목 높이 = 사진 판 높이, 글은 그 안의 위아래 가운데.
              항목이 판 옆에 나란히 오면 글이 사진 한가운데에 놓인다 ── */
        /* 아래 여백은 판 밑의 번호 줄 높이만큼 — 마지막 항목도 판과 나란히 선 채로 끝나게 한다 */
        .bd-list {
          list-style: none;
          margin: 0;
          padding: 0 0 2.9rem;
          display: grid;
          gap: 14vh;
        }
        .bd-item {
          aspect-ratio: 1 / var(--bd-ratio);
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0.25;
          transition: opacity 0.45s ease;
        }
        .bd-item.is-on { opacity: 1; }
        .bd-item__photo { display: none; }
        .bd-num {
          margin: 0 0 0.9rem;
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #3f8fe0;
        }
        .bd-item h2 {
          margin: 0;
          color: #111;
          font-size: clamp(1.6rem, 3.2vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .bd-item ul {
          list-style: none;
          margin: clamp(1.1rem, 2.4vw, 1.6rem) 0 0;
          padding: 0;
          display: grid;
          gap: 0.7rem;
        }
        .bd-item li {
          display: flex;
          gap: 0.6rem;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.6;
          color: #5c6066;
          word-break: keep-all;
        }
        .bd-item li svg { flex: none; margin-top: 0.3em; color: #3f8fe0; }

        /* 버튼 — 검은 알약, 마우스를 올리면 테두리만 남는다 */
        .bd-btn {
          display: inline-flex;
          /* 항목이 세로 flex 라 그냥 두면 가로로 꽉 늘어난다 — 글자 폭만큼만 차지하게 한다 */
          align-self: flex-start;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.5rem;
          padding: 0.75rem 1.4rem;
          border: 1.5px solid #111;
          border-radius: 9999px;
          background: #111;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .bd-btn:hover { background: transparent; color: #111; }
        .bd-btn svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .bd-btn:hover svg { transform: translateX(4px); }

        /* 좁은 화면 — 붙는 판을 감추고, 항목마다 제 사진을 달아 차례로 쌓는다 */
        @media (max-width: 860px) {
          .bd-wrap { grid-template-columns: 1fr; }
          .bd-stage { display: none; }
          .bd-list { padding-bottom: 0; gap: clamp(3rem, 9vw, 4.5rem); }
          .bd-item { aspect-ratio: auto; display: block; opacity: 1; }
          .bd-item__photo {
            display: block;
            position: relative;
            aspect-ratio: 16 / 9;
            margin-bottom: 1.5rem;
            border-radius: clamp(18px, 2.2vw, 28px);
            overflow: hidden;
            background: #e9ebee;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bd-shot, .bd-item, .bd-bar span { transition: none; }
        }
      `}</style>
    </section>
  );
}
