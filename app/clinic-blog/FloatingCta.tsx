'use client'
import { useEffect, useState } from 'react'
import { MessagesSquare } from 'lucide-react'

/**
 * 오른쪽 아래 떠 있는 동그란 상담 버튼(아이콘만) — 누르면 맨 아래 상담 폼(#contact)으로 내려간다.
 *
 * 첫 화면(히어로)에는 같은 역할의 버튼이 이미 있으니 숨겨 두고, 첫 화면을 반쯤 지나면 올라온다.
 * 상담 폼이 화면에 보이는 동안에는 바로 앞에 폼이 있으니 다시 내려간다.
 */
export default function FloatingCta() {
  const [past, setPast] = useState(false) // 첫 화면을 지났는지
  const [atForm, setAtForm] = useState(false) // 상담 폼이 보이는지

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const form = document.getElementById('contact')
    const io = form ? new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.15 }) : null
    if (form && io) io.observe(form)

    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const show = past && !atForm

  return (
    <a
      href="#contact-form"
      className={`fc ${show ? 'is-on' : ''}`}
      aria-label="무료 상담 신청"
      title="무료 상담 신청"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      <MessagesSquare size={28} />
      <style>{`
        .fc { position: fixed; right: max(20px, env(safe-area-inset-right)); bottom: max(24px, env(safe-area-inset-bottom)); z-index: 40; width: 60px; height: 60px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: #1f63d6; color: #fff; text-decoration: none; box-shadow: 0 14px 34px rgba(31,99,214,.32); opacity: 0; transform: translateY(16px) scale(.96); pointer-events: none; transition: opacity .3s ease, transform .4s cubic-bezier(.16,1,.3,1), background .15s; }
        .fc.is-on { opacity: 1; transform: none; pointer-events: auto; }
        .fc:hover { background: #1852b5; }
        /* 눈에 띄게 — 아이콘이 쉬지 않고 흔들흔들, 버튼 둘레로는 파란 물결이 번진다 */
        .fc.is-on svg { animation: fcWiggle 1.6s ease-in-out infinite; transform-origin: 50% 60%; }
        .fc::after { content: ''; position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 0 rgba(31,99,214,.45); pointer-events: none; }
        .fc.is-on::after { animation: fcPulse 2s ease-out infinite; }
        @keyframes fcWiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-14deg); }
          30% { transform: rotate(12deg); }
          45% { transform: rotate(-9deg); }
          60% { transform: rotate(6deg); }
          75% { transform: rotate(-3deg); }
        }
        @keyframes fcPulse { 0% { box-shadow: 0 0 0 0 rgba(31,99,214,.45); } 100% { box-shadow: 0 0 0 18px rgba(31,99,214,0); } }
        @media (max-width: 640px) { .fc { right: 16px; bottom: 16px; width: 52px; height: 52px; } .fc svg { width: 26px; height: 26px; } }
        @media (prefers-reduced-motion: reduce) { .fc { transition: opacity .2s; transform: none; } .fc.is-on svg, .fc.is-on::after { animation: none; } }
      `}</style>
    </a>
  )
}
