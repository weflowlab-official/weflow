'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { readStore, writeStore } from '@/lib/safeStorage'

// "오늘 하루 보지 않기"를 누른 시각 — 그 값(다음 자정)이 지나기 전엔 다시 안 뜬다
const HIDE_KEY = 'weflow_webblog_popup_hide_until'

/**
 * 새 탭 '웹블로그란?'(/webblog) 알림 팝업 — 메인 홈(/)에 들어올 때만 뜬다 (PC·모바일 공통).
 * 이미지 없이 코드로 그린다 — 연한 격자·파란 번짐 위에 천천히 도는 원 두 개를 글씨 바로 뒤에 깔고,
 * 문구는 '웹블로그란?' 히어로와 같게 (누르고 들어가면 같은 문장이 이어진다). 카드 어디를 눌러도 실제 웹블로그(/blog)가 새 창으로 열린다 ('웹블로그란?' 탭은 메뉴에서 내렸다).
 * · 닫기 / ✕ : 이번 방문(탭) 동안 안 뜸   · 바깥 클릭 · 카드 누르기 : 이번 화면만 닫음(홈에 다시 오면 뜸)   · 오늘 하루 보지 않기 : 다음 자정까지
 * 예전 이벤트 팝업(EventPopup.tsx)과 같은 틀이다.
 */
