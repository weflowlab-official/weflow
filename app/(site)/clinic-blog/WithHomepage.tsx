import { Lock, PenLine, LayoutTemplate, Inbox } from 'lucide-react'
import InView from './InView'
import { WH_CLINIC, type WithHomepageCopy } from './homeCopy'

/**
 * '홈페이지와 함께하면' — 병의원 랜딩에서는 WHY NOW 02 뒤, '홈페이지 vs 웹블로그' 앞 (2026-11-25 에 WHY WEB BLOG 위로 올렸다).
 *
 * 위: 환자가 지나가는 길(검색 → 블로그 글 → 홈페이지 → 예약)을 네 칸으로 보여 준다.
 *     화면에 들어오면 칸이 차례로 켜지고 사이 선이 이어진다. 가운데 두 칸(블로그 글·홈페이지)은
 *     '한 사이트 안' 이라는 띠로 묶어, 밖으로 나가지 않는다는 걸 그림으로 말한다.
 * 아래: 함께 두면 좋은 점 네 장. 상품 카드(가격 안내)는 ClinicPlans.tsx 로 떼어 병의원 랜딩 위쪽으로 올렸다.
 * 헤더의 '홈페이지 결합' 메뉴가 여기(#with-homepage)로 온다.
 */


/**
 * 좋은 점 네 장 — 카드 위쪽에 그 말을 보여 주는 작은 화면 그림이 붙는다.
 * 묶음(.ch-gains)이 화면에 들어오면(.is-in) 그림이 움직인다: 주소가 바뀌고, 막대가 차오르고, 색이 맞춰지고, 문의 수가 뜬다.
 */
const GAINS = [
  { key: 'stay', title: '밖으로 나가지 않아요', desc: null },
  { key: 'grow', title: '홈페이지도 같이 강해져요', desc: <>같은 주소에 글이 쌓일수록 <br className="ch-mo" />홈페이지의 검색 신뢰도가 올라갑니다.</> },
  { key: 'brand', title: '', desc: <>블로그와 홈페이지가 한 디자인이라 <br className="ch-mo" />처음부터 끝까지 일관됩니다.</> },
  { key: 'admin', title: '관리 화면은 하나', desc: <>글쓰기, 홈페이지 수정, 문의 확인을 <br className="ch-mo" />한곳에서 합니다.</> },
] as const

/** 카드 위쪽 그림 */
function GainVisual({ kind, copy }: { kind: (typeof GAINS)[number]['key']; copy: WithHomepageCopy }) {
  if (kind === 'stay')
    return (
      // 주소창 — 뒷부분만 /blog/implant → /doctors 로 바뀌고, 앞의 우리병원.com 은 그대로
      <div className="gv gv-stay">
        <span className="gv-bar">
          <Lock size={12} />
          <b>{copy.domain}</b>/<span className="gv-path"><em>{copy.path[0]}</em><em>{copy.path[1]}</em></span>
        </span>
        <span className="gv-same">같은 사이트</span>
      </div>
    )
  if (kind === 'grow')
    return (
      // 글이 쌓일수록 올라가는 곡선 그래프 — 눈금선 · 월 표시 위로 선이 그려지고, 점이 차례로 찍히고, 끝에 말풍선이 뜬다
      <div className="gv gv-grow">
        <span className="gv-grow-label">검색 유입</span>
        <span className="gv-grow-tip">글 쌓일수록 ↗</span>
        <svg viewBox="0 0 300 110" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gvGrowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f63d6" stopOpacity=".2" />
              <stop offset="100%" stopColor="#1f63d6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[24, 50, 76].map(y => <line key={y} x1="20" x2="280" y1={y} y2={y} className="gv-grid" />)}
          <path className="gv-grow-area" d="M30,84 C38.0,82.7 62.0,78.7 78,76 C94.0,73.3 110.0,71.7 126,68 C142.0,64.3 158.0,58.7 174,54 C190.0,49.3 206.0,45.3 222,40 C238.0,34.7 262.0,25.0 270,22 L270,92 L30,92 Z" fill="url(#gvGrowFill)" />
          <path className="gv-grow-line" d="M30,84 C38.0,82.7 62.0,78.7 78,76 C94.0,73.3 110.0,71.7 126,68 C142.0,64.3 158.0,58.7 174,54 C190.0,49.3 206.0,45.3 222,40 C238.0,34.7 262.0,25.0 270,22" />
          {[[30, 84], [78, 76], [126, 68], [174, 54], [222, 40], [270, 22]].map(([x, y], i) => (
            <circle key={x} cx={x} cy={y} r={i === 5 ? 5 : 3.5} className={`gv-pt${i === 5 ? ' gv-pt-end' : ''}`} style={{ '--i': i } as React.CSSProperties} />
          ))}
          {['1월', '2월', '3월', '4월', '5월', '6월'].map((m, i) => (
            <text key={m} x={30 + i * 48} y="106" textAnchor="middle" className="gv-month">{m}</text>
          ))}
        </svg>
      </div>
    )
  if (kind === 'brand')
    return (
      // 블로그 · 홈페이지 두 장이 같은 색 · 같은 로고
      // 두 화면 머리 색이 함께 바뀐다 — 회색 → 파랑 → 민트 → 주황 → 파랑에서 멈춘다 (한 번만)
      <div className="gv gv-brand">
        <span className="gv-page"><i /><b>블로그</b><u /><u /></span>
        <span className="gv-eq">=</span>
        <span className="gv-page"><i /><b>홈페이지</b><u /><u /></span>
      </div>
    )
  return (
    // 관리자 화면 한 장에 세 가지 — 문의 숫자만 0 → 1 → 2 → 3 으로 올라간다 (한 번만)
    <div className="gv gv-admin">
      <span><PenLine size={14} /> 글쓰기</span>
      <span><LayoutTemplate size={14} /> 홈페이지 수정</span>
      <span><Inbox size={14} /> 문의 확인 <em><b className="gv-cnt"><i>0</i><i>1</i><i>2</i><i>3</i></b></em></span>
    </div>
  )
}

