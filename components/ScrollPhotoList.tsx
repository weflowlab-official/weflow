"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

export type ScrollPhotoItem = {
  key: string;
  img: string;
  alt: string;
  /** 항목의 글 — 아래 .spl-* 글씨 클래스(kicker · title · stat · desc · source)로 짠다 */
  body: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 스크롤하면 사진이 바뀌는 목록 — 혜택 안내(BenefitDetails)와 같은 방식이다.
 *
 * 넓은 화면: 왼쪽에 하늘색 판(사진)이 화면 가운데쯤에 붙어 따라오고, 오른쪽에 항목이 세로로 지나간다.
 * 항목 하나의 높이를 사진 판과 똑같이 잡고 글을 그 안의 위아래 가운데에 두어서, 항목이 판 옆에 나란히 올 때
 * 글이 사진의 한가운데에 놓인다. 판에 가장 가까운 항목이 '지금 읽는 항목'이 되어 또렷해지고(나머지는 흐려진다),
 * 왼쪽 사진·번호·진행 막대가 그 항목에 맞춰 바뀐다.
 * 좁은 화면: 붙는 판 없이, 항목마다 제 사진을 위에 달고 차례로 쌓인다.
 *
 * 색은 사이트 색 변수로 그린다 — 흰 바탕(.theme-light) 안에 놓고 쓴다.
 * 감싸는 칸의 최대 폭이 1120px 이 아니면 --spl-max 로 알려 줘야 판이 화면 가운데에 맞는다.
 */
export default function ScrollPhotoList({
  items,
  photoRatio = 0.75,
  fit = "cover",
  caption,
}: {
  items: ScrollPhotoItem[];
  /** 사진 자리의 세로 ÷ 가로 (기본 4:3) */
  photoRatio?: number;
  /** cover: 자리를 꽉 채운다(넘치면 잘린다) · contain: 자르지 않고 다 보여 준다 (화면 캡처용) */
  fit?: "cover" | "contain";
  /** 사진 아래에 붙는 한 줄 안내 */
  caption?: ReactNode;
}) {
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
    <div
      className={fit === "contain" ? "spl spl--contain" : "spl"}
      style={
        {
          "--spl-photo": photoRatio,
          // 사진 판의 높이 ÷ 폭 — 위아래 여백 3.5% × 2 + 사진(폭의 93%)
          "--spl-ratio": 0.07 + 0.93 * photoRatio,
        } as CSSProperties
      }
    >
      {/* 왼쪽 — 붙어 따라오는 사진 판. 같은 사진·글이 오른쪽 목록에 있으므로 보조 기술에는 숨긴다 */}
      <div className="spl-stage" aria-hidden="true">
        <div ref={frameRef} className="spl-frame">
          <div className="spl-shots">
            {items.map((it, i) => (
              <div key={it.key} className={i === active ? "spl-shot is-on" : "spl-shot"}>
                <Image
                  src={it.img}
                  alt=""
                  fill
                  sizes="(max-width: 860px) 1px, 520px"
                  style={{ objectFit: fit }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="spl-meter">
          <p className="spl-count">
            <b>{pad(active + 1)}</b> / {pad(items.length)}
          </p>
          <span className="spl-bar">
            <span style={{ width: `${((active + 1) / items.length) * 100}%` }} />
          </span>
        </div>
        {caption && <p className="spl-caption">{caption}</p>}
      </div>

      {/* 오른쪽 — 항목 목록 */}
      <ol className="spl-list">
        {items.map((it, i) => (
          <li
            key={it.key}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            className={i === active ? "spl-item is-on" : "spl-item"}
          >
            {/* 좁은 화면에서만 보이는 사진 */}
            <div className="spl-item__photo">
              <Image
                src={it.img}
                alt={it.alt}
                fill
                sizes="(max-width: 860px) 100vw, 1px"
                style={{ objectFit: fit }}
              />
            </div>
            {caption && <p className="spl-caption spl-caption--item">{caption}</p>}
            {it.body}
          </li>
        ))}
      </ol>

      <style>{`
        /* 두 칸의 폭이 같아야 한다 — 오른쪽 항목이 왼쪽 판과 같은 폭에서 같은 비율로 높이를 잡는다 */
        .spl {
          --spl-gap: clamp(2rem, 6vw, 6rem);
          /* 사진 판의 높이(어림값) — 판을 화면 가운데쯤에 붙일 때만 쓴다 */
          --spl-h: calc((min(100vw - 2.5rem, var(--spl-max, 1120px)) - var(--spl-gap)) / 2 * var(--spl-ratio));
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: var(--spl-gap);
          align-items: start;
        }

        /* ── 왼쪽 판 — 화면 위아래 가운데쯤에 붙는다 (아래 번호 줄 몫만큼 조금 올린다) ── */
        .spl-stage { position: sticky; top: calc(50vh - var(--spl-h) / 2 - 1.5rem); }
        /* 파스텔 하늘색 판 위에 사진을 띄운다 (혜택 안내 · 메인 '왜 WEFLOW' 시연 카드와 같은 색) */
        .spl-frame {
          padding: 3.5%;
          border-radius: clamp(18px, 2.2vw, 28px);
          background: linear-gradient(135deg, #d6ebff 0%, #9ccbf7 100%);
        }
        /* 사진 자리 — 전부 겹쳐 두고 하나만 보인다 */
        .spl-shots {
          position: relative;
          aspect-ratio: 1 / var(--spl-photo);
          border-radius: clamp(10px, 1.4vw, 16px);
          overflow: hidden;
          background: #e9ebee;
          box-shadow: 0 10px 40px rgba(20, 60, 110, 0.28);
        }
        /* 자르지 않는 사진(화면 캡처)은 남는 자리가 보이므로 흰 바탕을 깐다 */
        .spl--contain .spl-shots,
        .spl--contain .spl-item__photo { background: #fff; }
        .spl-shot {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.06);
          transition:
            opacity 0.6s ease,
            transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .spl-shot.is-on { opacity: 1; transform: none; }
        /* 번호와 진행 막대 */
        .spl-meter { display: flex; align-items: center; gap: 1rem; margin-top: 1.25rem; }
        .spl-count {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--outline);
        }
        .spl-count b { font-weight: 800; color: var(--text); }
        .spl-bar { flex: 1; height: 2px; border-radius: 2px; overflow: hidden; background: var(--border); }
        .spl-bar span {
          display: block;
          height: 100%;
          background: var(--text);
          transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .spl-caption {
          margin: 0.9rem 0 0;
          text-align: center;
          font-size: 0.92rem;
          font-weight: 600;
          line-height: 1.5;
          color: var(--text);
          word-break: keep-all;
        }
        .spl-caption strong { color: var(--accent); }
        .spl-caption--item { display: none; }

        /* ── 오른쪽 목록 — 항목 높이 = 사진 판 높이, 글은 그 안의 위아래 가운데.
              항목이 판 옆에 나란히 오면 글이 사진 한가운데에 놓인다 ── */
        /* 아래 여백은 판 밑의 번호 줄 높이만큼 — 마지막 항목도 판과 나란히 선 채로 끝나게 한다 */
        .spl-list {
          list-style: none;
          margin: 0;
          padding: 0 0 2.9rem;
          display: grid;
          gap: 14vh;
        }
        .spl-item {
          aspect-ratio: 1 / var(--spl-ratio);
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0.25;
          transition: opacity 0.45s ease;
        }
        .spl-item.is-on { opacity: 1; }
        .spl-item__photo { display: none; }

        /* ── 항목의 글 ── */
        /* 차례(첫째·둘째…) 줄 — 왕관·'핵심' 배지가 같이 놓인다 */
        .spl-kicker {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0 0 0.9rem;
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--accent);
        }
        .spl-badge {
          background: var(--accent);
          color: var(--on-accent);
          font-size: 0.66rem;
          font-weight: 700;
          padding: 2px 9px;
          border-radius: 9999px;
          letter-spacing: 0.02em;
        }
        .spl-title {
          margin: 0;
          color: var(--text);
          font-size: clamp(1.45rem, 2.7vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        /* 통계 숫자·핵심 낱말 — 지금 읽는 항목에서만 7초마다 잠깐 흔들린다 */
        .spl-stat {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          align-self: flex-start;
          margin: clamp(0.8rem, 1.8vw, 1.1rem) 0 0;
          color: var(--accent);
          font-size: clamp(1.9rem, 4.2vw, 2.9rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          word-break: keep-all;
          transform-origin: center bottom;
        }
        .spl-stat svg { width: 1em; height: 1em; flex-shrink: 0; }
        /* 숫자가 아니라 낱말일 때 — 길어서 한 단계 줄인다 */
        .spl-stat--text { font-size: clamp(1.5rem, 3.2vw, 2.2rem); }
        .spl-item.is-on .spl-stat { animation: spl-wiggle 7s ease-in-out infinite; }
        @keyframes spl-wiggle {
          0%, 87%, 100% { transform: rotate(0deg); }
          89% { transform: rotate(-5deg); }
          91% { transform: rotate(4deg); }
          93% { transform: rotate(-3deg); }
          95% { transform: rotate(2deg); }
          97% { transform: rotate(0deg); }
        }
        .spl-desc {
          margin: clamp(0.8rem, 1.8vw, 1.1rem) 0 0;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          line-height: 1.7;
          color: var(--text-muted);
          word-break: keep-all;
        }
        .spl-desc strong { color: var(--text); font-weight: 700; }
        .spl-source {
          margin: 0.7rem 0 0;
          font-size: 11px;
          color: var(--outline);
          word-break: keep-all;
        }

        /* 좁은 화면 — 붙는 판을 감추고, 항목마다 제 사진을 달아 차례로 쌓는다 */
        @media (max-width: 860px) {
          .spl { grid-template-columns: 1fr; }
          .spl-stage { display: none; }
          .spl-list { padding-bottom: 0; gap: clamp(3rem, 9vw, 4.5rem); }
          .spl-item { aspect-ratio: auto; display: block; opacity: 1; }
          .spl-item__photo {
            display: block;
            position: relative;
            aspect-ratio: 1 / var(--spl-photo);
            margin-bottom: 1.5rem;
            border-radius: clamp(18px, 2.2vw, 28px);
            overflow: hidden;
            background: #e9ebee;
          }
          .spl--contain .spl-item__photo { border: 1px solid var(--border); }
          .spl-caption--item { display: block; margin: -0.7rem 0 1.4rem; }
          /* 쌓인 화면에서는 '지금 읽는 항목'이 따로 없다 — 흔들림은 끈다 */
          .spl-item.is-on .spl-stat { animation: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .spl-shot, .spl-item, .spl-bar span { transition: none; }
          .spl-item.is-on .spl-stat { animation: none; }
        }
      `}</style>
    </div>
  );
}
