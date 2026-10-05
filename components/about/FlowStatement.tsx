'use client'
import { useEffect, useRef } from 'react'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

// 진행 구간 — 단위는 '화면 높이의 몇 배'. 섹션이 화면에 붙은 뒤로 스크롤한 거리 기준이다.
const DARK_FROM = 0.1 // 바탕이 어두워지기 시작
const DARK_LEN = 0.4
const DEPTH_FROM = 0.5 // 윗줄이 뒤로 물러나고 아랫줄이 앞으로 나오기 시작
const DEPTH_LEN = 0.45
const LIT_AT = 0.8 // '앞에서 빛나게' 에 빛이 들어온다
// 붙어 있는 동안 스크롤되는 전체 거리 — 섹션 높이는 여기에 화면 한 장을 더한 값
const PIN_LEN = 1.35

/**
 * 회사소개의 철학 문장 — "기술은 뒤에서 받쳐주고, 사람은 앞에서 빛나게 하는 흐름".
 * 메인의 '왜 WEFLOW?' 화면과 같은 방식으로, 화면 한 장이 붙어 있는 동안 스크롤에 맞춰 진행된다:
 *  1) 두 줄이 양옆에서 가운데로 미끄러져 들어온다 — 윗줄은 왼쪽, 아랫줄은 오른쪽에서.
 *     (이 단계만 섹션이 화면 아래에서 올라오기 시작할 때부터 진행된다)
 *  2) 바탕이 흰색에서 어두운 색으로 가라앉고, 글씨는 검정에서 흰색으로 바뀐다.
 *  3) 문장 뜻 그대로 — 윗줄(기술)은 작고 흐리게 뒤로 물러나고, 아랫줄(사람)은 커지며 앞으로 나온다.
 *  4) '앞에서 빛나게' 에 하늘색 빛이 들어온다.
 *
 * 값은 스크롤 위치로 직접 계산해 넣는다 — 올리면 그대로 되감긴다.
 */
export default function FlowStatement() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 모션 최소화 설정에서는 CSS 가 검은 띠에 문장을 그대로 보여준다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const s = vh - top // 섹션 윗변이 화면 바닥을 지난 뒤로 스크롤한 거리
      const p = -top / vh // 화면에 붙은 뒤로 스크롤한 거리 (화면 높이의 배수)

      // 1) 등장
      el.style.setProperty('--fs-x', easeOut(clamp01(s / (vh * 1.1))).toFixed(4))

      // 2) 어두워짐 — 글씨는 바탕보다 먼저 밝아진다 (같은 속도면 중간에 둘 다 회색이 되어 글씨가 사라진다)
      const dark = clamp01((p - DARK_FROM) / DARK_LEN)
      const ink = clamp01(dark * 1.6)
      el.style.setProperty('--fs-bg', `rgb(${lerp(255, 14, dark)}, ${lerp(255, 14, dark)}, ${lerp(255, 16, dark)})`)
      el.style.setProperty('--fs-ink', `rgb(${lerp(17, 255, ink)}, ${lerp(17, 255, ink)}, ${lerp(17, 255, ink)})`)

      // 3) 앞뒤로 갈라짐
      el.style.setProperty('--fs-z', easeOut(clamp01((p - DEPTH_FROM) / DEPTH_LEN)).toFixed(4))

      // 4) 빛
      el.classList.toggle('is-lit', p >= LIT_AT)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={ref} className="fs-section" style={{ '--fs-len': PIN_LEN } as React.CSSProperties}>
      <div className="fs-pin">
        <h2 className="fs-title">
          <span className="fs-line fs-line--a">기술은 뒤에서 받쳐주고,</span>{' '}
          <span className="fs-line fs-line--b">
            사람은 <span className="fs-hl">앞에서 빛나게</span> 하는 흐름
          </span>
        </h2>
      </div>

      <style>{`
        /* 섹션 높이 = 화면 한 장 + 붙어 있는 동안 스크롤되는 거리(--fs-len 장) */
        .fs-section {
          position: relative;
          height: calc(100svh * (1 + var(--fs-len)));
          background: var(--fs-bg, #fff);
        }
        .fs-pin {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1.25rem;
          background: var(--fs-bg, #fff);
          color: var(--fs-ink, #111);
        }
        /* 아랫줄이 커져도(×1.12) 좁은 화면에서 넘치지 않는 크기 */
        .fs-title {
          margin: 0;
          color: inherit;
          font-size: clamp(1.25rem, 5.6vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.35;
          text-align: center;
        }
        /* 윗줄은 왼쪽 밖에서, 아랫줄은 오른쪽 밖에서 — --fs-x 가 1 이 되면 제자리.
           그 뒤 --fs-z 가 커지면 윗줄은 작고 흐려지고(뒤), 아랫줄은 커진다(앞) */
        .fs-line {
          display: block;
          white-space: nowrap;
          will-change: transform, opacity;
        }
        .fs-line--a {
          transform:
            translate3d(calc((1 - var(--fs-x, 0)) * -70vw), 0, 0)
            scale(calc(1 - var(--fs-z, 0) * 0.18));
          opacity: calc(1 - var(--fs-z, 0) * 0.55);
        }
        .fs-line--b {
          transform:
            translate3d(calc((1 - var(--fs-x, 0)) * 70vw), 0, 0)
            scale(calc(1 + var(--fs-z, 0) * 0.12));
        }

        /* 폰에서는 조금 더 크게 — 아랫줄이 커진 뒤(×1.12)에도 화면 폭 375px 에서 310px, 320px 에서 265px 이라 넘치지 않는다 */
        @media (max-width: 600px) {
          .fs-title { font-size: clamp(1.25rem, 6.4vw, 4rem); }
        }

        .fs-hl { transition: color 0.5s ease, text-shadow 0.5s ease; }
        .fs-section.is-lit .fs-hl { color: #9fd0ff; text-shadow: 0 0 28px rgba(127, 188, 247, 0.55); }

        /* 모션 최소화 — 붙잡지 않고 검은 띠에 문장을 그대로 보여준다 */
        @media (prefers-reduced-motion: reduce) {
          .fs-section { height: auto; background: #0e0e10; }
          .fs-pin {
            position: static;
            height: auto;
            padding: clamp(4.5rem, 10vw, 8.5rem) 1.25rem;
            background: #0e0e10;
            color: #fff;
          }
          .fs-line--a, .fs-line--b { transform: none; opacity: 1; }
          .fs-hl { color: #9fd0ff; }
        }
      `}</style>
    </section>
  )
}
