'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * '왜 WEFLOW?' 카드 묶음 — 두 가지를 맡는다.
 *  1) 화면에 들어오면 'is-in' 을 붙인다 (InView 와 같다 — 넓은 화면의 등장·차례 강조가 이걸 보고 시작한다).
 *  2) 휴대폰에서는 카드가 옆으로 넘기는 줄이 되는데, 지금 가운데에 와 있는(보고 있는) 카드에 'is-on' 을 붙여 강조한다.
 *     넓은 화면에서는 넘길 일이 없어 첫 카드에만 붙어 있고, CSS 가 그 폭에서는 is-on 을 쓰지 않는다.
 * 모양은 WhyWeflow.tsx 의 <style> 이 맡는다.
 */
export default function WwList({ className = '', children }: { className?: string; children: React.ReactNode }) {
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

  // 가운데에 가장 가까운 카드를 찾아 is-on — 넘기는 동안 계속 따라간다 (한 화면에 한 번만 계산하게 rAF 로 묶는다)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const mark = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      const mid = box.left + box.width / 2
      let best: Element | null = null
      let bestGap = Infinity
      for (const card of el.children) {
        const r = card.getBoundingClientRect()
        const gap = Math.abs(r.left + r.width / 2 - mid)
        if (gap < bestGap) {
          bestGap = gap
          best = card
        }
      }
      for (const card of el.children) card.classList.toggle('is-on', card === best)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(mark)
    }
    mark()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className={`${className} ${inView ? 'is-in' : ''}`}>
      {children}
    </div>
  )
}
