'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Code2,
  MonitorSmartphone,
  Ruler,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { POINTS } from './ListeningSection'

type Card = {
  Icon: LucideIcon
  title: string
  desc: React.ReactNode
  /** 카드 위쪽에 깔리는 사진 — 있으면 사진 카드가 된다 */
  img?: string
  /** 사진을 잘라 낼 때 기준 위치 (기본은 가운데) */
  imgPos?: string
  /** 사진을 얼마나 당겨 보일지 (1 = 그대로) */
  imgZoom?: number
  more?: { href: string; label: string }
}

// 일하는 방식 여섯 가지 — 서비스·회사소개 탭의 '한 줄 소개' 섹션과 같은 목록 (사진은 빼고 글만 쓴다)
const WAYS: Card[] = POINTS.map(({ Icon, title, desc }) => ({ Icon, title, desc }))

// 메인에서 보여주는 강점 여덟 가지 — 예전 솔루션 섹션의 신뢰 지표(6칸)와 강점(6종)을
// 겹치는 것 없이 합친 목록이다 (프로모션 할인·트렌디한 디자인은 뺐다). 2열 × 4줄로 놓인다.
// img: 카드 위쪽 사진 — 얼굴이 나오는 사진은 쓰지 않는다 (화면·기기·손만 나오는 것으로 고른다)
//      카드 폭(약 420px)의 두 배인 860px 로 줄여 둔 사본을 쓴다 (public/images/main/solution).
//      이 사이트는 이미지 자동 최적화를 꺼 두어서(next.config) 원본을 그대로 걸면 원본 크기 그대로 내려간다.
// more: 카드 아래에서 이어지는 페이지
const SOLUTIONS: Card[] = [
  {
    Icon: Search,
    title: 'SEO·AEO·GEO 설계',
    img: '/images/main/solution/main-solution-seo.webp', // 혜택 안내 01 과 같은 사진
    desc: '검색과 AI 답변에 잡히는 구조부터 설계',
    more: { href: '/check', label: '내 사이트 점검' },
  },
  {
    Icon: Zap,
    title: '최신 기술 활용',
    img: '/images/main/solution/main-solution-tech.webp',
    desc: '대기업 서비스에 쓰이는 React·Next.js로 제작',
    more: { href: '/difference', label: '차이점 보기' },
  },
  {
    Icon: MonitorSmartphone,
    title: 'PC·모바일 최적화',
    img: '/images/main/solution/main-service-05.webp',
    desc: '어떤 화면에서도 빠르고 깨지지 않게',
    more: { href: '/cases', label: '제작 사례' },
  },
  {
    Icon: Code2,
    title: '전문 개발자 직접 제작',
    img: '/images/main/solution/process-04-dev.webp',
    desc: '외주 없이 개발자가 직접 설계하고 구현',
    more: { href: '/difference', label: '차이점 보기' },
  },
  {
    Icon: Ruler,
    title: '100% 맞춤 제작',
    img: '/images/main/solution/process-02-plan.webp',
    desc: '템플릿이 아닌 브랜드에 맞춘 설계',
    more: { href: '/guide', label: '제작 라인업' },
  },
  {
    Icon: UserRoundCheck,
    title: '1:1 집중 관리',
    img: '/images/main/solution/main-solution-care.webp', // 혜택 안내 03 과 같은 사진
    desc: '전담 담당자가 처음부터 끝까지 함께',
    more: { href: '/benefits', label: '혜택 보기' },
  },
  {
    Icon: ShieldCheck,
    title: '꼼꼼한 마무리',
    img: '/images/main/solution/service22.webp',
    imgPos: '40% 45%', // 초록 체크가 있는 쪽을 기준으로
    imgZoom: 1.25,
    desc: '제작 후에도 책임지는 유지보수와 관리',
    more: { href: '/benefits', label: '혜택 보기' },
  },
  {
    Icon: Stethoscope,
    title: '무료 맞춤 견적',
    img: '/images/main/solution/process-01-consult.webp',
    desc: '현재 상태를 먼저 살펴보고 투명한 비용 안내',
    more: { href: '/diagnosis', label: '견적 받기' },
  },
]

