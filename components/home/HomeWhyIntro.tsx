'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { WhyAdminDemo, WhyDemoStyles, WhyFeatureDemo, WhySearchDemo, WhySpeedDemo } from './WhyDemos'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

// '왜 WEFLOW일까요?' 에 대한 답 — /difference 의 긴 설명을 키워드 한 줄 + 한 문장으로 줄였다.
// 자세한 내용은 그 페이지에 그대로 두고 마지막 버튼으로 넘긴다.
// 답마다 왼쪽에 시연 카드(코드로 그린 화면), 오른쪽에 글이 놓인다.
// 02·03 은 WEFLOW 가 내세우는 낱말(SEO·AEO·GEO · 최신 기술)을 제목에 두고, 고객이 얻는 결과는 설명에 적는다
// (메인 솔루션 카드·혜택 안내와 같은 제목)
// (제목·설명의 줄바꿈은 정해 둔 자리다 — 쉼표 뒤, 그리고 'SEO·AEO·GEO' 뒤에서 끊는다)
const ANSWERS: { id: string; title: React.ReactNode; desc: React.ReactNode; Demo: () => React.ReactNode }[] = [
  { id: 'feature', title: '원하는 기능은 무엇이든', desc: '“안 됩니다” 대신, 필요한 기능을 직접 개발해 넣습니다.', Demo: WhyFeatureDemo },
  {
    id: 'search',
    title: (
      <>
        SEO·AEO·GEO <br className="wi-br-pc" />
        구조 설계
      </>
    ),
    desc: (
      <>
        네이버·구글 검색과 AI 답변에 잡히도록,
        <br />
        구조부터 설계합니다.
      </>
    ),
    Demo: WhySearchDemo,
  },
  {
    id: 'speed',
    title: '최신 기술로 제작',
    desc: (
      <>
        최신 웹 기술로 처음부터 만들어,
        <br />
        모바일에서도 로딩이 빠릅니다.
      </>
    ),
    Demo: WhySpeedDemo,
  },
  { id: 'admin', title: '나만의 관리자 페이지', desc: '문의·예약이 한곳에 쌓이고, 내용도 직접 고칩니다.', Demo: WhyAdminDemo },
]

// 진행 구간 — 단위는 '화면 높이의 몇 배'. 섹션이 화면에 붙은 뒤로 스크롤한 거리 기준이다.
const DARK_FROM = 0.25 // 바탕이 어두워지기 시작
const DARK_LEN = 0.45
const LIT_AT = 0.84 // WEFLOW 에 강조색
const ASK_OUT_FROM = 1.3 // 질문이 위로 빠져나가기 시작
const ASK_OUT_LEN = 0.3
const ANS_FROM = 1.5 // 첫 답이 들어오기 시작
const ANS_LEN = 0.65 // 답 하나가 차지하는 길이
const ANS_IN = 0.3 // 그중 들어오는 데 쓰는 비율
const ANS_OUT = 0.25 // 그중 나가는 데 쓰는 비율
const END_HOLD = 0.55 // 맺음 장면이 다 들어온 뒤 머무는 길이
// 맺음 장면이 들어오기 시작하는 곳 — 마지막 답이 나간 바로 뒤
const END_FROM = ANS_FROM + ANS_LEN * ANSWERS.length
// 붙어 있는 동안 스크롤되는 전체 거리 — 섹션 높이는 여기에 화면 한 장을 더한 값
const PIN_LEN = END_FROM + ANS_LEN * ANS_IN + END_HOLD

/**
 * '왜 WEFLOW?' 화면 — 제작 사례(흰 바탕)와 그 아래 어두운 섹션들을 잇는다.
 *
 * 화면 한 장이 붙어 있는 동안 스크롤에 맞춰 차례로 진행된다:
 *  1) 두 줄 질문이 양옆에서 가운데로 미끄러져 들어온다 — 윗줄은 왼쪽, 아랫줄은 오른쪽에서.
 *     (이 단계만 섹션이 화면 아래에서 올라오기 시작할 때부터 진행된다)
 *  2) 바탕이 흰색에서 어두운 색으로 가라앉고, 글씨는 검정에서 흰색으로 바뀐다.
 *  3) 'WEFLOW' 에 하늘색이 들어온다.
 *  4) 질문이 위로 빠지고, 답 네 개가 한 번에 하나씩 올라왔다가 올라간다.
 *  5) 맺음 장면 — "더 궁금하시다면?" 과 버튼이 올라와 남는다.
 *
 * 값은 스크롤 위치로 직접 계산해 넣는다 — 올리면 그대로 되감긴다.
 */
