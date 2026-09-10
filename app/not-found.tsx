import Link from 'next/link'
import { Home, ArrowRight } from 'lucide-react'

/**
 * 404 페이지 — 없는 주소로 들어와도 사이트 톤을 유지하고,
 * 메인·무료 상담으로 자연스럽게 되돌려 보낸다.
 */
export default function NotFound() {
  return (
    <>
      {/* 방문 기록에서 제외하는 표시 — PageTracker 가 이걸 보고 404 는 세지 않는다.
          봇·잘못 복사된 링크가 남기던 이상한 주소가 통계에 섞이지 않는다 */}
      <span data-weflow-404="1" hidden />
    <section
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
          404 NOT FOUND
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
            textShadow: '0 0 30px rgba(88, 138, 226, 0.55), 0 0 12px rgba(88, 138, 226, 0.35)',
          }}
        >
          404
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
          페이지를 찾을 수 없습니다
        </h1>
        <p
          className="body"
          style={{ margin: '0.8rem 0 0', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}
        >
          주소가 바뀌었거나 삭제된 페이지예요.
          <br className="nf-br" /> 아래 버튼으로 다시 시작해 보세요.
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
          <Link href="/" className="btn-primary nf-btn">
            <Home size={18} strokeWidth={2.2} /> 메인으로 가기
          </Link>
          <Link href="/diagnosis" className="btn-primary nf-btn nf-btn--ghost">
            무료 상담 신청 <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <style>{`
        .nf-btn {
          justify-content: center;
          gap: 0.45rem;
          min-width: 190px;
          padding: 0.95rem 1.4rem;
          border-radius: 9999px;
          font-size: 1rem;
        }
        /* 보조 버튼 — 테두리형 */
        .nf-btn--ghost {
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--border);
        }
        .nf-btn--ghost:hover { border-color: var(--text-muted); background: rgba(255, 255, 255, 0.05); }
        /* 모바일에서만 안내 문구 줄바꿈 */
        .nf-br { display: none; }
        @media (max-width: 768px) {
          .nf-br { display: block; }
        }
      `}</style>
    </section>
    </>
  )
}
