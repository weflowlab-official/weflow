'use client'
import { useEffect, useState } from 'react'
import { ClipboardCheck, Phone, ClipboardList, NotebookPen, ExternalLink, X, Plus } from 'lucide-react'

/** 대표 번호 — 헤더와 같은 번호 */
const TEL = '010-2971-7280'
/** 웹블로그 안내 카드를 접어 두면(✕) 이번 탭(세션) 동안 접힌 채로 남는다 — ＋ 로 다시 편다 */
const POP_FOLD_KEY = 'weflow_clinic_blog_pop_fold'

/**
 * 늘 떠 있는 상담 버튼 — 화면 크기에 따라 모양이 다르다 (메인 사이트 components/FloatingButtons.tsx 와 같은 구성).
 *  · PC: 오른쪽 아래 동그란 버튼 둘(무료 견적 · 24시간 상담 전화). 아이콘이 위아래 차례로 흔들리고, 마우스를 올리면 왼쪽으로 이름표가 펼쳐진다.
 *        견적 아이콘은 메인 사이트 플로팅 버튼과 같은 클립보드 체크. 첫 화면부터 보인다.
 *        그 왼쪽에는 '실제 웹블로그 둘러보기' 카드 — 메인 사이트 우측 하단 '30초만에 … 견적 받기' 팝업과 같은 모양.
 *        카드 오른쪽 위 ✕ 로 접으면 작은 ＋ 버튼만 남고, ＋ 를 누르면 다시 펼쳐진다.
 *  · 모바일: 화면 맨 아래에 붙는 두 칸 바(무료 견적 신청 · 웹블로그 바로가기). 늘 같은 자리에 있다.
 * 웹블로그(/blog)는 모두 새 탭으로 연다 — 이 광고 랜딩을 떠나지 않게.
 */
