'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, X, ShieldCheck, Code2 } from 'lucide-react'

/**
 * 메인 — 제작 사례 아래 'PHP 보안' 섹션. 메인 카드 섹션(HomeCardSections)과 같은 모양으로 그린다:
 * 검은 바탕 버전(.hs-section--dark 와 같은 색) · 회색 띄어 쓴 작은 제목 · 굵은 흰 제목(강조는 하늘색) · 어두운 둥근 카드.
 * '경고' 이야기라 앞뒤 흰 섹션(제작 사례 · 웹블로그 출시) 사이에서 어두운 바탕으로 끊는다.
 *  1) PHP 보안 뉴스 기사 네 장 (병의원 페이지 보안 섹션과 같은 이미지 public/images/blog/news-php-0N.webp)
 *  2) 'PHP란?' — 처음 듣는 사람을 위한 한 줄 설명
 *  3) 옛 방식(PHP) vs WEFLOW(Next.js) 카드 두 장
 * 문구 기준: "Next.js 는 절대 안전" 이라고 하지 않는다 — "PHP 를 쓰지 않으니 PHP 취약점 걱정은 없다" 까지만.
 */
const NEWS = [
  { src: '/images/blog/news-php-01.webp', source: '연합뉴스', title: 'PHP 보안 취약점에 해킹 비상…국내 IT·보안업계 긴급 대응' },
  { src: '/images/blog/news-php-03.webp', source: '뉴스1', title: '국가안보실, 민관군 사이버안보 긴급 대책회의…"PHP 취약점 신속 대응"' },
  { src: '/images/blog/news-php-02.webp', source: '머니투데이', title: "'해킹 구멍' PHP…국내 서버 10대 중 9대, '업데이트 불가'" },
  { src: '/images/blog/news-php-04.webp', source: '연합뉴스', title: "'PHP 취약' 공개 나흘전부터 공격 포착…\"해킹 시도 수백만건\"" },
]
const OLD = ['서버에서 PHP 프로그램이 늘 돌아가며 요청을 처리합니다', '보안 업데이트를 사이트마다 따로 챙겨야 합니다', '오래된 버전은 업데이트 자체가 어려운 경우가 많습니다', '관리자 화면·플러그인이 공격 통로가 되기도 합니다']
const NEW = ['대기업 서비스에도 쓰이는 React·Next.js로 만듭니다', '페이지를 미리 만들어 두고 전 세계 서버망(CDN)에서 내보냅니다', '모든 페이지가 보안 연결(HTTPS)로 열립니다', '서버·보안 업데이트는 WEFLOW 월 운영관리에서 계속 챙깁니다']

/** 한 번 화면에 들어오면 켜진다 — 등장 애니메이션용 */
function useShown<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, shown }
}

