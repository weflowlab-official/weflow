'use client'

/**
 * 최후의 오류 화면 — 루트 레이아웃까지 깨졌을 때만 뜬다.
 * 이때는 전역 CSS·폰트도 없으므로 모든 스타일을 인라인으로 자립시킨다.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const btn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '180px',
    padding: '0.9rem 1.4rem',
    borderRadius: '9999px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'inherit',
  }
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          background: '#0a0f1c',
          color: '#f1f3f6',
          fontFamily:
            "'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', system-ui, sans-serif",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '560px' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#5f8ee6',
            }}
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
              textShadow: '0 0 30px rgba(88, 138, 226, 0.55)',
            }}
          >
            500
          </p>
          <h1 style={{ margin: '1rem 0 0', fontSize: '1.4rem', fontWeight: 700, wordBreak: 'keep-all' }}>
            일시적인 오류가 발생했습니다
          </h1>
          <p style={{ margin: '0.8rem 0 0', color: '#98a0ae', lineHeight: 1.7, wordBreak: 'keep-all' }}>
            잠시 후 다시 시도해 주세요. 문제가 계속되면 메인에서 다시 시작해 보세요.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '2rem',
            }}
          >
            <button onClick={reset} style={{ ...btn, background: '#2563eb', color: '#fff', border: 'none' }}>
              다시 시도
            </button>
            {/* 여기서는 next/link 가 아니라 <a> 가 맞다 — 이 화면은 루트 레이아웃까지 무너졌을 때
                대신 뜨는 자리라, 클라이언트 이동으로는 고장난 상태를 그대로 들고 간다.
                전체 새로고침으로 앱을 처음부터 다시 세워야 한다. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ ...btn, background: 'transparent', color: '#f1f3f6', border: '1.5px solid #2a3446' }}>
              메인으로 가기
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
