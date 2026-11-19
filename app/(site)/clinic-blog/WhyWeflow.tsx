import { ShieldCheck, Zap, ScanSearch, X, Check } from 'lucide-react'
import WwList from './WwList'

/**
 * 왜 WEFLOW? — WHY NOW 03(PHP 보안 뉴스) 바로 아래. 메뉴 '왜 WEFLOW?'(#why-weflow)가 여기로 온다.
 * 앞 섹션이 "PHP 는 위험하다는 뉴스"였다면, 여기는 "PHP 가 아니어도 지금 Next.js 로 리뉴얼해야 하는 이유"를 순위로 말한다:
 * 1 보안 → 2 검색·AI 구조(SEO·AEO·GEO) → 3 속도. 카드마다 '지금 홈페이지'와 'WEFLOW(Next.js)'를 한 줄씩 맞대어 보여 준다.
 *
 * 바로 위 SecurityNews 의 '옛 방식 vs WEFLOW' 비교(PHP 보안 이야기)는 그대로 두고, 여기는 보안에 더해 속도·검색까지 넓혀 말한다.
 * 문구 기준: 특정 회사 제품 이름을 쓰지 않는다. "절대 안전"·검색 순위를 약속하지 않는다 ("관리할 것이 줄어든다", "읽어 갈 정보가 함께 만들어진다").
 */

/** 금색 광택 글씨 — 카드마다 타이틀·설명에서 가장 중요한 말 한 군데씩 (모양은 아래 .ww-gold) */
const G = ({ children }: { children: React.ReactNode }) => <em className="ww-gold">{children}</em>

// why: 병원에 왜 중요한지 — 환자 이야기로 한두 문장 (한 줄 요약 아래 회색 글).
// oldM · weM: 휴대폰용 — 같은 문장을 세 줄로 끊어 둔 것. 옆으로 넘기는 카드라 상자마다 줄 수가 다르면 들쭉날쭉해 보여서, 여섯 상자 모두 세 줄로 맞춘다.
// 문장을 고치면 둘 다 고친다. 한 줄이 너무 길면(한글 17자 안팎) 좁은 폰에서 네 줄로 넘어간다.
/** 카드 세 장 — general 이면 전 업종용 말(고객 · 회사)로, 아니면 병의원용 말(환자 · 병원)로 */
function reasons(general: boolean) {
  const P = general ? '고객' : '환자' // 누가 찾아오나
  const H = general ? '회사' : '병원' // 누구의 홈페이지인가
  return [
    {
      Icon: ShieldCheck,
      title: '보안',
      lead: <><G>우리 {P} 정보가 유출</G>될 수 있습니다</>,
      why: <>{H} 홈페이지는 보안이 생명입니다.{'\n'}관리가 멈춘 홈페이지는 {P} 정보가{'\n'}새어 나갈 수 있어, 리뉴얼이 필요합니다.</>,
      old: '서버·게시판 프로그램·플러그인의\n보안 업데이트를 사이트마다 직접\n챙겨야 합니다.',
      we: '미리 만들어 둔 페이지를 내보내는 구조라 공격받을 곳이 줄고, 업데이트는 운영관리에서 계속 챙깁니다.',
      oldM: '서버·게시판 프로그램·플러그인의\n보안 업데이트를 사이트마다 직접\n챙겨야 합니다.',
      weM: '미리 만들어 둔 페이지를 내보내는\n구조라 공격받을 곳이 줄고, 업데이트는\n운영관리에서 계속 챙깁니다.',
    },
    {
      Icon: ScanSearch,
      title: '검색·AI',
      lead: <><G>네이버·구글 등 AI에 노출</G>되는 구조 설계</>,
      why: general
        ? <>고객은 궁금한 것을 먼저 검색합니다.{'\n'}SEO·AEO·GEO에 맞춰 설계해야{'\n'}그 검색에 우리 회사 글이 닿습니다.</>
        : <>환자는 증상과 치료법을 먼저 검색합니다.{'\n'}SEO·AEO·GEO에 맞춰 설계해야{'\n'}그 검색에 우리 병원 글이 닿습니다.</>,
      old: `${general ? '서비스' : '진료'} 안내가 이미지로 되어 있거나,\n검색용 정보를 페이지마다 따로 넣어야 합니다.`,
      we: '글자 중심으로 만들고, 사이트맵·구조화 데이터 같은 검색용 정보가 함께 만들어집니다.',
      oldM: `${general ? '서비스' : '진료'} 안내가 이미지로 되어 있거나,\n검색용 정보를 페이지마다\n따로 넣어야 합니다.`,
      weM: '글자 중심으로 만들고,\n사이트맵·구조화 데이터 같은\n검색용 정보가 함께 만들어집니다.',
    },
    {
      Icon: Zap,
      title: '속도',
      lead: <>미리 만든 페이지를 <G>바로 보여 줍니다</G></>,
      why: <>{P}{general ? '은' : '는'} 느린 화면을 기다려 주지 않습니다.{'\n'}페이지가 열리기도 전에 뒤로 가기를 누르고 다른 {general ? '업체' : '병원'}로 넘어갑니다.</>,
      old: '페이지를 열 때마다 서버가 화면을 새로 만들어, 접속이 몰리거나 기능이 늘수록 느려집니다.',
      we: '완성된 페이지를 가까운 서버망(CDN)에서 바로 보내, 휴대폰에서도 빠르게 열립니다.',
      oldM: '페이지를 열 때마다 서버가 화면을\n새로 만들어, 접속이 몰리거나\n기능이 늘수록 느려집니다.',
      weM: '완성된 페이지를 가까운\n서버망(CDN)에서 바로 보내,\n휴대폰에서도 빠르게 열립니다.',
    },
  ]
}

