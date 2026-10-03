'use client'
import { useEffect, useRef } from 'react'

/**
 * 히어로 배경 영상 — 소리 없이 자동·반복 재생.
 *
 * 영상이 뜨기 전과 모션 최소화 설정에서는 감싼 상자의 대표 이미지(poster)가 보인다.
 * React 는 muted 를 HTML 속성으로 내려주지 않아 iOS 에서 자동 재생이 막힐 수 있으므로,
 * 붙은 뒤 직접 음소거하고 재생을 건다.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    v.muted = true
    v.play().catch(() => {})
  }, [])

  return (
    <div className="hero-media" aria-hidden="true">
      <video
        ref={ref}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero-loop.webm" type="video/webm" />
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
