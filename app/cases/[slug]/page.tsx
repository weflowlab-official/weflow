import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/Reveal'
import CaseSlideshow from '@/components/cases/CaseSlideshow'
import { CTA_BTN, CTA_BTN_FILLED } from '@/lib/ctaButton'
import { portfolios } from '@/data/cases'

/** detail 이 채워진 사례만 상세 페이지를 갖는다 */
const detailed = portfolios.filter(p => p.detail)

export function generateStaticParams() {
  return detailed.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = detailed.find(x => x.slug === slug)
  if (!p) return {}
  return {
    title: `${p.name} ${p.plan} 제작 사례 · WEFLOW`,
    description: p.detail!.summary,
    openGraph: {
      title: `${p.name} ${p.plan} 제작 사례`,
      description: p.detail!.summary,
      images: p.images[0] ? [p.images[0]] : undefined,
    },
  }
}

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  /** from — 목록에서 열려 있던 업종 칩. 전체 탭에서 왔으면 없다 */
  searchParams: Promise<{ from?: string }>
}) {
  const { slug } = await params
  const { from } = await searchParams
  // 목록·다른 사례로 갈 때 열려 있던 업종 칩을 그대로 들고 다닌다
  const listHref = from ? `/cases?cat=${encodeURIComponent(from)}` : '/cases'
  const caseHref = (s: string) => (from ? `/cases/${s}?from=${encodeURIComponent(from)}` : `/cases/${s}`)
  const p = detailed.find(x => x.slug === slug)
  if (!p) notFound()

  const d = p.detail!
  // 같은 업종 사례를 아래에 붙인다 — 다 읽은 뒤 다음으로 넘어갈 곳
  const related = portfolios
    .filter(x => !x.placeholder && x.slug !== p.slug && x.category === p.category)
    .slice(0, 3)

  // 상단과 본문 슬라이드쇼의 시작 사진을 벌린다 — 같은 사진이 동시에 보이지 않게
  const n = p.images.length
  const midStart = Math.floor(n / 2)

  return (
    <div style={{ background: 'var(--section-a)' }}>
      {/* ── 1. 개요 — 사례 브랜드 색을 깐 포스터형 첫 화면 ──
             스크린샷만 놓으면 밋밋해서, 배경·워터마크·글자를 브랜드 색으로 합성해
             프로젝트마다 다른 "포스터"가 되게 한다. */}
      <section
        className="case-poster"
        style={
          {
            '--po-a': d.poster.from,
            '--po-b': d.poster.to,
            '--po-ink': d.poster.ink,
            background: 'linear-gradient(135deg, var(--po-a), var(--po-b))',
            padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
          } as CSSProperties
        }
      >
        {/* 배경에 크게 깔리는 워터마크 — 읽는 글자가 아니라 무늬라서 aria 에서 뺀다 */}
        <span aria-hidden="true" className="case-poster__mark">
          {d.poster.mark}
        </span>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal variant="up">
            {/* 목록으로 — 들어올 때 열려 있던 업종 칩 그대로 돌아간다 (전체 탭에서 왔으면 전체) */}
            <Link href={listHref} className="footnote case-poster__back">
              ← 제작 사례
            </Link>
            <p className="case-eyebrow">{p.category} · {p.plan} 제작 사례</p>
            {/* 제목과 같은 줄 오른쪽에 실제 사이트로 나가는 버튼 — 눈에 띄도록 채움 스타일 */}
            <div className="case-titlerow">
              <h1 className="case-title">{p.name}</h1>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-visit"
              >
                사이트 보러가기 <ArrowUpRight size={17} strokeWidth={2.5} />
              </a>
            </div>
            <p className="case-summary">{d.summary}</p>
          </Reveal>

          {/* 첫 화면에 결과물을 바로 보여 준다 — 글만 있으면 스크롤 전에 나가 버린다.
              이미지 자체가 실제 사이트로 가는 링크다. */}
          <Reveal variant="up" delay={0.08} className="case-hero">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="case-hero__frame"
              aria-label={`${p.name} 사이트 새 창에서 열기`}
            >
              <span aria-hidden="true" className="case-shot__bar">
                <span className="case-shot__dot case-shot__dot--red" />
                <span className="case-shot__dot case-shot__dot--yellow" />
                <span className="case-shot__dot case-shot__dot--green" />
              </span>
              <CaseSlideshow images={p.images} alt={`${p.name} 홈페이지`} priority />
              {/* 안내는 상단바까지 포함한 프레임 전체를 덮는다 — 세로 가운데가 프레임 기준이 되게 */}
              <span className="case-hero__overlay">
                사이트 보러가기 <ArrowUpRight size={18} strokeWidth={2.5} />
              </span>
            </a>
          </Reveal>

          {/* 규모를 한눈에 — 라벨을 달아 표처럼 정리한다 */}
          <Reveal variant="up" delay={0.1} as="dl" className="case-spec">
            <div className="case-spec__cell">
              <dt>업종</dt>
              <dd>{p.category}</dd>
            </div>
            <div className="case-spec__cell">
              <dt>제작 기간</dt>
              <dd>{d.duration}</dd>
            </div>
            <div className="case-spec__cell">
              <dt>제작 플랜</dt>
              <dd>{p.plan}</dd>
            </div>
          </Reveal>

          {/* 무엇을 넣었는지 스크롤 전에 보여 준다 */}
          {d.features.length > 0 && (
            <Reveal variant="up" delay={0.15} className="case-spec__features">
              <p className="case-spec__label">기능</p>
              <ul className="case-features">
                {d.features.map(f => (
                  <li key={f} className="case-feature">{f}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      <section style={{ padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* ── 2. 어떤 요청이었나 ──
                 실제로 받은 말을 말풍선으로 띄운다. 지어낸 문장이 아니라
                 고객이 보내온 그대로라서, 어떤 설명보다 상황이 잘 전달된다. */}
          {/* 블록 하나만 관찰하고 내부는 CSS 로 순서대로 재생한다.
              요소마다 따로 관찰하면 빠르게 스크롤할 때 여러 개가 동시에 걸려 순서가 뒤섞인다. */}
          <Reveal variant="fade" className="case-block case-seq">
            <h2 className="case-h2 case-seq__item" style={{ '--i': 0 } as CSSProperties}>
              이런 요청을 받았습니다
            </h2>
            {d.quotes && d.quotes.length > 0 && (
              <ul className="case-chat">
                {d.quotes.map((q, i) => (
                  <li
                    key={q}
                    className="case-chat__item case-seq__item"
                    style={{ '--i': i + 1 } as CSSProperties}
                  >
                    <span className="case-chat__bubble">{q}</span>
                  </li>
                ))}
              </ul>
            )}
            <p
              className="case-lead case-seq__item"
              style={{ '--i': (d.quotes?.length ?? 0) + 1 } as CSSProperties}
            >
              {d.background}
            </p>
          </Reveal>

          {/* 글이 이어지는 사이에 화면을 끼워 넣는다 — 읽는 리듬을 끊어 주는 역할.
              상단과 같은 슬라이드쇼지만 시작 사진을 다르게 해 같은 화면이 겹치지 않는다 */}
          {n > 1 && (
            <Reveal variant="up" className="case-block">
              <figure className="case-shot">
                <span aria-hidden="true" className="case-shot__bar">
                  <span className="case-shot__dot case-shot__dot--red" />
                  <span className="case-shot__dot case-shot__dot--yellow" />
                  <span className="case-shot__dot case-shot__dot--green" />
                </span>
                <CaseSlideshow images={p.images} alt={`${p.name} 홈페이지`} start={midStart} />
              </figure>
            </Reveal>
          )}

          {/* ── 3. 무엇에 집중했나 ── */}
          <Reveal variant="fade" className="case-block case-seq">
            <h2 className="case-h2 case-seq__item" style={{ '--i': 0 } as CSSProperties}>
              이렇게 풀었습니다
            </h2>
            <ol className="case-points">
              {d.points.map((pt, i) => (
                <li
                  key={pt.title}
                  className="case-point case-seq__item"
                  style={{ '--i': i + 1 } as CSSProperties}
                >
                  <span className="case-point__no">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="case-point__title">{pt.title}</h3>
                    <p className="case-point__body">{pt.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* ── 4. 이렇게 만들어봤습니다 — 골라 둔 대표 화면을 나열한다.
                 슬라이드는 한 장씩 기다려야 하지만, 나열은 스크롤하며 다 보게 된다 ── */}
          {d.results.length > 0 && (
            <Reveal variant="fade" className="case-block case-seq">
              <h2 className="case-h2 case-seq__item" style={{ '--i': 0 } as CSSProperties}>
                이렇게 만들어봤습니다
              </h2>
              {/* 브라우저 프레임은 위에서 이미 두 번 썼다 — 여기선 사진만 깔끔하게 */}
              <div className="case-shots">
                {d.results.map((src, i) => (
                  <figure
                    key={src}
                    className="case-shot case-seq__item"
                    style={{ '--i': i + 1 } as CSSProperties}
                  >
                    <Image
                      src={src}
                      alt={`${p.name} 홈페이지 완성 화면 ${i + 1}`}
                      width={1920}
                      height={937}
                      sizes="(max-width: 900px) 100vw, 900px"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </figure>
                ))}
              </div>
            </Reveal>
          )}

        </div>
      </section>

      {/* ── 5. CTA — 다른 페이지 하단 CTA 와 같은 전체 폭 섹션 ── */}
      <section
        style={{
          padding: 'clamp(2.5rem, 5vw, 3.5rem) 1.5rem',
          background: 'var(--section-b)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <Reveal
          variant="zoom"
          /* 제목이 한 줄로 떨어지도록 640 → 900 으로 넓혔다 */
          style={{ maxWidth: '900px', margin: '0 auto', width: '100%', textAlign: 'center' }}
        >
          <p
            className="caption-1 emphasized c-accent"
            style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem' }}
          >
            GET STARTED
          </p>

          <h2
            className="emphasized"
            style={{
              marginBottom: '1rem',
              wordBreak: 'keep-all',
              fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)',
              lineHeight: 1.25,
            }}
          >
            비슷한 홈페이지가 필요하신가요?
          </h2>

          <p
            className="c-muted"
            style={{
              marginBottom: '2rem',
              wordBreak: 'keep-all',
              fontSize: 'clamp(1.1rem, 2.6vw, 1.35rem)',
              lineHeight: 1.7,
            }}
          >
            무료 상담으로 제작 방향과 비용을 확인하고, 찾아오는 고객을 늘려보세요.
          </p>

          <div className="case-cta__row">
            <a href="tel:010-2971-7280" className="btn-gold" style={CTA_BTN}>
              <span className="btn-gold__label">전화 상담하기</span> <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link href="/diagnosis" className="btn-gold btn-gold--fill" style={CTA_BTN}>
              <span className="btn-gold__label">무료 상담 신청</span> <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── 6. 관련 사례 — CTA 와 배경을 달리해 섹션이 구분되게 ── */}
      {related.length > 0 && (
        <section
          style={{
            background: 'var(--section-a)',
            borderTop: '1px solid var(--border-subtle)',
            padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 3rem)',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="case-h2" style={{ marginTop: 0 }}>
              같은 업종 사례
            </h2>
            <ul className="case-related">
              {related.map(r => (
                <li key={r.slug}>
                  <Link
                    href={r.detail ? caseHref(r.slug) : listHref}
                    className="case-related__card"
                  >
                    <div className="case-related__thumb">
                      <Image
                        src={r.images[0]}
                        alt={r.name}
                        width={480}
                        height={270}
                        sizes="300px"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '0.85rem 1rem' }}>
                      <p className="case-related__name">{r.name}</p>
                      <p className="case-related__desc">{r.desc}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <style>{`
        /* 포스터 — 브랜드 색 배경 위에 워터마크 타이포를 깔고 그 위에 내용이 선다 */
        .case-poster {
          position: relative;
          overflow: hidden;
        }
        .case-poster__mark {
          position: absolute;
          right: -0.06em;
          bottom: -0.14em;
          z-index: 0;
          font-size: clamp(6.5rem, 24vw, 17rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          white-space: nowrap;
          color: var(--po-ink);
          opacity: 0.07;
          pointer-events: none;
          user-select: none;
        }
        .case-poster__back {
          color: var(--po-ink);
          opacity: 0.7;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .case-poster__back:hover { opacity: 1; }
        .case-poster .case-eyebrow { color: var(--po-ink); opacity: 0.65; }
        .case-poster .case-title { color: var(--po-ink); }
        .case-poster .case-summary { color: var(--po-ink); opacity: 0.85; }
        /* 버튼은 잉크색 채움 — 어느 배색에서든 가장 눈에 띈다 */
        .case-poster .case-visit {
          background: var(--po-ink);
          color: var(--po-a);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
        }
        .case-poster .case-visit:hover {
          opacity: 1;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.38);
        }
        .case-poster .case-hero__frame {
          border-color: color-mix(in srgb, var(--po-ink) 25%, transparent);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
        }
        .case-poster .case-hero__frame:hover {
          border-color: var(--po-ink);
          box-shadow: 0 38px 90px rgba(0, 0, 0, 0.5);
        }
        .case-poster .case-spec__cell dt { color: var(--po-ink); opacity: 0.6; }
        .case-poster .case-spec__cell dd { color: var(--po-ink); }
        .case-poster .case-spec__label { color: var(--po-ink); opacity: 0.6; }
        .case-poster .case-feature {
          border-color: color-mix(in srgb, var(--po-ink) 28%, transparent);
          background: color-mix(in srgb, var(--po-ink) 10%, transparent);
          color: var(--po-ink);
        }

        .case-eyebrow {
          margin: 1.4rem 0 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        /* 제목 + 사이트 바로가기 — 좁은 화면에선 아래로 내려간다 */
        .case-titlerow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem 1.25rem;
        }
        .case-title {
          margin: 0;
          font-size: clamp(1.75rem, 5vw, 3rem);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: var(--text);
          word-break: keep-all;
        }
        /* 눌러야 할 버튼이라는 게 바로 보이도록 채움 스타일 */
        .case-visit {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
          padding: 0.7rem 1.35rem;
          border: none;
          border-radius: 9999px;
          background: var(--accent);
          color: var(--on-accent);
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: var(--shadow-btn);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .case-visit:hover {
          transform: translateY(-2px);
          opacity: 0.94;
          box-shadow: 0 8px 22px rgba(106, 146, 215, 0.4);
        }

        /* 첫 화면 대표 이미지 — 글만 보고 나가지 않도록 결과물을 먼저 보여 준다 */
        .case-hero { margin-top: clamp(1.75rem, 4vw, 2.5rem); }
        .case-hero__frame {
          position: relative;
          display: block;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          background: var(--surface);
          text-decoration: none;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.45);
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .case-hero__frame:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 24px 56px rgba(0, 0, 0, 0.55);
        }
        /* 마우스를 올리면 눌러도 된다는 안내가 뜬다 */
        .case-hero__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: rgba(6, 10, 20, 0.55);
          color: #fff;
          font-size: clamp(0.95rem, 2.4vw, 1.1rem);
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .case-hero__frame:hover .case-hero__overlay { opacity: 1; }
        .case-summary {
          margin: 0.9rem 0 0;
          font-size: clamp(1rem, 2.6vw, 1.15rem);
          line-height: 1.7;
          color: var(--text-secondary);
          word-break: keep-all;
        }

        /* 규모 요약 — 라벨 위, 값 아래 */
        .case-spec {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          margin: clamp(1.75rem, 4vw, 2.5rem) 0 0;
          padding: 0;
        }
        .case-spec__cell dt {
          margin: 0 0 0.35rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 0.03em;
        }
        .case-spec__cell dd {
          margin: 0;
          font-size: clamp(0.95rem, 2.4vw, 1.05rem);
          font-weight: 700;
          color: var(--text);
          word-break: keep-all;
        }
        .case-spec__features { margin-top: 1.5rem; }
        .case-spec__label {
          margin: 0 0 0.55rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 0.03em;
        }

        .case-block { margin-bottom: clamp(2.5rem, 5vw, 3.5rem); }

        /* 블록이 화면에 들어오면 내부 요소가 --i 순서대로 하나씩 등장한다.
           개별 관찰 대신 이 방식을 쓰면 스크롤이 아무리 빨라도 순서가 지켜진다. */
        /* transform 이 아니라 translate 속성을 쓴다 —
           카드 hover 의 transform 과 부딪히지 않게 하기 위함이다. */
        .case-seq__item {
          opacity: 0;
          translate: 0 12px;
        }
        .case-seq.is-visible .case-seq__item {
          animation: caseSeqIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(var(--i, 0) * 0.13s);
        }
        @keyframes caseSeqIn {
          to { opacity: 1; translate: 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .case-seq__item { opacity: 1; translate: 0 0; }
          .case-seq.is-visible .case-seq__item { animation: none; }
        }
        .case-h2 {
          margin: 0 0 1.1rem;
          font-size: clamp(1.1rem, 2.6vw, 1.35rem);
          font-weight: 700;
          color: var(--text);
        }

        /* 고객이 보내온 말 — 대화창처럼 왼쪽에서 하나씩 올라온다 */
        .case-chat {
          margin: 0 0 1.75rem;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .case-chat__item { display: flex; }
        .case-chat__bubble {
          position: relative;
          display: inline-block;
          max-width: min(560px, 100%);
          padding: 0.85rem 1.1rem;
          border-radius: 4px 16px 16px 16px;
          background: var(--surface-container);
          color: var(--text);
          font-size: clamp(0.92rem, 2.3vw, 1.02rem);
          line-height: 1.65;
          word-break: keep-all;
          box-shadow: var(--shadow-card);
        }
        /* 말풍선 꼬리 */
        .case-chat__bubble::before {
          content: '';
          position: absolute;
          top: 0;
          left: -6px;
          width: 12px;
          height: 12px;
          background: var(--surface-container);
          clip-path: polygon(100% 0, 100% 100%, 0 0);
        }

        /* 인용을 받아 상황을 정리하는 문장 */
        .case-lead {
          margin: 0;
          white-space: pre-line;
          padding-left: 1.1rem;
          border-left: 3px solid var(--accent);
          font-size: clamp(0.95rem, 2.4vw, 1.05rem);
          line-height: 1.85;
          color: var(--text-secondary);
          word-break: keep-all;
        }

        .case-points { margin: 0; padding: 0; list-style: none; }
        .case-point {
          display: flex;
          gap: 1.1rem;
          padding: 1.4rem 1.2rem;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xl);
          background: var(--surface);
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .case-point + .case-point { margin-top: 0.75rem; }
        .case-point:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
        }
        .case-point__no {
          flex-shrink: 0;
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
          /* 번호는 배경처럼 — 읽는 걸 방해하지 않으면서 순서를 잡아 준다 */
          color: transparent;
          -webkit-text-stroke: 1.5px var(--accent);
          padding-top: 0.1rem;
          transition: color 0.25s;
        }
        .case-point:hover .case-point__no { color: var(--accent); }
        .case-point__title {
          margin: 0 0 0.45rem;
          font-size: clamp(1rem, 2.5vw, 1.12rem);
          font-weight: 700;
          color: var(--text);
          word-break: keep-all;
        }
        .case-point__body {
          margin: 0;
          white-space: pre-line;
          font-size: 0.92rem;
          line-height: 1.8;
          color: var(--text-muted);
          word-break: keep-all;
        }

        .case-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .case-feature {
          padding: 0.4rem 0.85rem;
          border: 1px solid var(--border);
          border-radius: 9999px;
          background: var(--surface);
          font-size: 0.83rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        /* 화면 — 브라우저 창 안에 넣어 실제 사이트를 보는 느낌을 준다 */
        .case-shots { display: flex; flex-direction: column; gap: 1.25rem; }
        .case-shot {
          margin: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          background: var(--surface);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .case-shot:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.5);
        }
        .case-shot__bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--surface-container);
        }
        /* 맥 창 신호등 — 빨강·노랑·초록 */
        .case-shot__dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
        }
        .case-shot__dot--red { background: #ff5f57; }
        .case-shot__dot--yellow { background: #febc2e; }
        .case-shot__dot--green { background: #28c840; }
        /* 다른 페이지 하단 CTA 와 같은 배치 — 왼쪽 전화 상담, 오른쪽 진단 신청 */
        .case-cta__row {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .br-mobile { display: none; }
        @media (max-width: 560px) {
          .br-mobile { display: inline; }
        }

        .case-related {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .case-related__card {
          display: block;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          background: var(--surface);
          text-decoration: none;
          transition: transform 0.2s, border-color 0.2s;
        }
        .case-related__card:hover {
          transform: translateY(-3px);
          border-color: var(--accent);
        }
        .case-related__thumb { aspect-ratio: 16 / 9; overflow: hidden; }
        .case-related__name {
          margin: 0 0 0.2rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
        }
        .case-related__desc {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-muted);
          word-break: keep-all;
        }

        @media (min-width: 641px) {
          .case-related { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  )
}
