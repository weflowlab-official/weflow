/**
 * 스마트로그(Smartlog) 설정과 전환 신호.
 *
 * 메인 스크립트는 components/Smartlog.tsx 가 </body> 직전에 싣고,
 * 전환(문의 완료)은 이 파일의 trackSmartlogInquiry 가 쏜다.
 *
 * 스마트로그는 원래 "완료 페이지"를 전제로 만들어졌다 — hpt_trace_info 를 먼저 선언해 두면
 * 그 아래에서 smart.js 가 읽어 가는 방식이다. 그런데 이 사이트는 폼을 fetch 로 보내고
 * 화면만 바꾸므로 페이지가 새로 뜨지 않아, 그 순서를 만들어 줄 자리가 없다.
 * 그래서 신청이 끝난 순간 hpt_trace_info 를 심고 smart.js 를 한 번 더 붙인다.
 * (선언 → 스크립트 순서는 그대로 지켜진다)
 */
export const SMARTLOG_ACCOUNT = 'UHPT-39185'
export const SMARTLOG_SERVER = 'a31'
export const SMARTLOG_SRC = 'https://cdn.smlog.co.kr/core/smart.js'
/** JS 를 끈 방문자용 픽셀 — 계정 번호는 위 _account 에서 UHPT- 를 뗀 값이다 */
export const SMARTLOG_NOSCRIPT_SRC = `https://${SMARTLOG_SERVER}.smlog.co.kr/smart_bda.php?_account=39185`

declare global {
  interface Window {
    hpt_info?: Record<string, string>
    hpt_trace_info?: Record<string, string>
  }
}

const SENT_KEY = 'weflow_smartlog_cnv'

/**
 * 문의 전환(_mode:'q') — 상담 신청·예약·점검 리드가 완료된 순간 호출한다.
 *
 * 회원 제도가 없는 사이트라 _memid 는 공란으로 둔다(스마트로그 안내대로).
 * 같은 탭에서는 한 번만 보낸다 — "추가 신청"·점검 재실행으로 두 번 제출해도
 * 사람은 한 명이므로 전환 수가 부풀지 않게 한다.
 * 메인 스크립트가 안 켜져 있으면(로컬·미리보기) 조용히 아무것도 안 한다.
 */
export function trackSmartlogInquiry(): void {
  if (typeof window === 'undefined') return
  try {
    if (!window.hpt_info) return
    if (sessionStorage.getItem(SENT_KEY)) return

    window.hpt_trace_info = { _mode: 'q', _memid: '' }

    const s = document.createElement('script')
    s.src = SMARTLOG_SRC
    s.charset = 'utf-8'
    document.body.appendChild(s)

    sessionStorage.setItem(SENT_KEY, '1')
  } catch {
    /* 전환 신호 오류가 신청 완료 화면을 막으면 안 된다 */
  }
}
