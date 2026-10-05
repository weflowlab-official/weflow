'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { faqs } from '@/data/faq'

// 화면에 보이는 질문·답변을 그대로 구조화한다 (보이지 않는 내용을 넣으면 가이드라인 위반).
// 예전에 /guide 에 있던 FaqSection 과 같은 데이터(data/faq)를 쓴다 (/guide 에서는 내렸다).
const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
  })),
}

/**
 * 메인의 자주 묻는 질문 — 솔루션 섹션 아래, 흰 바탕.
 * 왼쪽에 제목과 '찾으시는 질문이 없나요?' + 1:1로 물어보기 버튼(위쪽에 붙어 있고 스크롤을 따라오지 않는다), 오른쪽에 질문 목록.
 *
 * 질문을 누르면 답이 부드럽게 펼쳐지고, 한 번에 하나만 열린다.
 * 접혀 있어도 답변 글은 HTML 에 그대로 실린다 (높이만 0 으로 접는다) —
 * 검색엔진과 AI 답변엔진이 읽어 갈 수 있어야 하기 때문이다.
 */
export default function HomeFaqSection() {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(-1) // 열려 있는 질문 번호 (-1 = 모두 접힘). 처음에는 전부 접어 둔다

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={`hf-section${shown ? ' is-in' : ''}`} aria-labelledby="hf-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <div className="hf-inner">
        {/* 왼쪽 묶음 — 넓은 화면에서는 목록 옆 위쪽에 놓이고, 좁은 화면에서는 풀려서
            제목은 목록 위로, '찾으시는 질문이 없나요?' 는 목록 아래로 간다 */}
        <div className="hf-side">
          <header className="hf-head">
            <p className="hf-eyebrow">FAQ</p>
            <h2 id="hf-title" className="hf-title">
              자주 묻는 질문
            </h2>
          </header>
          <div className="hf-ask">
            <p>찾으시는 질문이 없나요?</p>
            <Link href="/diagnosis" className="hf-cta">
              1:1로 물어보기
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <ul className="hf-list">
          {faqs.map((f, i) => {
            const on = open === i
            return (
              <li key={f.q} className={on ? 'hf-item is-open' : 'hf-item'} style={{ '--i': i } as React.CSSProperties}>
                <h3 className="hf-q">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`hf-a-${i}`}
                    onClick={() => setOpen(on ? -1 : i)}
                  >
                    <span className="hf-q__mark" aria-hidden="true">
                      Q
                    </span>
                    <span className="hf-q__text">{f.q}</span>
                    <span className="hf-q__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`hf-a-${i}`} className="hf-a" role="region" aria-hidden={!on}>
                  <div className="hf-a__in">
                    {f.a.map(line => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <style>{`
        .hf-section {
          background: #fff;
          color: #111;
          padding: clamp(4.5rem, 10vw, 8.5rem) 1.5rem;
        }
        .hf-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.5fr);
          gap: clamp(2rem, 6vw, 6rem);
          align-items: start;
        }

        /* ── 왼쪽 묶음 — 목록 옆 위쪽에 그대로 있다 (스크롤을 따라오지 않는다) ── */
        .hf-head, .hf-ask {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hf-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .hf-title {
          margin: 0;
          color: #111;
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          white-space: nowrap;
        }
        /* 찾는 질문이 없을 때 — 한 줄 물음과 문의하기 버튼 */
        .hf-ask { margin-top: clamp(2rem, 4vw, 3rem); transition-delay: 0.15s; }
        .hf-ask p {
          margin: 0 0 0.85rem;
          font-size: clamp(0.95rem, 1.35vw, 1.08rem);
          line-height: 1.65;
          color: #5c6066;
        }
        .hf-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.85rem 1.5rem;
          border: 1.5px solid #111;
          border-radius: 9999px;
          background: #111;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .hf-cta:hover { background: transparent; color: #111; }
        .hf-cta svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hf-cta:hover svg { transform: translateX(4px); }

        /* ── 오른쪽 질문 목록 — 상자 없이 가는 선으로만 나눈다 ── */
        .hf-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid #111; }
        .hf-item {
          border-bottom: 1px solid #e3e5e8;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(0.1s + var(--i) * 0.05s),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(0.1s + var(--i) * 0.05s);
        }
        .is-in .hf-head, .is-in .hf-ask, .is-in .hf-item { opacity: 1; transform: none; }

        .hf-q { margin: 0; font-size: inherit; font-weight: inherit; }
        .hf-q button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: clamp(0.75rem, 1.6vw, 1.1rem);
          padding: clamp(1.15rem, 2.2vw, 1.6rem) 0.25rem;
          border: 0;
          background: none;
          color: #111;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .hf-q__mark {
          flex: none;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          font-weight: 800;
          color: #b9bdc4;
          transition: color 0.2s;
        }
        .hf-q__text {
          flex: 1;
          font-size: clamp(1.02rem, 1.55vw, 1.25rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.45;
          word-break: keep-all;
          transition: color 0.2s;
        }
        /* 더하기 표시 — 열리면 45° 돌아 × 가 되고, 동그라미가 검게 채워진다 */
        .hf-q__icon {
          position: relative;
          flex: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #d5d8dd;
          transition:
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.2s,
            border-color 0.2s;
        }
        .hf-q__icon::before, .hf-q__icon::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 13px;
          height: 1.6px;
          border-radius: 2px;
          background: #111;
          transform: translate(-50%, -50%);
          transition: background 0.2s;
        }
        .hf-q__icon::after { transform: translate(-50%, -50%) rotate(90deg); }
        .hf-q button:hover .hf-q__text, .hf-item.is-open .hf-q__text { color: #3f8fe0; }
        .hf-q button:hover .hf-q__mark, .hf-item.is-open .hf-q__mark { color: #3f8fe0; }
        .hf-q button:hover .hf-q__icon { border-color: #111; }
        .hf-item.is-open .hf-q__icon { transform: rotate(45deg); background: #111; border-color: #111; }
        .hf-item.is-open .hf-q__icon::before, .hf-item.is-open .hf-q__icon::after { background: #fff; }

        /* 답변 — 줄 높이를 0fr ↔ 1fr 로 바꿔 내용 높이만큼 부드럽게 펼친다 */
        .hf-a {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hf-item.is-open .hf-a { grid-template-rows: 1fr; }
        .hf-a__in {
          min-height: 0;
          overflow: hidden;
          /* 질문 글씨가 시작하는 자리에 맞춘다 (Q 표시 폭 + 간격만큼 들여 쓴다) */
          padding: 0 3.2rem 0 calc(0.25rem + clamp(1rem, 1.5vw, 1.2rem) * 0.72 + clamp(0.75rem, 1.6vw, 1.1rem));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .hf-item.is-open .hf-a__in { opacity: 1; transition: opacity 0.4s 0.1s; }
        .hf-a__in p {
          margin: 0 0 0.6rem;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          line-height: 1.75;
          color: #5c6066;
          word-break: keep-all;
        }
        .hf-a__in p:last-child { margin-bottom: 0; padding-bottom: clamp(1.25rem, 2.4vw, 1.75rem); }

        /* 좁은 화면 — 머리말을 위로 올리고 한 줄로 쌓는다 */
        @media (max-width: 860px) {
          .hf-section { padding-left: 1.25rem; padding-right: 1.25rem; }
          .hf-inner { grid-template-columns: 1fr; }
          /* 묶음을 풀어 제목 → 목록 → 문의 순으로 다시 놓는다 */
          .hf-side { display: contents; }
          .hf-head { order: 1; }
          .hf-list { order: 2; }
          .hf-ask { order: 3; margin-top: 0; text-align: center; }
          .hf-q__icon { width: 32px; height: 32px; }
          .hf-a__in { padding-right: 0.5rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hf-head, .hf-ask, .hf-item { opacity: 1; transform: none; transition: none; }
          .hf-a, .hf-a__in, .hf-q__icon { transition: none; }
        }
      `}</style>
    </section>
  )
}
