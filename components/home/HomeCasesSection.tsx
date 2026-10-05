'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { portfolios, type Portfolio } from '@/data/cases'

// 메인에 올리는 사례 — 자체 도메인으로 운영 중인 실제 사례만 위에서부터 다섯 개.
// (샘플 카드와 임시 주소(vercel.app)에 올라가 있는 사례는 뺀다)
const FEATURED = portfolios
  .filter(p => !p.placeholder && p.url && !p.url.includes('vercel.app'))
  .slice(0, 5)

// 카드에 세로로 이어 붙일 사진 세 장 — 사례별 사진 번호(파일 이름 끝의 01, 02 … 와 같은 번호).
// 적어 두지 않은 사례는 앞에서부터 세 장을 쓴다.
const SHOTS: Record<string, [number, number, number]> = {
  atelier: [1, 7, 9],
  tirecamp: [1, 7, 8],
  kpsc: [1, 5, 10],
  saedure: [1, 2, 7],
  ksmobility: [1, 3, 5],
  hrentcar: [1, 4, 6],
}

// 메인 카드용으로 줄여 둔 사진(가로 800px)이 있는 파일 — public/images/cases/home 에 있다.
// 이 사이트는 이미지 자동 최적화를 꺼 두어서(next.config), 원본(가로 1920px)을 그대로 걸면
// 카드 폭이 400px 인데도 원본이 통째로 내려간다. SHOTS 를 바꾸면 줄인 사진도 새로 만들어 여기 적는다.
const HOME_THUMBS = new Set([
  'cases-atelier-01.webp', 'cases-atelier-07.webp', 'cases-atelier-09.webp',
  'cases-tirecamp-01.webp', 'cases-tirecamp-07.webp', 'cases-tirecamp-08.webp',
  'cases-kpsc-01.webp', 'cases-kpsc-05.webp', 'cases-kpsc-10.webp',
  'cases-saedure-01.webp', 'cases-saedure-02.webp', 'cases-saedure-07.webp',
  'cases-ksmobility-01.webp', 'cases-ksmobility-03.webp', 'cases-ksmobility-05.webp',
  'cases-hrentcar-01.webp', 'cases-hrentcar-04.webp', 'cases-hrentcar-06.webp',
])
/** 줄여 둔 사진이 있으면 그 주소를, 없으면 원본 주소를 돌려준다 */
const homeThumb = (src: string) => {
  const name = src.split('/').pop() ?? ''
  return HOME_THUMBS.has(name) ? `/images/cases/home/${name}` : src
}

/**
 * 요소가 화면에 한 번 들어오면 shown 이 켜진다 — 등장 애니메이션용.
 * 페이지 공통 .reveal 감시에 기대지 않고 이 섹션이 직접 본다.
 */
function useShown<T extends Element>(threshold: number) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, shown }
}

/**
 * 사례 카드 한 장 — 글 없이 화면만 보여준다.
 *
 * 사진 세 장(SHOTS 에서 고른 것)을 위아래로 이어 붙여,
 * 사이트를 스크롤해 내려간 것처럼 긴 한 장으로 보이게 한다. 사진은 자르지 않고 그대로 쌓는다.
 */
function CaseCard({ p }: { p: Portfolio }) {
  const { ref: cardRef, shown } = useShown<HTMLAnchorElement>(0.2)
  const shots = (SHOTS[p.slug] ?? [1, 2, 3])
    .map(n => p.images[n - 1])
    .filter(Boolean)
    .map(homeThumb)

  return (
    <Link
      ref={cardRef}
      href={`/cases/${p.slug}`}
      aria-label={`${p.name} 제작 사례 보기`}
      className={`hc-card${shown ? ' is-in' : ''}`}
    >
      <span className="hc-media">
        <span className="hc-shots">
          {shots.map((src, i) => (
            <span key={src} className="hc-shot">
              <Image
                src={src}
                alt={i === 0 ? `${p.name} 홈페이지 화면` : ''}
                fill
                sizes="(max-width: 700px) 64vw, 21vw"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </span>
          ))}
        </span>
      </span>
    </Link>
  )
}

/**
 * 메인 제작 사례 — 히어로 바로 아래, 실제 운영 중인 사례 다섯 개를 보여준다.
 * 카드는 글 없이 화면만 보여주고, 누르면 사례 상세(/cases/[slug])로 들어간다.
 *
 * PC: 다섯 장을 화면 한가운데에 한 줄로 놓는다 (옆으로 넘기지 않는다). 줄이 화면보다 조금 넓어서
 *     첫째·다섯째 카드는 화면 양 끝에서 잘려 보이고, 셋째 카드가 정중앙에 온다.
 *     섹션은 화면 한 장 높이이고, 뒤의 큰 WEFLOW 글씨는 처음부터 다 그려져 섹션 바닥에 깔린다.
 * 모바일: 손가락으로 옆으로 넘기는 보통의 가로 스크롤 — 첫 카드는 왼쪽 여백만 두고 붙어서 시작하고,
 *         넘긴 만큼 뒤의 글씨가 왼쪽부터 드러난다.
 */
