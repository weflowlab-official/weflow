import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowUpRight, Quote } from 'lucide-react'
import { reviews } from '@/data/reviews'

/**
 * /reviews 페이지 본문 — 실제로 받은 후기를 카드로 쌓아 보여준다.
 * 카드 하나에 별점 · 업종 · 후기 본문 · 제작해 드린 사이트 링크가 들어간다.
 */
export default function ReviewsExplorer() {
  return (
    <div>
      <section style={{ background: 'var(--section-a)', padding: 'clamp(3rem, 7vw, 4.5rem) 1.5rem clamp(3.5rem, 7vw, 5rem)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* 머리말 */}
          <p
            className="caption-2 emphasized c-accent"
            style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
          >
            CUSTOMER REVIEWS
          </p>
          <h1 className="title-1" style={{ margin: '0 0 0.75rem' }}>
            제작 사례 인터뷰 &amp; 후기
          </h1>
          <p className="callout c-muted" style={{ margin: '0 0 2.25rem', maxWidth: '520px', wordBreak: 'keep-all' }}>
            WEFLOW와 함께한 분들이 직접 남겨주신 이야기입니다.
          </p>

          {/* 후기 카드 */}
          {reviews.map(r => (
            <article key={r.siteUrl} className="rv-card">
              {/* 별점 + 업종 */}
              <div className="rv-top">
                <div aria-label={`5점 만점에 ${r.star}점`} style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: r.star }, (_, i) => (
                    <Star key={i} size={20} fill="#f5b301" color="#f5b301" strokeWidth={0} />
                  ))}
                </div>
                <span className="rv-chip caption-2 semibold">{r.category}</span>
              </div>

              {/* 제작해 드린 사이트 — 사진과 이름이 한 덩어리로 사이트에 연결된다 */}
              <a href={r.siteUrl} target="_blank" rel="noopener noreferrer" className="rv-site">
                <span className="rv-shot">
                  <Image
                    src={r.siteImage}
                    alt={`${r.site} 홈페이지 화면`}
                    fill
                    sizes="(max-width: 860px) 100vw, 800px"
                    style={{ objectFit: 'cover' }}
                  />
                </span>
                <span className="rv-site-meta">
                  <span className="footnote c-muted">제작 사이트</span>
                  <span className="rv-site-name subhead emphasized">
                    <span>{r.site}</span>
                    <ArrowUpRight size={18} strokeWidth={2.5} style={{ flexShrink: 0, color: 'var(--accent)' }} />
                  </span>
                </span>
              </a>

              {/* 본문 */}
              <Quote size={28} strokeWidth={2} aria-hidden="true" className="rv-quote" />
              <div className="rv-body">
                {r.paragraphs.map((p, i) => (
                  <p key={i} className="body" style={{ margin: '0 0 0.9rem', wordBreak: 'keep-all', lineHeight: 1.8 }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* 작성자 */}
              <p className="subhead emphasized c-primary rv-name">— {r.name}</p>
            </article>
          ))}

          {/* 마무리 CTA */}
          <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            <Link href="/diagnosis" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
              맞춤 견적 받기 →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .rv-card {
          position: relative;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-2xl);
          background: var(--surface);
          padding: clamp(1.5rem, 4vw, 2.25rem);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
        }
        .rv-card + .rv-card {
          margin-top: 1.25rem;
        }
        .rv-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .rv-chip {
          flex-shrink: 0;
          padding: 0.25rem 0.7rem;
          border-radius: 9999px;
          background: var(--surface-container);
          color: var(--text-muted);
          white-space: nowrap;
        }
        .rv-site {
          display: block;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          text-decoration: none;
          color: var(--text);
          transition: border-color 0.2s, box-shadow 0.3s;
        }
        .rv-site:hover {
          border-color: var(--accent);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.5);
        }
        /* 사진 — 원본 비율(약 2.14:1)에 맞춰 잘리지 않게 둔다 */
        .rv-shot {
          display: block;
          position: relative;
          width: 100%;
          aspect-ratio: 2851 / 1332;
          background: var(--surface-container);
        }
        .rv-site-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding: 0.8rem 1rem;
          border-top: 1px solid var(--border);
        }
        /* 이름은 왼쪽, 화살표는 같은 줄 오른쪽 끝에 고정 */
        .rv-site-name {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .rv-quote {
          color: var(--accent);
          opacity: 0.35;
          margin-bottom: 0.5rem;
        }
        .rv-body p:last-child {
          margin-bottom: 0;
        }
        .rv-name {
          margin: 1.5rem 0 0;
          text-align: right;
        }
      `}</style>
    </div>
  )
}
