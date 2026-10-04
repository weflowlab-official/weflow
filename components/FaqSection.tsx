// 자주 묻는 질문 섹션.
// 어느 페이지에 놓아도 되도록 구조화 데이터(FAQPage)까지 이 안에 같이 넣었다 — 옮길 때 통째로 따라간다.
// 'use client' 를 쓰지 않는다: <details> 는 브라우저 기본 기능이라 자바스크립트가 필요 없고,
// 서버에서 그려야 답변 글이 HTML에 그대로 실려 검색엔진과 AI 답변엔진이 읽어 간다.
import { faqs } from '@/data/faq'
import { ChevronDown } from 'lucide-react'

// 화면에 보이는 질문·답변을 그대로 구조화한다 (보이지 않는 내용을 넣으면 가이드라인 위반).
// 답변은 문단으로 나뉘어 있으니 한 문장으로 이어 붙여 넘긴다.
const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
  })),
}

export default function FaqSection() {
  return (
    <section
      style={{
        padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem',
        background: 'var(--section-a)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {/* 가로 폭은 이 페이지의 다른 섹션들과 같은 1000px로 맞춘다 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p
          className="caption-1 emphasized c-accent"
          style={{ letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.6rem' }}
        >
          FAQ
        </p>
        <h2 className="title-1" style={{ margin: '0 0 0.75rem', wordBreak: 'keep-all' }}>
          자주 묻는 질문
        </h2>
        <p className="callout c-muted" style={{ margin: '0 0 2rem', wordBreak: 'keep-all' }}>
          견적을 받기 전에 가장 많이 여쭤보시는 것들을 모았습니다.
        </p>

        <div className="faq-list">
          {faqs.map(f => (
            <details key={f.q} className="faq-item">
              <summary className="faq-q">
                <span className="faq-badge faq-badge-q" aria-hidden>
                  Q
                </span>
                <span className="subhead emphasized faq-q-text">{f.q}</span>
                <ChevronDown className="faq-icon" size={18} strokeWidth={2.5} aria-hidden />
              </summary>

              <div className="faq-a">
                <span className="faq-badge faq-badge-a" aria-hidden>
                  A
                </span>
                <div className="faq-a-text">
                  {f.a.map(line => (
                    <p key={line} className="footnote c-muted">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        .faq-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .faq-item {
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          background: var(--surface);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item[open], .faq-item:hover { border-color: var(--accent); }

        /* Q·A 표식 — 같은 크기로 두어 질문과 답변의 시작점이 세로로 맞는다 */
        .faq-badge {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1;
        }
        .faq-badge-q { color: #fff; background: var(--accent); }
        .faq-badge-a { color: var(--text-muted); background: var(--surface-container); }

        .faq-q {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          cursor: pointer;
          list-style: none;
          word-break: keep-all;
        }
        /* 사파리·크롬의 기본 삼각형 표식을 지운다 (직접 그린 화살표를 쓴다) */
        .faq-q::-webkit-details-marker { display: none; }
        .faq-q-text { flex: 1; }
        .faq-icon {
          flex-shrink: 0;
          color: var(--text-muted);
          transition: transform 0.25s, color 0.2s;
        }
        .faq-item[open] .faq-icon { transform: rotate(180deg); color: var(--accent); }

        .faq-a {
          display: flex;
          gap: 0.75rem;
          padding: 0 1.25rem 1.15rem;
          /* 질문과 답변 사이에 옅은 선을 둬 경계를 만든다 */
          margin-top: 0.15rem;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }
        .faq-a-text { flex: 1; }
        .faq-a-text p {
          margin: 0 0 0.55rem;
          line-height: 1.75;
          word-break: keep-all;
        }
        .faq-a-text p:last-child { margin-bottom: 0; }
      `}</style>
    </section>
  )
}