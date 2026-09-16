'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { readStore, writeStore } from '@/lib/safeStorage'

// "오늘 하루 보지 않기"를 누른 시각을 저장 — 그 값(자정 타임스탬프)이 지나기 전엔 다시 안 뜬다
const HIDE_KEY = 'weflow_popup_hide_until'

/**
 * 이벤트 팝업 — 메인 홈(/)에서만 뜬다. 이미지를 누르면 예약(/booking)으로 이동.
 * · 닫기 / 오버레이 클릭 / X : 이번 세션 동안 안 뜸 (새로고침하면 다시)
 * · 오늘 하루 보지 않기 : 다음 자정까지 안 뜨게 localStorage 저장
 * 다른 페이지에서는 띄우지 않는다 — 둘러보는 화면을 가리지 않기 위해 메인 진입 시 한 번만.
 */
export default function EventPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const closedRef = useRef(false) // 닫기/X/오버레이 → 이번 세션 동안 안 뜸

  // 메인 홈이 아니면 띄우지 않는다
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) {
      setOpen(false) // 다른 페이지에서 열린 채 넘어왔더라도 닫는다
      return
    }
    if (closedRef.current) return // 이번 세션에 닫음
    let hideUntil = 0
    try {
      hideUntil = Number(readStore('local', HIDE_KEY) || 0)
    } catch {
      /* localStorage 접근 불가(프라이빗 모드 등)면 그냥 노출 */
    }
    if (Date.now() < hideUntil) return // 오늘 하루 보지 않기 유효
    const t = setTimeout(() => setOpen(true), 100)
    return () => clearTimeout(t)
  }, [pathname, isHome])

  // 팝업 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // 닫기 / X / 오버레이 — 이번 세션 동안 안 뜨게
  const close = () => {
    closedRef.current = true
    setOpen(false)
  }

  // 이미지(예약하러 가기) 클릭 — 예약 페이지로 이동. 세션은 유지(돌아오면 다시 뜸)
  const goBooking = () => setOpen(false)

  // 바깥(오버레이) 클릭 — 이번 화면만 닫음. 다른 페이지로 가면 다시 뜸(세션 종료 아님)
  const softClose = () => setOpen(false)

  const hideToday = () => {
    try {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      writeStore('local', HIDE_KEY, String(midnight.getTime()))
    } catch {
      /* 저장 실패해도 닫기만 */
    }
    closedRef.current = true
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      onClick={softClose}
      className="evt-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.62)',
        display: 'flex',
        justifyContent: 'center',
        animation: 'popupFade 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="evt-modal"
        style={{
          position: 'relative',
          animation: 'popupPop 0.32s cubic-bezier(0.34,1.4,0.64,1)',
        }}
      >
        {/* 닫기 X — 이미지 우상단 위쪽 */}
        <button
          onClick={close}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: -46,
            right: 0,
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.16)',
            border: '1px solid rgba(255,255,255,0.45)',
            color: '#fff',
            fontSize: 19,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* 이미지 클릭 → 예약 페이지 */}
        <Link
          href="/booking"
          onClick={goBooking}
          aria-label="예약하러 가기"
          style={{ display: 'block', borderRadius: '18px 18px 0 0', overflow: 'hidden', lineHeight: 0 }}
        >
          <Image
            src="/popup/event.png"
            alt="선착순 이벤트 · 제작 먼저, 결제는 그다음 — 예약하러 가기"
            width={1080}
            height={1080}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </Link>

        {/* 하단 컨트롤 바 */}
        <div style={{ display: 'flex', background: '#fff', borderRadius: '0 0 18px 18px', overflow: 'hidden' }}>
          <button
            onClick={hideToday}
            style={{
              flex: 1,
              padding: '15px 0',
              background: 'none',
              border: 'none',
              borderRight: '1px solid #eee',
              color: '#8b93a3',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={close}
            style={{
              flex: 1,
              padding: '15px 0',
              background: 'none',
              border: 'none',
              color: '#2b3550',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popupFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popupPop {
          from { opacity: 0; transform: translateY(22px) scale(0.94); }
          to { opacity: 1; transform: none; }
        }
        /* 데스크탑: 화면 가운데 */
        .evt-overlay { align-items: center; padding: 1.25rem; }
        .evt-modal { width: min(500px, 94vw); }
        /* 모바일: 화면 정중앙 */
        @media (max-width: 768px) {
          .evt-overlay { align-items: center; padding: 1rem; }
          .evt-modal { width: min(400px, 90vw); }
        }
      `}</style>
    </div>
  )
}