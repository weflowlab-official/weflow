'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { portfolios, categoryOrder, type Portfolio } from '@/data/cases'

const ROTATE_MS = 3500
// 사진마다 비율이 조금씩 달라(약 2.0~2.2:1) 중간값으로 고정하고 cover 로 채운다
const PHOTO_ASPECT = '2.05 / 1'

function PortfolioCard({ p }: { p: Portfolio }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)

  // 사진 자동 전환 (마우스를 올리면 멈춘다)
  useEffect(() => {
    if (hovered || p.images.length < 2) return
    const t = setInterval(() => setIndex(i => (i + 1) % p.images.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [hovered, p.images.length])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        border: `1.5px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        background: 'var(--surface)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* 사진 자리 — 겹쳐놓고 페이드로 전환 */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: PHOTO_ASPECT, background: 'var(--surface-container)' }}>
        {p.images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${p.name} ${i + 1}번째 화면`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0}
            style={{
              objectFit: 'cover',
              opacity: i === index ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
        ))}

        {/* 어떤 플랜으로 만든 사례인지 — 가격표와 같은 이름을 쓴다.
            띄우지만 z-index는 올리지 않는다 (위를 덮은 카드 링크가 계속 눌려야 한다) */}
        <span
          className="footnote"
          style={{
            position: 'absolute',
            top: '0.8rem',
            left: '0.8rem',
            padding: '0.32rem 0.8rem',
            borderRadius: '9999px',
            fontWeight: 700,
            color: '#fff',
            background: 'var(--accent)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {p.plan}
        </span>

        {/* 현재 사진 표시 — 눌러서 바로 넘길 수도 있다 (카드 링크보다 위에 둔다) */}
        {p.images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '0.7rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '0.35rem', zIndex: 3,
          }}>
            {p.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 사진 보기`}
                style={{
                  width: i === index ? 18 : 6, height: 6, padding: 0,
                  borderRadius: '9999px', border: 'none', cursor: 'pointer',
                  background: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 설명 — 새 창으로 나간다는 뜻의 아이콘은 뺐다.
          지금은 카드를 누르면 사이트 안의 상세 페이지로 들어오기 때문이다. */}
      <div style={{ padding: '0.95rem 1.1rem' }}>
        <p className="subhead emphasized c-primary" style={{ margin: '0 0 0.2rem' }}>{p.name}</p>
        <p className="footnote c-muted" style={{ margin: 0 }}>{p.desc}</p>
      </div>

      {/* 카드 전체를 링크로 덮는다 — 사진 넘기는 점은 위(zIndex 3)에 있어 안 가로챈다.
          상세 내용이 있으면 상세 페이지로 보내 사이트 안에 머물게 하고,
          아직 없는 사례는 예전처럼 실제 사이트를 새 창으로 연다.
          참고용 샘플(placeholder)은 링크를 덮지 않아 눌리지 않는다. */}
      {p.placeholder ? null : p.detail ? (
        <Link
          href={`/cases/${p.slug}`}
          aria-label={`${p.name} 제작 사례 자세히 보기`}
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
        />
      ) : (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${p.name} 사이트 새 창에서 열기`}
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
        />
      )}
    </div>
  )
}

// 업종 칩 — '전체' + categoryOrder 전체 (사례가 아직 없는 업종도 노출) + 목록에 없는 업종이 사례에 있으면 뒤에 붙인다
const ALL = '전체'
const rank = (c: string) => {
  const i = categoryOrder.indexOf(c)
  return i === -1 ? categoryOrder.length : i
}
const CATEGORIES = [
  ALL,
  ...Array.from(new Set([...categoryOrder, ...portfolios.map(p => p.category)])).sort(
    (a, b) => rank(a) - rank(b)
  ),
]

/** 실제 제작 사례 — 업종 칩으로 거르고, 한 줄에 두 칸(화면 반)씩 채운다 */
export default function PortfolioShowcase() {
  const [active, setActive] = useState(ALL)
  const filtered = active === ALL ? portfolios : portfolios.filter(p => p.category === active)

  // 고른 칩을 주소(?cat=업종)에 남긴다 — 상세로 들어갔다 뒤로 가거나 '← 제작 사례'로 돌아와도 같은 칩이 열려 있게.
  // 처음 들어올 때 주소에 칩이 있으면 그걸로 시작한다 (없거나 모르는 값이면 '전체').
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get('cat')
    if (cat && CATEGORIES.includes(cat)) setActive(cat)
  }, [])
  const choose = (cat: string) => {
    setActive(cat)
    const url = new URL(window.location.href)
    if (cat === ALL) url.searchParams.delete('cat')
    else url.searchParams.set('cat', cat)
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <div>
      {/* 업종 칩 */}
      <div className="portfolio-chips">
        {CATEGORIES.map(cat => {
          const isActive = cat === active
          return (
            <button
              key={cat}
              onClick={() => choose(cat)}
              className="subhead"
              style={{
                flexShrink: 0,
                padding: '0.4rem 1rem',
                background: isActive ? 'var(--accent)' : 'var(--surface)',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--on-accent)' : 'var(--text-muted)',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="portfolio-grid">
          {filtered.map(p => (
            <PortfolioCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        /* 아직 공개 사례가 없는 업종 — 빈 화면 대신 상담으로 잇는다 */
        <div
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: '16px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <p className="headline emphasized c-primary" style={{ margin: '0 0 0.5rem' }}>
            {active} 사례는 공개 준비 중입니다
          </p>
          <p className="footnote c-muted" style={{ margin: 0, lineHeight: 1.7, wordBreak: 'keep-all' }}>
            상담을 남겨주시면 유사 업종 시안과 함께 안내드릴게요.
          </p>
        </div>
      )}

      <style>{`
        .portfolio-chips {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.1rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
