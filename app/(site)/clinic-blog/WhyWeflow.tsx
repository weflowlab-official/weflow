import { ShieldCheck, Zap, ScanSearch, X, Check } from 'lucide-react'
import WwList from './WwList'

/**
 * 왜 WEFLOW? — WHY NOW 03(PHP 보안 뉴스) 바로 아래. 메뉴 '왜 WEFLOW?'(#why-weflow)가 여기로 온다.
 * 앞 섹션이 "PHP 는 위험하다는 뉴스"였다면, 여기는 "PHP 가 아니어도 지금 Next.js 로 리뉴얼해야 하는 이유"를 순위로 말한다:
 * 1 보안 → 2 속도 → 3 검색·AI 구조. 카드마다 '지금 홈페이지'와 'WEFLOW(Next.js)'를 한 줄씩 맞대어 보여 준다.
 *
 * 바로 위 SecurityNews 의 '옛 방식 vs WEFLOW' 비교(PHP 보안 이야기)는 그대로 두고, 여기는 보안에 더해 속도·검색까지 넓혀 말한다.
 * 문구 기준: 특정 회사 제품 이름을 쓰지 않는다. "절대 안전"·검색 순위를 약속하지 않는다 ("관리할 것이 줄어든다", "읽어 갈 정보가 함께 만들어진다").
 */

const REASONS = [
  {
    Icon: ShieldCheck,
    title: '보안',
    lead: '직접 챙길 서버와 프로그램이 없습니다',
    old: '서버·게시판 프로그램·플러그인의\n보안 업데이트를 사이트마다 직접\n챙겨야 합니다.',
    we: '미리 만들어 둔 페이지를 내보내는 구조라 공격받을 곳이 줄고, 업데이트는 운영관리에서 계속 챙깁니다.',
  },
  {
    Icon: Zap,
    title: '속도',
    lead: '미리 만든 페이지를 바로 보여 줍니다',
    old: '페이지를 열 때마다 서버가 화면을 새로 만들어, 접속이 몰리거나 기능이 늘수록 느려집니다.',
    we: '완성된 페이지를 가까운 서버망(CDN)에서 바로 보내, 휴대폰에서도 빠르게 열립니다.',
  },
  {
    Icon: ScanSearch,
    title: '검색·AI',
    lead: '검색엔진과 AI가 읽어 가기 좋은 구조',
    old: '진료 안내가 이미지로 되어 있거나,\n검색용 정보를 페이지마다 따로 넣어야 합니다.',
    we: '글자 중심으로 만들고, 사이트맵·구조화 데이터 같은 검색용 정보가 함께 만들어집니다.',
  },
]

