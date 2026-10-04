'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { portfolios, type Portfolio } from '@/data/cases'

// 메인에 올리는 사례 — 자체 도메인으로 운영 중인 실제 사례만 위에서부터 여섯 개.
// (샘플 카드와 임시 주소(vercel.app)에 올라가 있는 사례는 뺀다)
const FEATURED = portfolios
  .filter(p => !p.placeholder && p.url && !p.url.includes('vercel.app'))
  .slice(0, 6)

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
                sizes="(max-width: 700px) 64vw, 400px"
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
 * 메인 제작 사례 — 신뢰 밴드 바로 아래, 실제 운영 중인 사례 여섯 개를 가로 한 줄로 보여준다.
 * 카드는 글 없이 화면만 보여주고, 누르면 사례 상세(/cases/[slug])로 들어간다.
 *
 * PC: 섹션이 화면에 붙어 있는 동안(sticky) 세로 스크롤이 카드 줄의 가로 이동으로 바뀐다.
 *     섹션 높이를 '화면 높이 + 가로로 밀어야 할 거리'로 잡아, 스크롤 1px 이 가로 1px 이 되게 한다.
 * 모바일: 스크롤을 붙잡지 않고, 손가락으로 옆으로 넘기는 보통의 가로 스크롤로 둔다.
 */
