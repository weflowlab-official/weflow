import { Search, Gauge, ShieldCheck, CalendarCheck, UserRound, ClipboardList, MapPin } from 'lucide-react'
import { Fragment } from 'react'
import InView from './InView'
import { HV_CLINIC, type HomeVsBlogCopy } from './homeCopy'

/**
 * '홈페이지와 웹블로그, 뭐가 다른가요?' — 히어로 바로 아래.
 *
 * 왼쪽 홈페이지 창은 한 번에 완성되는 '병원의 얼굴' — 메뉴 · 배너 · 바로가기 칸이 차례로 자리 잡고 멈춘다.
 * 오른쪽 웹블로그 창은 '계속 쌓이는 글' — 글 카드가 하나씩 늘어나고, 글 수가 올라간다.
 * 두 창은 실제 사이트 화면처럼 그린다 (2026-11-25): 홈페이지는 로고 · 메뉴 · 예약 버튼이 있는 머리줄과 큰 배너,
 * 웹블로그는 파란 머리줄 · 카테고리 칩 · 썸네일 카드 격자 — WEFLOW 웹블로그의 실제 화면 짜임을 본떴다. 사진은 쓰지 않고 모두 CSS 로 그린다.
 * 둘 다 화면에 들어올 때 한 번만 움직인다 (InView 가 'is-in' 을 붙인다).
 * 카드마다 아래에 역할 · 담는 내용 · 바뀌는 주기 세 줄을 넣어 나란히 비교하고, 마지막 줄에서 '함께면' 으로 다음 이야기를 연다.
 */


/** 홈페이지든 웹블로그든 WEFLOW 가 똑같이 챙기는 것 — 표 아래에 네 칸으로 */
const BOTH: { Icon: typeof Search; title: string; desc: string; tight?: boolean }[] = [
  { Icon: Search, title: 'SEO·AEO·GEO 구조 설계', desc: '네이버·구글·AI 검색이 잘 읽는 구조로' },
  { Icon: Gauge, title: '빠른 로딩 · 모바일 최적화', desc: '사진이 많아도 휴대폰에서 빠르게' },
  // 관리자 페이지는 넣지 않는다 — 홈페이지는 관리자에서 글·사진·문구를 바꾸는 구조가 아니라 둘의 공통점이 아니다
  { Icon: ShieldCheck, title: '최신 기술 · 보안 연결', desc: 'PHP 없이 Next.js로, 모든 페이지 HTTPS', tight: true },
  { Icon: CalendarCheck, title: '문의 · 예약 연결', desc: '보던 화면에서 바로 상담으로' },
]

/** 홈페이지 창 바로가기 세 칸의 그림 — 순서는 copy.quick 과 같다 (사람 · 안내 · 위치) */
const QUICK_ICONS = [UserRound, ClipboardList, MapPin]

/** 맺음 문장 — 굵은(파란) 부분을 나눠 둔다. 한 글자씩 써지게 글자 단위로 쪼개 그린다 */
const TOGETHER = [
  { text: '둘이 함께면, ', bold: false, br: true },
  { text: '검색에서 예약까지 한 사이트 안에서', bold: true },
  { text: ' 이어집니다.', bold: false },
]