export default function HomePhpSection() {
  const { ref: headRef, shown: headShown } = useShown<HTMLElement>(0.3)
  const { ref: newsRef, shown: newsShown } = useShown<HTMLDivElement>(0.15)
  const { ref: cmpRef, shown: cmpShown } = useShown<HTMLDivElement>(0.2)

  return (
    <section className="hp-section" aria-labelledby="hp-title">
      <div className="hp-inner">
        <header ref={headRef} className={`hp-head${headShown ? ' is-in' : ''}`}>
          <p className="hp-eyebrow">SECURITY</p>
          <h2 id="hp-title" className="hp-title">
            PHP로 만든 홈페이지,<br />
            <span>지금 안전할까요?</span>
          </h2>
          <p className="hp-lead">
            국내 PHP 서버 상당수가 업데이트되지 않은<br className="hp-mo" /> 옛 버전이라는 보도가 잇따랐습니다.<br />
            오래된 기술로 만든 홈페이지는<br className="hp-mo" /> 보안 업데이트를 놓치는 순간 위험해집니다.
          </p>
        </header>

        {/* PHP란? */}
        <div className={`hp-what${headShown ? ' is-in' : ''}`}>
          <span className="hp-what__icon"><Code2 size={24} strokeWidth={1.8} /></span>
          <div>
            <b>PHP란?</b>
            <p>홈페이지를 만들 때 20년 넘게 널리 쓰여 온 서버 프로그래밍 언어입니다.<br className="hp-pc" />{' '}워드프레스·그누보드 같은 템플릿 홈페이지 제작 도구도 PHP로 만들어져 있습니다.</p>
            {/* 수치 출처: W3Techs 집계(서버 언어가 확인되는 사이트 기준)를 인용한 2026-10-22 보도 · 보안업체 말로리의 쇼단 집계 보도 */}
            <ul className="hp-stats">
              <li><strong>83%</strong><span>국내 웹사이트 중<br />PHP를 쓰는 비율</span></li>
              <li><strong>89%</strong><span>버전이 확인된 국내 PHP 서버 중<br />지원이 끝난 옛 버전 비율</span></li>
            </ul>
            <small className="hp-src">출처: W3Techs 집계 인용 보도(디지털타임스·뉴시스, 2026.10.22) · 쇼단 집계 인용 보도(스페셜타임스)</small>
          </div>
        </div>

        {/* 기사 네 장 — 넓은 화면은 2열, 휴대폰은 옆으로 넘긴다 */}
        <div ref={newsRef} className={`hp-news${newsShown ? ' is-in' : ''}`}>
          {NEWS.map((n, i) => (
            <figure key={n.src} className="hp-card hp-news__card" style={{ '--d': i % 2 } as React.CSSProperties}>
              <span className="hp-news__shot">
                <Image src={n.src} alt={`${n.source} 기사: ${n.title}`} fill sizes="(min-width: 768px) 520px, 80vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
              </span>
              <figcaption>{n.source}</figcaption>
            </figure>
          ))}
        </div>
        <p className="hp-note">기사 화면 일부를 갈무리했습니다.<br className="hp-mo" /> 내용은 각 언론사 보도를 확인해 주세요.</p>

        {/* 옛 방식 vs WEFLOW */}
        <h3 className="hp-sub">
          WEFLOW는 처음부터<br className="hp-mo" /> <span>최신 기술(Next.js)</span>로 만들어<br /> PHP 취약점 걱정이 없습니다
        </h3>
        <div ref={cmpRef} className={`hp-cmp${cmpShown ? ' is-in' : ''}`}>
          <div className="hp-card hp-cmp__box" style={{ '--d': 0 } as React.CSSProperties}>
            <p className="hp-cmp__tag">옛 방식</p>
            <p className="hp-cmp__title">PHP 서버 위의 홈페이지</p>
            <ul>{OLD.map(t => <li key={t}><X size={18} className="hp-x" />{t}</li>)}</ul>
          </div>
          <div className="hp-card hp-cmp__box hp-cmp__box--we" style={{ '--d': 1 } as React.CSSProperties}>
            <p className="hp-cmp__tag"><ShieldCheck size={16} /> WEFLOW</p>
            <p className="hp-cmp__title">Next.js로 만든 홈페이지·웹블로그</p>
            <ul>{NEW.map(t => <li key={t}><Check size={18} className="hp-v" />{t}</li>)}</ul>
          </div>
        </div>
        <p className="hp-note">어떤 기술도 &lsquo;절대 안전&rsquo;하지는 않습니다.<br className="hp-mo" /> 중요한 건 업데이트가 계속 챙겨지는 구조입니다.</p>
      </div>

      <style>{`
        .hp-section { background: #0e0e10; color: #fff; padding: clamp(4.5rem, 10vw, 8.5rem) 1.5rem; }
        .hp-inner { max-width: 1120px; margin: 0 auto; }
        .hp-pc { display: none; }
        @media (min-width: 768px) { .hp-pc { display: inline; } .hp-mo { display: none; } }

        /* 머리말 — 메인 카드 섹션(.hs-head)과 같은 크기·색 */
        .hp-head { text-align: center; opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .hp-head.is-in { opacity: 1; transform: none; }
        .hp-eyebrow { margin: 0 0 1rem; font-size: clamp(.75rem, 1.1vw, .9rem); font-weight: 600; letter-spacing: .34em; color: #8a8a8a; }
        .hp-title { margin: 0; font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.3; word-break: keep-all; }
        .hp-title span, .hp-sub span { color: #6fb0f2; }
        .hp-lead { margin: clamp(1.25rem, 2.5vw, 1.75rem) auto 0; max-width: 760px; font-size: clamp(1rem, 1.4vw, 1.12rem); line-height: 1.75; color: rgba(255,255,255,.66); word-break: keep-all; }

        /* 카드 공통 — 연회색 둥근 판, 화면에 들어오면 아래에서 떠오른다 */
        .hp-card { border-radius: clamp(18px, 2.2vw, 28px); background: #1a1b1f; opacity: 0; transform: translateY(40px); transition: opacity .8s cubic-bezier(.16,1,.3,1) calc(.05s + var(--d, 0) * .1s), transform .8s cubic-bezier(.16,1,.3,1) calc(.05s + var(--d, 0) * .1s), background .25s; }
        .is-in > .hp-card { opacity: 1; transform: none; }

        /* 박스 폭은 안의 글 길이에 맞춘다 (최대 860px) */
        .hp-what { display: flex; gap: 18px; align-items: flex-start; width: fit-content; max-width: 860px; margin: clamp(2.5rem, 5vw, 3.5rem) auto 0; padding: clamp(1.25rem, 2.4vw, 1.75rem) clamp(1.4rem, 2.6vw, 2rem); border-radius: clamp(18px, 2.2vw, 24px); background: rgba(63,143,224,.12); box-shadow: inset 0 0 0 1px rgba(111,176,242,.25); opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.16,1,.3,1) .15s, transform .8s cubic-bezier(.16,1,.3,1) .15s; }
        .hp-what.is-in { opacity: 1; transform: none; }
        .hp-what__icon { flex: none; width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,.08); color: #6fb0f2; display: flex; align-items: center; justify-content: center; }
        .hp-what b { font-size: 1.1rem; font-weight: 800; }
        .hp-what p { margin: .35rem 0 0; font-size: 1rem; line-height: 1.7; color: rgba(255,255,255,.78); word-break: keep-all; }
        .hp-stats { list-style: none; margin: 1.1rem 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .hp-stats li { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,.05); }
        .hp-stats strong { flex: none; font-size: clamp(1.8rem, 3.4vw, 2.4rem); font-weight: 800; letter-spacing: -0.03em; color: #ff7a7a; line-height: 1; }
        .hp-stats span { font-size: .88rem; line-height: 1.45; color: rgba(255,255,255,.72); word-break: keep-all; }
        @media (max-width: 520px) { .hp-stats { grid-template-columns: 1fr; } }
        /* 휴대폰 — 수치 카드·출처는 아이콘 칸만큼 왼쪽으로 넓혀, 박스 안 가로폭을 다 쓴다 (왼쪽 끝을 아이콘 시작점에 맞춤: 아이콘 48 + 간격 18) */
        @media (max-width: 767px) { .hp-stats, .hp-src { margin-left: -66px; } .hp-src { text-align: center; } }
        .hp-src { display: block; margin-top: .7rem; font-size: .75rem; color: rgba(255,255,255,.4); }

        .hp-news { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(.85rem, 1.8vw, 1.4rem); margin-top: clamp(2.5rem, 5vw, 3.5rem); }
        .hp-news__card { margin: 0; padding: clamp(.75rem, 1.4vw, 1rem); }
        /* 네 장을 같은 크기로 — 같은 비율(가로 900 : 세로 411) 칸에 기사 위쪽부터 채운다 */
        /* 바탕은 칠하지 않는다 — 흰 바탕이면 어두운 기사 가장자리에 흰 줄(소수점 픽셀 틈)이 비친다. 그림도 1% 키워 틈을 덮는다 */
        .hp-news__shot { position: relative; display: block; overflow: hidden; aspect-ratio: 900 / 411; border-radius: 12px; }
        /* 마우스를 올리면 기사가 살짝 다가온다 */
        .hp-news__shot img { transform: scale(1.01); transition: transform .6s cubic-bezier(.16,1,.3,1); }
        .hp-news__card:hover .hp-news__shot img { transform: scale(1.06); }
        .hp-news__card figcaption { margin: .7rem .25rem 0; font-size: .88rem; font-weight: 600; color: rgba(255,255,255,.5); }
        .hp-note { margin: 1rem 0 0; text-align: center; font-size: .82rem; color: rgba(255,255,255,.4); }
        @media (max-width: 767px) {
          .hp-news { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; margin-left: -1.5rem; margin-right: -1.5rem; padding: 0 1.5rem 6px; scrollbar-width: none; }
          .hp-news::-webkit-scrollbar { display: none; }
          .hp-news__card { flex: 0 0 82%; scroll-snap-align: center; }
        }

        .hp-sub { margin: clamp(4rem, 8vw, 6rem) 0 0; text-align: center; font-size: clamp(1.35rem, 2.8vw, 2.1rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.4; word-break: keep-all; }
        .hp-cmp { display: grid; gap: clamp(.85rem, 1.8vw, 1.4rem); max-width: 1000px; margin: clamp(2rem, 4vw, 3rem) auto 0; }
        @media (min-width: 768px) { .hp-cmp { grid-template-columns: 1fr 1fr; } }
        .hp-cmp__box { padding: clamp(1.4rem, 2.4vw, 2rem); }
        .hp-cmp__box--we { background: linear-gradient(135deg, rgba(63,143,224,.28), rgba(63,143,224,.08)); box-shadow: inset 0 0 0 2px rgba(111,176,242,.4); }
        .hp-cmp__tag { display: inline-flex; align-items: center; gap: 6px; margin: 0; font-size: .85rem; font-weight: 700; color: rgba(255,255,255,.5); }
        .hp-cmp__box--we .hp-cmp__tag { color: #6fb0f2; }
        .hp-cmp__title { margin: .35rem 0 0; font-size: clamp(1.1rem, 1.7vw, 1.3rem); font-weight: 800; letter-spacing: -0.02em; }
        .hp-cmp ul { list-style: none; margin: 1.25rem 0 0; padding: 0; display: grid; gap: .8rem; }
        .hp-cmp li { display: flex; gap: 10px; font-size: .98rem; line-height: 1.6; color: rgba(255,255,255,.75); word-break: keep-all; }
        .hp-cmp li svg { flex: none; margin-top: 3px; }
                .hp-x { color: #ff7a7a; }
        .hp-v { color: #6fb0f2; }

        @media (prefers-reduced-motion: reduce) {
          .hp-head, .hp-what, .hp-card { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
    </section>
  )
}
