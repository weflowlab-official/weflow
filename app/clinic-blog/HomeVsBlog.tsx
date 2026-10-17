import { Search, Gauge, PenLine, CalendarCheck } from 'lucide-react'
import { Fragment } from 'react'
import InView from './InView'

/**
 * '홈페이지와 웹블로그, 뭐가 다른가요?' — 히어로 바로 아래.
 *
 * 왼쪽 홈페이지 창은 한 번에 완성되는 '병원의 얼굴' — 메뉴 · 배너 · 바로가기 칸이 차례로 자리 잡고 멈춘다.
 * 오른쪽 웹블로그 창은 '계속 쌓이는 글' — 위로 새 글이 하나씩 밀려 들어오고, 글 수가 올라간다.
 * 둘 다 화면에 들어올 때 한 번만 움직인다 (InView 가 'is-in' 을 붙인다).
 * 카드마다 아래에 역할 · 담는 내용 · 바뀌는 주기 세 줄을 넣어 나란히 비교하고, 마지막 줄에서 '함께면' 으로 다음 이야기를 연다.
 */

const ROWS = [
  { label: '역할', home: '병원을 소개하고 믿음을 줍니다', blog: '검색에서 새 환자를 데려옵니다' },
  { label: '담는 내용', home: '의료진 · 진료 안내 · 오시는 길', blog: '질환 · 치료 · 관리법 이야기' },
  { label: '바뀌는 주기', home: '한 번 만들고 필요할 때 고칩니다', blog: '글이 꾸준히 쌓입니다' },
]

/** 홈페이지든 웹블로그든 WEFLOW 가 똑같이 챙기는 것 — 표 아래에 네 칸으로 */
const BOTH = [
  { Icon: Search, title: 'SEO·AEO·GEO 구조 설계', desc: '네이버·구글·AI 검색이 잘 읽는 구조로' },
  { Icon: Gauge, title: '빠른 로딩 · 모바일 최적화', desc: '사진이 많아도 휴대폰에서 빠르게' },
  { Icon: PenLine, title: '쉬운 관리자 페이지', desc: '글과 사진·문구를 병원에서 직접' },
  { Icon: CalendarCheck, title: '문의 · 예약 연결', desc: '보던 화면에서 바로 상담으로' },
]

/** 맺음 문장 — 굵은(파란) 부분을 나눠 둔다. 한 글자씩 써지게 글자 단위로 쪼개 그린다 */
const TOGETHER = [
  { text: '둘이 함께면, ', bold: false, br: true },
  { text: '검색에서 예약까지 한 사이트 안에서', bold: true },
  { text: ' 이어집니다.', bold: false },
]

const POSTS = [
  { tag: '사랑니', title: '사랑니는 꼭 빼야 하나요?' },
  { tag: '임플란트', title: '임플란트 수술 후 일주일' },
  { tag: '교정', title: '투명교정, 몇 살까지 될까요?' },
  { tag: '잇몸', title: '양치할 때 피가 난다면' },
]

