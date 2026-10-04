'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, FileText, Plus, X, type LucideIcon } from 'lucide-react'

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
// 이만큼(px) 스크롤을 내려야 두 개가 나타난다 — 들어오자마자 화면을 가리지 않게
const SHOW_AFTER = 240
const SIDE_HIDE_KEY = 'weflow_pc_side_hide' // 신뢰 카드를 접어 두면 이번 탭 동안 접힌 채로 남는다

/**
 * PC 전용 플로팅 두 개 — 모바일에선 CSS 로 통째로 숨긴다.
 * · 우측 가운데: 제작 사례 회사명 카드(흰 바탕) + "빠른 견적 문의" 버튼(하늘색).
 *   맨 아래 동그란 버튼(✕)으로 접고, 접히면 그 버튼이 ＋ 로 바뀌어 다시 펼 수 있다.
 *   화면 폭이 1600px 이상일 때만 보인다 — 본문 옆 여백이 넉넉해야 내용을 안 가린다
 *   (1440px 노트북 화면이면 브라우저 배율 90% 부터 보인다).
 * · 우측 하단: "30초만에 …" 상담 유도 팝업 (아래 '닫기' → 이번 탭 동안 안 뜸. X 버튼은 따로 두지 않는다)
 * 우측 하단 원형 버튼(FloatingButtons)과 겹치지 않게 팝업은 그 왼쪽에 둔다.
 *
 * 둘 다 페이지에 들어오자마자 뜨지 않고, 스크롤을 조금(SHOW_AFTER) 내렸을 때 처음 나타난다.
 * 한 번 나타난 뒤에는 다시 위로 올리거나 다른 탭으로 넘어가도 그대로 있다.
 */
