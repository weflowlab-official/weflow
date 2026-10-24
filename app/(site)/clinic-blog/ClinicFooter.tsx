/**
 * 병의원 웹블로그 페이지 아래 띠 — 사업자 정보 + 바깥 링크. 본 페이지와 404 가 같이 쓴다.
 * bar: 휴대폰 하단 두 칸 바(FloatingCta)가 있는 화면이면 그만큼 아래를 띄운다 (404 에는 바가 없다).
 */
export default function ClinicFooter({ bar = true }: { bar?: boolean }) {
  return (
    <>
      {/* 사업자 정보 + 오른쪽에 링크 — WEFLOW 홈페이지·전 업종 웹블로그·개인정보처리방침.
          제작 사례 자리는 휴대폰에서만 빈칸으로 남겨, 나머지 링크 위치가 그대로 있게 한다 (PC 는 붙인다).
          광고로 들어온 단독 페이지라 바깥 링크는 이 줄(과 SEO·AEO·GEO 섹션의 '실제 웹블로그 보기')에만 두고, 모두 새 탭으로 연다 */}
      <footer className={`cb-foot${bar ? ' cb-foot--bar' : ''}`}>
        <div className="cb-wrap cb-foot-inner">
          {/* 넓은 화면에서는 · 로 이어 한 줄, 휴대폰에서는 항목마다 한 줄씩 */}
          <p className="cb-foot-info">
            <span>WEFLOW</span>
            <span>대표 신서준</span>
            <span>사업자등록번호 884-07-03480</span>
            <span>contact@weflowlab.kr</span>
          </p>
          <nav className="cb-foot-links" aria-label="WEFLOW 바로가기">
            <a href="/" target="_blank" rel="noopener noreferrer">WEFLOW 홈페이지</a>
            <a href="/blog" target="_blank" rel="noopener noreferrer">전 업종 웹블로그</a>
            <span className="cb-foot-gap" aria-hidden="true">제작 사례</span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>
          </nav>
        </div>
      </footer>
      <style>{`
        .cb-foot { border-top: 1px solid var(--cb-line); color: var(--cb-muted); padding: 28px 0 36px; font-size: .85rem; }
        @media (max-width: 768px) { .cb-foot--bar { padding-bottom: calc(36px + 56px); } } /* 휴대폰 하단 두 칸 바(56px)에 가리지 않게 */
        .cb-foot p { margin: 0; }
        .cb-foot-info span + span::before { content: '·'; margin: 0 .5em; }
        @media (max-width: 640px) {
          .cb-foot-info span { display: block; line-height: 1.8; }
          .cb-foot-info span + span::before { content: none; }
        }
        /* 개인정보처리방침은 늘 오른쪽 위 — 휴대폰에서 정보가 여러 줄이 돼도 첫 줄(WEFLOW)과 같은 높이에 남는다 */
        .cb-foot-inner { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px 24px; }
        .cb-foot a { flex: none; white-space: nowrap; }
        /* 링크 네 개 — 넓은 화면은 오른쪽에 한 줄, 휴대폰은 사업자 정보 오른쪽에 세로로 */
        /* 빈칸은 휴대폰(세로 목록)에서만 자리를 지킨다 — PC 한 줄에서는 빼서 링크끼리 붙인다 */
        .cb-foot-gap { display: none; visibility: hidden; }
        @media (max-width: 640px) { .cb-foot-gap { display: block; } }
        .cb-foot-links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px 16px; }
        @media (max-width: 640px) { .cb-foot-links { flex-direction: column; align-items: flex-end; gap: 0; line-height: 1.8; } }
        .cb-foot a { color: var(--cb-muted); text-decoration: none; font-weight: 600; }
        .cb-foot a:hover { color: var(--cb-sub); text-decoration: underline; }

      `}</style>
    </>
  )
}
