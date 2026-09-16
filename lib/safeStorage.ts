/**
 * sessionStorage · localStorage 안전 래퍼.
 *
 * 저장소 접근은 "될 때도 있고 안 될 때도 있는" 호출이다. 시크릿 모드, 쿠키·사이트
 * 데이터 차단, 그리고 인스타·카카오톡 같은 인앱 브라우저에서는 읽기만 해도 예외를 던진다.
 *
 * 문제는 그 예외가 엉뚱한 곳을 망가뜨린다는 것이다. 2026-09-16 에 확인한 것들:
 *  - 폼 페이지가 열리자마자 getItem 에서 터져 화면 자체가 안 뜨는 경우
 *  - 문의는 DB 에 저장됐는데 그 직후 removeItem 이 터져 "전송에 실패했어요" 가 뜨는 경우
 *    (고객은 실패한 줄 알고 다시 누르고, 그러다 횟수 제한에 걸린다)
 *
 * 유입의 가장 큰 채널이 인스타(월 863세션)인데 인스타는 인앱 브라우저로 열린다.
 * 하필 제일 많이 들어오는 경로가 제일 위험한 환경이라, 저장소는 반드시 이걸로 쓴다.
 *
 * 원칙 — 저장소가 없어도 하던 일은 계속된다. 읽기는 null, 쓰기는 조용히 넘어간다.
 */

type Kind = 'session' | 'local'

function store(kind: Kind): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    return null
  }
}

/** 값을 읽는다. 저장소를 못 쓰면 null */
export function readStore(kind: Kind, key: string): string | null {
  try {
    return store(kind)?.getItem(key) ?? null
  } catch {
    return null
  }
}

/** 값을 쓴다. 저장소를 못 쓰면 아무 일도 일어나지 않는다 */
export function writeStore(kind: Kind, key: string, value: string): void {
  try {
    store(kind)?.setItem(key, value)
  } catch {
    /* 저장이 막힌 브라우저 — 기록만 못 남길 뿐 하던 일은 계속한다 */
  }
}

/** 값을 지운다. 저장소를 못 쓰면 아무 일도 일어나지 않는다 */
export function removeStore(kind: Kind, key: string): void {
  try {
    store(kind)?.removeItem(key)
  } catch {
    /* 위와 같다 */
  }
}
