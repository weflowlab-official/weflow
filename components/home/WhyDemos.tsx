/**
 * '왜 WEFLOW?' 답에 붙는 시연 네 가지 — 영상 파일 없이 코드로 그린 화면이 한 바퀴씩 돈다.
 *
 *  - WhyFeatureDemo : 자동 견적 계산기 — 고르는 대로 금액이 바뀌고 상담 신청까지 이어진다 (10초)
 *  - WhySearchDemo  : SEO 로 순위가 오르고, AEO 로 답변에 뽑히고, GEO 로 AI 답변에 인용된다 (10초)
 *  - WhySpeedDemo   : 코드가 써진 뒤, 그 결과로 모바일 화면이 순식간에 뜨고 점수가 차오른다 (12.5초)
 *  - WhyAdminDemo   : 문의를 하나씩 '연락 완료' 로 바꾸고, 유입 관리 탭으로 넘어가 내려 보며 유입을 본다 (14초)
 *
 * 공통 규칙:
 *  - 창은 40em × 30em(4:3) 좌표계다. 1em = 창 폭의 1/40(cqw) 이라 카드 크기를 그대로 따라간다.
 *  - 창 안의 요소는 전부 절대 좌표로 놓는다 — 커서 좌표를 계산으로 맞출 수 있다.
 *    좌표가 어긋나지 않게 상자의 글자 크기는 1em 으로 두고, 글씨 크기는 안쪽 .t 에서만 바꾼다.
 *  - 커서 상자의 왼쪽 위에서 (0.15em, 0.15em) 들어간 곳이 화살표 끝이라, 누를 곳 좌표에서 그만큼 뺀다.
 *  - 움직임은 부모에 .is-on 이 붙어 있을 때만 걸린다 — 떼었다 붙이면 처음부터 다시 시작한다.
 *  - 한 바퀴 끝(95~100%)에서 내용을 지웠다가 처음(0~5%)에 다시 그려, 되감기는 순간이 안 보이게 한다.
 *  - 색은 흰색·검정에 파스텔 하늘색 하나만 쓴다 (--a-* 변수).
 */