/**
 * 스크롤하는 만큼 읽히는 글 — 처음엔 전부 옅은 회색이다가, 내려갈수록 앞 낱말부터 차례로 검게 켜진다.
 * (올리면 다시 꺼진다) lines 의 한 줄이 화면의 한 줄이고, hl 에 든 낱말은 켜질 때 파란색이 된다.
 * 줄 안의 '|' 는 좁은 화면에서만 줄을 바꾸는 자리다 (넓은 화면에서는 그냥 이어진다).
 */
function RevealText({ lines, hl = [] }: { lines: string[]; hl?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = Array.from(el.querySelectorAll<HTMLElement>('.hs-word'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach(w => w.classList.add('on'))
      return
    }
    let raf = 0
    let lit = -1
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      // 글 윗변이 화면 82% 높이에 닿을 때 시작해, 글 아랫변이 화면 45% 높이에 닿으면 다 켜진다
      const t = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (vh * 0.37 + r.height)))
      const n = Math.round(t * words.length)
      if (n === lit) return
      lit = n
      words.forEach((w, i) => w.classList.toggle('on', i < n))
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
    <p ref={ref} className="hs-reveal">
      {lines.map((line, i) => (
        <span key={i} className="hs-reveal__line">
          {line.split('|').map((seg, s) => (
            <span key={s} className="hs-reveal__seg">
              {seg.split(' ').map((w, j) => (
                <span key={j}>
                  <span className={hl.some(h => w.includes(h)) ? 'hs-word hs-word--hl' : 'hs-word'}>{w}</span>{' '}
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </p>
  )
}

/**
 * 카드 섹션 하나 — 가운데 머리말(· 소개 한 문단) 아래 옅은 회색 카드 3열 또는 2열.
 * 카드마다 (사진 ·) 아이콘 · 제목 · 한 줄 설명 (· 이어지는 페이지 링크).
 *
 * 카드는 저마다 화면에 들어올 때 아래에서 떠오르고, 그때 아이콘이 선으로 그려진다.
 * light 를 켜면, 카드 위에서 마우스를 움직일 때 커서 자리에 옅은 하늘색 빛이 번진다 — 빛은 카드마다
 * '커서가 내 안의 어디에 있는지'(--mx, --my)로 그리므로, 카드 경계를 넘어가도 이어져 보인다.
 *
 * split 을 주면 제목 대신 그 두 토막을 쓴다 — 스크롤에 맞춰 앞 토막은 왼쪽에서,
 * 뒤 토막은 오른쪽에서 들어와 가운데에서 한 문장으로 붙는다 (올리면 다시 벌어진다).
 */
function CardSection({
  id,
  eyebrow,
  title,
  split,
  lead,
  cols = 3,
  cards,
  light = false,
  dark = false,
  foot,
}: {
  id: string
  eyebrow: string
  title?: React.ReactNode
  /** 양옆에서 들어와 붙는 제목 — [왼쪽에서 오는 토막, 오른쪽에서 오는 토막] */
  split?: [React.ReactNode, React.ReactNode]
  /** 제목 아래 소개 한 문단 */
  lead?: React.ReactNode
  /** 넓은 화면에서의 열 수 */
  cols?: 2 | 3
  cards: Card[]
  /** 마우스를 따라다니는 빛을 켤지 */
  light?: boolean
  /** 검은 바탕으로 그릴지 */
  dark?: boolean
  /** 카드 아래 가운데에 놓는 것 (더 보기 버튼 등) */
  foot?: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)
  const moveRaf = useRef(0)
  const [shown, setShown] = useState(false)

  // 카드마다 화면에 들어오는 순간 .is-on — 등장과 아이콘 그리기가 이 클래스에 걸려 있다
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-on')
          io.unobserve(e.target)
        }),
      { threshold: 0.2 },
    )
    grid.querySelectorAll('.hs-card').forEach(c => io.observe(c))
    return () => {
      io.disconnect()
      if (moveRaf.current) cancelAnimationFrame(moveRaf.current)
    }
  }, [])

  // 마우스 빛 — 커서 위치를 카드마다 제 왼쪽 위 기준 좌표로 바꿔 넘긴다 (한 프레임에 한 번)
  const onMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (moveRaf.current) return
    const grid = e.currentTarget
    const { clientX, clientY } = e
    moveRaf.current = requestAnimationFrame(() => {
      moveRaf.current = 0
      grid.querySelectorAll<HTMLElement>('.hs-card').forEach(c => {
        const r = c.getBoundingClientRect()
        c.style.setProperty('--mx', `${clientX - r.left}px`)
        c.style.setProperty('--my', `${clientY - r.top}px`)
      })
    })
  }

  // 붙는 제목 — 머리말이 화면 아래에서 올라와 가운데쯤 올 때까지의 진행도(0→1)를 --hs-x 로 넘긴다
  useEffect(() => {
    const head = headRef.current
    if (!split || !head) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const t = Math.min(1, Math.max(0, (vh * 0.98 - head.getBoundingClientRect().top) / (vh * 0.5)))
      head.style.setProperty('--hs-x', (1 - Math.pow(1 - t, 3)).toFixed(4))
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
    // split 은 있고 없고만 본다 (내용이 바뀌어도 다시 걸 필요 없다)
  }, [!!split]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={`hs-section${dark ? ' hs-section--dark' : ''}${shown ? ' is-in' : ''}`}
      aria-labelledby={id}
    >
      <div className="hs-inner">
        <header ref={headRef} className={split ? 'hs-head hs-head--split' : 'hs-head'}>
          <p className="hs-eyebrow">{eyebrow}</p>
          <h2 id={id} className="hs-title">
            {split ? (
              <>
                <span className="hs-part hs-part--a">{split[0]}</span>{' '}
                <span className="hs-part hs-part--b">{split[1]}</span>
              </>
            ) : (
              title
            )}
          </h2>
          {lead && <div className="hs-lead">{lead}</div>}
        </header>

        <ul
          ref={gridRef}
          className={`hs-grid${cols === 2 ? ' hs-grid--2' : ''}${light ? ' hs-grid--light' : ''}`}
          onMouseMove={light ? onMove : undefined}
        >
          {cards.map(({ Icon, title, desc, img, imgPos, imgZoom, more }, i) => (
            // --d: 같은 줄 안에서의 차례 — 옆 카드보다 조금 늦게 나오게 한다
            <li
              key={title}
              className={img ? 'hs-card hs-card--photo' : 'hs-card'}
              style={{ '--d': i % cols } as React.CSSProperties}
            >
              {img && (
                <span className="hs-photo">
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 100vw, 430px"
                    style={
                      {
                        objectFit: 'cover',
                        objectPosition: imgPos,
                        transformOrigin: imgPos,
                        '--z': imgZoom,
                      } as React.CSSProperties
                    }
                  />
                </span>
              )}
              <span className="hs-icon">
                <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="hs-card__body">
                <h3 className="hs-card__title">{title}</h3>
                <p className="hs-card__desc">{desc}</p>
                {more && (
                  <Link href={more.href} className="hs-card__more">
                    {more.label}
                    <ChevronRight size={15} strokeWidth={2.2} />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        {foot && <div className="hs-foot">{foot}</div>}
      </div>
    </section>
  )
}

/**
 * 메인의 카드 섹션 둘 — '왜 WEFLOW' 섹션 바로 아래, 흰 바탕.
 *  1) 일하는 방식 여섯 가지, 2열 (회사소개 대신 — 소개는 제목 아래 한 문단만 두고, 어떻게 일하는지를 보여준다)
 *  2) 솔루션: 강점 여덟 가지, 2열 — 검은 바탕, 카드마다 사진이 있다
 * 두 섹션이 같은 스타일을 쓰므로 한 번만 싣는다.
 */
export default function HomeCardSections() {
  return (
    <>
      <CardSection
        id="hs-ways"
        eyebrow="ABOUT US"
        split={['사람이 움직이면,', <span key="b">기술은 따라온다</span>]}
        lead={
          <RevealText
            lines={[
              'WEFLOW는 사람과 기술이 함께 흘러가며|더 좋은 방향을 만드는 회사입니다.',
              '기술은 뒤에서 받쳐주고,|사람이 앞에서 직접 듣고 기획하며 끝까지 책임집니다.',
            ]}
            hl={['끝까지', '책임집니다']}
          />
        }
        cols={2}
        cards={WAYS}
        foot={
          <Link href="/about" className="hs-more">
            회사소개 보기
            <ChevronRight size={17} strokeWidth={2.2} />
          </Link>
        }
      />
      <CardSection
        id="hs-solution"
        eyebrow="OUR STRENGTHS"
        title={
          <>
            보이는 것부터
            <br />
            보이지 않는 것까지
          </>
        }
        cols={2}
        cards={SOLUTIONS}
        light
        dark
      />

      <style>{`
        .hs-section {
          background: #fff;
          color: #111;
          padding: clamp(4.5rem, 10vw, 8.5rem) 1.5rem;
        }
        /* 같은 흰 바탕 섹션이 연달아 오면 여백이 두 배가 되므로, 뒤 섹션의 위 여백은 뺀다 */
        .hs-section + .hs-section { padding-top: 0; }
        .hs-inner { max-width: 1120px; margin: 0 auto; }

        /* 검은 바탕 — 앞 섹션과 바탕이 다르니 위 여백을 되살리고, 카드·글씨 색을 뒤집는다 */
        .hs-section--dark { background: #0e0e10; color: #fff; }
        .hs-section + .hs-section--dark { padding-top: clamp(4.5rem, 10vw, 8.5rem); }
        .hs-section--dark .hs-title { color: #fff; }
        .hs-section--dark .hs-card { background: #1a1b1f; }
        .hs-section--dark .hs-card:hover { background: #1f2228; }
        .hs-section--dark .hs-card__title { color: #fff; }
        .hs-section--dark .hs-card__desc,
        .hs-section--dark .hs-card__more { color: rgba(255, 255, 255, 0.66); }
        .hs-section--dark .hs-card__more:hover { color: #fff; }
        .hs-section--dark .hs-photo { background: #24262b; }

        /* ── 머리말 ── */
        .hs-head {
          text-align: center;
          margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .hs-title {
          margin: 0;
          color: #111;
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .hs-title span span, .hs-title > span:not(.hs-part) { color: #3f8fe0; }

        /* 붙는 제목 — 머리말 전체는 스크롤 진행도(--hs-x)를 따라 나타나고,
           두 토막은 각각 왼쪽·오른쪽 밖에서 제자리로 들어온다 */
        .hs-head--split { opacity: 1; transform: none; transition: none; }
        .hs-head--split .hs-eyebrow, .hs-head--split .hs-lead { opacity: var(--hs-x, 0); }
        .hs-head--split .hs-lead { margin-top: clamp(1.5rem, 3.5vw, 2.5rem); }
        .hs-part { display: inline-block; opacity: var(--hs-x, 0); will-change: transform; }
        .hs-part--a { transform: translate3d(calc((1 - var(--hs-x, 0)) * -34vw), 0, 0); }
        .hs-part--b { transform: translate3d(calc((1 - var(--hs-x, 0)) * 34vw), 0, 0); }
        /* 스크롤하는 만큼 읽히는 소개 글 — 크게 쓰고, 낱말이 회색에서 검정으로 켜진다 */
        /* (.hs-lead p 의 작은 글씨·여백 규칙에 지지 않게 .hs-lead 를 붙여 우선순위를 올린다) */
        .hs-lead .hs-reveal {
          margin: 0 auto;
          max-width: 62rem;
          font-size: clamp(1.05rem, 1.75vw, 1.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.6;
          word-break: keep-all;
        }
        .hs-reveal__line { display: block; }
        .hs-word { color: #d6d8dc; transition: color 0.3s ease; }
        .hs-word.on { color: #111; }
        .hs-word--hl.on { color: #3f8fe0; }

        /* 소개 한 문단 */
        .hs-lead { margin-top: clamp(1.1rem, 2.4vw, 1.6rem); }
        .hs-lead p {
          margin: 0;
          font-size: clamp(0.98rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          color: #5c6066;
          word-break: keep-all;
        }

        /* ── 카드 3열 ── */
        .hs-grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
        }
        /* 2열은 카드가 너무 넓어지지 않게 전체 폭을 좁혀 가운데에 둔다 */
        .hs-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 860px; margin: 0 auto; }
        .hs-card {
          --hs-pad: clamp(1.4rem, 2.4vw, 2rem);
          position: relative;
          padding: var(--hs-pad);
          border-radius: clamp(18px, 2.2vw, 28px);
          overflow: hidden;
          background: #f5f6f8;
          /* 등장 — 화면에 들어오면(.is-on) 아래에서 떠오르고, 같은 줄에서는 차례(--d)대로 조금씩 늦게 */
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(0.05s + var(--d) * 0.1s),
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(0.05s + var(--d) * 0.1s),
            background 0.25s;
        }
        .is-in .hs-head, .hs-card.is-on { opacity: 1; transform: none; }
        .hs-card:hover { background: #eef4fb; }

        /* 마우스 빛 — 커서 자리(--mx, --my)에 하늘색 빛을 얹는다.
           빛을 켠 묶음(.hs-grid--light) 위에 마우스가 있을 때만 보인다 */
        .hs-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            280px circle at var(--mx, -400px) var(--my, -400px),
            rgba(127, 188, 247, 0.34),
            transparent 65%
          );
          opacity: 0;
          transition: opacity 0.35s;
          pointer-events: none;
        }
        .hs-grid--light:hover .hs-card::after { opacity: 1; }

        /* 사진 카드 — 사진이 카드 위쪽을 가장자리까지 채우고, 아이콘 타일이 사진 아랫변에 반쯤 걸친다 */
        .hs-card--photo { padding: 0; }
        .hs-photo {
          position: relative;
          display: block;
          aspect-ratio: 2 / 1;
          overflow: hidden;
          background: #e9ebee;
        }
        /* --z: 사진마다 정한 확대 배율. 마우스를 올리면 거기서 조금 더 다가온다 */
        .hs-photo img { transform: scale(var(--z, 1)); transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .hs-card:hover .hs-photo img { transform: scale(calc(var(--z, 1) * 1.05)); }
        .hs-card--photo .hs-icon {
          position: relative;
          z-index: 1;
          margin: -28px 0 0 var(--hs-pad);
          box-shadow: 0 6px 16px rgba(17, 17, 17, 0.12);
        }
        .hs-card--photo .hs-card__body { padding: 0 var(--hs-pad) var(--hs-pad); }
        .hs-card--photo .hs-card__title { margin-top: 1rem; }

        /* 아이콘 — 흰 타일 위에 파란색으로. 카드에 마우스를 올리면 타일이 하늘색으로 채워지며 살짝 기운다 */
        .hs-icon {
          flex: none;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #fff;
          color: #3f8fe0;
          box-shadow: 0 1px 2px rgba(17, 17, 17, 0.04);
          transition:
            background 0.25s,
            color 0.25s,
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-card:hover .hs-icon { background: #a9d4ff; color: #12304f; transform: rotate(-6deg) scale(1.06); }
        /* 아이콘 그리기 — 선을 '긴 점선 하나'로 만들어 두고, 카드가 들어오면 시작점을 당겨 선이 그려지게 한다
           (아이콘 좌표가 24 × 24 라 어떤 선도 100 보다 짧다) */
        .hs-icon svg * { stroke-dasharray: 100; stroke-dashoffset: 100; }
        .hs-card.is-on .hs-icon svg * {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 1.4s cubic-bezier(0.3, 0, 0.2, 1) calc(0.3s + var(--d) * 0.1s);
        }

        .hs-card__title {
          margin: clamp(1.1rem, 2vw, 1.5rem) 0 0;
          color: #111;
          font-size: clamp(1.08rem, 1.6vw, 1.28rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          word-break: keep-all;
        }
        .hs-card__desc {
          margin: 0.6rem 0 0;
          font-size: clamp(0.92rem, 1.2vw, 1rem);
          line-height: 1.6;
          color: #5c6066;
          word-break: keep-all;
        }
        .hs-card__more {
          display: inline-flex;
          align-items: center;
          gap: 0.1rem;
          margin-top: clamp(1rem, 1.9vw, 1.4rem);
          font-size: 0.9rem;
          font-weight: 600;
          color: #5c6066;
          text-decoration: none;
          transition: color 0.2s;
        }
        .hs-card__more svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hs-card__more:hover { color: #111; }
        .hs-card__more:hover svg { transform: translateX(4px); }

        /* 카드 아래 버튼 — 검정 테두리, 마우스를 올리면 검정으로 채워진다 */
        .hs-foot {
          margin-top: clamp(1.75rem, 4vw, 2.75rem);
          text-align: center;
          opacity: 0;
          transition: opacity 0.8s ease 0.5s;
        }
        .is-in .hs-foot { opacity: 1; }
        .hs-more {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.85rem 1.5rem;
          border: 1.5px solid #111;
          border-radius: 9999px;
          color: #111;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .hs-more:hover { background: #111; color: #fff; }
        .hs-more svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hs-more:hover svg { transform: translateX(4px); }

        /* 중간 화면 — 2열 */
        @media (max-width: 960px) {
          .hs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        /* 좁은 화면 — 한 줄에 하나씩, 아이콘을 왼쪽에 두어 카드 높이를 낮춘다 (카드가 많아도 길어지지 않게) */
        @media (max-width: 600px) {
          .hs-section { padding-left: 1.25rem; padding-right: 1.25rem; }
          .hs-grid, .hs-grid--2 { grid-template-columns: 1fr; }
          .hs-br { display: none; }
          /* 소개 문단 — 줄 안의 '|' 자리에서도 줄을 바꾼다 */
          .hs-reveal__seg { display: block; }
          .hs-card { display: flex; align-items: flex-start; gap: 1rem; padding: 1.2rem; }
          .hs-icon { width: 48px; height: 48px; border-radius: 14px; }
          .hs-card__title { margin-top: 0.1rem; }
          .hs-card__desc { margin-top: 0.3rem; }
          .hs-card__more { margin-top: 0.6rem; }
          /* 사진 카드는 가로형으로 눕히지 않는다 — 사진 위, 글 아래 그대로 */
          .hs-card--photo { display: block; padding: 0; --hs-pad: 1.2rem; }
          .hs-card--photo .hs-icon { margin-top: -24px; }
          .hs-card--photo .hs-card__title { margin-top: 0.8rem; }
        }
        /* 터치 기기 — 마우스가 없으니 빛도 없다 */
        @media (hover: none) {
          .hs-card::after { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hs-head, .hs-card, .hs-foot { opacity: 1; transform: none; transition: none; }
          .hs-part, .hs-head--split .hs-eyebrow, .hs-head--split .hs-lead { opacity: 1; transform: none; }
          .hs-icon, .hs-photo img { transition: none; }
          .hs-icon svg * { stroke-dashoffset: 0; transition: none; }
        }
      `}</style>
    </>
  )
}