export default function WebBlogPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const closedRef = useRef(false)
  const isHome = pathname === '/'

  const close = () => {
    closedRef.current = true
    setOpen(false)
  }
  const hideToday = () => {
    const now = new Date()
    writeStore('local', HIDE_KEY, String(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime()))
    close()
  }

  useEffect(() => {
    if (!isHome || closedRef.current) return
    if (Date.now() < Number(readStore('local', HIDE_KEY) || 0)) return
    const t = setTimeout(() => setOpen(true), 400)
    return () => clearTimeout(t)
  }, [isHome])

  // 열려 있는 동안 배경 스크롤 잠금 + Esc 로 닫기
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      closedRef.current = true
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // 다른 페이지로 넘어가면 그리지 않는다 (열린 채 넘어왔더라도)
  if (!open || !isHome) return null

  return (
    <div className="wbp-overlay" onClick={() => setOpen(false)}>
      <div className="wbp-modal" role="dialog" aria-modal="true" aria-label="새 소식 — 웹블로그" onClick={e => e.stopPropagation()}>
        <button type="button" className="wbp-x" aria-label="닫기" onClick={close}>✕</button>

        {/* 누르고 들어간 뒤 홈으로 돌아오면 다시 뜬다 — 이번 화면만 닫는다 (닫기·✕ 와 다르게) */}
        <Link href="/blog" target="_blank" rel="noopener noreferrer" className="wbp-card" onClick={() => setOpen(false)}>
          {/* 배경 — 격자 · 번짐 · 글씨 뒤의 원 두 개 */}
          <span className="wbp-bg" aria-hidden="true">
            <i className="wbp-grid" />
            <i className="wbp-blob wbp-blob--a" />
            <i className="wbp-blob wbp-blob--b" />
            {/* 원 세 개 — 원마다 파란 점이 하나씩 붙어 원과 함께 돈다 */}
            <i className="wbp-ring wbp-ring--out"><b /></i>
            <i className="wbp-ring wbp-ring--in"><b /></i>
            <i className="wbp-ring wbp-ring--sm"><b /></i>
          </span>

          <span className="wbp-tag">NEW · WEFLOW 웹블로그 출시</span>
          <strong className="wbp-title">웹블로그, 생소하시죠?</strong>
          <strong className="wbp-title wbp-title--2"><span>경쟁업체보다 먼저</span><br />검색되는 방법</strong>
          <span className="wbp-desc">글 하나만 올려도 네이버·구글 검색과 AI 답변까지</span>
          <span className="wbp-btn">웹블로그 둘러보기 <ArrowUpRight size={17} /></span>
        </Link>

        <div className="wbp-bar">
          <button type="button" onClick={hideToday}>오늘 하루 보지 않기</button>
          <button type="button" onClick={close}>닫기</button>
        </div>
      </div>

      <style>{`
        .wbp-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,.62); animation: wbpFade .25s ease; }
        .wbp-modal { position: relative; width: min(440px, 90vw); animation: wbpPop .32s cubic-bezier(.34,1.4,.64,1); }
        @keyframes wbpFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wbpPop { from { opacity: 0; transform: translateY(22px) scale(.94); } to { opacity: 1; transform: none; } }
        .wbp-x { position: absolute; top: -46px; right: 0; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.45); color: #fff; font-size: 19px; cursor: pointer; }

        .wbp-card { position: relative; isolation: isolate; overflow: hidden; display: flex; flex-direction: column; align-items: center; padding: 64px 24px 44px; border-radius: 20px 20px 0 0; background: #fff; color: #111418; text-align: center; text-decoration: none; }
        .wbp-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .wbp-bg i { position: absolute; display: block; }
        .wbp-grid { inset: 0; background-image: linear-gradient(#e2e7ee 1px, transparent 1px), linear-gradient(90deg, #e2e7ee 1px, transparent 1px); background-size: 44px 44px; background-position: center;
          -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, #000 0%, transparent 75%); mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, #000 0%, transparent 75%); }
        .wbp-blob { width: 260px; height: 260px; border-radius: 50%; background: rgba(31,99,214,.14); filter: blur(50px); }
        .wbp-blob--a { left: -110px; top: -110px; }
        .wbp-blob--b { right: -110px; bottom: -110px; }
        /* 원 세 개 — 중심은 카드(아래 '오늘 하루 보지 않기' 줄 빼고)의 정가운데. 크기·속도·방향을 엇갈려 돈다 */
        .wbp-ring { left: 50%; top: 50%; border-radius: 50%; animation: wbpSpin 60s linear infinite; }
        .wbp-ring--out { width: 128%; aspect-ratio: 1; border: 1px solid #cfdcf0; }
        .wbp-ring--in { width: 92%; aspect-ratio: 1; border: 1.5px dashed #b4cbee; animation-duration: 40s; animation-direction: reverse; }
        .wbp-ring--sm { width: 58%; aspect-ratio: 1; border: 1px solid #dbe5f4; animation-duration: 26s; }
        /* 파란 점 — 원 맨 위에 붙어 원이 돌 때 함께 돈다 (원마다 다른 자리에서 출발) */
        .wbp-ring b { position: absolute; left: 50%; top: 0; width: 9px; height: 9px; margin: -4.5px 0 0 -4.5px; border-radius: 50%; background: #1f63d6; box-shadow: 0 0 0 5px rgba(31,99,214,.14); }
        .wbp-ring--in b { top: auto; bottom: 0; margin: 0 0 -4px -4px; width: 8px; height: 8px; background: #5b92ec; }
        .wbp-ring--sm b { left: 0; top: 50%; margin: -3.5px 0 0 -3.5px; width: 7px; height: 7px; background: #7fb0f5; box-shadow: none; }
        @keyframes wbpSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

        .wbp-tag { font-size: .88rem; font-weight: 800; color: #1f63d6; letter-spacing: -0.01em; }
        .wbp-title { margin-top: 14px; font-size: clamp(1.6rem, 7vw, 1.95rem); font-weight: 800; line-height: 1.3; letter-spacing: -0.04em; }
        .wbp-title--2 { margin-top: 2px; }
        .wbp-title--2 span { background: linear-gradient(transparent 58%, #cfe0fb 58%, #cfe0fb 92%, transparent 92%); }
        /* 한 줄로 — 좁은 휴대폰에서는 화면 폭에 맞춰 글씨가 조금 작아진다 */
        .wbp-desc { margin-top: 18px; font-size: min(.98rem, 3.55vw); line-height: 1.6; letter-spacing: -0.02em; white-space: nowrap; color: #4b5360; }
        /* 설명은 제목 쪽으로 붙이고(18px) 버튼과는 조금 더 띄운다(26px) */
        .wbp-btn { display: inline-flex; align-items: center; gap: 6px; margin-top: 26px; padding: 15px 30px; border-radius: 999px; background: #111418; color: #fff; font-size: 1rem; font-weight: 700; transition: background .15s; }
        .wbp-card:hover .wbp-btn { background: #1f63d6; }
        .wbp-btn svg { transition: transform .25s ease; }
        .wbp-card:hover .wbp-btn svg { transform: translate(2px, -2px); }

        .wbp-bar { display: flex; overflow: hidden; border-radius: 0 0 20px 20px; border-top: 1px solid #eef0f3; background: #fff; }
        .wbp-bar button { flex: 1; padding: 15px 0; border: 0; background: none; font-size: .92rem; cursor: pointer; }
        .wbp-bar button:first-child { border-right: 1px solid #eee; color: #8b93a3; font-weight: 600; }
        .wbp-bar button:last-child { color: #2b3550; font-weight: 700; }
        @media (prefers-reduced-motion: reduce) { .wbp-overlay, .wbp-modal, .wbp-ring { animation: none; } }
      `}</style>
    </div>
  )
}