export default function HomeWhyIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const askRef = useRef<HTMLDivElement>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    const ask = askRef.current
    const end = endRef.current
    if (!el || !ask || !end) return
    // 모션 최소화 설정에서는 CSS 가 질문과 답을 차례로 쌓아 그대로 보여준다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const s = vh - top // 섹션 윗변이 화면 바닥을 지난 뒤로 스크롤한 거리
      const p = -top / vh // 화면에 붙은 뒤로 스크롤한 거리 (화면 높이의 배수)

      // 1) 질문 등장
      const slide = easeOut(clamp01(s / (vh * 1.28)))
      el.style.setProperty('--wi-x', slide.toFixed(4))

      // 2) 어두워짐 — 글씨는 바탕보다 먼저 밝아진다 (같은 속도면 중간에 둘 다 회색이 되어 글씨가 사라진다)
      const dark = clamp01((p - DARK_FROM) / DARK_LEN)
      const ink = clamp01(dark * 1.6)
      el.style.setProperty('--wi-bg', `rgb(${lerp(255, 14, dark)}, ${lerp(255, 14, dark)}, ${lerp(255, 16, dark)})`)
      el.style.setProperty('--wi-ink', `rgb(${lerp(17, 255, ink)}, ${lerp(17, 255, ink)}, ${lerp(17, 255, ink)})`)

      // 3) 강조색
      el.classList.toggle('is-lit', p >= LIT_AT)

      // 4) 질문 퇴장
      const out = clamp01((p - ASK_OUT_FROM) / ASK_OUT_LEN)
      ask.style.opacity = String(1 - out)
      ask.style.transform = `translate3d(0, ${-out * 48}px, 0)`

      // 4) 답 — 들어오고, 머물고, 나간다
      answerRefs.current.forEach((a, i) => {
        if (!a) return
        const t = (p - (ANS_FROM + ANS_LEN * i)) / ANS_LEN
        const enter = easeOut(clamp01(t / ANS_IN))
        const exit = clamp01((t - (1 - ANS_OUT)) / ANS_OUT)
        const opacity = Math.min(enter, 1 - exit)
        a.style.opacity = String(opacity)
        // 보이는 동안만 .is-on — 코드로 그린 시연은 이 클래스가 붙을 때 처음부터 돈다
        a.classList.toggle('is-on', opacity > 0.05)
        a.style.transform = `translate3d(0, ${(1 - enter) * 44 - exit * 44}px, 0)`
      })

      // 5) 맺음 장면 — 들어와서 남는다. 다 보이기 전에는 버튼이 눌리지 않게 한다
      const fin = easeOut(clamp01((p - END_FROM) / (ANS_LEN * ANS_IN)))
      end.style.opacity = String(fin)
      end.style.transform = `translate3d(0, ${(1 - fin) * 44}px, 0)`
      end.style.pointerEvents = fin > 0.6 ? 'auto' : 'none'
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
    <section
      ref={sectionRef}
      className="wi-section"
      aria-labelledby="wi-title"
      style={{ '--wi-len': PIN_LEN } as React.CSSProperties}
    >
      <div className="wi-pin">
        {/* 질문 */}
        <div ref={askRef} className="wi-ask">
          <p className="wi-eyebrow">WHY WEFLOW</p>
          <h2 id="wi-title" className="wi-title">
            <span className="wi-line wi-line--a">수많은 제작사 중에서,</span>
            <span className="wi-line wi-line--b">
              왜 <span className="wi-hl">WEFLOW</span>일까요?
            </span>
          </h2>
        </div>

        {/* 답 — 같은 자리에 겹쳐 두고 하나씩만 보이게 한다 */}
        <div className="wi-answers">
          {ANSWERS.map((a, i) => (
            <div
              key={a.id}
              ref={node => {
                answerRefs.current[i] = node
              }}
              className="wi-answer"
            >
              <div className="wi-card">
                <a.Demo />
              </div>
              <div className="wi-answer__text">
                <p className="wi-num">
                  {String(i + 1).padStart(2, '0')}
                  <span> / {String(ANSWERS.length).padStart(2, '0')}</span>
                </p>
                <h3 className="wi-answer__title">{a.title}</h3>
                <p className="wi-answer__desc">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 맺음 — 더 알고 싶은 사람은 /difference 로, 바로 묻고 싶은 사람은 상담으로 */}
        <div ref={endRef} className="wi-end">
          <p className="wi-end__eyebrow">ONLY WEFLOW</p>
          <h3 className="wi-end__title">
            <span>WEFLOW</span>를 선택해야 하는 이유가
            <br />더 궁금하시다면?
          </h3>
          <p className="wi-end__desc">
            템플릿 제작과 무엇이 다른지,
            <br className="wi-end__br" /> 실제 사례와 함께 한 페이지에 정리해 두었습니다.
          </p>
          <div className="wi-end__btns">
            <Link href="/difference" className="wi-btn wi-btn--fill">
              WEFLOW가 특별한 이유
              <ArrowRight size={18} />
            </Link>
            <Link href="/diagnosis" className="wi-btn">
              맞춤 견적 받기
            </Link>
          </div>
        </div>
      </div>

      <WhyDemoStyles />
      <style>{`
        /* 섹션 높이 = 화면 한 장 + 붙어 있는 동안 스크롤되는 거리(--wi-len 장) */
        .wi-section {
          position: relative;
          height: calc(100svh * (1 + var(--wi-len)));
          background: var(--wi-bg, #fff);
        }
        .wi-pin {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          background: var(--wi-bg, #fff);
          color: var(--wi-ink, #111);
        }

        /* ── 질문 — 화면 한가운데 ── */
        .wi-ask {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          will-change: transform, opacity;
        }
        .wi-eyebrow {
          margin: 0 0 clamp(1.5rem, 4vh, 2.75rem);
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
          opacity: var(--wi-x, 0);
        }
        .wi-title {
          margin: 0;
          color: inherit;
          font-size: clamp(1.95rem, 5vw, 4.25rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.25;
          text-align: center;
        }
        /* 윗줄은 왼쪽 밖에서, 아랫줄은 오른쪽 밖에서 — --wi-x 가 1 이 되면 제자리 */
        .wi-line {
          display: block;
          white-space: nowrap;
          will-change: transform;
        }
        .wi-line--a { transform: translate3d(calc((1 - var(--wi-x, 0)) * -70vw), 0, 0); }
        .wi-line--b { transform: translate3d(calc((1 - var(--wi-x, 0)) * 70vw), 0, 0); }

        .wi-hl { transition: color 0.5s ease; }
        .wi-section.is-lit .wi-hl { color: #9fd0ff; }

        /* ── 답 — 질문과 같은 자리에 겹친다. 이때는 이미 어두운 바탕이라 흰 글씨로 고정한다 ── */
        .wi-answers {
          position: absolute;
          inset: 0;
          color: #fff;
          pointer-events: none;
        }
        /* 답 하나 — 왼쪽에 시연 카드, 오른쪽에 글 */
        .wi-answer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(2rem, 5vw, 5rem);
          padding: 0 1.5rem;
          text-align: left;
          opacity: 0;
          will-change: transform, opacity;
        }
        /* 글 칸의 폭을 못 박는다 — 카드와 글 묶음을 화면 가운데에 놓으므로, 폭을 글 길이에 맡기면
           설명이 짧은 답(줄을 일찍 끊은 02·03)만 묶음이 좁아져 카드와 글의 자리가 답마다 달라진다 */
        .wi-answer__text { flex: 0 1 30rem; min-width: 0; }
        .wi-num {
          margin: 0 0 clamp(1rem, 3vh, 1.75rem);
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #9fd0ff;
        }
        .wi-num span { color: rgba(255, 255, 255, 0.35); font-weight: 500; }
        .wi-answer__title {
          margin: 0;
          color: inherit;
          font-size: clamp(1.6rem, 3.6vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.25;
          word-break: keep-all;
        }
        .wi-answer__desc {
          margin: clamp(1rem, 3vh, 1.75rem) 0 0;
          max-width: 34rem;
          font-size: clamp(1rem, 1.6vw, 1.3rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
          word-break: keep-all;
        }

        /* 파스텔 하늘색 카드 — 시연 창은 위·왼쪽만 같은 길이(카드 폭의 7%)로 띄우고 오른쪽·아래는 카드 끝까지 붙인다.
           창이 정확히 4:3 이 되도록 카드 높이를 '여백 + 창 높이' = 폭 × (0.07 + 0.93 × 0.75) 로 잡는다 */
        .wi-card {
          position: relative;
          flex: none;
          width: min(46vw, 560px);
          container-type: inline-size;
          aspect-ratio: 1 / 0.7675;
          border-radius: 28px;
          overflow: hidden;
          background: linear-gradient(135deg, #d6ebff 0%, #9ccbf7 100%);
        }
        .wi-card .wd {
          position: absolute;
          top: 7cqw;
          left: 7cqw;
          right: 0;
          bottom: 0;
          border-top-left-radius: 14px;
          box-shadow: 0 10px 40px rgba(20, 60, 110, 0.28);
        }
        /* 좁은 화면 — 카드 위, 글 아래 */
        @media (max-width: 800px) {
          .wi-answer { flex-direction: column; gap: 1.75rem; text-align: center; }
          .wi-card { width: min(84vw, 420px); border-radius: 20px; }
          .wi-answer__text { flex: none; }
          /* 넓은 화면에서만 끊는 줄바꿈 — 좁은 화면에서는 한 줄에 다 들어간다 ('SEO·AEO·GEO 구조 설계') */
          .wi-br-pc { display: none; }
        }

        /* ── 맺음 장면 — 화면 한가운데에 물음 한 줄과 버튼 둘 ── */
        .wi-end {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 1.5rem;
          color: #fff;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .wi-end__eyebrow {
          margin: 0 0 clamp(1.25rem, 3.5vh, 2.25rem);
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .wi-end__title {
          margin: 0;
          color: inherit;
          font-size: clamp(1.6rem, 4.2vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .wi-end__title span { color: #9fd0ff; }
        .wi-end__desc {
          margin: clamp(1.1rem, 3vh, 1.75rem) 0 0;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.72);
          word-break: keep-all;
        }
        .wi-end__br { display: none; }
        .wi-end__btns {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.8rem;
          margin-top: clamp(2rem, 5vh, 3rem);
        }
        /* 버튼 — 기본은 흰 테두리, --fill 은 흰 면. 마우스를 올리면 서로의 모양으로 뒤집힌다 */
        .wi-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          min-width: 12.5rem;
          padding: 1rem 1.7rem;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-radius: 9999px;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .wi-btn:hover { background: #fff; color: #111; }
        .wi-btn--fill { background: #fff; color: #111; border-color: #fff; }
        .wi-btn--fill:hover { background: transparent; color: #fff; }
        .wi-btn svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .wi-btn:hover svg { transform: translateX(4px); }
        @media (max-width: 800px) {
          .wi-end__br { display: inline; }
          .wi-end__btns { flex-direction: column; width: min(100%, 20rem); }
        }

        /* 모션 최소화 — 붙잡지 않고 질문과 답을 차례로 쌓아 보여준다 */
        @media (prefers-reduced-motion: reduce) {
          .wi-section { height: auto; background: #0e0e10; }
          .wi-pin {
            position: static;
            height: auto;
            padding: 6rem 1.5rem;
            background: #0e0e10;
            color: #fff;
          }
          .wi-ask, .wi-answers, .wi-answer, .wi-end { position: static; }
          .wi-eyebrow { opacity: 1; }
          .wi-line--a, .wi-line--b { transform: none; }
          .wi-hl { color: #9fd0ff; }
          .wi-answers { pointer-events: auto; }
          .wi-answer { opacity: 1; margin-top: 4.5rem; }
          .wi-end { opacity: 1; pointer-events: auto; margin-top: 6rem; }
        }
      `}</style>
    </section>
  )
}
