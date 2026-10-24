'use client'
import { useEffect, useState } from 'react'
import { MessagesSquare, Phone, ClipboardList, NotebookPen } from 'lucide-react'

/** 대표 번호 — 헤더와 같은 번호 */
const TEL = '010-2971-7280'

/**
 * 늘 떠 있는 상담 버튼 — 화면 크기에 따라 모양이 다르다 (메인 사이트 components/FloatingButtons.tsx 와 같은 구성).
 *  · PC: 오른쪽 아래 동그란 버튼 셋(웹블로그 · 무료 견적 · 24시간 상담 전화). 웹블로그는 새 탭으로 연다. 아이콘이 위아래 차례로 흔들리고, 마우스를 올리면 왼쪽으로 이름표가 펼쳐진다.
 *        첫 화면에는 같은 역할의 버튼이 이미 있으니 숨겨 두고, 첫 화면을 반쯤 지나면 올라온다.
 *        견적 폼이 화면에 보이는 동안에는 바로 앞에 폼이 있으니 다시 내려간다.
 *  · 모바일: 화면 맨 아래에 붙는 두 칸 바(바로 전화 · 무료 견적 신청). 늘 같은 자리에 있다.
 *          동그란 버튼은 웹블로그 하나만 바 위 오른쪽에 띄운다 (상담 둘은 바에 이미 있다).
 */
export default function FloatingCta() {
  const [past, setPast] = useState(false) // 첫 화면을 지났는지
  const [atForm, setAtForm] = useState(false) // 견적 폼이 보이는지

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
    <>
      {/* PC — 오른쪽 아래 동그란 버튼 셋 */}
      <div className={`fc-wrap ${show ? 'is-on' : ''}`} aria-hidden={!show}>
        <a href="/blog" target="_blank" rel="noopener noreferrer" className="fc fc--blog" aria-label="웹블로그 (새 탭)" tabIndex={show ? 0 : -1}>
          <span className="fc-label">웹블로그</span>
          <span className="fc-icon"><NotebookPen size={25} /></span>
        </a>
        <a href="#contact-form" className="fc fc--form" aria-label="무료 견적 신청" tabIndex={show ? 0 : -1}>
          <span className="fc-label">무료 견적 신청</span>
          <span className="fc-icon"><MessagesSquare size={28} /></span>
        </a>
        <a href={`tel:${TEL}`} className="fc fc--tel" aria-label={`전화 상담 ${TEL}`} tabIndex={show ? 0 : -1}>
          <span className="fc-label">24시간 상담</span>
          <span className="fc-icon"><Phone size={24} fill="currentColor" /></span>
        </a>
      </div>

      {/* 모바일 — 화면 맨 아래 두 칸 바 */}
      <div className="fc-bar">
        <a href={`tel:${TEL}`} className="fc-bar-btn fc-bar-btn--tel">
          <Phone size={19} strokeWidth={2.2} /> 바로 전화
        </a>
        <a href="#contact-form" className="fc-bar-btn fc-bar-btn--form">
          <ClipboardList size={19} strokeWidth={2.2} /> 무료 견적 신청
        </a>
      </div>

      <style>{`
        /* ── PC 동그란 버튼 ── */
        .fc-wrap { position: fixed; right: max(20px, env(safe-area-inset-right)); bottom: 24px; z-index: 40; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; opacity: 0; transform: translateY(16px); pointer-events: none; transition: opacity .3s ease, transform .4s cubic-bezier(.16,1,.3,1); }
        .fc-wrap.is-on { opacity: 1; transform: none; pointer-events: auto; }
        .fc { position: relative; display: flex; align-items: center; height: 60px; border-radius: 999px; color: #fff; text-decoration: none; box-shadow: 0 14px 34px rgba(31,99,214,.3); transition: background .15s; }
        .fc-icon { width: 60px; height: 60px; flex: none; display: inline-flex; align-items: center; justify-content: center; }
        /* 이름표 — 평소엔 폭 0, 마우스를 올리면 왼쪽으로 펼쳐진다 */
        .fc-label { max-width: 0; overflow: hidden; white-space: nowrap; font-weight: 700; font-size: .98rem; transition: max-width .35s cubic-bezier(.16,1,.3,1), padding .35s cubic-bezier(.16,1,.3,1); }
        .fc:hover .fc-label { max-width: 200px; padding-left: 22px; }
        .fc--form { background: #1f63d6; }
        .fc--form:hover { background: #1852b5; }
        .fc--tel { background: #fff; color: #111418; box-shadow: 0 10px 28px rgba(17,20,24,.14); }
        .fc--tel .fc-icon { color: #16a34a; }
        /* 웹블로그 — 하늘색 바탕 + 진한 파란 아이콘 (흰 화면 위에서도 또렷하게) */
        .fc--blog { background: #b9d3fa; color: #1b4ea7; box-shadow: 0 10px 28px rgba(31,99,214,.22); }
        .fc--blog:hover { background: #a3c4f7; }
        /* 눈에 띄게 — 위에서부터 차례로 흔들린다: 웹블로그 → 견적 → 전화 (4.8초에 한 바퀴, 버튼마다 1.6초씩) */
        .fc-wrap.is-on .fc-icon svg { animation: fcWiggle 4.8s ease-in-out infinite; transform-origin: 50% 60%; }
        .fc-wrap.is-on .fc--form .fc-icon svg { animation-delay: 1.6s; }
        .fc-wrap.is-on .fc--tel .fc-icon svg { animation-delay: 3.2s; }
        @keyframes fcWiggle { 0%, 30%, 100% { transform: rotate(0deg); } 5% { transform: rotate(-14deg); } 10% { transform: rotate(12deg); } 15% { transform: rotate(-9deg); } 20% { transform: rotate(6deg); } 25% { transform: rotate(-3deg); } }

        /* ── 모바일 하단 두 칸 바 (메인 사이트 하단 바와 같은 크기) ── */
        .fc-bar { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; background: #fff; box-shadow: 0 -6px 20px rgba(17,20,24,.1); padding-bottom: max(0px, calc(env(safe-area-inset-bottom) - 12px)); }
        .fc-bar-btn { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 56px; font-size: 15px; font-weight: 700; text-decoration: none; }
        .fc-bar-btn--tel { background: #fff; color: #111418; border-top: 1px solid #e3e5e8; }
        .fc-bar-btn--tel svg { color: #16a34a; }
        .fc-bar-btn--form { background: #1f63d6; color: #fff; }
        @media (max-width: 768px) {
          /* 휴대폰 — 동그란 버튼은 웹블로그만, 아래 두 칸 바 바로 위 오른쪽에 */
          .fc-wrap { bottom: calc(56px + max(0px, env(safe-area-inset-bottom) - 12px) + 14px); right: 14px; }
          .fc-wrap .fc:not(.fc--blog) { display: none; }
          .fc--blog, .fc--blog .fc-icon { width: 52px; height: 52px; }
          .fc--blog .fc-label { display: none; }
          .fc-bar { display: flex; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fc-wrap, .fc-label { transition: none; }
          .fc-wrap.is-on .fc-icon svg { animation: none; }
        }
      `}</style>
    </>
  )
}