export default function FloatingCta() {
  const [popReady, setPopReady] = useState(false) // 들어오고 잠시 뒤에 나타난다
  const [popFolded, setPopFolded] = useState(false)

  useEffect(() => {
    // 웹블로그 카드 — 들어오고 잠시 뒤에 나타난다. 접어 둔 기록이 있으면 접힌 채로
    const t = window.setTimeout(() => {
      try {
        setPopFolded(sessionStorage.getItem(POP_FOLD_KEY) === '1')
      } catch {
        /* 저장소를 못 쓰면 펼친 채로 */
      }
      setPopReady(true)
    }, 1200)

    return () => {
      window.clearTimeout(t)
    }
  }, [])

  const foldPop = (fold: boolean) => {
    setPopFolded(fold)
    try {
      sessionStorage.setItem(POP_FOLD_KEY, fold ? '1' : '0')
    } catch {
      /* 저장 실패해도 접고 펴기만 */
    }
  }

  // 늘 보인다 — 첫 화면에서도, 견적 폼 앞에서도
  const show = true

  return (
    <>
      {/* PC — 오른쪽 아래 동그란 버튼 둘 */}
      <div className={`fc-wrap ${show ? 'is-on' : ''}`} aria-hidden={!show}>
        <a href="#contact-form" className="fc fc--form" aria-label="무료 견적 신청" tabIndex={show ? 0 : -1}>
          <span className="fc-label">무료 견적 신청</span>
          <span className="fc-icon"><ClipboardCheck size={26} /></span>
        </a>
        <a href={`tel:${TEL}`} className="fc fc--tel" aria-label={`전화 상담 ${TEL}`} tabIndex={show ? 0 : -1}>
          <span className="fc-label">24시간 상담</span>
          <span className="fc-icon"><Phone size={24} fill="currentColor" /></span>
        </a>
      </div>

      {/* PC — 웹블로그 안내 카드 (동그란 버튼 왼쪽). ✕ 로 접으면 ＋ 버튼만 남는다 */}
      {popReady && popFolded && (
        <button type="button" className="fc-pop-open" aria-label="웹블로그 안내 펼치기" onClick={() => foldPop(false)}>
          <Plus size={18} strokeWidth={2.6} />
        </button>
      )}
      {popReady && !popFolded && (
        <div className="fc-pop" role="dialog" aria-label="실제 웹블로그 둘러보기">
          <button type="button" className="fc-pop__x" aria-label="웹블로그 안내 접기" onClick={() => foldPop(true)}><X size={18} strokeWidth={2.6} /></button>
          <div className="fc-pop__head">
            <p className="fc-pop__title">
              <strong>실제 웹블로그</strong>를<br />
              직접 둘러보세요
            </p>
            <span className="fc-pop__icon"><NotebookPen size={46} strokeWidth={1.5} /></span>
          </div>
          <p className="fc-pop__desc">핵심 요약·FAQ가 들어간 글을 확인해 보세요.</p>
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="fc-pop__btn">
            웹블로그 바로가기 <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* 모바일 — 화면 맨 아래 두 칸 바 */}
      <div className="fc-bar">
        <a href="#contact-form" className="fc-bar-btn fc-bar-btn--form">
          <ClipboardList size={19} strokeWidth={2.2} /> 무료 견적 신청
        </a>
        <a href="/blog" target="_blank" rel="noopener noreferrer" className="fc-bar-btn fc-bar-btn--blog">
          웹블로그 바로가기 <ExternalLink size={18} strokeWidth={2.2} />
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
        /* 눈에 띄게 — 견적 버튼이 흔들린 뒤 멈추면 전화 버튼이 이어서 흔들린다 (3.2초에 한 바퀴) */
        .fc-wrap.is-on .fc-icon svg { animation: fcWiggle 3.2s ease-in-out infinite; transform-origin: 50% 60%; }
        .fc-wrap.is-on .fc--tel .fc-icon svg { animation-delay: 1.6s; }
        @keyframes fcWiggle { 0%, 45%, 100% { transform: rotate(0deg); } 7.5% { transform: rotate(-14deg); } 15% { transform: rotate(12deg); } 22.5% { transform: rotate(-9deg); } 30% { transform: rotate(6deg); } 37.5% { transform: rotate(-3deg); } }

        /* ── PC 웹블로그 팝업 카드 — 메인 사이트 상담 팝업과 같은 크기·모양, 버튼만 이 페이지 파랑.
              동그란 버튼(40)보다 아래(35)에 둔다 — 버튼에 마우스를 올리면 왼쪽으로 펼쳐지는 이름표가 카드에 가리지 않게 ── */
        .fc-pop { position: fixed; right: 100px; bottom: 24px; z-index: 35; width: 290px; padding: 1.4rem 1.4rem 1.3rem; border-radius: 18px; background: #0e1117; box-shadow: 0 14px 40px rgba(0,0,0,.3); animation: fcPopIn .4s cubic-bezier(.3,1.2,.5,1); }
        @keyframes fcPopIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .fc-pop__head { display: flex; gap: 1rem; align-items: flex-start; }
        /* ✕ — 카드 바깥 오른쪽 위에 작은 동그라미 */
        .fc-pop__x { position: absolute; top: 0; right: -46px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; background: #0e1117; color: rgba(255,255,255,.75); box-shadow: 0 6px 16px rgba(0,0,0,.2); cursor: pointer; transition: background .15s; }
        .fc-pop__x:hover { color: #fff; }
        /* 접혔을 때 — 카드 자리 오른쪽 아래에 작은 ＋ 버튼 */
        .fc-pop-open { position: fixed; right: 100px; bottom: 24px; z-index: 35; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; background: #0e1117; color: #7fa6ef; box-shadow: 0 10px 28px rgba(0,0,0,.25); cursor: pointer; animation: fcPopIn .3s cubic-bezier(.3,1.2,.5,1); }
        .fc-pop-open:hover { color: #fff; }
        .fc-pop__title { flex: 1; margin: 0; color: #fff; font-size: 1.05rem; font-weight: 700; line-height: 1.5; word-break: keep-all; }
        .fc-pop__title strong { color: #7fa6ef; }
        .fc-pop__icon { color: #7fa6ef; margin-top: 2px; }
        .fc-pop__desc { margin: .6rem 0 0; color: rgba(255,255,255,.55); font-size: .82rem; line-height: 1.55; white-space: nowrap; }
        .fc-pop__btn { display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 1rem; padding: .6rem 0; border-radius: 10px; background: #1f63d6; color: #fff; font-size: .95rem; font-weight: 700; text-decoration: none; transition: background .16s; }
        .fc-pop__btn:hover { background: #1852b5; }

        /* ── 모바일 하단 두 칸 바 (메인 사이트 하단 바와 같은 크기) ── */
        .fc-bar { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; background: #fff; box-shadow: 0 -6px 20px rgba(17,20,24,.1); padding-bottom: max(0px, calc(env(safe-area-inset-bottom) - 12px)); }
        .fc-bar-btn { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 56px; font-size: 15px; font-weight: 700; text-decoration: none; }
        .fc-bar-btn--form { background: #1f63d6; color: #fff; }
        .fc-bar-btn--blog { gap: 4px; background: #fff; color: #111418; border-top: 1px solid #e3e5e8; }
        .fc-bar-btn--blog svg { color: #1f63d6; }
        @media (max-width: 1023px) { .fc-pop, .fc-pop-open { display: none; } }
        @media (max-width: 768px) {
          .fc-wrap { display: none; }
          .fc-bar { display: flex; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fc-wrap, .fc-label { transition: none; }
          .fc-wrap.is-on .fc-icon svg { animation: none; }
          .fc-pop, .fc-pop-open { animation: none; }
        }
      `}</style>
    </>
  )
}