export default function HomeCasesSection() {
  const { ref: headRef, shown: headShown } = useShown<HTMLElement>(0.3)
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    const mark = markRef.current
    if (!section || !pin || !viewport || !track || !mark) return

    const mobile = window.matchMedia('(max-width: 700px)')
    let max = 0 // 가로로 밀어야 할 전체 거리(px)
    let raf = 0

    const update = () => {
      raf = 0
      if (mobile.matches) return
      const p = max > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / max)) : 0
      track.style.transform = `translate3d(${-p * max}px, 0, 0)`
      pin.style.setProperty('--hc-p', p.toFixed(4))
    }
    // 모바일은 세로 스크롤이 아니라 손으로 옆으로 넘긴 만큼 글씨가 찬다
    const onSwipe = () => {
      if (!mobile.matches) return
      const range = viewport.scrollWidth - viewport.clientWidth
      const p = range > 0 ? Math.min(1, Math.max(0, viewport.scrollLeft / range)) : 0
      pin.style.setProperty('--hc-p', p.toFixed(4))
    }
    // 뒤의 큰 글씨를 화면 폭에 딱 맞춘다 — 글자 '잉크'의 실제 좌우 끝을 재서
    // 왼쪽 끝이 화면 왼쪽에, 오른쪽 끝이 화면 오른쪽에, 밑동이 화면 바닥에 닿게 크기와 위치를 잡는다.
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
        mark.style.bottom = `${-(below - m.actualBoundingBoxDescent) * k}px`
      }
    }
    const measure = () => {
      fitMark()
      if (mobile.matches) {
        max = 0
        section.style.height = ''
        track.style.transform = ''
        onSwipe()
        return
      }
      max = Math.max(0, track.offsetWidth - viewport.clientWidth)
      section.style.height = `calc(100svh + ${max}px)`
      update()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    measure()
    // 글꼴이 늦게 도착하면 글자 폭이 달라지므로 다시 맞춘다
    document.fonts?.ready.then(fitMark)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    viewport.addEventListener('scroll', onSwipe, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      viewport.removeEventListener('scroll', onSwipe)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={sectionRef} className="hc-section" aria-labelledby="hc-title">
      <div ref={pinRef} className="hc-pin">
        {/* 화면 좌하단 모서리에 붙은 큰 글씨 — 처음엔 아무것도 없다가, 넘길수록 하늘색 테두리 글씨가 왼쪽부터 드러난다.
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
            <div ref={trackRef} className="hc-track">
              {FEATURED.map(p => (
                <CaseCard key={p.slug} p={p} />
              ))}
              {/* 마지막 카드 오른쪽 — 카드 한 장 자리를 차지하는 '제작 사례 더보기'.
                  바탕이 없어 뒤의 글씨가 그대로 비친다 */}
              <Link href="/cases" className="hc-all">
                <span className="hc-all__btn" aria-hidden="true">
                  <ArrowRight size={30} />
                </span>
                <span className="hc-all__label">제작 사례 더보기</span>
              </Link>
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
        /* 화면에 붙는 층 — 섹션이 지나가는 동안 이 안에서 카드 줄만 옆으로 흐른다 */
        .hc-pin {
          --hc-side: max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem));
          --hc-gap: clamp(1rem, 2vw, 1.75rem);
          /* 세 장을 쌓아 세로로 긴 카드 — 화면이 낮으면 카드도 같이 줄어 제목과 함께 한 화면에 들어온다.
             위아래 여백(헤더 자리 포함) + 제목 줄 + 제목 아래 간격 + 카드 줄 여백이 최대 약 307px 이라 308px 을 뺀다 */
          --hc-card: clamp(170px, min(28vw, calc((100svh - 308px) / 1.5)), 400px);
          /* 카드 줄 앞에 비워 두는 자리 — 카드 한 장 몫. 첫 카드가 둘째 칸에서 출발해
             왼쪽으로 뒤의 글씨가 드러난다 */
          --hc-lead: calc(var(--hc-card) + var(--hc-gap));
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          /* 헤더가 보일 때를 기준으로 위아래 빈 공간을 잡는다 —
             위 100px = 헤더 64px + 36px, 아래 48px = 여기 24px + 카드 줄 아래 여백 24px.
             제목 위는 글씨 자체의 여백이 있어, 카드 아래보다 조금 좁게 잡아야 눈에 비슷해 보인다 */
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
          /* 제목 ↔ 카드 간격 — 넉넉히 띄운다. 섹션 위아래에 남던 빈 공간을 이쪽으로 끌어온 것이라
             카드 크기는 그대로다 (3.5rem 을 넘기면 카드 폭 계산에서 빼는 값(--hc-card 의 308px)도 같이 늘려야 한다) */
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
          /* 한 줄 — 두 줄로 늘리거나 더 키우면 카드 폭 계산에서 빼는 값(--hc-card 의 308px)도 같이 늘려야 한다 */
          font-size: clamp(2rem, 4.4vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.015em;
          line-height: 1.2;
          word-break: keep-all;
        }
        /* ── 가로 카드 줄 — 양 끝 여백을 제목 줄과 맞춘다 ── */
        .hc-stage { position: relative; }
        .hc-viewport { position: relative; z-index: 1; overflow: hidden; }
        .hc-track {
          display: flex;
          gap: var(--hc-gap);
          width: max-content;
          /* 위아래 여백은 호버 그림자·등장 이동이 잘리지 않을 자리 */
          /* 왼쪽은 카드 한 장 몫을 비우고, 오른쪽 끝 한 칸은 '제작 사례 더보기' 가 차지한다 */
          padding: 8px var(--hc-side) 24px calc(var(--hc-side) + var(--hc-lead));
          will-change: transform;
        }

        /* ── 뒤에 깔리는 큰 글씨 — 하늘색 테두리만 있는 글씨가 왼쪽에서 오른쪽으로 써지듯 드러난다 ── */
        .hc-mark {
          position: absolute;
          /* 화면 좌하단 모서리에 붙여 오른쪽 끝까지 꽉 채운다.
             정확한 크기·위치는 스크립트(fitMark)가 글자를 재서 넣고, 여기 값은 그 전까지 쓰는 어림값이다 */
          left: -0.03em;
          bottom: -0.13em;
          font-size: 21.6vw;
          font-weight: 900;
          line-height: 1;
          white-space: nowrap;
          color: transparent;
          -webkit-text-stroke: 2px #7fbcf7;
          /* 오른쪽을 (1 - 진행도)만큼 가린다 — 넘길수록 왼쪽부터 보인다 */
          clip-path: inset(0 calc((1 - var(--hc-p, 0)) * 100%) 0 0);
          pointer-events: none;
          user-select: none;
        }

        /* ── 카드 — 아래에서 떠오르며 등장 ── */
        .hc-card {
          flex: none;
          width: var(--hc-card);
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

        /* ── 제작 사례 더보기 — 카드 한 장과 같은 크기의 빈 칸 가운데에 둥근 버튼과 글 ── */
        .hc-all {
          flex: none;
          width: var(--hc-card);
          aspect-ratio: 2 / 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          /* 오른쪽을 비워 버튼과 글을 칸 가운데보다 왼쪽(마지막 카드 쪽)으로 붙인다.
             % 로 쓰면 카드 줄 전체 폭을 기준으로 계산돼 칸이 엄청나게 커진다 — 카드 폭 기준으로 직접 잡는다 */
          padding-right: calc(var(--hc-card) * 0.3);
          color: #111;
          text-decoration: none;
        }
        .hc-all__btn {
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #111;
          color: #fff;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hc-all__label {
          font-size: 1.05rem;
          font-weight: 700;
          white-space: nowrap;
        }
        /* 호버 — 버튼이 커지고 화살표가 오른쪽으로 나갔다가 왼쪽에서 다시 들어온다 */
        .hc-all:hover .hc-all__btn { transform: scale(1.1); }
        .hc-all:hover .hc-all__btn svg { animation: hcAllArrow 0.55s cubic-bezier(0.65, 0, 0.35, 1); }
        @keyframes hcAllArrow {
          0% { transform: translateX(0); }
          49% { transform: translateX(60px); }
          50% { transform: translateX(-60px); }
          100% { transform: translateX(0); }
        }

        /* ── 모바일 — 붙잡지 않고 손가락으로 옆으로 넘긴다 ── */
        @media (max-width: 700px) {
          .hc-pin {
            --hc-side: 1.25rem;
            --hc-card: 64vw;
            /* 모바일은 카드 한 장을 다 비우면 첫 화면에 카드가 거의 안 보인다 — 화면 폭의 1/3 만 비운다 */
            --hc-lead: 34vw;
            position: static;
            height: auto;
            display: block;
            padding: clamp(3.5rem, 12vw, 5rem) 0;
          }
          .hc-inner { padding: 0 1.25rem; }
          .hc-all__btn { width: 68px; height: 68px; }
          /* 딱딱 멈추는 스냅은 뺐다 — 켜 두면 열자마자 첫 카드가 왼쪽 끝으로 끌려가 앞의 빈 자리가 사라진다 */
          .hc-viewport {
            overflow-x: auto;
            scrollbar-width: none;
          }
          .hc-viewport::-webkit-scrollbar { display: none; }
          .hc-track { padding-bottom: 12px; }
          .hc-media { border-radius: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-card, .hc-head, .hc-shots, .hc-media { transition: none; }
          .hc-card, .hc-head { opacity: 1; transform: none; }
          .hc-shots { transform: none !important; }
          .hc-all__btn { transition: none; }
          .hc-all:hover .hc-all__btn svg { animation: none; }
        }
      `}</style>
    </section>
  )
}
