'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, FileText, type LucideIcon } from 'lucide-react'

// 우측 상단 신뢰 카드 — 대표 제작 사례.
// 엠블럼 로고가 있으면 img, 없으면 업종을 나타내는 아이콘(Icon)을 쓴다.
const TRUST_ROWS: { label: string; img?: string; Icon?: LucideIcon }[] = [
  { label: 'KPSC', img: '/images/trust/emblem-kpsc.png' },
  { label: '새두레', img: '/images/trust/emblem-saedure.png' },
  { label: '타이어캠프', img: '/images/trust/emblem-tirecamp.png' },
  { label: '커튼장인 아뜰리에', img: '/images/trust/emblem-curtainjangin.png' },
  { label: 'H 렌트카', img: '/images/trust/emblem-hrentcar.svg' },
  { label: '특장맨', img: '/images/trust/emblem-teukjangman.svg' },
]

const POP_HIDE_KEY = 'weflow_pc_promo_hide' // 닫으면 이번 탭(세션) 동안 안 뜸
const SIDE_HIDE_KEY = 'weflow_pc_side_hide' // 신뢰 카드도 닫으면 이번 탭 동안 안 뜸

/**
 * PC 전용 플로팅 두 개 — 모바일에선 CSS 로 통째로 숨긴다.
 * · 우측 상단: 신뢰 항목 세로 카드 + "빠른 상담 문의" 버튼 (항상 표시)
 * · 우측 하단: "30초만에 …" 상담 유도 팝업 (X/닫기 → 이번 탭 동안 안 뜸)
 * 우측 하단 원형 버튼(FloatingButtons)과 겹치지 않게 팝업은 그 왼쪽에 둔다.
 */
