'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * 구글 광고 공통 태그 — 광고 클릭으로 들어온 방문을 구글 광고가 알아보게 한다.
 * Vercel 환경변수 NEXT_PUBLIC_GOOGLE_ADS_ID 를 넣으면 켜지고, 없으면 아무것도 그리지 않는다. 값은 두 가지 형식을 받는다:
 *   GTM-XXXXXXX  — 구글 광고가 주는 새 형식 (2026-11-21 광고 담당이 준 스크립트: gtm.js?id=GTM-… + gtag('js')). 설정은 구글 쪽 컨테이너가 들고 있어 config 줄이 없다
 *   AW-XXXXXXXXX — 예전 형식 (gtag/js?id=AW-… + gtag('config'))
 * 전환(상담 신청 완료)은 lib/googleConversion.ts 의 trackGoogleLead 가 쏜다.
 *
 * GA4(components/Analytics.tsx)와 같은 gtag 를 쓴다 — 둘 다 켜져 있어도 dataLayer·gtag 는 하나를 같이 쓴다.
 * 관리자(/admin · /blogadmin)에서는 켜지 않는다 — 우리 직원의 접속이 광고 방문으로 잡히지 않게.
 * 사이트(app/(site)/layout.tsx)와 웹블로그(app/(blog)/layout.tsx) 두 레이아웃에 다 들어 있어 모든 페이지에 실린다.
 */
export default function GoogleAds() {
  const ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const pathname = usePathname()
  if (!ID || pathname.startsWith('/admin') || pathname.startsWith('/blogadmin')) return null
  const viaGtm = ID.startsWith('GTM-')

  return (
    <>
      <Script src={viaGtm ? `https://www.googletagmanager.com/gtm.js?id=${ID}` : `https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){dataLayer.push(arguments);};
          gtag('js', new Date());
          ${viaGtm ? '' : `gtag('config', '${ID}');`}
        `}
      </Script>
    </>
  )
}