export default function WhyWeflow() {
  return (
    <section id="why-weflow" className="ww" aria-labelledby="ww-title">
      <div className="cb-wrap ww-wrap">
        <p className="cb-chapter">WHY WEFLOW 02</p>
        <h2 id="ww-title" className="cb-h2 ww-h2">PHP가 아니어도,{'\n'}지금 <span className="cb-hl">Next.js로 리뉴얼</span>해야 하는 이유</h2>
        <p className="cb-body">
          홈페이지를 무엇으로 만들었는지가 <br className="cb-mo" />보안과 속도, 검색 노출을 가릅니다.
        </p>

        <WwList className="ww-list">
          {REASONS.map(({ Icon, title, lead, old, we }, i) => (
            <article key={title} className="ww-card" style={{ '--i': i } as React.CSSProperties}>
              {/* 아이콘과 제목을 한 줄에 — [아이콘] 보안 */}
              <h3><span className="ww-icon"><Icon size={22} /></span>{title}</h3>
              <p className="ww-lead">{lead}</p>
              <dl>
                <div className="ww-old">
                  <dt><X size={14} strokeWidth={3} /> 지금 홈페이지</dt>
                  <dd>{old}</dd>
                </div>
                <div className="ww-we">
                  <dt><Check size={14} strokeWidth={3} /> WEFLOW · Next.js</dt>
                  <dd>{we}</dd>
                </div>
              </dl>
            </article>
          ))}
        </WwList>

        <p className="ww-foot">어떤 기술도 &lsquo;절대 안전&rsquo;하지는 않습니다. <br className="cb-mo" />중요한 건 업데이트가 계속 챙겨지는 구조입니다.</p>
        <a href="/clinic-blog/check" target="_blank" rel="noopener noreferrer" className="ww-btn">
          <ScanSearch size={18} /> 우리 병원 사이트 점검하기
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
        .ww-card dl { margin: auto 0 0; display: grid; gap: 10px; }
        .ww-card dl > div { padding: 15px 16px; border-radius: 14px; background: #fff; }
        .ww-card dt { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; font-size: .84rem; font-weight: 800; }
        .ww-card dd { margin: 0; font-size: .95rem; line-height: 1.65; word-break: keep-all; white-space: pre-line; } /* pre-line — 문구에 넣은 줄바꿈(\\n)을 그대로 살린다 */
        .ww-old dt { color: #8a919c; }
        .ww-old dd { color: #6b7380; }
        .ww-we { box-shadow: inset 0 0 0 1.5px #cfe0fb; }
        .ww-we dt { color: var(--cb-accent); }
        .ww-we dd { color: var(--cb-text); font-weight: 600; }
        .ww-foot { margin: 30px 0 0; color: var(--cb-muted); font-size: .92rem; line-height: 1.7; word-break: keep-all; }
        .ww-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 22px; padding: 15px 26px; border-radius: 999px; background: var(--cb-text); color: #fff; font-weight: 700; font-size: 1.02rem; text-decoration: none; transition: background .15s; }
        .ww-btn:hover { background: var(--cb-accent); }
        /* 휴대폰 — 제목 둘째 줄('지금 Next.js로 리뉴얼해야 하는 이유')이 한 줄에 들어가게 글자를 화면 폭에 맞춰 줄인다 */
        /* .ww 를 앞에 붙여 세게 건다 — 공통 제목 규칙(.cb-h2)이 page.tsx 의 <style> 에 있어 이 <style> 보다 뒤에 오므로, 같은 세기면 그쪽이 이긴다 */
        @media (max-width: 767px) { .ww .ww-h2 { font-size: min(1.7rem, 5.6vw); } }
        /* 휴대폰 — 카드 세 장을 옆으로 넘기는 줄로. 카드 폭을 화면의 82%로 둬 다음 카드가 살짝 보이고(넘길 수 있다는 신호), 멈추면 카드가 가운데에 온다.
           차례로 돌아가며 강조하던 연출은 끄고, 지금 가운데에 와 있는 카드(WwList 가 is-on 을 붙인다)와 누르고 있는 카드를 강조한다.
           위아래 여백은 떠오른 카드와 그림자가 잘리지 않게 줄 안쪽에 둔다 */
        @media (max-width: 767px) {
          .ww-list { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; margin: 32px -20px 0; padding: 16px 20px 34px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .ww-list::-webkit-scrollbar { display: none; }
          .ww-card, .ww-list.is-in .ww-card { flex: 0 0 82%; scroll-snap-align: center; opacity: 1; transform: none; animation: none; transition: transform .3s ease, background-color .3s ease, border-color .3s ease, box-shadow .3s ease; transition-delay: 0s; }
          .ww-list .ww-card.is-on, .ww-list .ww-card:active { transform: translateY(-8px); background-color: #eef4fd; border-color: #a9c6f5; box-shadow: 0 18px 34px rgba(31,99,214,.16); }
          .ww-foot { margin-top: 4px; }
        }
        @media (prefers-reduced-motion: reduce) { .ww-card { opacity: 1; transform: none; transition: none; } .ww-list.is-in .ww-card { animation: none; } }
      `}</style>
    </section>
  )
}