/** 맥 화살표 모양 커서 + 누를 때 퍼지는 원 */
function DemoCursor() {
  return (
    <span className="wd-cursor">
      <i className="wd-ring" />
      <svg viewBox="0 0 14 21">
        <path
          d="M1.2 1.2V17.7L4.9 14.3L7.2 19.8L9.5 18.8L7.2 13.5H12.4Z"
          fill="#111"
          stroke="#fff"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/** 01 · 자동 견적 계산기 */
export function WhyFeatureDemo() {
  return (
    <div className="wd fd" aria-hidden="true">
      <div className="wd-zoom">
        <div className="wd-body">
          {/* 사이트 머리 — 로고는 글씨, 메뉴는 막대로 */}
          <span className="fd-logo">
            <span className="t">WEFLOW</span>
          </span>
          <i className="wd-bar" style={{ left: '27em', top: '1.7em', width: '3em' }} />
          <i className="wd-bar" style={{ left: '31em', top: '1.7em', width: '3em' }} />
          <i className="wd-bar" style={{ left: '35em', top: '1.7em', width: '2.8em' }} />
          <i className="fd-line" />

          <strong className="fd-title">
            <span className="t">자동 견적 계산기</span>
          </strong>

          <span className="fd-label" style={{ top: '8.9em' }}>
            <span className="t">종류</span>
          </span>
          <span className="fd-opt" style={{ left: '2.2em', width: '5.4em' }}>
            <span className="t">기본형</span>
          </span>
          <span className="fd-opt fd-opt--pick" style={{ left: '8.2em', width: '5.4em' }}>
            <span className="t">고급형</span>
          </span>
          <span className="fd-opt" style={{ left: '14.2em', width: '6.2em' }}>
            <span className="t">프리미엄</span>
          </span>

          <span className="fd-label" style={{ top: '14.5em' }}>
            <span className="t">수량</span>
          </span>
          <span className="fd-step" style={{ left: '2.2em' }}>
            <span className="t">−</span>
          </span>
          <span className="fd-qty">
            <i className="fd-qty__strip">
              <em>1</em>
              <em>2</em>
            </i>
          </span>
          <span className="fd-step" style={{ left: '8em' }}>
            <span className="t">+</span>
          </span>

          <span className="fd-check">
            <i className="t">✓</i>
          </span>
          <span className="fd-check__label">
            <span className="t">설치 포함</span>
          </span>

          {/* 오른쪽 — 금액이 바로바로 바뀌는 견적 상자 */}
          <div className="fd-panel">
            <span className="fd-panel__label">
              <span className="t">예상 견적</span>
            </span>
            <span className="fd-price">
              <i className="fd-price__strip">
                <em>0원</em>
                <em>480,000원</em>
                <em>960,000원</em>
                <em>1,160,000원</em>
              </i>
            </span>
            <i className="wd-bar" style={{ left: '1.2em', top: '7.4em', width: '9em' }} />
            <i className="wd-bar" style={{ left: '1.2em', top: '9.2em', width: '6.5em' }} />
            <i className="wd-bar" style={{ left: '1.2em', top: '11em', width: '8em' }} />
            <span className="fd-btn">
              <span className="fd-btn__ask">
                <span className="t">이 견적으로 상담 신청</span>
              </span>
              <span className="fd-btn__done">
                <span className="t">✓ 신청 완료</span>
              </span>
            </span>
          </div>
        </div>
        <DemoCursor />
      </div>
    </div>
  )
}

/** 02 · 검색에 잡히는 구조 */
export function WhySearchDemo() {
  return (
    <div className="wd sd" aria-hidden="true">
      <div className="wd-zoom">
        <div className="wd-body">
          {/* 검색창 — 글자가 한 자씩 쳐진다 */}
          <div className="sd-box">
            <span className="sd-query">우리동네 인테리어 업체</span>
            <span className="sd-go">
              <svg viewBox="0 0 24 24">
                <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#fff" strokeWidth="2.4" />
                <path d="M15.5 15.5L20 20" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          {/* 세 가지 설계 — 차례로 불이 켜진다 */}
          <span className="sd-chip sd-chip--1">
            <span className="t">SEO</span>
          </span>
          <span className="sd-chip sd-chip--2">
            <span className="t">AEO</span>
          </span>
          <span className="sd-chip sd-chip--3">
            <span className="t">GEO</span>
          </span>

          {/* 검색 결과 — SEO: 우리 사이트가 셋째 칸에서 첫째 칸으로 올라간다 */}
          <div className="sd-results">
            <div className="sd-row sd-row--a">
              <i className="sd-fav" />
              <i className="wd-bar" style={{ left: '3.6em', top: '0.9em', width: '9em' }} />
              <i className="wd-bar" style={{ left: '3.6em', top: '2.5em', width: '18em', height: '0.5em' }} />
            </div>
            <div className="sd-row sd-row--b">
              <i className="sd-fav" />
              <i className="wd-bar" style={{ left: '3.6em', top: '0.9em', width: '11em' }} />
              <i className="wd-bar" style={{ left: '3.6em', top: '2.5em', width: '15em', height: '0.5em' }} />
            </div>
            <div className="sd-row sd-row--me">
              <i className="sd-fav sd-fav--me" />
              <strong>우리 사이트</strong>
              <i className="wd-bar" style={{ left: '3.6em', top: '2.5em', width: '17em', height: '0.5em' }} />
              <span className="sd-rank">
                <i className="sd-rank__strip">
                  <em>3위</em>
                  <em>2위</em>
                  <em>1위</em>
                </i>
              </span>
            </div>

            {/* AEO — 질문의 답으로 우리 사이트 내용이 뽑힌다 (순위와는 다른 자리다) */}
            <div className="sd-card sd-card--aeo">
              <span className="sd-card__label">
                <span className="t">✔ 검색 답변으로 채택</span>
              </span>
              <i className="wd-bar sd-card__line" />
              <span className="sd-card__src">
                <span className="t">우리 사이트</span>
              </span>
            </div>
            {/* GEO — AI 가 답을 만들 때 우리 사이트를 출처로 든다 */}
            <div className="sd-card sd-card--geo">
              <span className="sd-card__label">
                <span className="t">✦ AI 답변에 인용</span>
              </span>
              <i className="wd-bar sd-card__line" />
              <i className="wd-bar sd-card__line sd-card__line--2" />
              <span className="sd-card__src">
                <span className="t">우리 사이트</span>
              </span>
            </div>
          </div>
        </div>
        <DemoCursor />
      </div>
    </div>
  )
}

// 03 의 첫 장면에 써지는 코드 — [들여쓰기 칸 수, 토막들]. 토막의 k 는 색(k: 예약어, c: 컴포넌트, p: 속성)
const CODE: [number, { s: string; k?: 'k' | 'c' | 'p' }[]][] = [
  [0, [{ s: 'export default function ', k: 'k' }, { s: 'Page', k: 'c' }, { s: '() {' }]],
  [1, [{ s: 'return', k: 'k' }, { s: ' (' }]],
  [2, [{ s: '<' }, { s: 'main', k: 'c' }, { s: '>' }]],
  [3, [{ s: '<' }, { s: 'Hero', k: 'c' }, { s: ' priority', k: 'p' }, { s: ' />' }]],
  [3, [{ s: '<' }, { s: 'Cases', k: 'c' }, { s: ' lazy', k: 'p' }, { s: ' />' }]],
  [3, [{ s: '<' }, { s: 'Contact', k: 'c' }, { s: ' />' }]],
  [2, [{ s: '</' }, { s: 'main', k: 'c' }, { s: '>' }]],
  [1, [{ s: ')' }]],
]

/** 03 · 모바일에서도 빠른 로딩 */
export function WhySpeedDemo() {
  return (
    <div className="wd pd" aria-hidden="true">
      <div className="wd-zoom">
        <div className="wd-body">
          {/* 휴대폰 */}
          <div className="pd-phone">
            <i className="pd-url" />
            <span className="pd-reload">
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 12a7 7 0 1 1-2.1-5M17.5 3.5v4h-4"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <i className="pd-progress" />
            <div className="pd-page">
              <i className="pd-hero" />
              <i className="wd-bar pd-b1" />
              <i className="wd-bar pd-b2" />
              <i className="pd-card pd-card--1" />
              <i className="pd-card pd-card--2" />
              <i className="pd-cta" />
            </div>
          </div>

          {/* 성능 점수 */}
          <div className="pd-gauge">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#ececea" strokeWidth="9" />
              <circle
                className="pd-gauge__fill"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <span className="pd-score">
              <i className="pd-score__strip">
                <em>0</em>
                <em>43</em>
                <em>81</em>
                <em>100</em>
              </i>
            </span>
          </div>
          <span className="pd-gauge__label">성능 점수</span>

          <span className="pd-time">
            <span className="t">로딩</span>
            <b>
              <i className="pd-time__strip">
                <em>0.0초</em>
                <em>0.4초</em>
                <em>0.8초</em>
              </i>
            </b>
          </span>

          {/* 빨라서 따라오는 것 네 가지 — 같은 폭으로 2 × 2 */}
          <span className="pd-chip pd-chip--1">
            <span className="t">이탈 ↓</span>
          </span>
          <span className="pd-chip pd-chip--2">
            <span className="t">검색 순위 ↑</span>
          </span>
          <span className="pd-chip pd-chip--3">
            <span className="t">체류 시간 ↑</span>
          </span>
          <span className="pd-chip pd-chip--4">
            <span className="t">문의 ↑</span>
          </span>

          {/* 첫 장면 — 코드가 한 줄씩 써진다. 다 써지면 걷히고 위의 결과 화면이 드러난다 */}
          <div className="pd-code">
            <i className="pd-dot" style={{ left: '1.4em', background: '#ff5f57' }} />
            <i className="pd-dot" style={{ left: '2.7em', background: '#febc2e' }} />
            <i className="pd-dot" style={{ left: '4em', background: '#28c840' }} />
            <span className="pd-tab">
              <span className="t">page.tsx</span>
            </span>
            <span className="pd-stack">
              <span className="t">최신 기술</span>
            </span>
            {CODE.map(([indent, parts], i) => (
              <span
                key={i}
                className="pd-ln"
                style={{ top: `${5.4 + 2.4 * i}em`, animationDelay: `${(0.25 * i).toFixed(2)}s` }}
              >
                <span className="t pd-no">{i + 1}</span>
                <span className="t" style={{ paddingLeft: `${indent * 1.2}em` }}>
                  {parts.map((p, j) => (
                    <span key={j} className={p.k ? `t pd-${p.k}` : 't'}>
                      {p.s}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </div>
        </div>
        <DemoCursor />
      </div>
    </div>
  )
}

// 04 의 문의 목록 — who 는 동그라미 색, kind 는 문의 종류. 첫 줄은 시연 도중에 새로 들어온다
const INQUIRIES = [
  { who: '#a9d4ff', kind: '홈페이지 제작 문의', time: '방금', bar: '4.2em' },
  { who: '#111', kind: '랜딩페이지 문의', time: '12분 전', bar: '5.5em' },
  { who: '#9aa0a6', kind: '예약 신청', time: '1시간 전', bar: '4.8em' },
  { who: '#d7dade', kind: '홈페이지 제작 문의', time: '어제', bar: '5.2em' },
]
// 04 의 유입 소스 — pct 는 막대 길이이자 표시 숫자 (실제 관리자 화면의 '유입 소스' 카드를 본떴다)
const INFLOW = [
  { name: '구글 검색', pct: 52 },
  { name: '인스타그램', pct: 31 },
  { name: '직접 유입', pct: 17 },
]
// 04 의 날짜별 방문자 — 최근 열흘. 그래프는 가로 256 × 세로 100 좌표에 그린다
// (그림 영역: 가로 22~250, 세로 6~76 / 세로축 0~150명)
const DAYS = ['9/24', '9/25', '9/26', '9/27', '9/28', '9/29', '9/30', '10/1', '10/2', '10/3']
const VISITS = [38, 52, 46, 74, 66, 91, 83, 112, 104, 128]
const Y_TICKS = [0, 50, 100, 150]
const chartX = (i: number) => 22 + (228 / (DAYS.length - 1)) * i
const chartY = (v: number) => 76 - (v / 150) * 70
const DAILY = VISITS.map((v, i) => `${chartX(i).toFixed(1)},${chartY(v).toFixed(1)}`).join(' ')

/** 04 · 나만의 관리자 페이지 */
export function WhyAdminDemo() {
  return (
    <div className="wd ad" aria-hidden="true">
      <div className="wd-zoom">
        <div className="wd-body">
          {/* 왼쪽 메뉴 */}
          <i className="ad-side" />
          <span className="ad-logo">
            <span className="t">WEFLOW</span>
          </span>
          <span className="ad-menu ad-menu--inq">
            <span className="t">문의 관리</span>
          </span>
          <span className="ad-menu ad-menu--flow">
            <span className="t">유입 관리</span>
          </span>
          <i className="wd-bar" style={{ left: '1.2em', top: '10.6em', width: '5em' }} />
          <i className="wd-bar" style={{ left: '1.2em', top: '12.6em', width: '3.8em' }} />

          {/* 화면 1 — 문의 관리 */}
          <div className="ad-view ad-view--inq">
            <strong className="ad-title">
              <span className="t">문의 관리</span>
            </strong>
            <span className="ad-stat" style={{ left: '15.2em', width: '6em' }}>
              <span className="t">신규</span>
              <b>
                <i className="ad-new__strip">
                  <em>3</em>
                  <em>4</em>
                  <em>3</em>
                  <em>2</em>
                  <em>1</em>
                  <em>0</em>
                </i>
              </b>
            </span>
            <span className="ad-stat ad-stat--done" style={{ left: '21.8em', width: '7.6em' }}>
              <span className="t">연락 완료</span>
              <b>
                <i className="ad-done__strip">
                  <em>0</em>
                  <em>1</em>
                  <em>2</em>
                  <em>3</em>
                  <em>4</em>
                </i>
              </b>
            </span>

            {INQUIRIES.map((r, i) => (
              <div key={i} className={`ad-row ad-row--${i}`}>
                <i className="ad-who" style={{ background: r.who }} />
                <i className="wd-bar" style={{ left: '4em', top: '1.2em', width: r.bar }} />
                <span className="ad-kind">
                  <span className="t">{r.kind}</span>
                </span>
                <span className="ad-time">
                  <span className="t">{r.time}</span>
                </span>
                <span className="ad-chip">
                  <span className="ad-chip__new">
                    <span className="t">신규</span>
                  </span>
                  <span className="ad-chip__done">
                    <span className="t">✓ 연락 완료</span>
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* 화면 2 — 유입 관리 (메뉴를 누르면 바뀐다). 실제 관리자 화면처럼
              위에 숫자 상자 둘, 그 아래 유입 소스 막대, 더 내리면 날짜별 방문자 꺾은선이 나온다 */}
          <div className="ad-view ad-view--flow">
            <strong className="ad-title">
              <span className="t">유입 관리</span>
            </strong>
            <div className="ad-scroll">
              <div className="ad-scroll__in">
                <div className="ad-box" style={{ left: '1.6em' }}>
                  <span className="ad-box__label">
                    <span className="t">방문자 수</span>
                  </span>
                  <span className="ad-box__value">
                    <span className="t">128</span>
                  </span>
                </div>
                <div className="ad-box" style={{ left: '15.8em' }}>
                  <span className="ad-box__label">
                    <span className="t">즉시 이탈률</span>
                  </span>
                  <span className="ad-box__value">
                    <span className="t">3%</span>
                  </span>
                </div>

                {/* 한 줄 요약 — 실제 관리자 화면의 안내 문구를 본떴다 */}
                <div className="ad-tip">
                  <span className="t">
                    고객이 가장 많이 유입된 곳은 <b className="t">구글 검색</b>이에요 — 전체 방문자의 {INFLOW[0].pct}%
                  </span>
                </div>

                <div className="ad-card ad-card--src">
                  <span className="ad-card__title">
                    <span className="t">유입 소스</span>
                  </span>
                  {INFLOW.map((f, i) => (
                    <div key={f.name} className="ad-flow" style={{ top: `${3 + 2.9 * i}em` }}>
                      <span className="ad-flow__name">
                        <span className="t">{f.name}</span>
                      </span>
                      <i className="ad-flow__track" />
                      <i
                        className={`ad-flow__fill${i === 0 ? ' ad-flow__fill--top' : ''}`}
                        style={
                          {
                            '--w': `${((f.pct / INFLOW[0].pct) * 20.4).toFixed(2)}em`,
                            animationDelay: `${(0.18 * i).toFixed(2)}s`,
                          } as React.CSSProperties
                        }
                      />
                      <span className="ad-flow__pct">
                        <span className="t">{f.pct}%</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="ad-card ad-card--day">
                  <span className="ad-card__title">
                    <span className="t">날짜별 방문자</span>
                  </span>
                  {/* 세로축: 방문자 수, 가로축: 날짜 */}
                  <svg className="ad-chart" viewBox="0 0 256 100">
                    {Y_TICKS.map(v => (
                      <g key={v}>
                        <path d={`M22 ${chartY(v)}H250`} stroke="#ececea" strokeWidth="1" />
                        <text x="17" y={chartY(v) + 2.5} textAnchor="end">
                          {v}
                        </text>
                      </g>
                    ))}
                    {DAYS.map((d, i) => (
                      <text key={d} x={chartX(i)} y="89" textAnchor="middle">
                        {d}
                      </text>
                    ))}
                    <polygon className="ad-chart__area" points={`22,76 ${DAILY} 250,76`} />
                    <polyline className="ad-chart__line" points={DAILY} pathLength={100} />
                    <circle
                      className="ad-chart__dot"
                      cx={chartX(DAYS.length - 1)}
                      cy={chartY(VISITS[VISITS.length - 1])}
                      r="3.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DemoCursor />
      </div>
    </div>
  )
}

/** 네 시연의 스타일 — 페이지에 한 번만 넣는다 */
export function WhyDemoStyles() {
  return (
    <style>{`
      /* ══ 공통 ══ */
      .wd {
        /* 파스텔 하늘색 — 면 · 그 위 글씨 · 선 · 아주 옅은 바탕 · 글씨로 쓸 때의 짙은 톤 */
        --a-fill: #a9d4ff;
        --a-ink: #12304f;
        --a-line: #7fbcf7;
        --a-soft: #eaf4ff;
        --a-deep: #2f78c4;
        container-type: inline-size;
        background: #fff;
        overflow: hidden;
        color: #111;
        text-align: left;
        line-height: 1.3;
        white-space: nowrap;
      }
      .wd-zoom { position: absolute; inset: 0; font-size: 2.5cqw; }
      .wd-body { position: absolute; inset: 0; }
      .wd-body * { position: absolute; }
      /* 글씨 — 상자 안에서 제자리에 흐르고, 글자 크기는 여기서만 바꾼다 */
      .wd-body .t { position: static; }
      .wd em, .wd i { font-style: normal; }
      .wd-bar { height: 0.7em; border-radius: 9999px; background: #e3e3e0; }
      /* 커서 — 화살표 끝(0.15em, 0.15em)을 축으로 눌림 표현 */
      .wd-cursor {
        position: absolute;
        top: 0;
        left: 0;
        width: 1.7em;
        height: 2.55em;
        transform-origin: 0.15em 0.15em;
        filter: drop-shadow(0 0.12em 0.2em rgba(0, 0, 0, 0.35));
      }
      .wd-cursor svg { position: relative; display: block; width: 100%; height: 100%; }
      .wd-ring {
        position: absolute;
        left: -1.05em;
        top: -1.05em;
        width: 2.4em;
        height: 2.4em;
        border-radius: 50%;
        background: rgba(127, 188, 247, 0.5);
        transform: scale(0);
        opacity: 0;
      }
      /* 숫자·글자를 세로로 쌓은 띠 — 한 칸씩 올려 바꾼다 */
      .wd [class$="__strip"] { position: static; display: block; }
      .wd [class$="__strip"] em { position: static; display: block; }
      .is-on .fd .wd-body, .is-on .sd .wd-body { animation: wdFade 10s linear infinite; }
      .is-on .pd .wd-body { animation: wdFade 12.5s linear infinite; }
      .is-on .ad .wd-body { animation: wdFade 14s linear infinite; }
      @keyframes wdFade {
        0% { opacity: 0; }
        5%, 95% { opacity: 1; }
        100% { opacity: 0; }
      }

      /* ══ 01 · 자동 견적 계산기 ══ */
      /* 머리(0~4.1em) 세로 가운데 — 영문 대문자는 글자 상자 안에서 위로 치우쳐 있어 그만큼 더 내린다 */
      .fd-logo { left: 2.2em; top: 1.42em; }
      .fd-logo .t { font-size: 1.1em; font-weight: 900; letter-spacing: 0.02em; }
      .fd-line { left: 0; top: 4.1em; width: 100%; height: 1px; background: #ececea; }
      .fd-title { left: 2.2em; top: 5.1em; }
      .fd-title .t { font-size: 1.5em; font-weight: 800; letter-spacing: -0.02em; }
      .fd-label { left: 2.2em; }
      .fd-label .t { font-size: 0.8em; color: #8a8a8a; }
      .fd-opt, .fd-step {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #dcdcd8;
        border-radius: 0.7em;
      }
      .fd-opt { top: 10.4em; height: 2.4em; }
      .fd-opt .t { font-size: 0.85em; font-weight: 600; }
      .fd-step { top: 16em; width: 2.4em; height: 2.4em; }
      .fd-step .t { font-weight: 700; }
      .fd-qty { left: 4.6em; top: 16em; width: 3.4em; height: 2.4em; overflow: hidden; text-align: center; font-weight: 800; }
      .fd-qty em { height: 2.4em; line-height: 2.4em; }
      .fd-check {
        left: 2.2em;
        top: 20.4em;
        width: 1.6em;
        height: 1.6em;
        border: 1px solid #111;
        border-radius: 0.4em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .fd-check .t { font-size: 0.95em; font-weight: 800; color: #fff; opacity: 0; }
      .fd-check__label { left: 4.5em; top: 20.6em; }
      .fd-check__label .t { font-size: 0.85em; font-weight: 600; }
      .fd-panel { left: 24em; top: 5.2em; width: 14em; height: 21.8em; border-radius: 1.1em; background: #f6f6f4; }
      .fd-panel__label { left: 1.2em; top: 1.3em; }
      .fd-panel__label .t { font-size: 0.8em; color: #8a8a8a; }
      /* 금액 — 글자는 1.7배, 한 칸 높이는 2.6em (1.7 × 1.5294) */
      .fd-price { left: 1.2em; top: 2.9em; height: 2.6em; overflow: hidden; }
      .fd-price em { font-size: 1.7em; height: 1.5294em; line-height: 1.5294em; font-weight: 800; letter-spacing: -0.03em; }
      .fd-btn { left: 1.2em; top: 16.4em; width: 11.6em; height: 3.2em; }
      .fd-btn > span {
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.8em;
      }
      .fd-btn .t { font-size: 0.85em; font-weight: 700; }
      .fd-btn__ask { background: #111; color: #fff; }
      .fd-btn__done { background: var(--a-fill); color: var(--a-ink); opacity: 0; }

      .is-on .fd .wd-zoom { animation: fdZoom 10s ease-in-out infinite; transform-origin: 100% 62%; }
      .is-on .fd .wd-cursor { animation: fdCursor 10s cubic-bezier(0.45, 0.05, 0.2, 1) infinite; }
      .is-on .fd .wd-ring { animation: fdRing 10s ease-out infinite; }
      .is-on .fd-opt--pick { animation: fdPick 10s linear infinite; }
      .is-on .fd-qty__strip { animation: fdQty 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .fd-check { animation: fdCheckBox 10s linear infinite; }
      .is-on .fd-check .t { animation: fdCheck 10s linear infinite; }
      .is-on .fd-price__strip { animation: fdPrice 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .fd-btn__done { animation: fdDone 10s linear infinite; }
      .fd .wd-cursor { transform: translate(20em, 25em); }

      /* 커서 — 고급형(10.9, 11.6) → +(9.2, 17.2) → 체크(3.0, 21.2) → 신청 버튼(31, 23.2) */
      @keyframes fdCursor {
        0%, 10% { transform: translate(20em, 25em); }
        18%, 24% { transform: translate(10.75em, 11.45em); }
        21% { transform: translate(10.75em, 11.45em) scale(0.88); }
        32%, 38% { transform: translate(9.05em, 17.05em); }
        35% { transform: translate(9.05em, 17.05em) scale(0.88); }
        46%, 52% { transform: translate(2.85em, 21.05em); }
        49% { transform: translate(2.85em, 21.05em) scale(0.88); }
        64%, 82% { transform: translate(30.85em, 23.05em); }
        74% { transform: translate(30.85em, 23.05em) scale(0.88); }
        94%, 100% { transform: translate(20em, 25em); }
      }
      @keyframes fdRing {
        0%, 20.9% { transform: scale(0); opacity: 0; }
        21% { transform: scale(0.4); opacity: 0.9; }
        26% { transform: scale(1.5); opacity: 0; }
        34.9% { transform: scale(0); opacity: 0; }
        35% { transform: scale(0.4); opacity: 0.9; }
        40% { transform: scale(1.5); opacity: 0; }
        48.9% { transform: scale(0); opacity: 0; }
        49% { transform: scale(0.4); opacity: 0.9; }
        54% { transform: scale(1.5); opacity: 0; }
        73.9% { transform: scale(0); opacity: 0; }
        74% { transform: scale(0.4); opacity: 0.9; }
        79%, 100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes fdPick {
        0%, 21% { background: #fff; color: #111; border-color: #dcdcd8; }
        22%, 100% { background: #111; color: #fff; border-color: #111; }
      }
      @keyframes fdQty {
        0%, 35% { transform: translateY(0); }
        38%, 100% { transform: translateY(-2.4em); }
      }
      @keyframes fdCheckBox {
        0%, 49% { background: #fff; }
        50%, 100% { background: #111; }
      }
      @keyframes fdCheck {
        0%, 49% { opacity: 0; }
        50%, 100% { opacity: 1; }
      }
      @keyframes fdPrice {
        0%, 21% { transform: translateY(0); }
        25%, 35% { transform: translateY(-2.6em); }
        39%, 49% { transform: translateY(-5.2em); }
        53%, 100% { transform: translateY(-7.8em); }
      }
      @keyframes fdDone {
        0%, 74% { opacity: 0; }
        76%, 100% { opacity: 1; }
      }
      @keyframes fdZoom {
        0%, 58% { transform: scale(1); }
        66%, 88% { transform: scale(1.45); }
        94%, 100% { transform: scale(1); }
      }

      /* ══ 02 · 검색에 잡히는 구조 ══ */
      .sd-box { left: 5em; top: 2.4em; width: 30em; height: 3.6em; border: 1px solid #cfcfcb; border-radius: 9999px; }
      .sd-query { left: 1.5em; top: 0; height: 3.6em; line-height: 3.6em; width: 0; overflow: hidden; font-weight: 600; }
      .sd-go {
        right: 0.45em;
        top: 0.45em;
        width: 2.7em;
        height: 2.7em;
        border-radius: 50%;
        background: #111;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sd-go svg { position: static; width: 1.4em; height: 1.4em; }
      .sd-chip {
        top: 7.3em;
        width: 4em;
        height: 1.8em;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #dcdcd8;
        border-radius: 9999px;
        color: #a0a0a0;
      }
      .sd-chip .t { font-size: 0.8em; font-weight: 800; letter-spacing: 0.04em; }
      .sd-chip--1 { left: 5em; }
      .sd-chip--2 { left: 9.6em; }
      .sd-chip--3 { left: 14.2em; }
      /* 결과 칸 — 한 줄 4.4em, 줄 사이 0.6em (한 칸 = 5em) */
      .sd-results { left: 5em; top: 10.4em; width: 30em; height: 14.4em; opacity: 0; }
      .sd-row { left: 0; width: 30em; height: 4.4em; border: 1px solid #ececea; border-radius: 0.9em; background: #fff; }
      .sd-row--a { top: 0; }
      .sd-row--b { top: 5em; }
      .sd-row--me { top: 10em; border: 1.5px solid var(--a-line); background: var(--a-soft); z-index: 2; }
      .sd-fav { left: 1em; top: 1.2em; width: 1.8em; height: 1.8em; border-radius: 0.5em; background: #e3e3e0; }
      .sd-fav--me { background: #111; }
      .sd-row strong { left: 3.6em; top: 0.65em; font-weight: 800; }
      .sd-rank { right: 1em; top: 1.2em; height: 2em; padding: 0 0.8em; overflow: hidden; border-radius: 9999px; background: var(--a-fill); color: var(--a-ink); }
      .sd-rank em { font-size: 0.85em; height: 2.353em; line-height: 2.353em; font-weight: 800; }
      /* 답변 카드 둘 — 우리 사이트 아래 두 칸 자리에 차례로 들어온다 */
      .sd-card { left: 0; width: 30em; height: 4.4em; border-radius: 0.9em; background: #f6f6f4; opacity: 0; z-index: 3; }
      .sd-card--aeo { top: 5em; }
      /* GEO 는 답이 두 줄이라 카드가 조금 더 높다 */
      .sd-card--geo { top: 10em; height: 5.7em; }
      .sd-card--geo .sd-card__line { top: 2.6em; }
      .sd-card--geo .sd-card__line--2 { top: 3.95em; }
      .sd-card--geo .sd-card__src { top: 1.9em; }
      .sd-card__label { left: 1.2em; top: 0.75em; }
      .sd-card__label .t { font-size: 0.8em; font-weight: 800; color: var(--a-deep); }
      .sd-card__line { left: 1.2em; top: 2.75em; width: 0; height: 0.6em; }
      .sd-card__src {
        right: 1em;
        top: 1.25em;
        height: 1.9em;
        padding: 0 0.9em;
        display: flex;
        align-items: center;
        border-radius: 9999px;
        background: #111;
        color: #fff;
        opacity: 0;
      }
      .sd-card__src .t { font-size: 0.8em; font-weight: 700; }

      .is-on .sd .wd-cursor { animation: sdCursor 10s cubic-bezier(0.45, 0.05, 0.2, 1) infinite; }
      .is-on .sd .wd-ring { animation: sdRing 10s ease-out infinite; }
      .is-on .sd-query { animation: sdType 10s steps(12, end) infinite; }
      .is-on .sd-results { animation: sdShow 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .sd-chip--1 { animation: sdChip1 10s linear infinite; }
      .is-on .sd-chip--2 { animation: sdChip2 10s linear infinite; }
      .is-on .sd-chip--3 { animation: sdChip3 10s linear infinite; }
      .is-on .sd-row--me { animation: sdMe 10s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
      .is-on .sd-row--b { animation: sdB 10s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
      .is-on .sd-row--a { animation: sdA 10s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
      .is-on .sd-rank__strip { animation: sdRank 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .sd-card--aeo { animation: sdAeo 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .sd-card--aeo .sd-card__line { animation: sdAeoLine 10s ease-out infinite; }
      .is-on .sd-card--aeo .sd-card__src { animation: sdAeoSrc 10s linear infinite; }
      .is-on .sd-card--geo { animation: sdGeo 10s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .sd-card--geo .sd-card__line { animation: sdGeoLine 10s ease-out infinite; }
      .is-on .sd-card--geo .sd-card__line--2 { animation: sdGeoLine2 10s ease-out infinite; }
      .is-on .sd-card--geo .sd-card__src { animation: sdGeoSrc 10s linear infinite; }
      .sd .wd-cursor { transform: translate(27em, 24em); }

      /* 검색어 — 5~17% 동안 한 자씩 */
      @keyframes sdType {
        0%, 5% { width: 0; }
        17%, 100% { width: 11.4em; }
      }
      /* 커서 — 검색 버튼(33.2, 4.2)을 누르고 물러난다 */
      @keyframes sdCursor {
        0%, 8% { transform: translate(27em, 24em); }
        17%, 23% { transform: translate(33.05em, 4.05em); }
        20% { transform: translate(33.05em, 4.05em) scale(0.88); }
        32%, 100% { transform: translate(35.5em, 25.5em); }
      }
      @keyframes sdRing {
        0%, 19.9% { transform: scale(0); opacity: 0; }
        20% { transform: scale(0.4); opacity: 0.9; }
        25%, 100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes sdShow {
        0%, 21% { opacity: 0; transform: translateY(1.2em); }
        27%, 100% { opacity: 1; transform: translateY(0); }
      }
      /* 칩 — SEO(31%) · AEO(52%) · GEO(68%) 차례로 켜진다 */
      @keyframes sdChip1 {
        0%, 31% { background: #fff; color: #a0a0a0; border-color: #dcdcd8; }
        33%, 100% { background: var(--a-fill); color: var(--a-ink); border-color: var(--a-fill); }
      }
      @keyframes sdChip2 {
        0%, 52% { background: #fff; color: #a0a0a0; border-color: #dcdcd8; }
        54%, 100% { background: var(--a-fill); color: var(--a-ink); border-color: var(--a-fill); }
      }
      @keyframes sdChip3 {
        0%, 68% { background: #fff; color: #a0a0a0; border-color: #dcdcd8; }
        70%, 100% { background: var(--a-fill); color: var(--a-ink); border-color: var(--a-fill); }
      }
      /* SEO — 우리 사이트: 셋째 칸 → 둘째 칸(33~38%) → 첫째 칸(41~46%). 밀려난 줄은 한 칸씩 내려간다.
         순위 다툼이 끝나면(50%~) 남의 줄은 걷어 내고 그 자리에 답변 카드가 들어온다 */
      @keyframes sdMe {
        0%, 33% { transform: translateY(0); }
        38%, 41% { transform: translateY(-5em); }
        46%, 100% { transform: translateY(-10em); }
      }
      @keyframes sdB {
        0%, 33% { transform: translateY(0); opacity: 1; }
        38%, 50% { transform: translateY(5em); opacity: 1; }
        53%, 100% { transform: translateY(5em); opacity: 0; }
      }
      @keyframes sdA {
        0%, 41% { transform: translateY(0); opacity: 1; }
        46%, 50% { transform: translateY(5em); opacity: 1; }
        53%, 100% { transform: translateY(5em); opacity: 0; }
      }
      @keyframes sdRank {
        0%, 34% { transform: translateY(0); }
        38%, 42% { transform: translateY(-2em); }
        46%, 100% { transform: translateY(-4em); }
      }
      /* AEO — 답변 카드가 들어오고, 답이 써지고, 출처가 붙는다 */
      @keyframes sdAeo {
        0%, 54% { opacity: 0; transform: translateY(1.2em); }
        59%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes sdAeoLine {
        0%, 58% { width: 0; }
        64%, 100% { width: 15em; }
      }
      @keyframes sdAeoSrc {
        0%, 64% { opacity: 0; }
        66%, 100% { opacity: 1; }
      }
      /* GEO — 같은 순서로 한 번 더 */
      @keyframes sdGeo {
        0%, 70% { opacity: 0; transform: translateY(1.2em); }
        75%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes sdGeoLine {
        0%, 74% { width: 0; }
        79%, 100% { width: 15em; }
      }
      @keyframes sdGeoLine2 {
        0%, 78% { width: 0; }
        83%, 100% { width: 10em; }
      }
      @keyframes sdGeoSrc {
        0%, 83% { opacity: 0; }
        85%, 100% { opacity: 1; }
      }

      /* ══ 03 · 모바일에서도 빠른 로딩 (12.5초: 코드 0~20% → 결과 26~100%) ══ */
      .pd-phone {
        left: 5em;
        top: 2.2em;
        width: 12.6em;
        height: 25.6em;
        border: 0.35em solid #111;
        border-radius: 2em;
        background: #fff;
        overflow: hidden;
      }
      /* 휴대폰 안쪽 좌표 (테두리 안쪽 11.9em × 24.9em 기준) */
      .pd-url { left: 0.8em; top: 0.9em; width: 7.9em; height: 1.7em; border-radius: 9999px; background: #efefec; }
      .pd-reload {
        left: 9.3em;
        top: 0.75em;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        background: #111;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .pd-reload svg { position: static; width: 1.2em; height: 1.2em; }
      .pd-progress { left: 0; top: 3.2em; width: 0; height: 0.22em; background: var(--a-line); }
      .pd-page { left: 0; top: 3.5em; width: 100%; height: 21.4em; }
      .pd-page > * { opacity: 0; }
      .pd-hero { left: 0.8em; top: 0.4em; width: 10.3em; height: 6.6em; border-radius: 0.8em; background: linear-gradient(135deg, #d6ebff, #9ccbf7); }
      /* 제목 줄(검정)과 그 아래 설명 줄(회색)은 히어로와 같은 폭 */
      .pd-b1 { left: 0.8em; top: 8em; width: 10.3em; background: #111; }
      .pd-b2 { left: 0.8em; top: 9.6em; width: 10.3em; height: 0.5em; }
      .pd-card { top: 11.4em; width: 4.9em; height: 5em; border-radius: 0.7em; background: #f1f1ee; }
      .pd-card--1 { left: 0.8em; }
      .pd-card--2 { left: 6.2em; }
      .pd-cta { left: 0.8em; top: 17.6em; width: 10.3em; height: 2.4em; border-radius: 0.7em; background: #111; }

      /* 오른쪽 묶음(점수 · 로딩 · 칩)은 4.1~25.9em — 휴대폰(2.2~27.8em)과 세로 가운데가 같다 */
      .pd-gauge { left: 23.2em; top: 4.1em; width: 10em; height: 10em; }
      .pd-gauge svg { position: static; display: block; width: 100%; height: 100%; }
      .pd-gauge__fill { stroke: var(--a-line); stroke-dasharray: 326.73; stroke-dashoffset: 326.73; }
      /* 점수 — 글자는 2.6배, 한 칸 높이는 3.2em (2.6 × 1.2308) */
      .pd-score { left: 0; top: 3.4em; width: 10em; height: 3.2em; overflow: hidden; text-align: center; }
      .pd-score em { font-size: 2.6em; height: 1.2308em; line-height: 1.2308em; font-weight: 800; letter-spacing: -0.03em; }
      .pd-gauge__label { left: 23.2em; top: 14.7em; width: 10em; text-align: center; font-weight: 700; }
      .pd-time {
        left: 23.3em;
        top: 17.1em;
        width: 9.8em;
        height: 2.3em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        border: 1px solid #dcdcd8;
        border-radius: 9999px;
      }
      .pd-time .t { font-size: 0.9em; font-weight: 600; }
      .pd-time b { position: static; display: block; font-size: 0.9em; height: 1.3em; overflow: hidden; font-weight: 800; }
      .pd-time em { height: 1.3em; line-height: 1.3em; }
      /* 네 칸 — 폭 6.4em 로 같게, 2 × 2 */
      .pd-chip {
        width: 6.4em;
        height: 2.1em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background: #111;
        color: #fff;
        opacity: 0;
      }
      .pd-chip .t { font-size: 0.8em; font-weight: 700; }
      .pd-chip--1 { left: 21.6em; top: 21.1em; }
      .pd-chip--2 { left: 28.4em; top: 21.1em; }
      .pd-chip--3 { left: 21.6em; top: 23.8em; }
      .pd-chip--4 { left: 28.4em; top: 23.8em; }

      /* 코드 장면 — 어두운 편집기가 창을 다 덮는다 */
      /* 오른쪽·아래로 2px 더 내밀어, 소수점 반올림으로 창 가장자리에 틈이 비치지 않게 한다 */
      .pd-code { inset: 0 -2px -2px 0; background: #15181d; color: #d7dbe0; z-index: 5; }
      .pd-dot { top: 1.5em; width: 0.8em; height: 0.8em; border-radius: 50%; }
      .pd-tab { left: 6.6em; top: 1em; height: 1.9em; padding: 0 0.9em; display: flex; align-items: center; border-radius: 0.5em; background: #242930; }
      .pd-tab .t { font-size: 0.8em; color: #c5cad1; }
      .pd-stack { right: calc(1.4em + 2px); top: 1em; height: 1.9em; padding: 0 0.9em; display: flex; align-items: center; border-radius: 9999px; background: var(--a-fill); color: var(--a-ink); }
      .pd-stack .t { font-size: 0.75em; font-weight: 800; }
      /* 한 줄 — 왼쪽부터 글자가 드러난다. 줄마다 시작을 0.25초씩 늦춘다(animation-delay) */
      .pd-ln {
        left: 1.4em;
        height: 2em;
        display: flex;
        align-items: center;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        clip-path: inset(0 100% 0 0);
      }
      .pd-ln .t { font-size: 1.02em; }
      .pd-ln .t .t { font-size: 1em; }
      .pd-no { display: inline-block; width: 2.4em; color: #5d6570; }
      .pd-k { color: #8ecbff; }
      .pd-c { color: #ffffff; font-weight: 700; }
      .pd-p { color: #b7e0ff; }

      /* 확대 축은 오른쪽 묶음의 세로 가운데(15em = 50%) — 커졌을 때 위아래 여백이 같아진다 */
      .is-on .pd .wd-zoom { animation: pdZoom 12.5s ease-in-out infinite; transform-origin: 100% 50%; }
      .is-on .pd .wd-cursor { animation: pdCursor 12.5s cubic-bezier(0.45, 0.05, 0.2, 1) infinite; }
      .is-on .pd .wd-ring { animation: pdRing 12.5s ease-out infinite; }
      .is-on .pd-code { animation: pdCode 12.5s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
      .is-on .pd-ln { animation: pdType 12.5s steps(26, end) infinite backwards; }
      .is-on .pd-progress { animation: pdProgress 12.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .pd-hero { animation: pdIn1 12.5s ease-out infinite; }
      .is-on .pd-b1, .is-on .pd-b2 { animation: pdIn2 12.5s ease-out infinite; }
      .is-on .pd-card { animation: pdIn3 12.5s ease-out infinite; }
      .is-on .pd-cta { animation: pdIn4 12.5s ease-out infinite; }
      .is-on .pd-gauge__fill { animation: pdGauge 12.5s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
      .is-on .pd-score__strip { animation: pdScore 12.5s steps(1, end) infinite; }
      .is-on .pd-time__strip { animation: pdTime 12.5s steps(1, end) infinite; }
      .is-on .pd-chip--1 { animation: pdChip1 12.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .pd-chip--2 { animation: pdChip2 12.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .pd-chip--3 { animation: pdChip3 12.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .pd-chip--4 { animation: pdChip4 12.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .pd .wd-cursor { transform: translate(21em, 25em); opacity: 0; }

      /* 코드 한 줄 — 제 차례(1.5~3.5%, 약 0.25초)에 써지고, 편집기가 걷힌 뒤(60%~)에는 다음 바퀴를 위해 다시 지운다.
         줄마다 늦게 시작하므로, 지운 상태가 다음 바퀴의 제 차례까지 이어져야 앞줄보다 먼저 보이지 않는다 */
      @keyframes pdType {
        0%, 1.5% { clip-path: inset(0 100% 0 0); }
        3.5%, 60% { clip-path: inset(0 0 0 0); }
        60.01%, 100% { clip-path: inset(0 100% 0 0); }
      }
      /* 편집기 — 여덟 줄이 다 써지면(약 18%) 잠깐 뒤 위로 걷힌다 */
      @keyframes pdCode {
        0%, 20% { transform: translateY(0); }
        26%, 100% { transform: translateY(-104%); }
      }
      /* 커서 — 편집기가 걷힌 뒤 나타나 새로고침(15.65, 4.3)을 누르고 물러난다 */
      @keyframes pdCursor {
        0%, 24% { transform: translate(21em, 25em); opacity: 0; }
        27% { transform: translate(21em, 25em); opacity: 1; }
        33%, 37.5% { transform: translate(15.5em, 4.15em); opacity: 1; }
        35.2% { transform: translate(15.5em, 4.15em) scale(0.88); opacity: 1; }
        45.5%, 94% { transform: translate(19.6em, 26em); opacity: 1; }
        100% { transform: translate(19.6em, 26em); opacity: 0; }
      }
      @keyframes pdRing {
        0%, 35.1% { transform: scale(0); opacity: 0; }
        35.2% { transform: scale(0.4); opacity: 0.9; }
        39.8%, 100% { transform: scale(1.5); opacity: 0; }
      }
      /* 로딩 줄이 한 번에 지나가고(35~40%), 화면 조각이 바로바로 뜬다 */
      @keyframes pdProgress {
        0%, 35.2% { width: 0; opacity: 1; }
        39.8% { width: 100%; opacity: 1; }
        42%, 100% { width: 100%; opacity: 0; }
      }
      @keyframes pdIn1 {
        0%, 37.5% { opacity: 0; transform: translateY(0.6em); }
        39.8%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdIn2 {
        0%, 38.6% { opacity: 0; transform: translateY(0.6em); }
        41%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdIn3 {
        0%, 39.8% { opacity: 0; transform: translateY(0.6em); }
        42.1%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdIn4 {
        0%, 41% { opacity: 0; transform: translateY(0.6em); }
        43.2%, 100% { opacity: 1; transform: translateY(0); }
      }
      /* 점수 — 원이 끝까지 차고(42~57%), 숫자는 그 사이 세 번 바뀌어 100 */
      @keyframes pdGauge {
        0%, 42% { stroke-dashoffset: 326.73; }
        57%, 100% { stroke-dashoffset: 0; }
      }
      @keyframes pdScore {
        0% { transform: translateY(0); }
        46.7% { transform: translateY(-3.2em); }
        52.4% { transform: translateY(-6.4em); }
        57%, 100% { transform: translateY(-9.6em); }
      }
      @keyframes pdTime {
        0% { transform: translateY(0); }
        37.5% { transform: translateY(-1.3em); }
        41%, 100% { transform: translateY(-2.6em); }
      }
      @keyframes pdChip1 {
        0%, 60.5% { opacity: 0; transform: translateY(0.8em); }
        64%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdChip2 {
        0%, 64% { opacity: 0; transform: translateY(0.8em); }
        67.4%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdChip3 {
        0%, 67.4% { opacity: 0; transform: translateY(0.8em); }
        70.9%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdChip4 {
        0%, 70.9% { opacity: 0; transform: translateY(0.8em); }
        74.3%, 100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes pdZoom {
        0%, 77% { transform: scale(1); }
        83%, 90% { transform: scale(1.3); }
        95%, 100% { transform: scale(1); }
      }

      /* ══ 04 · 나만의 관리자 페이지 (14초: 문의 0~46% → 유입 52~100%) ══ */
      .ad-side { left: 0; top: 0; width: 9em; height: 100%; background: #f6f6f4; border-right: 1px solid #ececea; }
      .ad-logo { left: 1.2em; top: 1.4em; }
      .ad-logo .t { font-size: 1.05em; font-weight: 900; letter-spacing: 0.02em; }
      .ad-menu { left: 0.6em; width: 7.8em; height: 2.3em; padding-left: 0.7em; display: flex; align-items: center; border-radius: 0.6em; }
      .ad-menu .t { font-size: 0.85em; font-weight: 600; }
      .ad-menu--inq { top: 4.2em; background: #111; color: #fff; }
      .ad-menu--flow { top: 7em; background: transparent; color: #8a8a8a; }

      /* 본문 — 두 화면을 같은 자리에 겹쳐 둔다 (창 왼쪽 9em 부터) */
      .ad-view { left: 9em; top: 0; width: 31em; height: 100%; }
      .ad-view--flow { opacity: 0; }
      .ad-title { left: 1.6em; top: 1.8em; }
      .ad-title .t { font-size: 1.5em; font-weight: 800; letter-spacing: -0.02em; }
      .ad-stat {
        top: 1.8em;
        height: 2.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45em;
        border: 1px solid #dcdcd8;
        border-radius: 9999px;
      }
      .ad-stat .t { font-size: 0.85em; font-weight: 600; }
      .ad-stat b { position: static; display: block; font-size: 0.85em; height: 1.3em; overflow: hidden; font-weight: 800; }
      .ad-stat b .t { font-size: 1em; font-weight: 800; }
      .ad-stat em { height: 1.3em; line-height: 1.3em; }
      .ad-stat--done { background: #111; border-color: #111; color: #fff; }

      /* 목록 — 한 줄 4.6em, 한 칸 5.2em. 5.7em 에서 시작한다.
         처음엔 1~3번 줄이 위 세 칸에 있다가, 0번(새 문의)이 들어오면 한 칸씩 내려간다 */
      .ad-row { left: 1.6em; width: 27.8em; height: 4.6em; border: 1px solid #ececea; border-radius: 0.9em; background: #fff; }
      .ad-row--0 { top: 5.7em; opacity: 0; }
      .ad-row--1 { top: 5.7em; }
      .ad-row--2 { top: 10.9em; }
      .ad-row--3 { top: 16.1em; }
      .ad-who { left: 1em; top: 1.25em; width: 2.1em; height: 2.1em; border-radius: 50%; }
      .ad-kind { left: 4em; top: 2.3em; }
      .ad-kind .t { font-size: 0.8em; color: #777; }
      .ad-time { left: 15.6em; top: 1.6em; }
      .ad-time .t { font-size: 0.75em; color: #a0a0a0; }
      /* 상태 칩 — '신규' 위에 '연락 완료' 를 겹쳐 두고 눌린 순간에 바꿔 보인다 */
      .ad-chip { left: 20.8em; top: 1.3em; width: 6em; height: 2em; }
      .ad-chip > span { inset: 0; display: flex; align-items: center; justify-content: center; border-radius: 9999px; }
      .ad-chip .t { font-size: 0.8em; font-weight: 700; }
      .ad-chip__new { border: 1px solid #111; background: #fff; }
      .ad-chip__done { background: var(--a-fill); color: var(--a-ink); opacity: 0; }

      /* 유입 관리 — 제목 아래 5em 부터가 스크롤되는 창. 그 안의 내용을 위로 올려 '내려 보는' 모습을 만든다 */
      .ad-scroll { left: 0; top: 5em; width: 31em; height: 25em; overflow: hidden; }
      .ad-scroll__in { left: 0; top: 0; width: 31em; height: 38em; }
      /* 숫자 상자 둘 — 가로로 나란히 */
      .ad-box { top: 0.6em; width: 13.6em; height: 5.6em; border: 1px solid #ececea; border-radius: 0.9em; background: #fff; }
      .ad-box__label { left: 1.1em; top: 0.9em; }
      .ad-box__label .t { font-size: 0.8em; color: #8a8a8a; }
      .ad-box__value { left: 1.1em; top: 2.2em; }
      .ad-box__value .t { font-size: 1.8em; font-weight: 800; letter-spacing: -0.03em; }
      /* 한 줄 요약 — 상자 둘 아래 가로로 긴 띠 */
      .ad-tip { left: 1.6em; top: 7em; width: 27.8em; height: 3em; padding-left: 1.1em; display: flex; align-items: center; border-radius: 0.9em; background: var(--a-soft); }
      .ad-tip .t { font-size: 0.8em; font-weight: 600; }
      .ad-tip b.t { font-size: 1em; font-weight: 800; color: var(--a-deep); }
      /* 카드 둘 — 유입 소스(10.8em~), 날짜별 방문자(23.8em~, 처음엔 창 아래로 조금만 걸쳐 보인다) */
      .ad-card { left: 1.6em; width: 27.8em; border: 1px solid #ececea; border-radius: 0.9em; background: #fff; }
      .ad-card--src { top: 10.8em; height: 12.2em; }
      .ad-card--day { top: 23.8em; height: 13.2em; }
      .ad-card__title { left: 1.1em; top: 0.85em; }
      .ad-card__title .t { font-size: 0.85em; font-weight: 800; }
      .ad-flow { left: 1.1em; width: 25.6em; height: 2.4em; }
      .ad-flow__name { left: 0; top: 0; }
      .ad-flow__name .t { font-size: 0.78em; font-weight: 600; color: #555; }
      .ad-flow__track { left: 0; top: 1.35em; width: 20.4em; height: 0.85em; border-radius: 9999px; background: #f1f1ee; }
      .ad-flow__fill { left: 0; top: 1.35em; width: 0; height: 0.85em; border-radius: 9999px; background: var(--a-fill); }
      .ad-flow__fill--top { background: var(--a-line); }
      .ad-flow__pct { left: 21.4em; top: 1em; }
      .ad-flow__pct .t { font-size: 0.85em; font-weight: 800; }
      .ad-chart { left: 1.1em; top: 2.7em; width: 25.6em; height: 10em; overflow: visible; }
      /* 눈금 글씨 — 그래프 좌표 7.5 = 0.75em */
      .ad-chart text { font-size: 7.5px; fill: #8a8a8a; }
      .ad-chart__line { fill: none; stroke: var(--a-line); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 100; }
      .ad-chart__area { fill: var(--a-soft); opacity: 0; }
      .ad-chart__dot { fill: #fff; stroke: var(--a-line); stroke-width: 2.2; opacity: 0; }

      .is-on .ad .wd-cursor { animation: adCursor 14s cubic-bezier(0.45, 0.05, 0.2, 1) infinite; }
      .is-on .ad .wd-ring { animation: adRing 14s ease-out infinite; }
      .is-on .ad-row--0 { animation: adRowIn 14s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .ad-row--1, .is-on .ad-row--2, .is-on .ad-row--3 { animation: adRowDown 14s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      .is-on .ad-row--0 .ad-chip__done { animation: adDone0 14s linear infinite; }
      .is-on .ad-row--1 .ad-chip__done { animation: adDone1 14s linear infinite; }
      .is-on .ad-row--2 .ad-chip__done { animation: adDone2 14s linear infinite; }
      .is-on .ad-row--3 .ad-chip__done { animation: adDone3 14s linear infinite; }
      .is-on .ad-new__strip { animation: adCountNew 14s steps(1, end) infinite; }
      .is-on .ad-done__strip { animation: adCountDone 14s steps(1, end) infinite; }
      .is-on .ad-menu--inq { animation: adMenuOff 14s linear infinite; }
      .is-on .ad-menu--flow { animation: adMenuOn 14s linear infinite; }
      .is-on .ad-view--inq { animation: adViewOut 14s ease infinite; }
      .is-on .ad-view--flow { animation: adViewIn 14s ease infinite; }
      .is-on .ad-flow__fill { animation: adFill 14s cubic-bezier(0.16, 1, 0.3, 1) infinite backwards; }
      .is-on .ad-scroll__in { animation: adScroll 14s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
      .is-on .ad-chart__line { animation: adLine 14s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
      .is-on .ad-chart__area { animation: adArea 14s ease infinite; }
      .is-on .ad-chart__dot { animation: adDot 14s ease infinite; }
      .ad .wd-cursor { transform: translate(30em, 26em); }

      /* 새 문의 — 5~10% 에 첫 칸으로 들어오며 하늘색으로 한 번 반짝인다. 나머지는 한 칸씩 내려간다 */
      @keyframes adRowIn {
        0%, 5% { opacity: 0; transform: translateY(-1.2em); background: var(--a-soft); }
        10% { opacity: 1; transform: translateY(0); background: var(--a-soft); }
        18%, 100% { opacity: 1; transform: translateY(0); background: #fff; }
      }
      @keyframes adRowDown {
        0%, 5% { transform: translateY(0); }
        10%, 100% { transform: translateY(5.2em); }
      }
      /* 칩 — 맨 아랫줄부터 위로, 커서가 누르는 순간(17 · 24 · 31 · 38%)에 '연락 완료' 로 */
      @keyframes adDone3 { 0%, 17% { opacity: 0; } 18%, 100% { opacity: 1; } }
      @keyframes adDone2 { 0%, 24% { opacity: 0; } 25%, 100% { opacity: 1; } }
      @keyframes adDone1 { 0%, 31% { opacity: 0; } 32%, 100% { opacity: 1; } }
      @keyframes adDone0 { 0%, 38% { opacity: 0; } 39%, 100% { opacity: 1; } }
      /* 집계 — 신규 3 → 4 → 3 → 2 → 1 → 0, 연락 완료 0 → 1 → 2 → 3 → 4 */
      @keyframes adCountNew {
        0% { transform: translateY(0); }
        8% { transform: translateY(-1.3em); }
        17.5% { transform: translateY(-2.6em); }
        24.5% { transform: translateY(-3.9em); }
        31.5% { transform: translateY(-5.2em); }
        38.5%, 100% { transform: translateY(-6.5em); }
      }
      @keyframes adCountDone {
        0% { transform: translateY(0); }
        17.5% { transform: translateY(-1.3em); }
        24.5% { transform: translateY(-2.6em); }
        31.5% { transform: translateY(-3.9em); }
        38.5%, 100% { transform: translateY(-5.2em); }
      }
      /* 커서 — 칩 넷(가로 34.4, 세로 23.6 · 18.4 · 13.2 · 8.0)을 아래에서 위로 차례로 누르고,
         유입 관리 메뉴(4.5, 8.15)를 누른 뒤 본문 위에 머문다 */
      @keyframes adCursor {
        0%, 10% { transform: translate(30em, 26em); }
        15%, 19% { transform: translate(34.25em, 23.45em); }
        17% { transform: translate(34.25em, 23.45em) scale(0.88); }
        22.5%, 26% { transform: translate(34.25em, 18.25em); }
        24% { transform: translate(34.25em, 18.25em) scale(0.88); }
        29.5%, 33% { transform: translate(34.25em, 13.05em); }
        31% { transform: translate(34.25em, 13.05em) scale(0.88); }
        36.5%, 40% { transform: translate(34.25em, 7.85em); }
        38% { transform: translate(34.25em, 7.85em) scale(0.88); }
        48%, 52% { transform: translate(4.35em, 8em); }
        50% { transform: translate(4.35em, 8em) scale(0.88); }
        61%, 94% { transform: translate(33em, 21.5em); }
        100% { transform: translate(30em, 26em); }
      }
      @keyframes adRing {
        0%, 16.9% { transform: scale(0); opacity: 0; }
        17% { transform: scale(0.4); opacity: 0.9; }
        20.5% { transform: scale(1.5); opacity: 0; }
        23.9% { transform: scale(0); opacity: 0; }
        24% { transform: scale(0.4); opacity: 0.9; }
        27.5% { transform: scale(1.5); opacity: 0; }
        30.9% { transform: scale(0); opacity: 0; }
        31% { transform: scale(0.4); opacity: 0.9; }
        34.5% { transform: scale(1.5); opacity: 0; }
        37.9% { transform: scale(0); opacity: 0; }
        38% { transform: scale(0.4); opacity: 0.9; }
        41.5% { transform: scale(1.5); opacity: 0; }
        49.9% { transform: scale(0); opacity: 0; }
        50% { transform: scale(0.4); opacity: 0.9; }
        54%, 100% { transform: scale(1.5); opacity: 0; }
      }
      /* 메뉴 — 50% 에 '유입 관리' 가 켜지고 '문의 관리' 가 꺼진다 */
      @keyframes adMenuOff {
        0%, 50% { background: #111; color: #fff; }
        51%, 100% { background: transparent; color: #8a8a8a; }
      }
      @keyframes adMenuOn {
        0%, 50% { background: transparent; color: #8a8a8a; }
        51%, 100% { background: #111; color: #fff; }
      }
      @keyframes adViewOut {
        0%, 50% { opacity: 1; }
        53%, 100% { opacity: 0; }
      }
      @keyframes adViewIn {
        0%, 51% { opacity: 0; transform: translateY(0.8em); }
        56%, 100% { opacity: 1; transform: translateY(0); }
      }
      /* 막대 — 화면이 바뀐 뒤(56%~) 길이(--w)만큼 자란다. 줄마다 조금씩 늦게.
         되돌리는 건 본문이 지워지는 한 바퀴 끝(97%~)에 한다 */
      @keyframes adFill {
        0%, 56% { width: 0; }
        63%, 97% { width: var(--w); }
        97.01%, 100% { width: 0; }
      }
      /* 아래로 내려 보기 — 68~76% 에 12.8em 올라가 '날짜별 방문자' 카드 아랫변이 창 바닥 바로 위에 온다 */
      @keyframes adScroll {
        0%, 68% { transform: translateY(0); }
        76%, 100% { transform: translateY(-12.8em); }
      }
      /* 꺾은선 — 내려온 뒤(76%~) 왼쪽부터 그려지고, 아래 면과 끝점이 따라 나타난다 */
      @keyframes adLine {
        0%, 76% { stroke-dashoffset: 100; }
        87%, 100% { stroke-dashoffset: 0; }
      }
      @keyframes adArea {
        0%, 84% { opacity: 0; }
        89%, 100% { opacity: 1; }
      }
      @keyframes adDot {
        0%, 86% { opacity: 0; }
        88%, 100% { opacity: 1; }
      }
    `}</style>
  )
}
