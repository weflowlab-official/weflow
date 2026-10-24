import InView from './InView'

/**
 * WHY NOW 01 왼쪽 — PC 검색 결과 예시 화면. 오른쪽 휴대폰(AI 검색)과 짝을 이룬다:
 * "환자는 PC 로도, 휴대폰 AI 로도 먼저 찾아본다 — 그런데 나오는 건 다른 병원 글".
 * 안과 검색어를 치면 다른 병원 블로그 글이 줄줄이 나오고, 맨 아래 '우리 병원 글'은 비어 있다.
 * 특정 포털의 로고·디자인을 흉내 내지 않는 일반 검색 화면으로 그렸다 (병원 이름도 ○○안과 처럼 가렸다).
 * 검색창 테두리·버튼만 초록(#03c75a)으로 칠해 "네이버에서 찾아본다"는 느낌만 준다 (로고·글자는 쓰지 않는다).
 * 화면에 들어오면 결과가 위에서부터 차례로 올라온다 (InView 가 is-in 을 붙이고 --i 로 늦춘다).
 * 검색어·결과·'우리 글 없음' 문구는 props 로 받는다 — 병의원 페이지는 안과, 메인 '웹블로그란?' 은 업종 공통 예시.
 * 넓은 화면(960px 이상): 휴대폰 왼쪽에 같은 높이의 PC 화면으로.
 * 좁은 화면: 휴대폰 위에 짧은 카드로 (결과 2개 + "우리 병원 글은 보이지 않습니다", 탭·썸네일 없이) — 위아래로 읽으면 "검색 → AI" 순서가 된다.
 */

export type SearchResult = { blog: string; ago: string; title: string; text: string }

export const CLINIC_RESULTS: SearchResult[] = [
  { blog: '○○안과 블로그', ago: '2일 전', title: '백내장 수술 후 일주일, 이것만 지켜 주세요', text: '수술 직후 생활에서 주의할 점과 안약 넣는 방법, 다음 진료 때 확인할 것을 정리했습니다.' },
  { blog: '△△안과 블로그', ago: '5일 전', title: '노안 백내장 수술, 인공수정체는 어떻게 고를까', text: '단초점·다초점 렌즈의 차이와 생활 방식에 따라 고려할 점을 쉽게 설명합니다.' },
  { blog: '□□안과 블로그', ago: '1주 전', title: '백내장 수술 뒤 눈이 뿌옇게 보인다면', text: '수술 후 시야가 흐릿하게 느껴질 때 확인해야 할 경우와 진료가 필요한 신호를 알려 드립니다.' },
]