/** general: 전 업종용(웹블로그 메인 /blog) — 제목 · 카드 문구 · 아래 버튼을 병의원 말 대신 일반 말로 바꾼다 */
export default function WhyWeflow({ general = false }: { general?: boolean }) {
  const REASONS = reasons(general)
  return (
    <section id="why-weflow" className="ww" aria-labelledby="ww-title">
      <div className="cb-wrap ww-wrap">
        <p className="cb-chapter">WHY WEFLOW 02</p>
        <h2 id="ww-title" className="cb-h2 ww-h2">{general ? '우리 웹블로그,' : '병의원이라면,'} <br className="cb-mo" /><span className="cb-hl">WEFLOW</span>여야만 하는 이유</h2>
        <p className="cb-body">
          홈페이지를 무엇으로 만들었는지가 <br className="cb-mo" />보안과 속도, 검색 노출을 가릅니다.
        </p>

        <WwList className="ww-list">
          {REASONS.map(({ Icon, title, lead, why, old, we, oldM, weM }, i) => (
            <article key={title} className="ww-card" style={{ '--i': i } as React.CSSProperties}>
              {/* 아이콘과 제목을 한 줄에 — [아이콘] 보안 */}
              <h3><span className="ww-icon"><Icon size={22} /></span>{title}</h3>
              <p className="ww-lead">{lead}</p>
              <p className="ww-why">{why}</p>
              <dl>
                <div className="ww-old">
                  <dt><X size={14} strokeWidth={3} /> 지금 홈페이지</dt>
                  <dd><span className="ww-wide">{old}</span><span className="ww-narrow">{oldM}</span></dd>
                </div>
                <div className="ww-we">
                  <dt><Check size={14} strokeWidth={3} /> WEFLOW · Next.js</dt>
                  <dd><span className="ww-wide">{we}</span><span className="ww-narrow">{weM}</span></dd>
                </div>
              </dl>
            </article>
          ))}
        </WwList>

        <p className="ww-foot">어떤 기술도 &lsquo;절대 안전&rsquo;하지는 않습니다. <br className="cb-mo" />중요한 건 업데이트가 계속 챙겨지는 구조입니다.</p>
        <a href={general ? '/check' : '/clinic-blog/check'} target="_blank" rel="noopener noreferrer" className="ww-btn">
          <ScanSearch size={18} /> {general ? '우리 사이트 점검하기' : '우리 병원 사이트 진단하기'}
        </a>
      </div>

      <style>{`
        .ww { padding: 96px 0; text-align: center; background: #fff; }
        @media (min-width: 960px) { .ww { padding: 140px 0; } }
        .ww-wrap { max-width: 1200px; }
        .ww-list { display: grid; gap: 16px; margin-top: 48px; text-align: left; }
        @media (min-width: 900px) { .ww-list { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; } }
        /* 화면에 들어오면 1 → 2 → 3 순위 차례로 올라온다 (InView 가 is-in 을 붙인다) */
        .ww-card { position: relative; display: flex; flex-direction: column; padding: 30px 26px 26px; border-radius: 24px; background: var(--cb-soft); border: 1.5px solid transparent; opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; transition-delay: calc(var(--i) * .14s); }
        .ww-list.is-in .ww-card { opacity: 1; transform: none; }
        /* 포커스 — 차례가 된 카드가 살짝 떠오르며 옅은 파랑 바탕·파란 테두리·그림자가 생긴다. 1 → 2 → 3 차례로 한 장씩.
           세 카드가 7.2초에 한 바퀴(카드마다 2.4초). 화면에 들어온 뒤(is-in), 카드가 올라오는 연출이 끝난 다음 시작한다 */
        .ww-list.is-in .ww-card { animation: wwFocus 7.2s ease-in-out infinite; animation-delay: calc(.9s + var(--i) * 2.4s); }
        @keyframes wwFocus {
          0% { transform: none; background-color: #f7f8fa; border-color: transparent; box-shadow: 0 0 0 rgba(31,99,214,0); }
          7% { transform: translateY(-8px); background-color: #eef4fd; border-color: #a9c6f5; box-shadow: 0 22px 44px rgba(31,99,214,.16); }
          27% { transform: translateY(-8px); background-color: #eef4fd; border-color: #a9c6f5; box-shadow: 0 22px 44px rgba(31,99,214,.16); }
          33.3% { transform: none; background-color: #f7f8fa; border-color: transparent; box-shadow: 0 0 0 rgba(31,99,214,0); }
          100% { transform: none; background-color: #f7f8fa; border-color: transparent; box-shadow: 0 0 0 rgba(31,99,214,0); }
        }
        /* 아이콘 — 배경 없이 파란 선만. 제목 글자 높이에 맞춘 크기 (흰 네모 배경은 제목보다 먼저 눈에 띄어 뺐다) */
        .ww-icon { flex: none; display: inline-flex; color: var(--cb-accent); }
        .ww-icon svg { width: 27px; height: 27px; }
        .ww-card h3 { display: flex; align-items: center; gap: 8px; margin: 0 0 14px; font-size: 1.7rem; font-weight: 800; letter-spacing: -0.03em; }
        .ww-lead { margin: 0 0 22px; color: var(--cb-text); font-size: 1.04rem; font-weight: 700; line-height: 1.5; letter-spacing: -0.02em; word-break: keep-all; }
        .ww-lead:has(+ .ww-why) { margin-bottom: 8px; }
        .ww-why { margin: 0 0 22px; color: var(--cb-sub); font-size: .95rem; line-height: 1.65; word-break: keep-all; white-space: pre-line; } /* pre-line — 문구에 넣은 줄바꿈을 살린다 */
        /* 금색 광택 — 헤더 '왜 WEFLOW?' 메뉴와 같은 흰 바탕용 중간 톤 금색, 빛이 왼쪽에서 오른쪽으로 흐른다.
           움직임은 사이트 공통 cGoldSheen 과 같은 값을 여기 따로 둔다 — 웹블로그 메인(/blog)은 사이트 공통 CSS 를 싣지 않는다 */
        .ww-gold { font-style: normal; font-weight: 800; background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: wwGoldSheen 2.8s linear infinite; }
        @keyframes wwGoldSheen { from { background-position: 250% center; } to { background-position: 0% center; } }
        @media (prefers-reduced-motion: reduce) { .ww-gold { animation: none; } }
        .ww-card dl { margin: auto 0 0; display: grid; gap: 10px; }
        .ww-card dl > div { padding: 15px 16px; border-radius: 14px; background: #fff; }
        .ww-card dt { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; font-size: .84rem; font-weight: 800; }
        .ww-card dd { margin: 0; font-size: .95rem; line-height: 1.65; word-break: keep-all; white-space: pre-line; } /* pre-line — 문구에 넣은 줄바꿈(\\n)을 그대로 살린다 */
        .ww-narrow { display: none; }
        .ww-old dt { color: #f87171; } /* 윗 섹션(SecurityNews) '옛 방식' X 표시와 같은 붉은색 */
        .ww-old dd { color: #555d69; }
        .ww-we { box-shadow: inset 0 0 0 1.5px #cfe0fb; }
        .ww-we dt { color: var(--cb-accent); }
        .ww-we dd { color: var(--cb-text); font-weight: 600; }
        .ww-foot { margin: 30px 0 0; color: var(--cb-muted); font-size: .92rem; line-height: 1.7; word-break: keep-all; }
        .ww-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 22px; padding: 15px 26px; border-radius: 999px; background: var(--cb-text); color: #fff; font-weight: 700; font-size: 1.02rem; text-decoration: none; transition: background .15s; }
        .ww-btn:hover { background: var(--cb-accent); }
        /* 제목 안 형광펜 부분(WEFLOW)은 공통 규칙이 한 단계 가늘게(700) 잡는다 — 이 제목은 나머지 글자와 같은 굵기(800)로 맞춘다.
           .ww 를 앞에 붙여 세게 건다 — 공통 규칙이 page.tsx 쪽 스타일에 있어 이 파일의 것보다 뒤에 오므로, 같은 세기면 그쪽이 이긴다.
           (이 CSS 글 안에는 꺾쇠로 감싼 태그 이름을 적지 않는다 — 서버가 그 글자를 바꿔 내보내 브라우저와 어긋나고 하이드레이션 오류가 난다) */
        .ww .ww-h2 .cb-hl { font-weight: inherit; }
        /* 휴대폰 — 카드 세 장을 옆으로 넘기는 줄로. 카드 폭을 화면의 82%로 둬 다음 카드가 살짝 보이고(넘길 수 있다는 신호), 멈추면 카드가 가운데에 온다.
           차례로 돌아가며 강조하던 연출은 끄고, 지금 가운데에 와 있는 카드(WwList 가 is-on 을 붙인다)와 누르고 있는 카드를 강조한다.
           위아래 여백은 떠오른 카드와 그림자가 잘리지 않게 줄 안쪽에 둔다 */
        @media (max-width: 767px) {
          .ww-list { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 32px -20px 0; padding: 16px 20px 34px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .ww-list::-webkit-scrollbar { display: none; }
          /* 휴대폰에서만 순서를 검색·AI → 보안 → 속도로 — 둘째 카드(검색·AI)를 맨 앞으로 보낸다. 넓은 화면은 적힌 순서(보안 → 검색·AI → 속도) 그대로 */
          .ww-card:nth-child(2) { order: -1; }
          .ww-card, .ww-list.is-in .ww-card { flex: 0 0 min(82vw, 340px); padding: 30px min(5vw, 20.75px) 26px; scroll-snap-align: center; opacity: 1; transform: none; animation: none; transition: transform .3s ease, background-color .3s ease, border-color .3s ease, box-shadow .3s ease; transition-delay: 0s; }
          .ww-list .ww-card.is-on, .ww-list .ww-card:active { transform: translateY(-8px); background-color: #eef4fd; border-color: #a9c6f5; box-shadow: 0 18px 34px rgba(31,99,214,.16); }
          /* 카드 한 줄 요약이 한 줄에 들어가게 — 카드 폭이 화면을 따라가므로 글자도 화면 폭에 맞춰 줄인다.
             가장 긴 '네이버·구글 등 AI에 노출되는 구조 설계'(한글 18자쯤)가 들어가는 크기 */
          .ww-lead { font-size: min(1.04rem, 4vw); white-space: nowrap; }
          /* 상자 안 글 — 세 줄로 끊어 둔 휴대폰용 문장을 쓴다. 끊은 자리에서만 줄이 바뀌도록 카드 폭 · 안쪽 여백 · 글자 크기를 모두 화면 폭에 비례하게 잡는다
             (한 줄에 한글 18자쯤 들어간다. 화면이 415px 을 넘으면 셋 다 같은 지점에서 멈춰 비율이 그대로다) */
          .ww-why { font-size: min(3.6vw, 15px); margin-bottom: 18px; } /* 첫 문장이 한 줄에 들어가는 크기 */
          .ww-wide { display: none; }
          .ww-narrow { display: inline; }
          .ww-card dl > div { padding: 15px min(3.6vw, 15px); }
          .ww-card dd { font-size: min(3.8vw, 15.8px); }
          .ww-foot { margin-top: 4px; }
        }
        @media (prefers-reduced-motion: reduce) { .ww-card { opacity: 1; transform: none; transition: none; } .ww-list.is-in .ww-card { animation: none; } }
      `}</style>
    </section>
  )
}
