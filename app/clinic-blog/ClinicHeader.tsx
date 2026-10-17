'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Menu, X, ClipboardList, Phone } from 'lucide-react'

/**
 * 병·의원 블로그 페이지 상단 띠 — 브랜드와 상담 버튼만 있고, 메인 사이트로 가는 링크는 두지 않는다.
 * 첫 화면에서는 투명하게 두어 제목에 시선이 가게 하고, 조금이라도 내리면 흰 바탕과 아래 선을 깐다.
 * 가운데 메뉴는 페이지 안의 섹션(id)으로만 이동한다 — 넓은 화면에서만 보인다.
 * 좁은 화면에서는 상담 버튼 오른쪽에 햄버거 버튼을 두고, 누르면 오른쪽에서 메뉴 판이 밀려 나온다
 * (메인 사이트 모바일 메뉴와 같은 구성 — 위에 로고·닫기, 가운데 메뉴, 아래 무료 상담 버튼).
 */
/** 대표 번호 — 메인 헤더(components/Navbar.tsx)와 같은 번호 */
const TEL = '010-2971-7280'

const MENU = [
  { href: '#webblog', label: '웹블로그란' },
  { href: '#with-homepage', label: '홈페이지와 함께' },
  { href: '#process', label: '진행 과정' },
  { href: '#faq', label: '자주 묻는 질문' },
]

/** 로고 — 누르면 이 페이지 맨 위로 부드럽게 올라간다 (메인 사이트로 가지 않는다) */
function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#"
      className="cb-brand"
      aria-label="맨 위로"
      onClick={e => {
        e.preventDefault()
        onClick?.()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      {/* 로고 원본이 흰색이라 검정으로 뒤집는다 (메인 헤더와 같은 처리) */}
      <Image src="/logo.png" alt="" width={28} height={28} style={{ filter: 'brightness(0)' }} />
      WEFLOW
      <i className="cb-brand-sep" aria-hidden="true" />
      <span className="cb-brand-sub">병·의원 웹블로그</span>
    </a>
  )
}