/** 카드 안 비교 세 줄 — 따로 떨어진 표 대신 카드마다 넣어, 두 카드가 같은 줄 순서로 나란히 비교된다 */
function Facts({ side }: { side: 'home' | 'blog' }) {
  return (
    <dl className="hv-facts">
      {ROWS.map(r => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r[side]}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function HomeVsBlog() {
  return (
    <section id="difference" className="hv">
      <div className="hv-inner">
        <p className="hv-eyebrow">HOMEPAGE vs WEB BLOG</p>
        <h2 className="hv-title">
          홈페이지는 <span>병원의 얼굴</span>,<br />
          웹블로그는 <span>환자를 데려오는 길</span>
        </h2>

        <InView className="hv-pair">
          {/* 홈페이지 — 차례로 자리 잡고 멈춘다 */}
          <div className="hv-card">
            <span className="hv-label">홈페이지</span>
            <div className="hv-win">
              <div className="hv-bar"><i /><i /><i /><span>우리병원.com</span></div>
              <div className="hv-home">
                <div className="hv-h-nav hv-step" style={{ '--d': '0.3s' } as React.CSSProperties}>
                  <b>우리병원치과</b><u /><u /><u />
                </div>
                <div className="hv-h-banner hv-step" style={{ '--d': '1.05s' } as React.CSSProperties}>
                  <strong>건강한 미소를<br />오래 지켜드립니다</strong>
                  <em>진료 예약</em>
                </div>
                <div className="hv-h-quick hv-step" style={{ '--d': '1.8s' } as React.CSSProperties}>
                  <span>의료진</span><span>진료 안내</span><span>오시는 길</span>
                </div>
              </div>
            </div>
            <p className="hv-cap">한 번 완성하면 <b>늘 그 자리에</b></p>
            <Facts side="home" />
          </div>

          {/* 웹블로그 — 새 글이 위로 하나씩 밀려 들어온다 */}
          <div className="hv-card hv-card--blog">
            <span className="hv-label">웹블로그</span>
            <div className="hv-win">
              <div className="hv-bar"><i /><i /><i /><span>우리병원.com/blog</span></div>
              <div className="hv-blog">
                <div className="hv-b-head">
                  <b>우리병원치과 블로그</b>
                  <span className="hv-count">글 <span className="hv-count-strip"><i>12</i><i>13</i><i>14</i><i>15</i></span>개</span>
                </div>
                <div className="hv-b-list">
                  {POSTS.map((p, i) => (
                    <div key={p.title} className="hv-post" style={{ '--i': i } as React.CSSProperties}>
                      <span className="hv-thumb" />
                      <span className="hv-post-text"><small>{p.tag}</small>{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="hv-cap">쓸수록 <b>늘어나는 검색 유입</b></p>
            <Facts side="blog" />
          </div>
        </InView>

        {/* 둘 다 똑같이 챙기는 것 */}
        <div className="hv-both">
          <p className="hv-both-head">WEFLOW는 홈페이지든 웹블로그든, 이렇게 만듭니다</p>
          <ul>
            {BOTH.map(({ Icon, title, desc }) => (
              <li key={title}>
                <span className="hv-both-icon"><Icon size={20} /></span>
                <strong>{title}</strong>
                <small>{desc}</small>
              </li>
            ))}
          </ul>
        </div>
        {/* 맺음 문장 — 화면에 들어오면 한 글자씩 써진다 */}
        <InView className="hv-together-wrap">
          <p className="hv-together" aria-label={TOGETHER.map(t => t.text).join('')}>
            {TOGETHER.flatMap(seg => [...seg.text].map((ch, k, arr) => ({ ch, bold: seg.bold, br: seg.br && k === arr.length - 1 }))).map((c, i) => (
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

      <style>{`
        .hv { background: #fff; padding: clamp(5rem, 10vw, 8rem) 20px; text-align: center; border-top: 1px solid #e9ebef; overflow: hidden; } /* 양옆 밖에서 날아오는 카드가 가로 스크롤을 만들지 않게 */
        .hv-inner { max-width: 1000px; margin: 0 auto; }
        .hv-eyebrow { margin: 0 0 16px; font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: #1f63d6; }
        .hv-title { margin: 0; font-size: clamp(1.6rem, 3.6vw, 2.4rem); line-height: 1.38; font-weight: 800; letter-spacing: -0.035em; color: #111418; }
        .hv-title span { color: #1f63d6; }

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

        /* 홈페이지 창 — 메뉴 · 배너 · 바로가기가 차례로 내려앉는다 */
        .hv-home { height: 210px; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
        .hv-step { opacity: 0; transform: translateY(-10px); transition: opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--hit) + var(--d)); }
        .hv-pair.is-in .hv-step { opacity: 1; transform: none; }
        .hv-h-nav { display: flex; align-items: center; gap: 8px; }
        .hv-h-nav b { font-size: .8rem; margin-right: auto; }
        .hv-h-nav u { width: 26px; height: 5px; border-radius: 999px; background: #e3e7ed; }
        .hv-h-banner { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; padding: 0 14px; border-radius: 10px; background: linear-gradient(135deg, #6aa2f2, #1f63d6); color: #fff; }
        .hv-h-banner strong { font-size: .92rem; line-height: 1.35; }
        .hv-h-banner em { font-style: normal; font-size: .68rem; font-weight: 800; color: #1f63d6; background: #fff; padding: 4px 10px; border-radius: 999px; }
        .hv-h-quick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .hv-h-quick span { padding: 9px 0; border-radius: 8px; background: #f3f5f8; text-align: center; font-size: .7rem; font-weight: 700; color: #4b5360; }

        /* 웹블로그 창 — 새 글이 위로 하나씩 밀려 들어오고, 글 수가 올라간다 */
        .hv-blog { height: 210px; padding: 12px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
        .hv-b-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid #eef0f3; }
        .hv-b-head b { font-size: .8rem; }
        .hv-count { display: inline-flex; align-items: center; gap: 3px; height: 22px; padding: 0 9px; line-height: 1; font-size: .72rem; font-weight: 700; color: #1f63d6; background: #eef4fe; border-radius: 999px; }
        /* 숫자 띠 — 칸 높이와 글자 줄 높이를 같은 값으로 맞춰야 '글 · 개' 와 같은 높이에 숫자가 놓인다 */
        .hv-count-strip { display: inline-flex; flex-direction: column; height: 1.25em; overflow: hidden; font-variant-numeric: tabular-nums; }
        .hv-count-strip i { display: block; height: 1.25em; line-height: 1.25em; font-style: normal; text-align: center; transform: translateY(0); }
        /* 글 수도 마지막 글이 들어오는 때(부딪힌 뒤 2.3초)에 같이 15 로 멈춘다 */
        .hv-pair.is-in .hv-count-strip i { animation: hvCount 1.9s cubic-bezier(.45,.05,.3,1) calc(var(--hit) + .4s) both; }
        @keyframes hvCount { 0%, 10% { transform: translateY(0); } 33%, 40% { transform: translateY(-100%); } 63%, 70% { transform: translateY(-200%); } 93%, 100% { transform: translateY(-300%); } }
        .hv-b-list { display: flex; flex-direction: column; gap: 7px; }
        .hv-post { display: flex; align-items: center; gap: 8px; max-height: 0; opacity: 0; overflow: hidden; transition: max-height .5s cubic-bezier(.16,1,.3,1), opacity .4s ease; transition-delay: calc(var(--hit) + .3s + (3 - var(--i)) * .5s); }
        .hv-pair.is-in .hv-post { max-height: 40px; opacity: 1; }
        .hv-thumb { flex: none; width: 34px; height: 26px; border-radius: 6px; background: linear-gradient(135deg, #d9e8fc, #b9d3f7); }
        .hv-post:nth-child(2n) .hv-thumb { background: linear-gradient(135deg, #d6f2ea, #aee3d3); }
        .hv-post-text { display: grid; font-size: .76rem; font-weight: 700; color: #111418; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hv-post-text small { font-size: .62rem; color: #12a37a; }

        .hv-cap { margin: 4px 0 0; font-size: .98rem; color: #4b5360; }
        .hv-cap b { color: #111418; }

        /* 카드 안 비교 세 줄 — 왼쪽 항목 이름, 오른쪽 내용. 두 카드가 같은 순서라 나란히 읽힌다 */
        .hv-facts { width: 100%; max-width: 380px; margin: 6px 0 0; padding-top: 14px; border-top: 1px solid rgba(17,20,24,.08); text-align: left; display: grid; gap: 10px; }
        .hv-facts > div { display: grid; grid-template-columns: 84px 1fr; gap: 10px; align-items: baseline; }
        .hv-facts dt { font-size: .82rem; font-weight: 700; color: #8a919c; }
        .hv-facts dd { margin: 0; font-size: .95rem; font-weight: 600; line-height: 1.5; color: #111418; word-break: keep-all; }
        .hv-card--blog .hv-facts dt { color: #1f63d6; }
        .hv-both { margin: 56px auto 0; } /* 위 카드 두 장 · 표와 같은 폭 */
        .hv-both-head { margin: 0 0 20px; font-size: clamp(1.1rem, 1.9vw, 1.22rem); font-weight: 800; letter-spacing: -0.02em; color: #111418; } /* 아래 '둘이 함께면' 맺음 문장(최대 1.4rem)보다는 작게 */
        .hv-both ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (min-width: 900px) { .hv-both ul { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        /* 휴대폰 — 옆으로 넘기는 줄. 카드 폭을 화면의 76%로 둬 다음 카드가 1/3쯤 보이게 하고, 스크롤 막대는 숨긴다.
           화면 양끝까지 붙여 넘기고, 멈출 때는 카드 왼쪽이 본문 여백(20px)에 맞는다 */
        @media (max-width: 767px) {
          .hv-both ul { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 76%; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 20px; margin: 0 -20px; padding: 6px 20px 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .hv-both ul::-webkit-scrollbar { display: none; }
          .hv-both li { scroll-snap-align: start; }
        }
        .hv-mo { display: inline; }
        @media (min-width: 768px) { .hv-mo { display: none; } }
        .hv-both li { display: grid; justify-items: center; align-content: center; gap: 8px; padding: 34px 14px; min-height: 180px; border-radius: 18px; background: #f5f9ff; border: 1px solid #e3ecfb; }
        /* 마우스를 올리면 — 카드가 떠오르며 흰 바탕 · 파란 테두리 · 그림자, 아이콘은 통 튀며 살짝 기운다 */
        .hv-both li { transition: transform .3s cubic-bezier(.16,1,.3,1), background .25s ease, border-color .25s ease, box-shadow .3s ease; }
        .hv-both li:hover { transform: translateY(-6px); background: #fff; border-color: #1f63d6; box-shadow: 0 18px 40px rgba(31,99,214,.14); }
        .hv-both li:hover .hv-both-icon { animation: hvIconPop .5s cubic-bezier(.34,1.56,.64,1); }
        @keyframes hvIconPop { 0% { transform: none; } 45% { transform: translateY(-6px) scale(1.12) rotate(-8deg); } 100% { transform: none; } }
        @media (prefers-reduced-motion: reduce) { .hv-both li { transition: none; } .hv-both li:hover { transform: none; } .hv-both li:hover .hv-both-icon { animation: none; } }
        .hv-both-icon { width: 42px; height: 42px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: #1f63d6; color: #fff; margin-bottom: 4px; }
        .hv-both strong { font-size: .95rem; font-weight: 800; letter-spacing: -0.02em; color: #111418; word-break: keep-all; }
        .hv-both small { font-size: .82rem; color: #6b7380; word-break: keep-all; }
        .hv-together { margin: 52px 0 0; font-size: clamp(1.15rem, 2.2vw, 1.4rem); font-weight: 700; letter-spacing: -0.02em; color: #3a414c; word-break: keep-all; }
        .hv-ch--b { color: #1f63d6; font-weight: 800; }
        /* 한 글자씩 — 글자마다 0.045초씩 늦게 나타난다 */
        .hv-ch { opacity: 0; transition: opacity .05s linear; transition-delay: calc(var(--i) * .045s); }
        .hv-together-wrap.is-in .hv-ch { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .hv-ch { opacity: 1; transition: none; } }

        @media (prefers-reduced-motion: reduce) {
          .hv-step, .hv-post { transition: none; }
          .hv-step { opacity: 1; transform: none; }
          .hv-card { opacity: 1; animation: none !important; }
          .hv-post { max-height: 40px; opacity: 1; }
          .hv-count-strip i { animation: none !important; transform: translateY(-300%); }
        }
      `}</style>
    </section>
  )
}
