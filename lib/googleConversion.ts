/**
 * 구글 광고 전환 신호 — 상담 신청·예약·점검 리드가 저장된 순간 호출한다 (네이버 쪽 lib/naverConversion.ts 의 trackNaverLead 와 짝).
 * 구글 광고가 이 신호를 받아야 "어떤 광고·키워드가 실제 신청을 만들었는지" 집계하고 입찰을 최적화한다.
 *
 * 켜는 법 — Vercel 환경변수 두 개. 구글 광고가 준 스크립트 형식에 따라 둘 중 하나:
 *   새 형식 (전환을 이벤트 이름으로 보낸다 — gtag('event', 'ads_conversion___1')):
 *     NEXT_PUBLIC_GOOGLE_ADS_ID=GTM-XXXXXXX         (공통 태그 components/GoogleAds.tsx 도 이 값으로 켜진다)
 *     NEXT_PUBLIC_GOOGLE_ADS_LEAD_EVENT=ads_conversion___1
 *   예전 형식 ('send_to' 값 AW-123456789/AbCdEf 를 / 앞뒤로 나눈 것):
 *     NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
 *     NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=AbCdEf
 * ID 가 없거나, 이벤트 이름·라벨이 둘 다 없으면 조용히 아무것도 안 한다.
 * 구글이 준 예시는 '링크를 누르면 신호를 보낸 뒤 이동'하는 도우미(gtagSendEvent)인데, 우리는 신청이 저장된 뒤 같은 화면에서 쏘므로 이동 처리 없이 이벤트만 보낸다.
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
  const eventName = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_EVENT
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL
  if (!id || (!eventName && !label)) return
  try {
    if (typeof window.gtag !== 'function') return
    if (sessionStorage.getItem(SENT_KEY)) return
    if (eventName) window.gtag('event', eventName)
    else window.gtag('event', 'conversion', { send_to: `${id}/${label}` })
    sessionStorage.setItem(SENT_KEY, '1')
  } catch {
    /* 광고 스크립트 오류가 신청 완료 화면을 막으면 안 된다 */
  }
}