export default function PcPromoWidgets() {
  const [popOpen, setPopOpen] = useState(false)
  // 회사명 카드 — pending: 접어 뒀는지 아직 모름(아무것도 안 그린다) / open: 펼침 / closed: 접힘(＋ 버튼만)
  const [side, setSide] = useState<'pending' | 'open' | 'closed'>('pending')
  // 스크롤을 조금 내렸는지 — 그 전에는 둘 다 그리지 않는다
  const [scrolled, setScrolled] = useState(false)

  // 닫아 둔 기록을 읽는다 (팝업은 닫았으면 안 띄우고, 카드는 접어 뒀으면 접힌 채로)
  useEffect(() => {
    try {
      setSide(sessionStorage.getItem(SIDE_HIDE_KEY) ? 'closed' : 'open')
      if (!sessionStorage.getItem(POP_HIDE_KEY)) setPopOpen(true)
    } catch {
      /* 접근 불가면 그냥 노출 */
      setSide('open')
      setPopOpen(true)
    }
  }, [])

  // 스크롤을 SHOW_AFTER 넘게 내리면 나타난다 — 한 번 나타나면 더 볼 필요가 없어 듣기를 끝낸다
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < SHOW_AFTER) return
      setScrolled(true)
      window.removeEventListener('scroll', onScroll)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closePop = () => {
    try {
      sessionStorage.setItem(POP_HIDE_KEY, '1')
    } catch {}
    setPopOpen(false)
  }

  // 회사명 카드 접기·펴기 — 접어 둔 것만 기억한다
  const toggleSide = () => {
    const next = side === 'open' ? 'closed' : 'open'
    try {
      if (next === 'closed') sessionStorage.setItem(SIDE_HIDE_KEY, '1')
      else sessionStorage.removeItem(SIDE_HIDE_KEY)
    } catch {}
    setSide(next)
  }

  return (
    <>
      {/* ── 우측 가운데: 회사명 카드 + 견적 버튼, 맨 아래에 접기(✕)·펴기(＋) 버튼 ── */}
      {scrolled && side !== 'pending' && (
      <div className={side === 'open' ? 'pc-side-widget' : 'pc-side-widget is-closed'}>
        {/* 접혀도 자리는 그대로 둔다(보이지만 않게) — 맨 아래 버튼이 제자리에 남는다 */}
        <div className="pc-side-widget__body" aria-hidden={side !== 'open'}>
          <div className="pc-side-widget__card">
            {TRUST_ROWS.map(({ label, img, Icon = BadgeCheck }) => (
              <div key={label} className="pc-side-widget__row">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={label} className="pc-side-widget__thumb" />
                ) : (
                  <Icon size={15} strokeWidth={2.2} style={{ color: '#6a92d7', flexShrink: 0 }} />
                )}
                <span>{label}</span>
              </div>
            ))}
          </div>
          <Link href="/diagnosis" className="pc-side-widget__btn btn-goldline" tabIndex={side === 'open' ? undefined : -1}>
            <FileText size={14} strokeWidth={2} />
            빠른 견적 문의
          </Link>
        </div>
        <button
          type="button"
          onClick={toggleSide}
          aria-label={side === 'open' ? '제작 사례 목록 접기' : '제작 사례 목록 펴기'}
          aria-expanded={side === 'open'}
          className="pc-side-widget__x"
        >
          {side === 'open' ? <X size={20} strokeWidth={2.4} /> : <Plus size={21} strokeWidth={2.4} />}
        </button>
      </div>
      )}

      {/* ── 우측 하단: 상담 유도 팝업 ── */}
      {scrolled && popOpen && (
        <div className="pc-promo-pop">
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
        /* ── 우측 가운데 회사명 카드 (흰 바탕) ── */
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
          align-items: center;
          gap: 10px;
          /* 나타날 때 — 아래에서 살짝 떠오른다 (세로 가운데 맞춤에 transform 을 쓰고 있어 translate 로 움직인다) */
          animation: pcSideIn 0.4s cubic-bezier(0.3, 1.2, 0.5, 1);
        }
        @keyframes pcSideIn {
          from { opacity: 0; translate: 0 16px; }
          to { opacity: 1; translate: 0 0; }
        }
        .pc-side-widget__body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        /* 접힘 — 카드와 견적 버튼을 감추고 눌리지도 않게 한다 (자리는 남겨 ＋ 버튼이 움직이지 않는다) */
        .pc-side-widget.is-closed .pc-side-widget__body {
          opacity: 0;
          transform: translateY(8px);
          visibility: hidden;
          pointer-events: none;
        }
        /* 접기(✕)·펴기(＋) 버튼 — 카드 아래 오른쪽 끝의 흰 동그라미 */
        .pc-side-widget__x {
          align-self: flex-end;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid #e3e5e8;
          color: #5c6066;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
          transition: color 0.15s, border-color 0.15s;
        }
        /* 올리면 사이트 하늘색 테두리 */
        .pc-side-widget__x:hover { color: #6a92d7; border-color: #6a92d7; }
        .pc-side-widget__card {
          background: #fff;
          border: 1.5px solid #e3e5e8;
          border-radius: 12px;
          padding: 0.3rem 0.7rem;
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.1);
        }
        .pc-side-widget__row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #111;
          word-break: keep-all;
        }
        .pc-side-widget__row + .pc-side-widget__row { border-top: 1px solid #e3e5e8; }
        .pc-side-widget__thumb {
          width: 16px;
          height: 16px;
          object-fit: contain;
          flex-shrink: 0;
        }
        /* 빠른 견적 문의 — 사이트 하늘색(#6a92d7) 채움에 흰 글씨 (각 탭 맨 아래 CTA 의 채운 버튼과 같은 색).
           테두리에는 금색 광택(.btn-goldline, styles/globals.css)이 흐른다 — 그 띠가 놓일 테두리 자리를 잡아 둔다 */
        .pc-side-widget__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: #6a92d7;
          color: #fff;
          border: 1.5px solid transparent;
          border-radius: 10px;
          padding: 0.65rem 0;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(106, 146, 215, 0.35);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .pc-side-widget__btn:hover {
          transform: translateY(-1px);
          background: #8aabe3;
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
        .pc-promo-pop__card {
          width: 264px;
          /* 사이트의 검은 바탕과 같은 색 */
          background: #0e0e10;
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
        /* 회사명 카드는 화면 폭 1600px 부터 — 그보다 좁으면 본문·헤더 가장자리를 가린다.
           1440px 화면(노트북)에서는 브라우저 배율을 90% 로 줄였을 때부터 보인다 */
        @media (max-width: 1599px) {
          .pc-side-widget { display: none; }
        }
      `}</style>
    </>
  )
}
