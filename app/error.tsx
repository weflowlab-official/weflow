'use client'
import Link from 'next/link'
import { Home, RefreshCw } from 'lucide-react'

/**
 * 런타임 오류 화면 — 페이지 렌더 중 에러가 나도 사이트 톤을 유지하고,
 * 다시 시도·메인으로 되돌려 보낸다. (헤더·푸터는 레이아웃이 그대로 감싼다)
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section
      // 메인과 같은 흰 바탕 — .theme-light 가 색 변수를 밝은 값으로 바꾼다 (styles/globals.css)
      className="theme-light"
      style={{
        background: 'var(--section-a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '62vh',
        padding: 'clamp(3.5rem, 9vw, 6rem) 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <p
          className="caption-2 emphasized c-accent"
          style={{ letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}
        >
          500 ERROR
        </p>

        <p
          aria-hidden="true"
          style={{
            margin: '0.4rem 0 0',
            fontSize: 'clamp(4.5rem, 16vw, 7.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            color: 'var(--text)',
          }}
        >
          500
        </p>

        <h1
          style={{
            margin: '1rem 0 0',
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
            fontWeight: 700,
            color: 'var(--text)',
            wordBreak: 'keep-all',
          }}
        >
          일시적인 오류가 발생했습니다
        </h1>
        <p
          className="body"
          style={{ margin: '0.8rem 0 0', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}
        >
          잠시 후 다시 시도해 주세요.
          <br className="er-br" /> 문제가 계속되면 메인에서 다시 시작해 보세요.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 'clamp(1.75rem, 4vw, 2.5rem)',
          }}
        >
          <button onClick={reset} className="btn-primary er-btn">
            <RefreshCw size={18} strokeWidth={2.2} /> 다시 시도
          </button>
          <Link href="/" className="btn-primary er-btn er-btn--ghost">
            <Home size={18} strokeWidth={2.2} /> 메인으로 가기
          </Link>
        </div>
      </div>

      <style>{`
        .er-btn {
          justify-content: center;
          gap: 0.45rem;
          min-width: 190px;
          padding: 0.95rem 1.4rem;
          border-radius: 9999px;
          font-size: 1rem;
          cursor: pointer;
        }
        .er-btn--ghost {
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--outline-variant);
          box-shadow: none;
        }
        .er-btn--ghost:hover { border-color: var(--text-muted); background: rgba(17, 17, 17, 0.04); }
        .er-br { display: none; }
        @media (max-width: 768px) {
          .er-br { display: block; }
        }
      `}</style>
    </section>
  )
}
