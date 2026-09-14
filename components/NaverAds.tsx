'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

/**
 * 네이버 검색광고 전환추적 공통 스크립트.
 * .env 에 NEXT_PUBLIC_NAVER_WA=s_xxxxxxxx (광고시스템 → 도구 → 전환추적 설정의 계정 ID) 를
 * 넣으면 켜지고, 없으면 아무것도 렌더하지 않는다.
 *
 * 페이지뷰는 경로가 바뀔 때마다 다시 찍는다 — 앱 라우터는 페이지를 새로 안 불러오므로
 * 처음 한 번만 실행되는 기본 방식으로는 이동 후 방문이 누락된다.
 * 전환(상담 신청 완료)은 lib/naverConversion.ts 의 trackNaverLead 가 쏜다.
 */
declare global {
  interface Window {
    wcs_add?: Record<string, string>
    wcs?: {
      cnv: (type: string, value: string) => unknown
      /** 유입 경로(검색어·리퍼러) 기록 — 첫 로드 때 한 번만 부른다 */
      inflow?: (domain?: string) => void
      /** 전환 신호 — 신청 완료처럼 목표에 도달한 페이지에서 부른다 */
      trans?: (conv: { type: string }) => void
    }
    wcs_do?: (arg?: Record<string, unknown>) => void
    _nasa?: Record<string, unknown>
  }
}

export default function NaverAds() {
  const WA = process.env.NEXT_PUBLIC_NAVER_WA
  const pathname = usePathname()

  // 경로 이동 시 페이지뷰 재전송 (스크립트가 아직 안 왔으면 onLoad 쪽에서 처리)
  useEffect(() => {
    if (!WA || typeof window === 'undefined' || !window.wcs || !window.wcs_do) return
    window.wcs_do()
  }, [WA, pathname])

  if (!WA) return null

  return (
    <Script
      src="https://wcs.naver.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.wcs_add = window.wcs_add || {}
        window.wcs_add['wa'] = WA
        window._nasa = window._nasa || {}
        // inflow 는 처음 들어온 경로를 기록하는 것이라 첫 로드 때만 부른다.
        // 경로가 바뀔 때마다 다시 부르면 사이트 안에서의 이동이 새 유입으로 잡힌다.
        window.wcs?.inflow?.()
        window.wcs_do?.()
      }}
    />
  )
}
