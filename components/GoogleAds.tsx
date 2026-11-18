'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * 구글 광고 공통 태그(gtag.js) — 광고 클릭으로 들어온 방문을 구글 광고가 알아보게 한다.
 * Vercel 환경변수 NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX 를 넣으면 켜지고, 없으면 아무것도 그리지 않는다.
 * 전환(상담 신청 완료)은 lib/googleConversion.ts 의 trackGoogleLead 가 쏜다.
 *
 * GA4(components/Analytics.tsx)와 같은 gtag 를 쓴다 — 둘 다 켜져 있어도 dataLayer·gtag 는 하나를 같이 쓴다.
 * 관리자(/admin)에서는 켜지 않는다 — 우리 직원의 접속이 광고 방문으로 잡히지 않게.
 */
export default function GoogleAds() {
  const ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const pathname = usePathname()
  if (!ID || pathname.startsWith('/admin')) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){dataLayer.push(arguments);};
          gtag('js', new Date());
          gtag('config', '${ID}');
        `}
      </Script>
    </>
  )
}