export default function HomeCasesSection() {
  const { ref: headRef, shown: headShown } = useShown<HTMLElement>(0.3)
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pin = pinRef.current
    const viewport = viewportRef.current
    const mark = markRef.current
    if (!pin || !viewport || !mark) return

    const mobile = window.matchMedia('(max-width: 700px)')

    // 모바일은 손으로 옆으로 넘긴 만큼 글씨가 찬다. PC 는 값을 지워 CSS 기본값(다 보임)을 쓴다
    const onSwipe = () => {
      if (!mobile.matches) {
        pin.style.removeProperty('--hc-p')
        return
      }
      const range = viewport.scrollWidth - viewport.clientWidth
      const p = range > 0 ? Math.min(1, Math.max(0, viewport.scrollLeft / range)) : 0
      pin.style.setProperty('--hc-p', p.toFixed(4))
    }
    // 뒤의 큰 글씨를 화면 폭에 딱 맞춘다 — 글자 '잉크'의 실제 좌우 끝을 재서
    // 왼쪽 끝이 화면 왼쪽에, 오른쪽 끝이 화면 오른쪽에, 밑동이 섹션 바닥에 닿게 크기와 위치를 잡는다.
    // (글자 상자에는 좌우·아래로 빈 몫이 있어, 상자 기준으로 맞추면 눈에는 떠 보인다)
    const fitMark = () => {
      const cs = getComputedStyle(mark)
      const ctx = document.createElement('canvas').getContext('2d')
      if (!ctx) return
      ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`
      const m = ctx.measureText(mark.textContent ?? '')
      const ink = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
      if (!(ink > 0)) return
      const k = pin.clientWidth / ink // 100px 로 쟀을 때의 값에 곱할 배율
      mark.style.fontSize = `${100 * k}px`
      mark.style.left = `${m.actualBoundingBoxLeft * k}px`
      // 줄 높이 1 인 상자에서 글자 밑동(기준선) 아래에 남는 높이만큼 아래로 내린다
      if (m.fontBoundingBoxAscent != null) {
        const below = (100 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxDescent
        // 둥근 글자(O)는 밑동이 기준선보다 살짝 아래로 내려온다. 잰 값이 그보다 작게 나오면(글꼴이 덜 왔을 때 등)
        // O 아래가 섹션 바닥에 잘리므로, 어림값(글자 크기의 1.6%)으로 받쳐 둔다
        const descent = Math.max(m.actualBoundingBoxDescent, 1.6)
        // 테두리만 있는 글씨라 선 두께의 절반(1px)이 글자 밖으로 나온다 — 그 몫과 여유 1px 만큼 더 올린다
        mark.style.bottom = `${-(below - descent) * k + 2}px`
      }
    }
    const measure = () => {
      fitMark()
      onSwipe()
    }

    measure()
    // 글꼴이 늦게 도착하면 글자 폭이 달라지므로 다시 맞춘다
    document.fonts?.ready.then(fitMark)
    window.addEventListener('resize', measure)
    viewport.addEventListener('scroll', onSwipe, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      viewport.removeEventListener('scroll', onSwipe)
    }
  }, [])

  return (
    <section className="hc-section" aria-labelledby="hc-title">
      <div ref={pinRef} className="hc-pin">
        {/* 섹션 좌하단 모서리에 붙은 큰 글씨 — 하늘색 테두리 글씨가 카드 뒤에 깔린다.
            맨 앞에 두어 제목·카드보다 뒤에 깔리게 한다 */}
        <div ref={markRef} className="hc-mark" aria-hidden="true">
          WEFLOW
        </div>

        <div className="hc-inner">
          <header ref={headRef} className={`hc-head${headShown ? ' is-in' : ''}`}>
            <p className="hc-eyebrow">PORTFOLIO</p>
            <h2 id="hc-title" className="hc-title">
              고객 맞춤 실제 제작 사례
            </h2>
          </header>
        </div>

        <div className="hc-stage">
          <div ref={viewportRef} className="hc-viewport">
            <div className="hc-track">
              {FEATURED.map(p => (
                <CaseCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hc-section {
          position: relative;
          background: #fff;
          color: #111;
        }
        /* 섹션 안쪽 — 화면 한 장 높이를 채우고, 제목과 카드 줄을 그 가운데에 둔다.
           뒤의 큰 글씨는 이 상자의 좌하단에 붙는다 (넘치는 부분은 잘라 낸다) — 카드 줄 아래로 아랫부분만 드러난다.
           화면이 낮아 내용이 한 장에 다 안 들어가면 그만큼만 길어진다 (잘리지 않게 min-height 로 둔다) */
        .hc-pin {
          --hc-gap: 1.75vw;
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          /* 헤더가 보일 때를 기준으로 위아래 빈 공간을 잡는다 —
             위 100px = 헤더 64px + 36px, 아래 48px = 여기 24px + 카드 줄 아래 여백 24px */
          padding: 100px 0 24px;
          overflow: hidden;
        }
        .hc-inner {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── 머리말 ── */
        .hc-head {
          text-align: center;
          margin-bottom: clamp(2rem, 6vh, 3.5rem);
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hc-head.is-in { opacity: 1; transform: none; }
        .hc-eyebrow {
          margin: 0 0 0.5rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #888;
        }
        .hc-title {
          margin: 0;
          color: #111;
          font-size: clamp(2rem, 4.4vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.015em;
          line-height: 1.2;
          word-break: keep-all;
        }
        /* ── 카드 줄 — PC 는 다섯 장을 화면 한가운데에 한 줄로 놓는다 (옆으로 넘기지 않는다).
              카드 폭을 화면 폭의 20.25% 로 잡아 줄 전체가 화면보다 넓다 (5장 + 틈 4개 ≈ 108%) —
              가운데 정렬이라 양쪽으로 똑같이 넘쳐, 첫째·다섯째 카드가 화면 끝에서 약 1/5 씩 잘린다 ── */
        .hc-stage { position: relative; }
        .hc-viewport { position: relative; z-index: 1; }
        .hc-track {
          display: flex;
          justify-content: center;
          gap: var(--hc-gap);
          /* 위아래 여백은 호버 그림자·등장 이동이 잘리지 않을 자리 */
          padding: 8px 0 24px;
        }

        /* ── 뒤에 깔리는 큰 글씨 — 하늘색 테두리만 있는 글씨 ── */
        .hc-mark {
          position: absolute;
          /* 섹션 좌하단 모서리에 붙여 오른쪽 끝까지 꽉 채운다.
             정확한 크기·위치는 스크립트(fitMark)가 글자를 재서 넣고, 여기 값은 그 전까지 쓰는 어림값이다 */
          left: -0.03em;
          bottom: -0.13em;
          font-size: 21.6vw;
          font-weight: 900;
          line-height: 1;
          white-space: nowrap;
          color: transparent;
          -webkit-text-stroke: 2px #7fbcf7;
          /* 오른쪽을 (1 - 진행도)만큼 가린다. PC 는 진행도를 주지 않아 기본값 1 — 처음부터 다 보인다.
             모바일은 옆으로 넘긴 만큼 스크립트가 진행도(--hc-p)를 넣어 왼쪽부터 드러난다 */
          clip-path: inset(0 calc((1 - var(--hc-p, 1)) * 100%) 0 0);
          pointer-events: none;
          user-select: none;
        }

        /* ── 카드 — 아래에서 떠오르며 등장 ── */
        .hc-card {
          flex: none;
          width: 20.25vw;
          display: block;
          color: inherit;
          text-decoration: none;
          opacity: 0;
          transform: translateY(56px);
          transition:
            opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hc-card.is-in { opacity: 1; transform: none; }

        .hc-media {
          position: relative;
          display: block;
          /* 2:1 화면 세 장을 그대로 쌓아 2:3 */
          aspect-ratio: 2 / 3;
          border-radius: 20px;
          overflow: hidden;
          background: #f1f1f1;
          /* 사진 가장자리가 흰 바탕에 녹지 않게 아주 옅은 테두리 */
          box-shadow: 0 0 0 1px rgba(17, 17, 17, 0.06);
          transition: box-shadow 0.4s ease, border-radius 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hc-card:hover .hc-media {
          box-shadow: 0 0 0 1px rgba(17, 17, 17, 0.06), 0 16px 24px -16px rgba(17, 17, 17, 0.28);
          border-radius: 28px;
        }
        /* 사진 — 크게 들어왔다가 제자리로 가라앉고, 마우스를 올리면 다시 천천히 다가온다 */
        .hc-shots {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          transform: scale(1.14);
          transition: transform 1.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hc-card.is-in .hc-shots { transform: scale(1); }
        .hc-card.is-in:hover .hc-shots { transform: scale(1.045); }
        .hc-shot { position: relative; display: block; flex: 1 1 0; min-height: 0; }

        /* ── 모바일 — 손가락으로 옆으로 넘긴다. 첫 카드는 왼쪽 여백(1.25rem)만 두고 붙어서 시작한다 ── */
        @media (max-width: 700px) {
          .hc-pin {
            min-height: 0;
            display: block;
            padding: clamp(3.5rem, 12vw, 5rem) 0;
          }
          .hc-inner { padding: 0 1.25rem; }
          /* 딱딱 멈추는 스냅은 두지 않는다 — 손을 떼는 자리에서 그대로 멈춘다 */
          .hc-viewport {
            overflow-x: auto;
            scrollbar-width: none;
          }
          .hc-viewport::-webkit-scrollbar { display: none; }
          .hc-pin { --hc-gap: 1rem; }
          .hc-track {
            justify-content: flex-start;
            width: max-content;
            padding: 8px 1.25rem 12px;
          }
          .hc-card { width: 64vw; }
          .hc-media { border-radius: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-card, .hc-head, .hc-shots, .hc-media { transition: none; }
          .hc-card, .hc-head { opacity: 1; transform: none; }
          .hc-shots { transform: none !important; }
        }
      `}</style>
    </section>
  )
}