export default function WithHomepage({ copy = WH_CLINIC }: { copy?: WithHomepageCopy }) {
  return (
    <section id="with-homepage" className="ch">
      <div className="ch-inner">
        <p className="ch-eyebrow">WITH HOMEPAGE</p>
        <h2 className={`ch-title${copy.titleGold ? ' is-gold' : ''}`}>
          {copy.title[0]}<br />
          <span>{copy.title[1]}</span>
        </h2>
        <p className="ch-body">
          {copy.body}
        </p>

        <HomepageFlow copy={copy} />

        {/* 카드마다 따로 화면에 들어올 때 움직인다 — 묶음으로 한 번에 켜면 아래 카드는 내려가 볼 때 이미 끝나 있다 */}
        <div className="ch-gains">
          {GAINS.map(g => (
            <InView key={g.key} className="ch-gain">
              <GainVisual kind={g.key} copy={copy} />
              <strong>{g.title || copy.brandTitle}</strong>
              <p>{g.desc ?? copy.stayDesc}</p>
            </InView>
          ))}
        </div>
      </div>

      <style>{CH_FLOW_CSS + `
        .ch { background: #fff; padding: clamp(5rem, 10vw, 8.75rem) 20px; text-align: center; border-top: 1px solid #e9ebef; } /* 앞 섹션도 흰 바탕이라 선으로 나눈다 */
        .ch-inner { max-width: 1120px; margin: 0 auto; }
        .ch-mo { display: inline; }
        @media (min-width: 768px) { .ch-mo { display: none; } }
        .ch-eyebrow { margin: 0 0 16px; font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: #1f63d6; }
        .ch-title { margin: 0; font-size: clamp(1.7rem, 3.8vw, 2.5rem); line-height: 1.32; font-weight: 800; letter-spacing: -0.035em; color: #111418; }
        .ch-title span { color: #1f63d6; }
        /* 둘째 줄 금색 광택 (copy.titleGold) — '왜 WEFLOW?' 의 금색 글씨와 같은 색·움직임 */
        .ch-title.is-gold span { background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: chGoldLabel 2.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ch-title.is-gold span { animation: none; } }
        .ch-body { margin: 20px auto 0; max-width: 640px; color: #4b5360; font-size: 1.15rem; line-height: 1.8; }

        /* 좋은 점 넷 */
        .ch-gains { margin: 64px auto 0; max-width: 960px; display: grid; gap: 14px; text-align: left; }
        @media (min-width: 768px) { .ch-gains { grid-template-columns: 1fr 1fr; gap: 20px; } }
        .ch-gain { padding: 14px 14px 26px; border-radius: 24px; background: #f7f8fa; transition: transform .25s ease, box-shadow .25s ease; }
        .ch-gain:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(17,20,24,.07); }
        .ch-gain strong { display: block; margin: 20px 12px 6px; font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em; color: #111418; }
        .ch-gain p { margin: 0 12px; color: #4b5360; font-size: .97rem; line-height: 1.65; }

        /* 카드 위쪽 그림 칸 — 흰 바탕 둥근 칸 */
        .gv { position: relative; height: 128px; border-radius: 16px; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; }

        /* 밖으로 나가지 않아요 — 주소 뒷부분만 바뀐다 */
        .gv-stay { flex-direction: column; gap: 10px; }
        .gv-bar { display: inline-flex; align-items: center; padding: 10px 16px; border-radius: 999px; background: #f3f5f8; font-size: .92rem; color: #6b7380; white-space: nowrap; }
        .gv-bar svg { color: #12a37a; margin-right: 5px; }
        .gv-bar b { color: #1f63d6; }
        /* 주소 뒷부분 — 바뀌는 동안 칩 폭도 글자 길이에 맞춰 줄어든다 (앞 글자는 폭이 0으로, 뒷 글자는 0에서 제 폭으로) */
        .gv-path { display: inline-flex; color: #111418; font-weight: 700; }
        .gv-path em { display: inline-block; overflow: hidden; white-space: nowrap; font-style: normal; transition: max-width .5s cubic-bezier(.65,0,.35,1), opacity .35s ease; transition-delay: .8s; }
        .gv-path em:first-child { max-width: 8em; }
        .gv-path em + em { max-width: 0; opacity: 0; }
        .ch-gain.is-in .gv-path em:first-child { max-width: 0; opacity: 0; }
        .ch-gain.is-in .gv-path em + em { max-width: 5em; opacity: 1; }
        .gv-same { font-size: .78rem; font-weight: 700; color: #1f63d6; background: #eef4fe; padding: 4px 10px; border-radius: 999px; opacity: 0; transition: opacity .4s ease 1.3s; }
        .ch-gain.is-in .gv-same { opacity: 1; }

        /* 홈페이지도 같이 강해져요 — 막대가 차례로 차오른다 */
        .gv-grow svg { position: absolute; left: 10px; right: 10px; top: 26px; bottom: 6px; width: calc(100% - 20px); height: calc(100% - 32px); overflow: visible; }
        .gv-grid { stroke: #eef0f3; stroke-width: 1; stroke-dasharray: 3 4; }
        .gv-month { font-size: 9px; fill: #9aa1ac; font-weight: 600; }
        .gv-grow-line { fill: none; stroke: #1f63d6; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 320; stroke-dashoffset: 320; transition: stroke-dashoffset 1.4s cubic-bezier(.45,.05,.3,1) .2s; }
        .ch-gain.is-in .gv-grow-line { stroke-dashoffset: 0; }
        .gv-grow-area { opacity: 0; transition: opacity .7s ease 1.1s; }
        .ch-gain.is-in .gv-grow-area { opacity: 1; }
        /* 점 — 선이 지나가는 순서대로 톡톡 찍힌다. 마지막 점은 크고 빛무리가 있다 */
        .gv-pt { fill: #fff; stroke: #1f63d6; stroke-width: 2; transform-box: fill-box; transform-origin: center; transform: scale(0); transition: transform .35s cubic-bezier(.34,1.56,.64,1); transition-delay: calc(.3s + var(--i) * .22s); }
        .gv-pt-end { fill: #1f63d6; stroke: #cfe0fb; stroke-width: 4; }
        .ch-gain.is-in .gv-pt { transform: scale(1); }
        .gv-grow-tip { position: absolute; top: 12px; right: 14px; padding: 4px 10px; border-radius: 999px; background: #1f63d6; color: #fff; font-size: .74rem; font-weight: 700; opacity: 0; transform: translateY(6px); transition: opacity .4s ease 1.6s, transform .4s ease 1.6s; }
        .ch-gain.is-in .gv-grow-tip { opacity: 1; transform: none; }
        .gv-grow-label { position: absolute; top: 14px; left: 16px; font-size: .78rem; font-weight: 700; color: #8a919c; }

        /* 병원 이미지가 이어져요 — 두 장이 같은 색으로 맞춰진다 */
        .gv-brand { gap: 14px; }
        .gv-page { width: 92px; height: 88px; border-radius: 12px; border: 1px solid #e6ebf2; padding: 10px; display: grid; align-content: start; gap: 6px; background: #fff; }
        .gv-page i { height: 22px; border-radius: 6px; background: #e3e7ed; }
        .ch-gain.is-in .gv-page i { animation: gvTheme 3.2s ease-in-out .3s both; }
        @keyframes gvTheme {
          0% { background: #e3e7ed; }
          20%, 35% { background: #4f8ded; }
          45%, 60% { background: #3fb393; }
          70%, 85% { background: #f2a65a; }
          100% { background: #4f8ded; }
        }
        .gv-page b { font-size: .72rem; color: #111418; text-align: center; }
        .gv-page u { display: block; height: 5px; border-radius: 999px; background: #eceef1; }
        .gv-eq { font-size: 1.3rem; font-weight: 800; color: #b4bac4; }
        .gv-eq { transition: color .4s ease .9s; }
        .ch-gain.is-in .gv-eq { color: #1f63d6; }

        /* 관리 화면은 하나 — 세 줄이 한 화면에, 문의 수가 톡 뜬다 */
        .gv-admin { flex-direction: column; align-items: stretch; justify-content: center; gap: 6px; padding: 0 28px; }
        .gv-admin span { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; background: #f7f8fa; font-size: .85rem; font-weight: 700; color: #3a414c; }
        .gv-admin svg { color: #1f63d6; }
        /* 문의 숫자 — 0 1 2 3 이 세로로 쌓인 띠를 한 칸씩 올려 3에서 멈춘다 */
        .gv-admin em { margin-left: auto; width: 22px; height: 22px; padding: 0; border-radius: 50%; background: #e05252; color: #fff; font-style: normal; font-size: .75rem; overflow: hidden; display: block; }
        /* 숫자마다 폭이 달라(1 은 좁다) 한쪽으로 쏠려 보이지 않게 — 같은 폭 숫자 + 칸 가운데 정렬 */
        .gv-cnt { display: flex; flex-direction: column; width: 100%; font-weight: 800; font-variant-numeric: tabular-nums; }
        .gv-cnt i { display: block; height: 22px; line-height: 22px; text-align: center; font-style: normal; }
        /* 숫자가 한 칸씩 위로 굴러 올라간다 — 칸마다 미끄러져 넘어가고 잠깐 멈춘다 */
        .ch-gain.is-in .gv-cnt { animation: gvCount 1.8s cubic-bezier(.45,.05,.3,1) .5s both; }
        @keyframes gvCount { 0%, 12% { transform: translateY(0); } 28%, 40% { transform: translateY(-22px); } 56%, 68% { transform: translateY(-44px); } 84%, 100% { transform: translateY(-66px); } }

        @media (prefers-reduced-motion: reduce) {
          .ch-steps li, .ch-node, .ch-site, .ch-steps li::after, .ch-gain, .gv * { transition: none !important; animation: none !important; }
          .gv-cnt { transform: translateY(-66px); }
          .gv-page i { background: #4f8ded; }
        }
      `}</style>
    </section>
  )
}