export default function PcPromoWidgets() {
  const [popOpen, setPopOpen] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SIDE_HIDE_KEY)) setSideOpen(true)
      if (sessionStorage.getItem(POP_HIDE_KEY)) return
    } catch {
      setSideOpen(true) /* 접근 불가면 그냥 노출 */
    }
    const t = setTimeout(() => setPopOpen(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const closePop = () => {
    try {
      sessionStorage.setItem(POP_HIDE_KEY, '1')
    } catch {}
    setPopOpen(false)
  }

  const closeSide = () => {
    try {
      sessionStorage.setItem(SIDE_HIDE_KEY, '1')
    } catch {}
    setSideOpen(false)
  }

  return (
    <>
      {/* ── 우측 상단: 신뢰 카드 + 상담 버튼 (X 로 닫으면 이번 탭 동안 숨김) ── */}
      {sideOpen && (
      <div className="pc-side-widget">
        <button onClick={closeSide} aria-label="닫기" className="pc-side-widget__x">✕</button>
        <div className="pc-side-widget__card">
          {TRUST_ROWS.map(({ label, img, Icon = BadgeCheck }) => (
            <div key={label} className="pc-side-widget__row">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={label} className="pc-side-widget__thumb" />
              ) : (
                <Icon size={15} strokeWidth={2.2} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              )}
              <span>{label}</span>
            </div>
          ))}
        </div>
        <Link href="/diagnosis" className="pc-side-widget__btn">
          <FileText size={14} strokeWidth={2} />
          <span className="btn-gold__label">빠른 견적 문의</span>
        </Link>
      </div>
      )}

      {/* ── 우측 하단: 상담 유도 팝업 ── */}
      {popOpen && (
        <div className="pc-promo-pop">
          <button onClick={closePop} aria-label="닫기" className="pc-promo-pop__x">✕</button>
          <div className="pc-promo-pop__card">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <p className="pc-promo-pop__title">
                <strong>30초</strong>만에<br />
                우리 브랜드에 꼭 맞는<br />
                <span className="pc-promo-pop__accent">홈페이지 견적</span> 받기
              </p>
              <span className="pc-promo-pop__icon"><FileText size={52} strokeWidth={1.5} /></span>
            </div>
            <Link href="/diagnosis" className="pc-promo-pop__btn" onClick={closePop}>
              <span className="btn-gold__label">견적 문의</span>
            </Link>
            <button onClick={closePop} className="pc-promo-pop__close">닫기</button>
          </div>
        </div>
      )}

      <style>{`
        /* ── 우측 상단 신뢰 카드 ── */
        .pc-side-widget {
          position: fixed;
          /* 세로 중앙 근처 — px 고정(210px)은 모니터가 클수록 위로 붙어 보였다 */
          top: 47.5%;
          transform: translateY(-50%);
          right: 16px;
          z-index: 150;
          width: 148px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pc-side-widget__x {
          position: absolute;
          top: -10px;
          right: -8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--surface);
          border: 1.5px solid var(--border);
          color: var(--text-muted);
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
          z-index: 1;
        }
        .pc-side-widget__card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 0.3rem 0.7rem;
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.08);
        }
        .pc-side-widget__row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text);
          word-break: keep-all;
        }
        .pc-side-widget__row + .pc-side-widget__row { border-top: 1px solid var(--border); }
        .pc-side-widget__thumb {
          width: 16px;
          height: 16px;
          object-fit: contain;
          flex-shrink: 0;
        }
        /* 빠른 견적 문의 — 도입부 CTA(btn-gold--fill)와 같은 파란 채움 + 금색 테두리·광택 글씨·글로우 */
        .pc-side-widget__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: rgba(37, 99, 235, 0.68);
          color: #e3c99e;
          border: 1.5px solid rgba(240, 220, 174, 0.95);
          border-radius: 10px;
          padding: 0.65rem 0;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 0 18px rgba(227, 201, 158, 0.25);
          transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
        }
        .pc-side-widget__btn:hover {
          transform: translateY(-1px);
          background: rgba(37, 99, 235, 0.82);
          box-shadow: 0 0 24px rgba(227, 201, 158, 0.38);
        }

        /* ── 우측 하단 상담 유도 팝업 ── */
        .pc-promo-pop {
          position: fixed;
          right: 88px; /* 원형 플로팅 버튼(우측 16px) 왼쪽 */
          bottom: 20px;
          z-index: 190;
          animation: pcPromoIn 0.4s cubic-bezier(0.3, 1.2, 0.5, 1);
        }
        @keyframes pcPromoIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .pc-promo-pop__x {
          position: absolute;
          top: -14px;
          right: -14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--surface);
          border: 1.5px solid var(--border);
          color: var(--text-muted);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        }
        .pc-promo-pop__card {
          width: 264px;
          background: #101828;
          border-radius: 18px;
          padding: 1.4rem 1.4rem 1rem;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
        }
        .pc-promo-pop__title {
          margin: 0;
          flex: 1;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.5;
          word-break: keep-all;
        }
        .pc-promo-pop__title strong { color: #60a5fa; }
        .pc-promo-pop__accent { color: #60a5fa; }
        .pc-promo-pop__icon { color: #60a5fa; margin-top: 2px; }
        /* 견적 문의 버튼 — 사이트 CTA(btn-gold)와 같은 금색 테두리·광택 글씨 */
        .pc-promo-pop__btn {
          display: block;
          text-align: center;
          margin-top: 1.1rem;
          background: rgba(227, 201, 158, 0.10);
          border: 1.5px solid rgba(240, 220, 174, 0.95);
          color: #e3c99e;
          border-radius: 10px;
          padding: 0.55rem 0;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 0 18px rgba(227, 201, 158, 0.2);
          transition: background 0.16s ease;
        }
        .pc-promo-pop__btn:hover { background: rgba(227, 201, 158, 0.2); }
        .pc-promo-pop__close {
          display: block;
          width: 100%;
          margin-top: 0.35rem;
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.5rem 0 0.1rem;
          cursor: pointer;
        }

        /* 모바일에선 둘 다 숨김 — PC 전용 */
        @media (max-width: 1023px) {
          .pc-side-widget, .pc-promo-pop { display: none; }
        }
      `}</style>
    </>
  )
}
