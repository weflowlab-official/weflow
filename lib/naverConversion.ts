/**
 * 네이버 검색광고 전환 신호 — 상담 신청·예약·점검 리드가 완료된 순간 호출한다.
 * 네이버 전환 유형 "4" = 신청/예약. 광고시스템이 이걸 받아야
 * "어떤 키워드가 실제 신청을 만들었는지"를 광고 쪽에서도 집계하고 입찰을 최적화한다.
 *
 * 같은 탭(세션)에서는 한 번만 보낸다 — "추가 신청"·점검 재실행으로 두 번 제출해도
 * 사람은 한 명이므로 전환 수가 부풀지 않게 한다.
 * 공통 스크립트(components/NaverAds.tsx)가 안 켜져 있으면 조용히 아무것도 안 한다.
 */
const SENT_KEY = 'weflow_naver_cnv'
const PENDING_KEY = 'weflow_naver_lead_pending'

/**
 * 완료 주소로 넘어가는 방식(/diagnosis/success)에서 쓰는 표시.
 *
 * 주소에 도착한 것만으로 전환을 쏘면 두 가지가 새어 든다 —
 * 허니팟에 걸려 저장되지 않은 봇 요청과, 주소를 직접 친 방문이다.
 * 그래서 저장이 확인된 신청에만 표시를 남기고, 완료 화면은 그 표시를 보고 쏜다.
 */
export function markNaverLead(): void {
  try {
    sessionStorage.setItem(PENDING_KEY, '1')
  } catch {
    /* 저장이 막힌 브라우저에서는 표시를 못 남긴다 — takeNaverLeadMark 쪽에서 봐준다 */
  }
}

/**
 * 표시가 있으면 지우고 true 를 준다. 한 번 쓰면 사라지므로 새로고침해도 다시 안 쏜다.
 * sessionStorage 자체를 못 쓰는 브라우저(시크릿 모드 등)에서는 true —
 * 전환을 조금 더 세는 쪽이, 진짜 신청을 통째로 놓치는 쪽보다 낫다.
 */
export function takeNaverLeadMark(): boolean {
  try {
    if (!sessionStorage.getItem(PENDING_KEY)) return false
    sessionStorage.removeItem(PENDING_KEY)
    return true
  } catch {
    return true
  }
}

export function trackNaverLead(): void {
  if (typeof window === 'undefined') return
  try {
    if (!window.wcs || !window.wcs_do) return
    if (sessionStorage.getItem(SENT_KEY)) return
    window.wcs_do({ cnv: window.wcs.cnv('4', '0') })
    sessionStorage.setItem(SENT_KEY, '1')
  } catch {
    /* 광고 스크립트 오류가 신청 완료 화면을 막으면 안 된다 */
  }
}
