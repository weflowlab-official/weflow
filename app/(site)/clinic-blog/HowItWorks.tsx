import { PenLine, Settings2, Globe, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react'
import InView from './InView'

/**
 * 등록 구조 — "글만 쓰면, 네이버·구글에 자리 잡고 AI까지 읽어 가는 구조" (웹블로그란 다음 — 히어로의 약속을 어떻게 지키는지).
 * 웹블로그 메인(/blog)의 HOW IT WORKS(blog/components/home/HowItWorksSection.tsx)를 이 페이지 디자인으로 옮긴 것.
 * 위: 4단계(글 작성 → 자동 생성 → 네이버·구글 수집 → 검색·AI 답변 노출 기회) / 아래: SEO·AEO·GEO 카드 3장.
 * 문구 기준: 순위·노출을 약속하지 않는다 ("자리 잡는 구조", "노출 기회").
 */

const STEPS = [
  { Icon: PenLine, title: '글 작성', text: '관리자 페이지에서\n제목·본문·자주 묻는 질문만 채웁니다.' },
  { Icon: Settings2, title: '자동으로 함께 생성', text: '사이트맵·구조화 데이터·요약이\n글과 함께 저절로\n만들어집니다.' },
  { Icon: Globe, title: '네이버·구글이 수집', text: '서치어드바이저·서치콘솔에 등록된 사이트를\n검색엔진이 읽어 갑니다.' },
  { Icon: Sparkles, title: '검색·AI 답변에 노출 기회', text: '검색 결과와 AI 답변의 출처로\n우리 병원 글이 쓰일 기회가 생깁니다.' },
]

const OPTIMIZE = [
  { tag: 'SEO', name: '검색 노출', desc: '네이버·구글 검색 결과에 잘 보이게', auto: ['환자가 쓰는 말로 짓는 제목·소제목', '새 글마다 사이트맵 자동 갱신', '모바일에서도 빠른 로딩'] },
  { tag: 'AEO', name: '답변 노출', desc: "질문에 대한 '답'으로 뽑히게", auto: ['글 맨 위 핵심 요약', '글마다 자주 묻는 질문', 'FAQ 구조화 데이터 자동 생성'] },
  { tag: 'GEO', name: 'AI 답변 인용', desc: 'AI가 답할 때 인용하게', auto: ['AI가 읽기 좋은 글자 중심 구조', '작성자·발행일·출처 정보', 'AI 검색 로봇이 읽을 수 있게 공개'] },
]

export default function HowItWorks() {
  return (
    <section id="how" className="chw" aria-labelledby="chw-title">
      <div className="cb-wrap chw-wrap">
        <p className="cb-chapter">HOW IT WORKS</p>
        <h2 id="chw-title" className="cb-h2">글만 쓰면, 네이버·구글에 자리 잡고{'\n'}AI까지 읽어 가는 구조</h2>
        <p className="cb-body">
          웹블로그는 Next.js로 만듭니다.<br className="cb-mo" /> 글을 올리는 순간,<br className="cb-pc" />
          검색엔진과 AI가 읽는 정보가 함께 만들어져 <span className="cb-hl">SEO·AEO·GEO에 맞춰집니다.</span>
        </p>

        {/* 4단계 — 카드 사이에 화살표 칸을 따로 둔다. 화면에 들어오면 차례로 올라온다 */}
        <InView className="chw-steps">
          {STEPS.map(({ Icon, title, text }, i) => (
            <div key={title} className="chw-step-wrap" style={{ '--i': i } as React.CSSProperties}>
              <div className="chw-step">
                <span className="chw-icon"><Icon size={22} /><b>{i + 1}</b></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && <span className="chw-arrow" aria-hidden="true"><ArrowRight size={20} /></span>}
            </div>
          ))}
        </InView>

        {/* SEO · AEO · GEO */}
        <div className="chw-opt">
          {OPTIMIZE.map(o => (
            <div key={o.tag} className="chw-card">
              <p className="chw-tag"><b>{o.tag}</b>{o.name}</p>
              <p className="chw-desc">{o.desc}</p>
              <p className="chw-auto">웹블로그가 자동으로 해 두는 것</p>
              <ul>
                {o.auto.map(a => <li key={a}>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="chw-note">검색 순위와 AI 인용 여부는 각 검색엔진·AI 서비스가 정합니다.<br className="cb-mo" /> 웹블로그는 그 기회를 넓히는 구조를 만듭니다.</p>

        {/* 실제로 돌아가는 견본 — WEFLOW 가 운영하는 웹블로그(/blog). 이 페이지를 떠나지 않게 새 탭으로 연다 */}
        <div className="chw-demo">
          <div className="chw-demo-text">
            <p className="chw-demo-tag">LIVE DEMO</p>
            <p className="chw-demo-title">
              핵심 요약·자주 묻는 질문·구조화 데이터가 들어간 글을<br className="cb-pc" />
              <b> WEFLOW 웹블로그</b>에서<br className="cb-mo" /> 직접 확인해 보세요.
            </p>
          </div>
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="chw-demo-btn">
            실제 웹블로그 보기 <ArrowUpRight size={20} />
          </a>
        </div>
      </div>

      <style>{`
        /* 앞(웹블로그란)·뒤(홈페이지 vs 웹블로그)가 흰 바탕이라 연한 회색으로 나눈다 */
        .chw { padding: 96px 0; text-align: center; background: var(--cb-soft); }
        @media (min-width: 960px) { .chw { padding: 140px 0; } }
        /* 이 섹션만 본문(1080px)보다 넓게 — 4단계 카드가 한 줄에 들어가게 */
        .chw-wrap { max-width: 1320px; }
        .chw .cb-body { font-size: 1.15rem; }

        .chw-steps { display: grid; gap: 12px; margin: 48px auto 0; text-align: left; }
        .chw-step-wrap { opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; transition-delay: calc(var(--i) * .15s); }
        .chw-steps.is-in .chw-step-wrap { opacity: 1; transform: none; }
        .chw-step { display: flex; gap: 16px; height: 100%; padding: 20px; border: 1px solid var(--cb-line); border-radius: 16px; background: #fff; }
        .chw-icon { position: relative; flex: none; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; background: #e8f0fc; color: var(--cb-accent); }
        .chw-icon b { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: var(--cb-accent); color: #fff; font-size: .7rem; display: flex; align-items: center; justify-content: center; }
        .chw-step h3 { margin: 0; font-size: 1.08rem; font-weight: 800; }
        .chw-step p { margin: 4px 0 0; font-size: .92rem; line-height: 1.65; color: var(--cb-sub); }
        .chw-arrow { display: none; }
        @media (min-width: 960px) {
          /* 카드 사이 40px 간격 위에 화살표를 띄운다. 화살표를 카드 칸 안에 두면 화살표 없는 마지막 칸만 넓어졌다 */
          .chw-steps { display: flex; align-items: stretch; gap: 40px; margin-top: 64px; }
          .chw-step-wrap { position: relative; display: flex; flex: 1 1 0; min-width: 0; }
          .chw-step { flex: 1 1 0; min-width: 0; flex-direction: column; gap: 16px; padding: 22px; }
          .chw-step p { white-space: pre-line; }
          .chw-arrow { position: absolute; top: 50%; right: -40px; width: 40px; display: flex; align-items: center; justify-content: center; transform: translateY(-50%); color: var(--cb-accent); }
        }

        .chw-opt { display: grid; gap: 12px; margin: 48px auto 0; text-align: left; }
        @media (min-width: 768px) { .chw-opt { grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 64px; } }
        .chw-card { display: flex; flex-direction: column; justify-content: center; padding: 26px; border-radius: 16px; background: linear-gradient(135deg, #e8f0fc, #f3f7fd); }
        .chw-tag { display: flex; align-items: baseline; gap: 8px; margin: 0; font-weight: 700; }
        .chw-tag b { font-size: 2.1rem; font-weight: 900; letter-spacing: -0.03em; color: var(--cb-accent); }
        .chw-desc { margin: 6px 0 0; font-size: .95rem; color: var(--cb-sub); }
        .chw-auto { margin: 12px 0 0; font-size: .78rem; font-weight: 700; color: var(--cb-accent); }
        .chw-card ul { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 6px; }
        .chw-card li { position: relative; padding-left: 14px; font-size: .95rem; font-weight: 600; color: var(--cb-text); }
        .chw-card li::before { content: ''; position: absolute; left: 0; top: .6em; width: 6px; height: 6px; border-radius: 50%; background: var(--cb-accent); }
        .chw-note { margin: 20px 0 0; font-size: .85rem; color: var(--cb-muted); }
        /* 실제 웹블로그 견본으로 가는 큰 띠 — 파란 그라데이션 카드에 큰 글씨 + 흰 버튼 */
        .chw-demo { display: flex; flex-direction: column; align-items: center; gap: 24px; max-width: 1080px; margin: 56px auto 0; padding: 36px 24px; border-radius: 24px; background: linear-gradient(135deg, #1f63d6, #0d2858); color: #fff; box-shadow: 0 24px 60px rgba(31,99,214,.25); }
        @media (min-width: 960px) { .chw-demo { flex-direction: row; justify-content: space-between; gap: 40px; padding: 44px 52px; text-align: left; } }
        .chw-demo-tag { margin: 0; font-size: .8rem; font-weight: 800; letter-spacing: .2em; color: #9fbdf5; }
        .chw-demo-title { margin: 10px 0 0; font-size: clamp(1.2rem, 2.4vw, 1.55rem); line-height: 1.45; font-weight: 700; letter-spacing: -0.02em; }
        .chw-demo-title b { color: #fff; font-weight: 900; text-decoration: underline; text-decoration-color: #9fbdf5; text-decoration-thickness: 2px; text-underline-offset: 6px; }
        .chw-demo-btn { flex: none; display: inline-flex; align-items: center; gap: 8px; padding: 18px 34px; border-radius: 999px; background: #fff; color: #0d2858; font-weight: 800; font-size: 1.12rem; text-decoration: none; box-shadow: 0 10px 24px rgba(0,0,0,.18); transition: transform .15s, box-shadow .15s; }
        .chw-demo-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,0,0,.24); }
        .chw-demo-btn svg { transition: transform .25s ease; }
        .chw-demo-btn:hover svg { transform: translate(2px, -2px); }
        @media (prefers-reduced-motion: reduce) { .chw-step-wrap { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </section>
  )
}