export default function ClinicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false) // 모바일 메뉴 판

  // 내려가면 위로 스르륵 숨고, 올리면 다시 내려온다.
  // 손떨림 정도의 작은 움직임(6px 미만)은 무시하고, 첫 화면 근처(헤더 높이 안쪽)에서는 늘 보인다
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (y < 80) setHidden(false)
      else if (Math.abs(y - last) >= 6) setHidden(y > last)
      if (Math.abs(y - last) >= 6 || y < 80) last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 메뉴 판이 열려 있는 동안 — 뒤 페이지 스크롤을 막고, Esc 로 닫는다
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`cb-top ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
        <div className="cb-wrap cb-top-inner">
          <Brand />
          <nav className="cb-menu" aria-label="페이지 안 이동">
            {MENU.map(m => (
              <a key={m.href} href={m.href}>{m.label}</a>
            ))}
          </nav>
          {/* 오른쪽 묶음 — 대표 번호(넓은 화면에서만) · 견적 버튼 · 햄버거(좁은 화면에서만) */}
          <div className="cb-top-right">
            <a href={`tel:${TEL}`} className="cb-tel"><Phone size={17} /> {TEL}</a>
            <a href="#contact-form" className="cb-top-btn">
              무료 견적 신청 <ArrowRight size={15} />
            </a>
          <button type="button" className="cb-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 판 — 헤더 밖에 둔다 (헤더는 숨을 때 transform 이 걸려, 안에 두면 판이 같이 밀려 올라간다) */}
      <div className={`cb-drawer-dim ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
      <aside className={`cb-drawer ${open ? 'is-open' : ''}`} aria-label="메뉴" aria-hidden={!open}>
        <div className="cb-drawer-head">
          <Brand onClick={close} />
          <button type="button" className="cb-drawer-close" aria-label="메뉴 닫기" onClick={close} tabIndex={open ? 0 : -1}>
            <X size={26} />
          </button>
        </div>
        <nav className="cb-drawer-nav">
          {MENU.map(m => (
            <a key={m.href} href={m.href} onClick={close} tabIndex={open ? 0 : -1}>{m.label}</a>
          ))}
        </nav>
        <div className="cb-drawer-foot">
          <a href="#contact-form" className="cb-drawer-btn cb-drawer-btn--fill" onClick={close} tabIndex={open ? 0 : -1}>
            <ClipboardList size={19} /> 무료 견적 신청
          </a>
        </div>
      </aside>

      <style>{`
        .cb-top-right { display: flex; align-items: center; justify-self: end; }
        /* 대표 번호 — 메인 헤더처럼 견적 버튼 왼쪽. 메뉴와 겹치지 않을 만큼 넓은 화면(1100px 이상)에서만 */
        .cb-tel { display: none; align-items: center; gap: 6px; margin-right: 20px; color: #111418; font-size: 1.08rem; font-weight: 700; text-decoration: none; white-space: nowrap; }
        .cb-tel:hover { color: #1f63d6; }
        @media (min-width: 1100px) { .cb-tel { display: inline-flex; } }
        /* 햄버거 — 가운데 메뉴가 숨는 화면(960px 미만)에서만, 상담 버튼 오른쪽에 붙는다 */
        .cb-burger { display: none; width: 44px; height: 44px; align-items: center; justify-content: center; margin-right: -8px; border: 0; background: none; color: #111418; cursor: pointer; }
        @media (max-width: 959px) {
          .cb-burger { display: inline-flex; }
          .cb-top-right { margin-left: auto; }
          .cb-top-btn { margin-right: 6px; }
        }
        /* 휴대폰 — 화면 아래 두 칸 바에 '무료 견적 신청' 이 늘 있으니 헤더에서는 뺀다 */
        @media (max-width: 768px) { .cb-top-btn { display: none !important; } }

        /* 메뉴 판 — 오른쪽에서 밀려 나오고, 뒤는 어둡게 깔린다 */
        .cb-drawer-dim { position: fixed; inset: 0; z-index: 60; background: rgba(17,20,24,.45); opacity: 0; pointer-events: none; transition: opacity .3s ease; }
        .cb-drawer-dim.is-open { opacity: 1; pointer-events: auto; }
        .cb-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 61; width: min(72vw, 320px); display: flex; flex-direction: column; background: #fff; box-shadow: -12px 0 40px rgba(17,20,24,.12); transform: translateX(100%); visibility: hidden; transition: transform .38s cubic-bezier(.16,1,.3,1), visibility 0s linear .38s; }
        .cb-drawer.is-open { transform: none; visibility: visible; transition: transform .38s cubic-bezier(.16,1,.3,1), visibility 0s; }
        .cb-drawer-head { display: flex; align-items: center; justify-content: space-between; height: 76px; padding: 0 16px 0 24px; border-bottom: 1px solid #e9ebef; }
        .cb-drawer-head .cb-brand-sep, .cb-drawer-head .cb-brand-sub { display: none; }
        .cb-drawer-close { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; border: 0; background: none; color: #111418; cursor: pointer; }
        .cb-drawer-nav { flex: 1; display: flex; flex-direction: column; padding: 16px 0; overflow-y: auto; }
        .cb-drawer-nav a { padding: 18px 28px; font-size: 1.15rem; font-weight: 600; color: #111418; text-decoration: none; }
        .cb-drawer-nav a:active { background: #f7f8fa; }
        .cb-drawer-foot { display: grid; gap: 10px; padding: 18px 20px max(22px, env(safe-area-inset-bottom)); border-top: 1px solid #e9ebef; }
        .cb-drawer-btn { display: flex; align-items: center; justify-content: center; gap: 8px; height: 56px; border-radius: 16px; border: 1.5px solid #d5d9df; color: #111418; font-size: 1.05rem; font-weight: 700; text-decoration: none; }
        .cb-drawer-btn--fill { background: #1f63d6; border-color: #1f63d6; color: #fff; }
        @media (prefers-reduced-motion: reduce) { .cb-drawer, .cb-drawer.is-open, .cb-drawer-dim { transition: none; } }
      `}</style>
    </>
  )
}
