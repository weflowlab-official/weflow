'use client'
import { useEffect, useRef } from 'react'

// 영상 태그 — 문자열 그대로 HTML 에 싣는다.
// React 로 그리면 muted 가 HTML 속성으로 안 나가서, 브라우저가 "소리 나는 영상" 으로 보고
// 자동 재생을 막는다. 그러면 스크립트가 붙어 직접 재생을 걸 때까지(몇 초) 영상이 멈춰 있다.
// 속성이 처음부터 HTML 에 있으면 영상 데이터가 오는 대로 바로 돈다.
const VIDEO_HTML = `
  <video class="hero-video" autoplay muted loop playsinline preload="auto">
    <source src="/videos/hero-loop.webm" type="video/webm" />
    <source src="/videos/hero-loop.mp4" type="video/mp4" />
  </video>
`

/**
 * 히어로 배경 영상 — 소리 없이 자동·반복 재생.
 *
 * 화면에서 벗어나면 멈추고, 다시 들어오면 이어서 돈다.
 * 영상이 뜨기 전과 모션 최소화 설정에서는 감싼 상자의 대표 이미지(poster)가 보인다.
 * 대표 이미지는 첫 화면에서 가장 큰 그림이라 가장 먼저 받게 한다(preload).
 */
export default function HeroVideo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = ref.current
    const v = box?.querySelector('video')
    if (!box || !v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause()
      return
    }
    v.muted = true
    // 화면에 보일 때만 돌린다 — 아래 섹션을 보는 동안에도 영상을 계속 풀면
    // 그만큼 CPU·그래픽을 써서 스크롤 연출이 버벅인다.
    // (저전력 모드 등으로 자동 재생이 막혔을 때 다시 거는 역할도 겸한다)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(box)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <link rel="preload" as="image" href="/videos/hero-poster.jpg" fetchPriority="high" />
      <div
        ref={ref}
        className="hero-media"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: VIDEO_HTML }}
      />
    </>
  )
}
