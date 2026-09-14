'use client'
import { useEffect } from 'react'
import { takeNaverLeadMark } from '@/lib/naverConversion'

/**
 * 네이버 전환 스크립트 — 상담 신청이 완료된 주소(/diagnosis/success)에만 놓는다.
 *
 * 가이드가 wcslog.js 는 한 번만 불러오라고 해서, 스크립트 로드와 wcs_do(방문)는
 * 공통 스크립트(components/NaverAds.tsx)에 맡기고 여기서는 wcs.trans 만 부른다.
 *
 * 공통 스크립트가 아직 안 왔을 수 있다 — 신청 직후 넘어온 화면이라 로드가 진행 중일
 * 수 있어서, 준비될 때까지 잠깐 기다렸다 쏜다. 안 오면 조용히 포기한다.
 *
 * 저장이 확인된 신청을 거쳐 왔을 때만 쏜다 — 표시는 한 번 쓰면 사라지므로,
 * 완료 화면을 새로고침하거나 주소를 직접 쳐서 들어와도 전환이 더 세지 않는다.
 */
const RETRY_MS = 250
const MAX_TRIES = 40 // 최대 10초

export default function NaverLeadConversion() {
  useEffect(() => {
    const WA = process.env.NEXT_PUBLIC_NAVER_WA
    if (!WA) return
    // 실제로 저장된 신청을 거쳐 온 경우에만 쏜다 (봇·주소 직접 입력 제외)
    if (!takeNaverLeadMark()) return

    let tries = 0
    let timer: ReturnType<typeof setInterval> | undefined

    const fire = () => {
      if (!window.wcs?.trans) return false
      try {
        window.wcs_add = window.wcs_add || {}
        window.wcs_add['wa'] = WA
        window.wcs.trans({ type: 'lead' })
      } catch {
        /* 광고 스크립트 오류가 완료 화면을 막으면 안 된다 */
      }
      return true
    }

    if (!fire()) {
      timer = setInterval(() => {
        if (fire() || ++tries >= MAX_TRIES) clearInterval(timer)
      }, RETRY_MS)
    }

    return () => clearInterval(timer)
  }, [])

  return null
}
