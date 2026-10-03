'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// 진행 구간 — 단위는 '화면 높이의 몇 배'. 섹션이 화면에 붙은 뒤로 스크롤한 거리 기준이다.
const MERGE_FROM = 0.15 // WE 와 FLOW 가 모이기 시작
const MERGE_LEN = 0.5
const FOOT_FROM = 0.72 // 소개 글과 버튼이 나타나기 시작
const FOOT_LEN = 0.2
const PIN_LEN = 1.15 // 붙어 있는 동안 스크롤되는 전체 거리

/**
 * 회사소개 도입 — 'WE' 와 'FLOW' 가 만나 'WEFLOW' 가 되는 장면으로 이름의 뜻을 보여준다.
 *
 * 화면 한 장이 붙어 있는 동안 스크롤에 맞춰 진행된다:
 *  1) 왼쪽에 WE(사진 + 뜻풀이), 오른쪽에 FLOW(사진 + 뜻풀이)가 양옆에서 들어온다.
 *     (이 단계만 섹션이 화면 아래에서 올라오기 시작할 때부터 진행된다)
 *  2) 두 글자가 가운데로 모여 한 단어 'WEFLOW' 가 되고, 두 사진도 맞붙어 한 장이 된다.
 *     뜻풀이는 사라지고 그 자리에 표어가 나타난다.
 *  3) 소개 글과 '회사소개 자세히 보기' 버튼이 나타난다.
 *
 * 배치는 '다 모인 상태'를 기준으로 잡아 두고, 모이기 전 위치는 거기서 얼마나 떨어져 있는지를
 * 재서(measure) transform 으로 밀어 놓는다 — 그래야 모였을 때 단어가 정확히 화면 가운데에 온다.
 */
