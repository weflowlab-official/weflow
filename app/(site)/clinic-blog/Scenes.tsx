import type { ReactNode } from 'react'
import InView from './InView'
import SearchMock, { type SearchResult } from './SearchMock'

/**
 * 대화 장면 둘 — 병의원 페이지(page.tsx)와 메인 사이트 '웹블로그란?'(app/(site)/webblog)이 같이 쓴다.
 *  - AiSearchScene (WHY NOW 01): 왼쪽 PC 검색 결과(SearchMock) + 오른쪽 휴대폰 AI 검색 대화
 *  - PlatformDropScene (WHY NOW 02): 블로그 방문자 그래프가 뚝 떨어지고 대화가 이어진다
 * 글귀는 모두 props 로 받는다 — 병원이면 '환자·원장님', 업종 공통이면 '손님·사장님'.
 * 모양은 base-css.ts 의 SCENE_CSS 에 있다 (쓰는 페이지가 <style> 에 함께 넣는다).
 */

/** 말하는 사람 — 왼쪽(상대)·오른쪽(나) 위치. 이름·동그라미 글자는 Line 마다 받는다 */
export type Speaker = 'me' | 'ai' | 'boss' | 'staff'
const SIDE: Record<Speaker, 'left' | 'right'> = { me: 'right', ai: 'left', boss: 'right', staff: 'left' }
// 색 — AI 는 검정, 손님·대표는 연파랑, 직원은 회색 (예전 cb-who-* 이름을 그대로 써 CSS 를 건드리지 않는다)
const WHO_CLASS: Record<Speaker, string> = { me: 'patient', ai: 'ai', boss: 'director', staff: 'manager' }
/** source 가 있으면 말풍선 대신 '출처 카드' 로 그린다 (AI 답변이 인용한 글) */
export type Line = { who: Speaker; name: string; short: string; text: string; source?: string; time?: string }

/** 대화창 하나 — 말풍선이 --i 순서대로 늦게 올라온다. className 으로 장면마다 모양을 바꾼다 */
export function Chat({ lines, className = '' }: { lines: Line[]; className?: string }) {
  return (
    <InView className={`cb-chat ${className}`}>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`cb-line cb-${SIDE[l.who]} cb-who-${WHO_CLASS[l.who]}`}
          style={{ '--i': i } as React.CSSProperties}
        >
          <span className="cb-avatar" aria-hidden="true">{l.short}</span>
          <div className="cb-bubble-wrap">
            <span className="cb-name">{l.name}</span>
            {l.source ? (
              <p className="cb-bubble cb-src">
                <small>출처 · {l.source}</small>
                {l.text}
              </p>
            ) : (
              <p className="cb-bubble">{l.text}</p>
            )}
            {l.time && <time className="cb-time">{l.time}</time>}
          </div>
        </div>
      ))}
    </InView>
  )
}

/** WHY NOW 01 — 검색창과 AI 에게 먼저 묻는다 */
export function AiSearchScene({ id, title, body, search, lines, note }: {
  id?: string
  title: ReactNode
  body: ReactNode
  search: { query: string; results: SearchResult[]; emptyText: string }
  lines: Line[]
  note: ReactNode
}) {
  return (
    <section id={id} className="cb-scene cb-scene-alt cb-phone-scene">
      <div className="cb-wrap">
        <p className="cb-chapter">WHY NOW 01</p>
        <h2 className="cb-h2">{title}</h2>
        <p className="cb-body">{body}</p>
        {/* 넓은 화면: 왼쪽 PC 검색 결과 + 오른쪽 휴대폰 AI 검색 / 좁은 화면: 위아래로 */}
        <div className="cb-ai-visual">
          <SearchMock {...search} />
          <div className="cb-phone">
            <div className="cb-phone-screen">
              <div className="cb-phone-status"><i /></div>
              <p className="cb-phone-head">
                {/* AI 서비스들이 흔히 쓰는 네 꼭짓점 반짝이 — 특정 회사 로고가 아닌 일반 모양으로 그렸다 */}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <defs>
                    <linearGradient id="cbSpark" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4f8cff" />
                      <stop offset="100%" stopColor="#9b6bff" />
                    </linearGradient>
                  </defs>
                  <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill="url(#cbSpark)" />
                </svg>
                AI 검색
              </p>
              <Chat lines={lines} />
              <p className="cb-phone-input">무엇이든 물어보세요</p>
            </div>
          </div>
        </div>
        <p className="cb-phone-note">{note}</p>
      </div>
    </section>
  )
}

/** WHY NOW 02 — 플랫폼 블로그에만 쌓으면 노출이 빠지는 날 손쓸 수 없다 */
export function PlatformDropScene({ title, body, lines }: { title: ReactNode; body: ReactNode; lines: Line[] }) {
  return (
    <section className="cb-scene">
      <div className="cb-wrap cb-scene-grid">
        <div className="cb-scene-text">
          <p className="cb-chapter">WHY NOW 02</p>
          <h2 className="cb-h2">{title}</h2>
          <p className="cb-body">{body}</p>
        </div>
        <InView className="cb-drop-col">
          <div className="cb-drop">
            <div className="cb-drop-head">
              <span>블로그 방문자</span>
              <small>최근 12개월</small>
            </div>
            <svg className="cb-drop-chart" viewBox="0 0 400 170" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="cbDropFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f63d6" stopOpacity=".16" />
                  <stop offset="100%" stopColor="#1f63d6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="cb-drop-area" d="M0,140 L40,128 L80,120 L120,104 L160,96 L200,82 L240,70 L280,56 L310,46 L325,150 L360,154 L400,156 L400,170 L0,170 Z" fill="url(#cbDropFill)" />
              <path className="cb-drop-line" d="M0,140 L40,128 L80,120 L120,104 L160,96 L200,82 L240,70 L280,56 L310,46 L325,150 L360,154 L400,156" fill="none" stroke="#1f63d6" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="cb-drop-mark">노출 제한</span>
            <p className="cb-drop-toast">⚠ 블로그 검색 노출이 제한되었습니다</p>
          </div>
          <Chat lines={lines} className="cb-after-drop" />
        </InView>
      </div>
    </section>
  )
}