export default function SearchMock({ query, results, emptyText }: { query: string; results: SearchResult[]; emptyText: string }) {
  return (
    <div className="csm" aria-label="PC 검색 결과 예시 화면">
      {/* 브라우저 창 */}
      <div className="csm-bar" aria-hidden="true">
        <span className="csm-dots"><i /><i /><i /></span>
        <span className="csm-url">검색 결과</span>
      </div>
      <div className="csm-page">
        <div className="csm-search">
          <span className="csm-q">{query}</span>
          <span className="csm-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </span>
        </div>
        <div className="csm-tabs" aria-hidden="true">
          <span>통합</span><span className="is-on">블로그</span><span>이미지</span><span>동영상</span>
        </div>
        <InView className="csm-list">
          {results.map((r, i) => (
            <div key={r.title} className="csm-item" style={{ '--i': i } as React.CSSProperties}>
              <div className="csm-body">
                <p className="csm-meta"><span className="csm-ava">{r.blog.slice(0, 2)}</span>{r.blog} · {r.ago}</p>
                <p className="csm-title">{r.title}</p>
                <p className="csm-text">{r.text}</p>
              </div>
              <span className="csm-thumb" aria-hidden="true" />
            </div>
          ))}
          {/* 우리 병원 글은 없다 — 결과가 다 올라온 뒤 마지막에 나타난다 */}
          <div className="csm-item csm-empty" style={{ '--i': results.length + 1 } as React.CSSProperties}>
            <p>{emptyText}</p>
          </div>
        </InView>
      </div>

      <style>{`
        /* 좁은 화면: 휴대폰 위의 짧은 카드 (휴대폰과 같은 폭) */
        .csm { display: flex; flex-direction: column; width: min(340px, 100%); margin: 0 auto 32px; border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 20px 50px rgba(17,20,24,.1); border: 1px solid var(--cb-line); text-align: left; }
        .csm-item:nth-child(3), .csm-thumb, .csm-tabs { display: none; }
        @media (min-width: 960px) {
          .csm { width: 100%; height: 622px; margin: 0; box-shadow: 0 30px 80px rgba(17,20,24,.12); }
          .csm-item:nth-child(3) { display: flex; }
          .csm-thumb { display: block; }
          .csm-tabs { display: flex; }
        }
        .csm-bar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #f1f3f6; border-bottom: 1px solid var(--cb-line); }
        .csm-dots { display: flex; gap: 6px; }
        .csm-dots i { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; }
        .csm-dots i:nth-child(2) { background: #febc2e; }
        .csm-dots i:nth-child(3) { background: #28c840; }
        .csm-url { flex: 1; padding: 5px 14px; border-radius: 999px; background: #fff; font-size: .8rem; color: var(--cb-muted); }
        .csm-page { flex: 1; padding: 16px 16px 18px; overflow: hidden; }
        @media (min-width: 960px) { .csm-page { padding: 22px 26px; } }
        .csm-search { display: flex; align-items: center; justify-content: space-between; height: 44px; margin-bottom: 4px; padding: 0 3px 0 20px; border: 2px solid #03c75a; border-radius: 999px; }
        /* 돋보기 버튼: 위·아래·오른쪽 여백을 모두 3px 로 (높이 44 - 테두리 4 - 버튼 34 = 6 → 위아래 3px) */
        .csm-q { font-weight: 700; font-size: 1rem; color: var(--cb-text); }
        .csm-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: #03c75a; color: #fff; }
        .csm-tabs { display: flex; gap: 22px; margin: 18px 0 6px; padding: 0 4px; border-bottom: 1px solid var(--cb-line); font-size: .9rem; color: var(--cb-muted); }
        .csm-tabs span { padding-bottom: 10px; }
        .csm-tabs .is-on { color: var(--cb-text); font-weight: 800; box-shadow: inset 0 -2px 0 var(--cb-text); }
        .csm-list { display: grid; }
        .csm-item { display: flex; gap: 16px; padding: 16px 4px; border-bottom: 1px solid var(--cb-line); opacity: 0; transform: translateY(12px); transition: opacity .45s ease, transform .45s ease; transition-delay: calc(var(--i) * .35s); }
        .csm-list.is-in .csm-item { opacity: 1; transform: none; }
        .csm-body { flex: 1; min-width: 0; }
        .csm-meta { display: flex; align-items: center; gap: 6px; margin: 0; font-size: .78rem; color: var(--cb-muted); }
        .csm-ava { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #e8eef7; color: var(--cb-sub); font-size: .6rem; font-weight: 800; }
        .csm-title { margin: 6px 0 0; font-size: 1.02rem; font-weight: 800; color: #1a45a8; }
        .csm-text { margin: 4px 0 0; font-size: .86rem; line-height: 1.55; color: var(--cb-sub); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .csm-thumb { flex: none; width: 84px; height: 84px; border-radius: 10px; background: linear-gradient(135deg, #eef2f7, #dfe6f0); }
        .csm-empty { justify-content: center; border: 1.5px dashed #d5d9df; border-radius: 12px; margin-top: 14px; padding: 18px; }
        .csm-empty p { margin: 0; font-weight: 700; color: #e05252; font-size: .95rem; }
        @media (prefers-reduced-motion: reduce) { .csm-item { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </div>
  )
}