/** 카드 안 비교 세 줄 — 따로 떨어진 표 대신 카드마다 넣어, 두 카드가 같은 줄 순서로 나란히 비교된다 */
function Facts({ side, rows }: { side: 'home' | 'blog'; rows: HomeVsBlogCopy['rows'] }) {
  return (
    <dl className="hv-facts">
      {rows.map(r => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r[side]}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function HomeVsBlog({ copy = HV_CLINIC }: { copy?: HomeVsBlogCopy }) {
  // 맺음 문장 — 굵은 부분만 업종에 따라 바뀐다
  const together = TOGETHER.map((t, i) => (i === 1 ? { ...t, text: copy.together } : t))
  return (
    <section id="difference" className="hv">
      <div className="hv-inner">
        <p className="hv-eyebrow">HOMEPAGE vs WEB BLOG</p>
        <h2 className="hv-title">
          홈페이지는 <span>{copy.homeIs}</span>,<br />
          웹블로그는 <span>{copy.blogIs}</span>
        </h2>

        <HomeVsBlogPair copy={copy} />

        {/* 둘 다 똑같이 챙기는 것 */}
        <div className="hv-both">
          <p className={`hv-both-head${copy.headGold ? ' is-gold' : ''}`}>WEFLOW는 홈페이지든 웹블로그든, <br className="hv-mo" />이렇게 만듭니다</p>
          <ul>
            {BOTH.map(({ Icon, title, desc, tight }) => (
              <li key={title}>
                <span className="hv-both-icon"><Icon size={20} /></span>
                <strong>{title}</strong>
                <small className={tight ? 'is-tight' : undefined}>{desc}</small>
              </li>
            ))}
          </ul>
        </div>
        {/* 맺음 문장 — 화면에 들어오면 한 글자씩 써진다 */}
        <InView className="hv-together-wrap">
          <p className="hv-together" aria-label={together.map(t => t.text).join('')}>
            {together.flatMap(seg => [...seg.text].map((ch, k, arr) => ({ ch, bold: seg.bold, br: seg.br && k === arr.length - 1 }))).map((c, i) => (
              <Fragment key={i}>
                <span aria-hidden="true" className={c.bold ? 'hv-ch hv-ch--b' : 'hv-ch'} style={{ '--i': i } as React.CSSProperties}>
                  {c.ch}
                </span>
                {/* 휴대폰에서만 '둘이 함께면,' 뒤에서 줄을 바꾼다 */}
                {c.br && <br className="hv-mo" />}
              </Fragment>
            ))}
          </p>
        </InView>
      </div>

      <style>{HV_PAIR_CSS + `
        .hv { background: #fff; padding: clamp(5rem, 10vw, 8rem) 20px; text-align: center; border-top: 1px solid #e9ebef; overflow: hidden; } /* 양옆 밖에서 날아오는 카드가 가로 스크롤을 만들지 않게 */
        .hv-inner { max-width: 1000px; margin: 0 auto; }
        .hv-eyebrow { margin: 0 0 16px; font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: #1f63d6; }
        .hv-title { margin: 0; font-size: clamp(1.6rem, 3.6vw, 2.4rem); line-height: 1.38; font-weight: 800; letter-spacing: -0.035em; color: #111418; }
        .hv-title span { color: #1f63d6; }

        .hv-both { margin: 56px auto 0; } /* 위 카드 두 장 · 표와 같은 폭 */
        .hv-both-head { margin: 0 0 20px; font-size: clamp(1.1rem, 1.9vw, 1.22rem); font-weight: 800; letter-spacing: -0.02em; color: #111418; } /* 아래 '둘이 함께면' 맺음 문장(최대 1.4rem)보다는 작게 */
        /* 금색 광택 (copy.headGold) — '왜 WEFLOW?' 의 금색 글씨와 같은 색·움직임 */
        .hv-both-head.is-gold { background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: hvGoldSheen 2.8s linear infinite; }
        @keyframes hvGoldSheen { from { background-position: 250% center; } to { background-position: 0% center; } }
        @media (prefers-reduced-motion: reduce) { .hv-both-head.is-gold { animation: none; } }
        .hv-both ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 900px) { .hv-both ul { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        /* 휴대폰 — 옆으로 넘기는 줄. 카드 폭을 화면의 62%로 둬 다음 카드가 절반쯤 보이게 하고, 스크롤 막대는 숨긴다.
           화면 양끝까지 붙여 넘기고, 멈출 때는 카드 왼쪽이 본문 여백(20px)에 맞는다 */
        @media (max-width: 767px) {
          .hv-both ul { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 62%; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 20px; margin: 0 -20px; padding: 6px 20px 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .hv-both ul::-webkit-scrollbar { display: none; }
          .hv-both li { scroll-snap-align: start; }
        }
        .hv-mo { display: inline; }
        @media (min-width: 768px) { .hv-mo { display: none; } }
        /* 위에서부터 쌓는다 — 설명이 두 줄인 칸이 있어도 네 칸의 아이콘·제목·설명 첫 줄 높이가 같게 */
        .hv-both li { display: grid; justify-items: center; align-content: start; gap: 8px; padding: 34px 14px; min-height: 180px; border-radius: 18px; background: #f5f9ff; border: 1px solid #e3ecfb; }
        /* 마우스를 올리면 — 카드가 떠오르며 흰 바탕 · 파란 테두리 · 그림자, 아이콘은 통 튀며 살짝 기운다 */
        .hv-both li { transition: transform .3s cubic-bezier(.16,1,.3,1), background .25s ease, border-color .25s ease, box-shadow .3s ease; }
        .hv-both li:hover { transform: translateY(-6px); background: #fff; border-color: #1f63d6; box-shadow: 0 18px 40px rgba(31,99,214,.14); }
        .hv-both li:hover .hv-both-icon { animation: hvIconPop .5s cubic-bezier(.34,1.56,.64,1); }
        @keyframes hvIconPop { 0% { transform: none; } 45% { transform: translateY(-6px) scale(1.12) rotate(-8deg); } 100% { transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hv-both li { transition: none; } .hv-both li:hover { transform: none; } .hv-both li:hover .hv-both-icon { animation: none; } }
        .hv-both-icon { width: 42px; height: 42px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: #1f63d6; color: #fff; margin-bottom: 4px; }
        .hv-both strong { font-size: .95rem; font-weight: 800; letter-spacing: -0.02em; color: #111418; word-break: keep-all; }
        .hv-both small { font-size: .82rem; line-height: 1.5; color: #6b7380; word-break: keep-all; }
        /* 설명이 긴 칸(보안) — 글씨를 한 단계 줄여 다른 칸처럼 한 줄로. 아주 좁은 휴대폰에서는 줄이 바뀌어도 된다 */
        /* 줄 높이는 다른 칸 설명(.82rem × 1.5)과 같게 — 글씨만 작아지면 줄이 낮아져 위로 붙어 보인다 */
        .hv-both small.is-tight { font-size: .74rem; line-height: calc(.82rem * 1.5); letter-spacing: -0.02em; white-space: nowrap; position: relative; top: 0.8px; } /* 눈으로 맞춰 0.8px 내림 */
        @media (max-width: 639px) { .hv-both small.is-tight { white-space: normal; } }
        .hv-together { margin: 52px 0 0; font-size: clamp(1.15rem, 2.2vw, 1.4rem); font-weight: 700; letter-spacing: -0.02em; color: #3a414c; word-break: keep-all; }
        .hv-ch--b { color: #1f63d6; font-weight: 800; }
        /* 한 글자씩 — 글자마다 0.045초씩 늦게 나타난다 */
        .hv-ch { opacity: 0; transition: opacity .05s linear; transition-delay: calc(var(--i) * .045s); }
        .hv-together-wrap.is-in .hv-ch { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .hv-ch { opacity: 1; transition: none; } }

      `}</style>
    </section>
  )
}

/**
 * 카드 두 장(홈페이지 창 · 웹블로그 창 + 비교 세 줄)만 — 웹블로그(/blog) 메인 '웹블로그란?' 섹션도 이것만 가져다 쓴다.
 * 모양은 HV_PAIR_CSS (쓰는 쪽이 <style> 에 넣는다).
 */
export function HomeVsBlogPair({ copy }: { copy: HomeVsBlogCopy }) {
  return (
    <InView className="hv-pair">
      {/* 홈페이지 — 머리줄 · 배너 · 바로가기가 차례로 자리 잡고 멈춘다 */}
      <div className="hv-card">
        <span className="hv-label">홈페이지</span>
        <div className="hv-win">
          <div className="hv-bar"><i /><i /><i /><span>{copy.domain}</span></div>
          <div className="hv-home">
            {/* 머리줄 — 로고 · 메뉴 · 예약 버튼 */}
            <div className="hv-h-nav hv-step" style={{ '--d': '0.3s' } as React.CSSProperties}>
              <b><i className="hv-logo" />{copy.brand}</b>
              <span className="hv-h-menu">{copy.quick.map(t => <u key={t}>{t}</u>)}</span>
              <em>{copy.bannerCta}</em>
            </div>
            {/* 큰 배너 — 왼쪽 문구 · 버튼, 오른쪽은 사람 사진 자리(실루엣) */}
            <div className="hv-h-banner hv-step" style={{ '--d': '1.05s' } as React.CSSProperties}>
              <div className="hv-h-copy">
                <small>{copy.brand}</small>
                <strong>{copy.banner[0]}<br />{copy.banner[1]}</strong>
                <em>{copy.bannerCta} →</em>
              </div>
              <span className="hv-h-art" aria-hidden="true"><i /><i /></span>
            </div>
            {/* 바로가기 세 칸 */}
            <div className="hv-h-quick hv-step" style={{ '--d': '1.8s' } as React.CSSProperties}>
              {copy.quick.map((t, i) => {
                const Icon = QUICK_ICONS[i] ?? MapPin
                return <span key={t}><Icon size={15} />{t}</span>
              })}
            </div>
          </div>
        </div>
        <p className="hv-cap">한 번 완성하면 <b>늘 그 자리에</b></p>
        <Facts side="home" rows={copy.rows} />
      </div>

      {/* 웹블로그 — 글 카드가 하나씩 늘어난다 */}
      <div className="hv-card hv-card--blog">
        <span className="hv-label">웹블로그</span>
        <div className="hv-win">
          <div className="hv-bar"><i /><i /><i /><span>{copy.domain}/blog</span></div>
          <div className="hv-blog">
            {/* 파란 머리줄 — 로고 · 홈페이지 바로가기 · 검색 */}
            <div className="hv-b-top">
              <b>{copy.brand}<small>웹블로그</small></b>
              <em>홈페이지 바로가기 →</em>
              <Search size={12} strokeWidth={2.5} />
            </div>
            <div className="hv-b-body">
              <div className="hv-b-head">
                <b>전체 글</b>
                <span className="hv-count">글 <span className="hv-count-strip"><i>12</i><i>13</i><i>14</i><i>15</i></span>개</span>
              </div>
              {/* 카테고리 칩 */}
              <div className="hv-b-chips">
                <span className="is-on">전체</span>
                {copy.posts.map(p => <span key={p.tag}>{p.tag}</span>)}
              </div>
              {/* 썸네일 카드 격자 */}
              <div className="hv-b-list">
                {copy.posts.map((p, i) => (
                  <div key={p.title} className="hv-post" style={{ '--i': i } as React.CSSProperties}>
                    <span className="hv-thumb"><small>{p.tag}</small><b>{p.title}</b></span>
                    <span className="hv-post-foot">{copy.brand} 웹블로그</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="hv-cap">쓸수록 <b>늘어나는 검색 유입</b></p>
        <Facts side="blog" rows={copy.rows} />
      </div>
    </InView>
  )
}

export const HV_PAIR_CSS = `
        /* 창 두 개 */
        /* 맞붙기 — 홈페이지는 왼쪽 밖, 웹블로그는 오른쪽 밖에서 날아와 가운데서 부딪히고 살짝 튕겼다 제자리.
           카드 안 움직임은 부딪힌 뒤(--hit)에 시작해, 양쪽 모두 부딪힌 뒤 2.3초에 함께 끝난다
           (오른쪽 웹블로그의 마지막 글이 들어오는 때에 왼쪽 홈페이지의 마지막 칸 · 글 수를 맞췄다) */
        .hv-pair { --hit: .62s; position: relative; display: grid; gap: 20px; margin-top: 52px; }
        .hv-card { opacity: 0; }
        .hv-pair.is-in .hv-card { animation: hvFromLeft .9s cubic-bezier(.2,.8,.2,1) both; }
        .hv-pair.is-in .hv-card--blog { animation-name: hvFromRight; }
        @keyframes hvFromLeft { 0% { opacity: 0; transform: translateX(-70vw) rotate(-4deg); } 66% { opacity: 1; transform: translateX(18px) rotate(1deg); } 80% { transform: translateX(-8px); } 100% { opacity: 1; transform: none; } }
        @keyframes hvFromRight { 0% { opacity: 0; transform: translateX(70vw) rotate(4deg); } 66% { opacity: 1; transform: translateX(-18px) rotate(-1deg); } 80% { transform: translateX(8px); } 100% { opacity: 1; transform: none; } }
        @media (min-width: 768px) { .hv-pair { grid-template-columns: 1fr 1fr; gap: 28px; } }
        .hv-card { display: grid; gap: 14px; justify-items: center; padding: 22px 20px 24px; border-radius: 24px; background: #f5f6f8; }
        .hv-card--blog { background: #eef4fe; }
        .hv-label { padding: 5px 14px; border-radius: 999px; background: #111418; color: #fff; font-size: .82rem; font-weight: 800; }
        .hv-card--blog .hv-label { background: #1f63d6; }
        .hv-win { width: 100%; max-width: 380px; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 14px 34px rgba(17,20,24,.08); text-align: left; }
        .hv-bar { display: flex; align-items: center; gap: 5px; padding: 9px 12px; background: #fafbfc; border-bottom: 1px solid #eef0f3; }
        .hv-bar i { width: 7px; height: 7px; border-radius: 50%; background: #ff5f57; }
        .hv-bar i:nth-child(2) { background: #febc2e; }
        .hv-bar i:nth-child(3) { background: #28c840; }
        .hv-bar span { margin-left: 8px; flex: 1; padding: 3px 10px; border-radius: 999px; background: #f1f3f6; font-size: .72rem; color: #6b7380; }

        /* 홈페이지 창 — 머리줄 · 배너 · 바로가기가 차례로 내려앉는다. 실제 병원 홈페이지 첫 화면처럼 그린다 */
        .hv-home { height: 290px; display: flex; flex-direction: column; }
        .hv-step { opacity: 0; transform: translateY(-10px); transition: opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--hit) + var(--d)); }
        .hv-pair.is-in .hv-step { opacity: 1; transform: none; }
        .hv-h-nav { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-bottom: 1px solid #eef0f3; }
        .hv-h-nav b { display: inline-flex; align-items: center; gap: 5px; margin-right: auto; font-size: .74rem; font-weight: 800; letter-spacing: -0.02em; color: #111418; white-space: nowrap; }
        .hv-logo { width: 14px; height: 14px; border-radius: 4px; background: linear-gradient(135deg, #6aa2f2, #1f63d6); }
        .hv-h-menu { display: flex; gap: 9px; min-width: 0; }
        .hv-h-menu u { text-decoration: none; font-size: .6rem; font-weight: 600; color: #4b5360; white-space: nowrap; }
        @media (max-width: 420px) { .hv-h-menu u:nth-child(n+3) { display: none; } } /* 좁은 휴대폰 — 메뉴 둘만 */
        .hv-h-nav em { flex: none; font-style: normal; font-size: .6rem; font-weight: 800; color: #fff; background: #111418; padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
        .hv-h-banner { position: relative; flex: 1; min-height: 0; margin: 10px 12px; padding: 0 16px; display: flex; align-items: center; border-radius: 12px; overflow: hidden; background: linear-gradient(120deg, #eef4ff 0%, #d8e7fe 60%, #c6dbfc 100%); }
        .hv-h-copy { position: relative; z-index: 1; display: grid; justify-items: start; gap: 6px; }
        .hv-h-copy small { font-size: .58rem; font-weight: 800; letter-spacing: .04em; color: #1f63d6; }
        .hv-h-copy strong { font-size: 1rem; line-height: 1.35; font-weight: 800; letter-spacing: -0.03em; color: #111418; white-space: nowrap; }
        .hv-h-copy em { margin-top: 3px; font-style: normal; font-size: .62rem; font-weight: 800; color: #fff; background: #1f63d6; padding: 5px 11px; border-radius: 999px; box-shadow: 0 6px 14px rgba(31,99,214,.28); }
        /* 사진 자리 — 흰 원 위에 사람 실루엣(머리 · 어깨) */
        .hv-h-art { position: absolute; right: 12px; bottom: 0; width: 96px; height: 112px; }
        .hv-h-art::before { content: ''; position: absolute; left: 50%; top: 2px; width: 124px; height: 124px; margin-left: -62px; border-radius: 50%; background: rgba(255,255,255,.6); }
        .hv-h-art i { position: absolute; left: 50%; background: linear-gradient(160deg, #9cc2f8, #4f8ff5); }
        .hv-h-art i:first-child { top: 16px; width: 36px; height: 36px; margin-left: -18px; border-radius: 50%; }
        .hv-h-art i:last-child { bottom: 0; width: 84px; height: 54px; margin-left: -42px; border-radius: 42px 42px 0 0; }
        .hv-h-quick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; padding: 0 12px 12px; }
        .hv-h-quick span { display: grid; justify-items: center; gap: 4px; padding: 9px 0 8px; border-radius: 10px; background: #f5f7fa; border: 1px solid #edf0f4; font-size: .64rem; font-weight: 700; color: #3a414c; white-space: nowrap; }
        .hv-h-quick svg { color: #1f63d6; }

        /* 웹블로그 창 — 파란 머리줄 · 카테고리 칩 · 썸네일 카드 격자. 글 카드가 하나씩 늘어나고, 글 수가 올라간다 */
        .hv-blog { height: 290px; display: flex; flex-direction: column; overflow: hidden; }
        .hv-b-top { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: #1f63d6; color: #fff; }
        .hv-b-top b { font-size: .74rem; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
        .hv-b-top b small { margin-left: 4px; font-size: .56rem; font-weight: 600; opacity: .82; }
        .hv-b-top em { flex: none; font-style: normal; font-size: .54rem; font-weight: 700; padding: 3px 8px; border: 1px solid rgba(255,255,255,.55); border-radius: 999px; white-space: nowrap; }
        .hv-b-top svg { flex: none; margin-left: auto; }
        .hv-b-body { flex: 1; min-height: 0; padding: 8px 12px 0; display: flex; flex-direction: column; gap: 7px; } /* 위 여백은 줄이고, 카드 높이를 조금 낮춰 맨 아래 카드 밑에 숨 쉴 자리를 둔다 */
        .hv-b-head { display: flex; align-items: center; justify-content: space-between; }
        .hv-b-head b { font-size: .88rem; font-weight: 800; letter-spacing: -0.02em; color: #111418; }
        .hv-count { display: inline-flex; align-items: center; gap: 3px; height: 22px; padding: 0 9px; line-height: 1; font-size: .72rem; font-weight: 700; color: #1f63d6; background: #eef4fe; border-radius: 999px; }
        /* 숫자 띠 — 칸 높이와 글자 줄 높이를 같은 값으로 맞춰야 '글 · 개' 와 같은 높이에 숫자가 놓인다 */
        .hv-count-strip { display: inline-flex; flex-direction: column; height: 1.25em; overflow: hidden; font-variant-numeric: tabular-nums; }
        .hv-count-strip i { display: block; height: 1.25em; line-height: 1.25em; font-style: normal; text-align: center; transform: translateY(0); }
        /* 글 수도 마지막 글이 들어오는 때(부딪힌 뒤 2.3초)에 같이 15 로 멈춘다 */
        .hv-pair.is-in .hv-count-strip i { animation: hvCount 1.9s cubic-bezier(.45,.05,.3,1) calc(var(--hit) + .4s) both; }
        @keyframes hvCount { 0%, 10% { transform: translateY(0); } 33%, 40% { transform: translateY(-100%); } 63%, 70% { transform: translateY(-200%); } 93%, 100% { transform: translateY(-300%); } }
        .hv-b-chips { display: flex; gap: 5px; overflow: hidden; }
        .hv-b-chips span { flex: none; padding: 3px 8px; border: 1px solid #e1e5ea; border-radius: 999px; background: #fff; font-size: .58rem; font-weight: 700; color: #4b5360; white-space: nowrap; }
        .hv-b-chips span.is-on { background: #1f63d6; border-color: #1f63d6; color: #fff; }
        .hv-b-list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        /* 글 카드 — 썸네일(칩 + 제목) 아래에 블로그 이름 띠. 뒤 글부터 하나씩 떠오른다 */
        .hv-post { min-width: 0; border-radius: 9px; overflow: hidden; background: #fff; box-shadow: 0 3px 10px rgba(17,20,24,.07); opacity: 0; transform: translateY(10px) scale(.96); transition: opacity .45s ease, transform .5s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--hit) + .3s + (3 - var(--i)) * .5s); }
        .hv-pair.is-in .hv-post { opacity: 1; transform: none; }
        .hv-thumb { position: relative; display: grid; align-content: center; justify-items: start; gap: 4px; height: 61px; padding: 0 9px; overflow: hidden; background: linear-gradient(135deg, #e6f0fe, #c7dcfb); }
        .hv-thumb::after { content: ''; position: absolute; right: -16px; bottom: -22px; width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,.55); }
        .hv-thumb small { position: relative; z-index: 1; padding: 2px 6px; border-radius: 999px; background: #1f63d6; color: #fff; font-size: .5rem; font-weight: 800; }
        .hv-thumb b { position: relative; z-index: 1; font-size: .64rem; line-height: 1.3; font-weight: 800; letter-spacing: -0.03em; color: #111418; word-break: keep-all; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .hv-post-foot { display: block; padding: 4px 0; background: #5b8fe6; color: #fff; text-align: center; font-size: .48rem; font-weight: 700; letter-spacing: .02em; white-space: nowrap; overflow: hidden; }
        /* 카드마다 색을 달리 — 파랑 · 민트 · 라벤더 · 하늘 */
        .hv-post:nth-child(2) .hv-thumb { background: linear-gradient(135deg, #dff5ee, #b9e7d9); }
        .hv-post:nth-child(2) .hv-thumb small { background: #12a37a; }
        .hv-post:nth-child(2) .hv-post-foot { background: #3fb596; }
        .hv-post:nth-child(3) .hv-thumb { background: linear-gradient(135deg, #ece6fd, #d5c8f8); }
        .hv-post:nth-child(3) .hv-thumb small { background: #7c5ce0; }
        .hv-post:nth-child(3) .hv-post-foot { background: #9079e6; }
        .hv-post:nth-child(4) .hv-thumb { background: linear-gradient(135deg, #e0f3fb, #bfe3f5); }
        .hv-post:nth-child(4) .hv-thumb small { background: #1689b8; }
        .hv-post:nth-child(4) .hv-post-foot { background: #43a6cf; }

        .hv-cap { margin: 4px 0 0; font-size: .98rem; color: #4b5360; }
        .hv-cap b { color: #111418; }

        /* 카드 안 비교 세 줄 — 왼쪽 항목 이름, 오른쪽 내용. 두 카드가 같은 순서라 나란히 읽힌다 */
        .hv-facts { width: 100%; max-width: 380px; margin: 6px 0 0; padding-top: 14px; border-top: 1px solid rgba(17,20,24,.08); text-align: left; display: grid; gap: 10px; }
        .hv-facts > div { display: grid; grid-template-columns: 84px 1fr; gap: 10px; align-items: baseline; }
        .hv-facts dt { font-size: .82rem; font-weight: 700; color: #8a919c; }
        .hv-facts dd { margin: 0; font-size: .95rem; font-weight: 600; line-height: 1.5; color: #111418; word-break: keep-all; }
        .hv-card--blog .hv-facts dt { color: #1f63d6; }
        @media (prefers-reduced-motion: reduce) {
          .hv-step, .hv-post { transition: none; }
          .hv-step { opacity: 1; transform: none; }
          .hv-card { opacity: 1; animation: none !important; }
          .hv-post { opacity: 1; transform: none; }
          .hv-count-strip i { animation: none !important; transform: translateY(-300%); }
        }
`