export default function HomeAboutIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const weRef = useRef<HTMLSpanElement>(null)
  const flowRef = useRef<HTMLSpanElement>(null)
  const weTagRef = useRef<HTMLSpanElement>(null)
  const flowTagRef = useRef<HTMLSpanElement>(null)
  const wePhotoRef = useRef<HTMLDivElement>(null)
  const flowPhotoRef = useRef<HTMLDivElement>(null)
  const sloganRef = useRef<HTMLParagraphElement>(null)
  const footRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    const we = weRef.current
    const flow = flowRef.current
    const weTag = weTagRef.current
    const flowTag = flowTagRef.current
    const wePhoto = wePhotoRef.current
    const flowPhoto = flowPhotoRef.current
    const slogan = sloganRef.current
    const foot = footRef.current
    if (!el || !we || !flow || !weTag || !flowTag || !wePhoto || !flowPhoto || !slogan || !foot) return
    // 모션 최소화 설정에서는 CSS 가 다 모인 상태를 그대로 보여준다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let gap = 0 // 모이기 전 두 사진 사이 간격
    let weDx = 0 // 모이기 전 WE 가 제자리에서 떨어져 있는 거리 (자기 사진 가운데 위에 오도록)
    let flowDx = 0
    let raf = 0

    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const vw = window.innerWidth
      const top = el.getBoundingClientRect().top
      const e = easeOut(clamp01((vh - top) / (vh * 1.1))) // 등장
      const p = -top / vh
      const m = easeInOut(clamp01((p - MERGE_FROM) / MERGE_LEN)) // 모임
      const f = easeOut(clamp01((p - FOOT_FROM) / FOOT_LEN)) // 맺음

      const side = (1 - e) * vw * 0.4
      we.style.transform = `translate3d(${(1 - m) * weDx - side}px, 0, 0)`
      flow.style.transform = `translate3d(${(1 - m) * flowDx + side}px, 0, 0)`
      wePhoto.style.transform = `translate3d(${-(1 - m) * (gap / 2) - side}px, 0, 0)`
      flowPhoto.style.transform = `translate3d(${(1 - m) * (gap / 2) + side}px, 0, 0)`
      el.style.setProperty('--ha-e', e.toFixed(4))
      el.style.setProperty('--ha-m', m.toFixed(4))

      const tag = String(e * clamp01(1 - m * 2.2))
      weTag.style.opacity = tag
      flowTag.style.opacity = tag
      const s = clamp01((m - 0.7) / 0.3)
      slogan.style.opacity = String(s)
      slogan.style.transform = `translate3d(0, ${(1 - s) * 14}px, 0)`
      foot.style.opacity = String(f)
      foot.style.transform = `translate3d(0, ${(1 - f) * 28}px, 0)`
      foot.style.pointerEvents = f > 0.6 ? 'auto' : 'none'
    }
    // offsetLeft/Width 는 transform 의 영향을 받지 않는다 — 언제 재도 '다 모인 상태'의 자리가 나온다
    const measure = () => {
      gap = Math.min(36, Math.max(14, window.innerWidth * 0.024))
      const center = (n: HTMLElement) => n.offsetLeft + n.offsetWidth / 2
      weDx = center(wePhoto) - gap / 2 - center(we)
      flowDx = center(flowPhoto) + gap / 2 - center(flow)
      update()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    measure()
    // 글꼴이 늦게 도착하면 글자 폭이 달라지므로 다시 잰다
    document.fonts?.ready.then(measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ha-section"
      aria-labelledby="ha-title"
      style={{ '--ha-len': PIN_LEN } as React.CSSProperties}
    >
      <div className="ha-pin">
        <div className="ha-stage">
          <p className="ha-eyebrow">ABOUT US</p>

          <h2 id="ha-title" className="ha-word" aria-label="WEFLOW">
            <span ref={weRef} className="ha-w" aria-hidden="true">
              WE
              <span ref={weTagRef} className="ha-tag">
                우리 · 사람 · 관계 · 함께하는 가치
              </span>
            </span>
            <span ref={flowRef} className="ha-w" aria-hidden="true">
              FLOW
              <span ref={flowTagRef} className="ha-tag">
                흐름 · 성장 · 연결 · 나아가는 움직임
              </span>
            </span>
          </h2>

          {/* 뜻풀이가 있던 줄 — 글자가 모이고 나면 표어가 이 자리에 나타난다 */}
          <div className="ha-mid">
            <p ref={sloganRef} className="ha-slogan">
              사람이 움직이면, <b>기술은 따라온다</b>
            </p>
          </div>

          <div className="ha-photos">
            <div ref={wePhotoRef} className="ha-photo ha-photo--we">
              <Image
                src="/images/main/main-about-01.webp"
                alt="함께 화면을 보며 이야기하는 WEFLOW 사람들"
                fill
                sizes="(max-width: 700px) 46vw, 500px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div ref={flowPhotoRef} className="ha-photo ha-photo--flow">
              <Image
                src="/images/main/main-about-02.webp"
                alt="빛의 흐름이 지나는 계단을 함께 오르는 모습"
                fill
                sizes="(max-width: 700px) 46vw, 500px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div ref={footRef} className="ha-foot">
            <p>
              WEFLOW는 사람과 기술이 함께 흘러가며 더 좋은 방향을 만드는 회사입니다.
              <br className="ha-br" /> 기술은 뒤에서 받쳐주고, 사람은 앞에서 빛나게 합니다.
            </p>
            <Link href="/about" className="ha-more">
              회사소개 자세히 보기
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* 섹션 높이 = 화면 한 장 + 붙어 있는 동안 스크롤되는 거리(--ha-len 장) */
        .ha-section {
          position: relative;
          height: calc(100svh * (1 + var(--ha-len)));
          background: #fff;
          color: #111;
        }
        .ha-pin {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          /* 위쪽은 스크롤을 올릴 때 다시 내려오는 헤더(64px) 자리를 비워 둔다 */
          padding: 76px 1.25rem 28px;
          overflow: hidden;
        }
        /* 사진 한 장의 폭 — 화면이 낮으면 같이 줄어 글·버튼까지 한 화면에 들어온다 */
        .ha-stage {
          --ha-p: min(40vw, 500px, calc((100svh - 470px) * 1.7778));
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .ha-eyebrow {
          margin: 0 0 clamp(0.9rem, 2.5vh, 1.6rem);
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
          opacity: var(--ha-e, 0);
        }

        /* ── 단어 — 다 모인 상태가 기본 배치(두 조각이 붙어 가운데 정렬) ── */
        .ha-word {
          margin: 0;
          display: flex;
          justify-content: center;
          color: #111;
          font-size: clamp(2.4rem, 6.4vw, 5rem);
          font-weight: 900;
          letter-spacing: 0.01em;
          line-height: 1;
          white-space: nowrap;
        }
        .ha-w { position: relative; display: block; opacity: var(--ha-e, 0); will-change: transform; }
        /* 뜻풀이 — 조각 바로 아래 가운데. 자리를 차지하지 않게 띄워 둔다 */
        .ha-tag {
          position: absolute;
          top: calc(100% + clamp(0.6rem, 1.6vh, 1rem));
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(0.72rem, 1.25vw, 1rem);
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.4;
          color: #666;
          opacity: 0;
        }

        /* ── 뜻풀이·표어 줄 ── */
        .ha-mid {
          height: clamp(2.6rem, 6.5vh, 3.8rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ha-slogan {
          margin: 0;
          font-size: clamp(1rem, 2vw, 1.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          white-space: nowrap;
          opacity: 0;
        }
        .ha-slogan b { font-weight: 800; color: #3f8fe0; }

        /* ── 사진 — 다 모이면 가운데 모서리가 펴지며 한 장으로 이어진다 ── */
        .ha-photos { display: flex; justify-content: center; }
        .ha-photo {
          position: relative;
          flex: none;
          width: var(--ha-p);
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #f1f1f1;
          opacity: var(--ha-e, 0);
          will-change: transform;
          --ha-r: clamp(14px, 1.8vw, 24px);
          --ha-in: calc(var(--ha-r) * (1 - var(--ha-m, 0)));
        }
        .ha-photo--we { border-radius: var(--ha-r) var(--ha-in) var(--ha-in) var(--ha-r); }
        .ha-photo--flow { border-radius: var(--ha-in) var(--ha-r) var(--ha-r) var(--ha-in); }

        /* ── 소개 글과 버튼 ── */
        .ha-foot {
          margin-top: clamp(1.1rem, 3vh, 1.9rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.9rem, 2.4vh, 1.4rem);
          opacity: 0;
          pointer-events: none;
        }
        .ha-foot p {
          margin: 0;
          font-size: clamp(0.92rem, 1.35vw, 1.1rem);
          line-height: 1.65;
          color: #555;
          word-break: keep-all;
        }
        .ha-more {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.9rem 1.6rem;
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
        .ha-more:hover { background: transparent; color: #111; }
        .ha-more svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .ha-more:hover svg { transform: translateX(4px); }

        /* 좁은 화면 — 사진을 화면 폭에 맞춰 키우고, 소개 글의 줄바꿈은 흐름에 맡긴다 */
        @media (max-width: 700px) {
          .ha-stage { --ha-p: min(45vw, calc((100svh - 470px) * 1.7778)); }
          .ha-br { display: none; }
        }

        /* 모션 최소화 — 붙잡지 않고 다 모인 상태만 보여준다 */
        @media (prefers-reduced-motion: reduce) {
          .ha-section { height: auto; }
          .ha-pin { position: static; height: auto; padding: 5rem 1.25rem; }
          .ha-eyebrow, .ha-w, .ha-photo, .ha-slogan, .ha-foot { opacity: 1; }
          .ha-photo { --ha-in: 0px; }
          .ha-foot { pointer-events: auto; }
        }
      `}</style>
    </section>
  )
}
