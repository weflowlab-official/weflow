/**
 * 구글 광고 전환 신호 — 상담 신청·예약·점검 리드가 저장된 순간 호출한다 (네이버 쪽 lib/naverConversion.ts 의 trackNaverLead 와 짝).
 * 구글 광고가 이 신호를 받아야 "어떤 광고·키워드가 실제 신청을 만들었는지" 집계하고 입찰을 최적화한다.
 *
 * 켜는 법 — Vercel 환경변수 두 개 (구글 광고 → 목표 → 전환 → 태그 설정의 'send_to' 값 AW-123456789/AbCdEf 를 / 앞뒤로 나눈 것):
 *   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789          (공통 태그 components/GoogleAds.tsx 도 이 값으로 켜진다)
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=AbCdEf
 * 둘 중 하나라도 없으면 조용히 아무것도 안 한다.
 *
 * 같은 탭(세션)에서는 한 번만 보낸다 — 두 번 제출해도 사람은 한 명이므로 전환 수가 부풀지 않게 한다.
 */
const SENT_KEY = 'weflow_google_cnv'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function trackGoogleLead(): void {
  if (typeof window === 'undefined') return
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL
  if (!id || !label) return
  try {
    if (typeof window.gtag !== 'function') return
    if (sessionStorage.getItem(SENT_KEY)) return
    window.gtag('event', 'conversion', { send_to: `${id}/${label}` })
    sessionStorage.setItem(SENT_KEY, '1')
  } catch {
    /* 광고 스크립트 오류가 신청 완료 화면을 막으면 안 된다 */
  }
}