/**
 * 손님이 지나가는 길(검색 → 블로그 글 → 홈페이지 → 상담) 네 칸만 — 웹블로그(/blog) 메인 '웹블로그란?' 섹션도 이것만 가져다 쓴다.
 * 모양은 CH_FLOW_CSS (쓰는 쪽이 <style> 에 넣는다).
 */
export function HomepageFlow({ copy }: { copy: WithHomepageCopy }) {
  // 칸이 차례로 켜지고, 가운데 두 칸은 '한 사이트 안' 띠로 묶인다
  return (
    <InView className={`ch-flow${copy.titleGold ? ' is-gold' : ''}`}>
      <div className="ch-site" aria-hidden="true"><span>{copy.domain} 한 사이트 안</span></div>
      <ol className="ch-steps">
        {copy.steps.map(({ Icon, ...s }, i) => (
          <li key={s.label} style={{ '--i': i } as React.CSSProperties}>
            <span className="ch-node"><Icon size={24} /></span>
            <strong>{s.label}</strong>
            <small>{s.sub}</small>
          </li>
        ))}
      </ol>
    </InView>
  )
}

export const CH_FLOW_CSS = `
        /* 환자가 지나가는 길 */
        .ch-flow { position: relative; max-width: 960px; margin: 84px auto 0; }
        .ch-steps { position: relative; list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
        /* align-content: start — 설명이 두 줄인 칸(홈페이지)만 아이콘·이름이 위로 떠 보이지 않게, 네 칸 모두 위에서부터 같은 선으로 쌓는다 */
        .ch-steps li { position: relative; display: grid; align-content: start; justify-items: center; gap: 6px; opacity: .35; transition: opacity .4s ease; transition-delay: calc(var(--i) * .45s); }
        .ch-flow.is-in .ch-steps li { opacity: 1; }
        .ch-node { position: relative; z-index: 1; width: 64px; height: 64px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; background: #f3f5f8; color: #8a919c; margin-bottom: 8px; transition: background .4s ease, color .4s ease, box-shadow .4s ease; transition-delay: calc(var(--i) * .45s); }
        .ch-flow.is-in .ch-node { background: #1f63d6; color: #fff; box-shadow: 0 12px 28px rgba(31,99,214,.25); }
        .ch-steps strong { font-size: 1.1rem; font-weight: 800; color: #111418; }
        .ch-steps small { font-size: .9rem; color: #6b7380; }
        /* 가운데 두 칸(웹블로그 · 홈페이지)의 이름을 금색 광택으로 (copy.titleGold) — '한 사이트 안' 테두리 · 이름표와 한 묶음으로 보이게 */
        .ch-flow.is-gold .ch-steps li:nth-child(2) strong, .ch-flow.is-gold .ch-steps li:nth-child(3) strong { background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: chGoldLabel 2.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ch-flow.is-gold .ch-steps strong { animation: none; } }
        /* 그 두 칸은 아이콘 그림도 금색 — 바탕은 파란색 그대로 두고 안의 그림만. 파란 바탕 위라 밝은 금색을 쓴다 */
        .ch-flow.is-gold.is-in .ch-steps li:nth-child(2) .ch-node, .ch-flow.is-gold.is-in .ch-steps li:nth-child(3) .ch-node { color: #ecd49c; }
        /* 칸 사이 선 — 앞 칸이 켜진 뒤 다음 칸 쪽으로 그어진다 */
        .ch-steps li:not(:last-child)::after { content: ''; position: absolute; background: #1f63d6; transform-origin: left top; transition: transform .45s ease; transition-delay: calc(var(--i) * .45s + .2s); }
        .ch-steps li:not(:last-child)::after { top: 32px; left: calc(50% + 40px); width: calc(100% - 80px); height: 2px; transform: scaleX(0); }
        .ch-flow.is-in .ch-steps li:not(:last-child)::after { transform: scaleX(1); }
        /* '한 사이트 안' 띠 — 가운데 두 칸(블로그 글·홈페이지)을 감싼다 */
        /* 테두리는 금색 광택 — '왜 WEFLOW?' 의 금색 글씨와 같은 색이 테두리를 따라 흐른다. 테두리에 직접 그라데이션을 줄 수 없어, 안쪽 바탕(padding-box)과 테두리 바탕(border-box)을 겹쳐 그린다 */
        .ch-site { position: absolute; border: 2px solid transparent; border-radius: 26px; background: linear-gradient(#f5f9ff, #f5f9ff) padding-box, linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%) border-box; background-size: auto, 250% auto; animation: chGoldSheen 2.8s linear infinite; opacity: 0; transition: opacity .5s ease 1.6s; }
        @keyframes chGoldSheen { from { background-position: 0 0, 250% center; } to { background-position: 0 0, 0% center; } }
        @media (prefers-reduced-motion: reduce) { .ch-site { animation: none; } }
        .ch-flow.is-in .ch-site { opacity: 1; }
        .ch-site span { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 4px 12px; border-radius: 999px; background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #d9b876 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; animation: chGoldLabel 2.8s linear infinite; color: #fff; font-size: .78rem; font-weight: 700; } /* 이름표도 테두리와 같은 금색 광택 — 흰 글씨가 읽히게 가장 밝은 자리만 조금 덜 밝게 */
        @keyframes chGoldLabel { from { background-position: 250% center; } to { background-position: 0% center; } }
        @media (prefers-reduced-motion: reduce) { .ch-site span { animation: none; } }
        .ch-site { top: -34px; bottom: -18px; left: 25%; right: 25%; } /* 윗변을 넉넉히 올려 이름표와 아이콘 사이를 띄운다 */
        .ch-site span { top: -13px; }
        /* 휴대폰 — 세로로 쌓지 않고 PC 처럼 가로 네 칸을 작게. 길게 늘어지지 않고 '한 사이트 안' 띠도 그대로 보인다 */
        @media (max-width: 767px) {
          .ch-flow { margin-top: 56px; }
          .ch-gains { margin-top: 48px; }
          .ch-node { width: 46px; height: 46px; border-radius: 14px; margin-bottom: 4px; }
          .ch-node svg { width: 20px; height: 20px; }
          .ch-steps li { gap: 3px; padding: 0 2px; }
          .ch-steps strong { font-size: .86rem; }
          .ch-steps small { font-size: .7rem; line-height: 1.4; word-break: keep-all; }
          .ch-steps li:not(:last-child)::after { top: 23px; left: calc(50% + 28px); width: calc(100% - 56px); }
          .ch-site { top: -30px; bottom: -12px; border-radius: 18px; }
          .ch-site span { top: -11px; font-size: .66rem; padding: 3px 9px; }
        }
`
