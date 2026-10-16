'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * 화면에 들어오면 'is-in' 클래스를 붙이는 감싸개 — 대화 장면의 말풍선이 차례로 올라오는 데 쓴다.
 * 한 번 붙으면 떼지 않는다 (위로 다시 스크롤할 때 말풍선이 사라졌다 나타나면 산만하다).
 * 실제 등장 효과와 순서는 page.tsx 의 CSS 가 맡는다.
 */
export default function InView({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${className} ${inView ? 'is-in' : ''}`}>
      {children}
    </div>
  )
}
