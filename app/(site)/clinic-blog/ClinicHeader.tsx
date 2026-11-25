'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X, ClipboardList, Phone, ExternalLink } from 'lucide-react'

/**
 * 병의원 블로그 페이지 상단 띠 — 브랜드와 상담 버튼만 있고, 메인 사이트로 가는 링크는 두지 않는다.
 * 첫 화면에서는 투명하게 두어 제목에 시선이 가게 하고, 조금이라도 내리면 흰 바탕과 아래 선을 깐다.
 * 가운데 메뉴는 페이지 안의 섹션(id)으로 이동한다 — 넓은 화면에서만 보인다.
 * 메뉴가 늘어 묶음 둘은 드롭다운으로 편다 (메인 헤더 components/Navbar.tsx 와 같은 방식 — 올리면 펼쳐지고, 좁은 화면 메뉴 판에서는 눌러서 편다).
 * '무료 진단·체험' 묶음(사이트 진단 · 글쓰기 데모)은 이 페이지 밖의 화면이라 새 탭으로 연다 — 광고 랜딩을 떠나지 않게.
 * 좁은 화면에서는 상담 버튼 오른쪽에 햄버거 버튼을 두고, 누르면 오른쪽에서 메뉴 판이 밀려 나온다
 * (메인 사이트 모바일 메뉴와 같은 구성 — 위에 로고·닫기, 가운데 메뉴, 아래 바로 전화 · 맞춤 견적 받기 버튼).
 * base: 404 처럼 이 페이지 밖에서 쓸 때 '/clinic-blog' 를 넘긴다 — 메뉴·버튼이 이 페이지의 각 섹션으로, 로고는 이 페이지 맨 위로 간다.
 *   본 페이지에서는 비워 둔다 (#id 만 쓰면 광고 주소의 ?utm 같은 꼬리가 그대로 남는다).
 */
/** 대표 번호 — 메인 헤더(components/Navbar.tsx)와 같은 번호 */
const TEL = '010-2971-7280'

// 페이지 순서와 같게: 제작 사례 → 왜 WEFLOW?(WHY WEFLOW 01~02 · 바로 아래 가격 안내) → 웹블로그 소개(웹블로그란 · 홈페이지와 함께) → SEO·AEO·GEO → 무료 진단·체험(새 탭).
// 묶음 안의 '홈페이지와 함께'만 실제로는 SEO·AEO·GEO 보다 아래에 있다.
// 'WHY NOW 두 장면(우리 병원은?)' · '진행 과정' · '자주 묻는 질문'은 메뉴로 찾아갈 만큼 궁금한 내용이 아니라 뺐다 (스크롤로 지나며 본다)
// ext: 이 페이지 밖의 화면(진단 · 데모) — 주소를 그대로 쓰고 새 탭으로 연다
// accent: 강조색으로 띄우는 메뉴 ('왜 WEFLOW?')
type MenuLink = { href: string; label: string; ext?: boolean; accent?: boolean }
type MenuGroup = { label: string; children: MenuLink[]; accent?: boolean }
const MENU: (MenuLink | MenuGroup)[] = [
  { href: '#cases', label: '제작 사례' },
  {
    label: '왜 WEFLOW?',
    accent: true,
    children: [
      { href: '#security', label: '왜 WEFLOW?' },
      { href: '#plans', label: '가격 안내' },
    ],
  },
  {
    label: '웹블로그 소개',
    children: [
      { href: '#with-homepage', label: '홈페이지와 함께' },
      { href: '#webblog', label: '웹블로그란?' },
    ],
  },
  { href: '#how', label: 'SEO·AEO·GEO란?' },
  {
    label: '무료 진단·체험',
    children: [
      { href: '/clinic-blog/check', label: '내 사이트 5초 진단', ext: true },
      { href: '/clinic-blog/demo', label: '관리자페이지 체험', ext: true },
    ],
  },
]

/** 로고 — 누르면 이 페이지 맨 위로 부드럽게 올라간다 (메인 사이트로 가지 않는다). base 가 있으면 그 주소로 이동 */
function Brand({ onClick, base }: { onClick?: () => void; base: string }) {
  return (
    <a
      href={base || '#'}
      className="cb-brand"
      aria-label={base ? '병의원 웹블로그 처음으로' : '맨 위로'}
      onClick={e => {
        onClick?.()
        if (base) return
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      {/* 로고 원본이 흰색이라 검정으로 뒤집는다 (메인 헤더와 같은 처리) */}
      <Image src="/logo.png" alt="" width={28} height={28} style={{ filter: 'brightness(0)' }} />
      WEFLOW
      <i className="cb-brand-sep" aria-hidden="true" />
      <span className="cb-brand-sub">병의원 웹블로그<span className="cb-brand-more"> · 홈페이지</span></span>
    </a>
  )
}

export default function ClinicHeader({ base = '' }: { base?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false) // 모바일 메뉴 판
  const [groups, setGroups] = useState<Record<string, boolean>>({}) // 메뉴 판에서 펼친 묶음

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
  // 페이지 안 이동은 base 를 붙이고(#id), 밖의 화면은 주소 그대로 새 탭으로
  // 방금 누른 묶음 — 마우스가 아직 그 위에 있어도 목록을 닫아 둔다 (:hover 만으로는 누른 뒤에도 펼쳐진 채 남는다). 마우스가 묶음을 벗어나면 풀린다
  const [shut, setShut] = useState('')
  const linkProps = (m: MenuLink) =>
    m.ext ? { href: m.href, target: '_blank', rel: 'noopener noreferrer' } : { href: base + m.href }

  return (
    <>
      <header className={`cb-top ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
        <div className="cb-wrap cb-top-inner">
          <Brand base={base} />
          <nav className="cb-menu" aria-label="페이지 안 이동">
            {MENU.map(m =>
              'children' in m ? (
                // 묶음 — 올리거나 탭 키로 들어오면 아래로 펼쳐진다 (CSS :hover · :focus-within).
                // 고른 뒤에는 초점을 풀어 목록이 열린 채 남지 않게 한다
                <div key={m.label} className={`cb-menu-group${shut === m.label ? ' is-shut' : ''}`} onMouseLeave={() => setShut('')}>
                  {/* 묶음 이름도 링크 — 누르면 목록의 첫 항목으로 간다 (목록은 올리기만 해도 펼쳐진다) */}
                  <a className={`cb-menu-trigger${m.accent ? ' is-accent' : ''}`} aria-haspopup="true" {...linkProps(m.children[0])} onClick={e => { e.currentTarget.blur(); setShut(m.label) }}>
                    {m.label} <ChevronDown size={15} />
                  </a>
                  <div className="cb-menu-pop">
                    <div className="cb-menu-list">
                      {m.children.map(c => (
                        <a key={c.href} {...linkProps(c)} onClick={e => { e.currentTarget.blur(); setShut(m.label) }}>
                          {c.label}
                          {c.ext && <ArrowUpRight size={14} />}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a key={m.href} className={`cb-menu-link${m.accent ? ' is-accent' : ''}`} {...linkProps(m)}>{m.label}</a>
              ),
            )}
          </nav>
          {/* 오른쪽 묶음 — 견적 버튼 · 햄버거(좁은 화면에서만). 대표 번호는 뺐다 (전화는 떠 있는 전화 버튼과 메뉴 판의 '바로 전화'가 맡는다) */}
          <div className="cb-top-right">
            <a href={`${base}#contact-form`} className="cb-top-btn">
              맞춤 견적 받기 <ArrowRight size={15} />
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
          <Brand onClick={close} base={base} />
          <button type="button" className="cb-drawer-close" aria-label="메뉴 닫기" onClick={close} tabIndex={open ? 0 : -1}>
            <X size={26} />
          </button>
        </div>
        <nav className="cb-drawer-nav">
          {MENU.map(m => {
            if (!('children' in m)) {
              return <a key={m.href} className={m.accent ? 'is-accent' : undefined} {...linkProps(m)} onClick={close} tabIndex={open ? 0 : -1}>{m.label}</a>
            }
            // 묶음 — 눌러서 편다. 하나를 펴면 다른 묶음은 접힌다. grid-rows 0fr ↔ 1fr 로 높이가 부드럽게 열리고, 접힌 동안에는 탭 키로도 안 잡힌다
            const shown = !!groups[m.label]
            return (
              <div key={m.label}>
                <button
                  type="button"
                  className={`cb-drawer-group${m.accent ? ' is-accent' : ''}`}
                  aria-expanded={shown}
                  onClick={() => setGroups({ [m.label]: !shown })}
                  tabIndex={open ? 0 : -1}
                >
                  <span>{m.label}</span>
                  <ChevronDown size={19} style={{ transform: shown ? 'rotate(180deg)' : 'none' }} />
                </button>
                <div className="cb-drawer-sub" style={{ gridTemplateRows: shown ? '1fr' : '0fr' }}>
                  <div style={{ visibility: shown ? 'visible' : 'hidden' }}>
                    {m.children.map(c => (
                      <a key={c.href} {...linkProps(c)} onClick={close} tabIndex={open && shown ? 0 : -1}>
                        {c.label}
                        {c.ext && <ArrowUpRight size={16} />}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
          {/* 실제 웹블로그 — 메뉴 줄처럼, 새 탭으로. 메인 사이트의 금색 광택 글씨 */}
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="cb-drawer-ext" onClick={close} tabIndex={open ? 0 : -1}>
            <span>웹블로그 바로가기</span> <ExternalLink size={17} />
          </a>
        </nav>
        <div className="cb-drawer-foot">
          <a href={`tel:${TEL}`} className="cb-drawer-btn cb-drawer-btn--tel" tabIndex={open ? 0 : -1}>
            <Phone size={19} fill="currentColor" /> 바로 전화
          </a>
          <a href={`${base}#contact-form`} className="cb-drawer-btn cb-drawer-btn--fill" onClick={close} tabIndex={open ? 0 : -1}>
            <ClipboardList size={19} /> 맞춤 견적 받기
          </a>
        </div>
      </aside>

      <style>{`
        /* 헤더 — 양끝까지 꽉 찬 얇은 띠. 처음엔 투명, 내리면 흰 바탕 + 아래 선 (ClinicHeader 가 is-scrolled 를 붙인다).
           내용 위로 겹치므로 첫 화면은 그만큼 내려 시작한다 */
        .cb-top { position: fixed; top: 0; left: 0; right: 0; z-index: 30; background: transparent; border-bottom: 1px solid transparent; transition: background .25s ease, border-color .25s ease, transform .35s cubic-bezier(.16,1,.3,1); }
        .cb-top.is-hidden { transform: translateY(-100%); }
        .cb-top.is-scrolled { background: rgba(255,255,255,.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom-color: var(--cb-line); }
        /* 헤더만 본문(1080px)보다 넓게 — 로고와 버튼을 양끝으로 더 벌린다 */
        .cb-top .cb-top-inner { max-width: 1440px; padding: 0 clamp(20px, 3vw, 48px); }
        .cb-top-inner { height: 76px; display: flex; align-items: center; justify-content: space-between; }
        .cb-brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.35rem; color: var(--cb-text); text-decoration: none; cursor: pointer; letter-spacing: -0.02em; }
        .cb-brand-sep { width: 1px; height: 14px; background: #d5d9df; margin: 0 4px; }
        /* 로고 옆 한 줄 — 무엇을 만드는 곳인지. 흐린 회색은 눈에 안 들어와 이 페이지 파랑으로 또렷하게 */
        .cb-brand-sub { font-weight: 700; font-size: 1.02rem; letter-spacing: -0.01em; white-space: nowrap; background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: cbBrandGold 2.8s linear infinite; } /* 금색 광택 — 히어로 칩 · '왜 WEFLOW?' 와 같은 금색 */
        @keyframes cbBrandGold { from { background-position: 250% center; } to { background-position: 0% center; } }
        @media (prefers-reduced-motion: reduce) { .cb-brand-sub { animation: none; } }
        /* ' · 홈페이지' 는 자리가 넉넉할 때만 — 가운데 메뉴와 함께 보이는 폭(1200~1499px)에서는 메뉴에 자리를 내준다 */
        .cb-top-btn { display: inline-flex; align-items: center; gap: 6px; height: 44px; padding: 0 20px; border-radius: 999px; background: var(--cb-text); color: #fff; font-weight: 700; font-size: 1.02rem; text-decoration: none; transition: background .15s; }
        .cb-top-btn:hover { background: var(--cb-accent); }
        /* 휴대폰 — 버튼을 작게 */
        @media (max-width: 640px) { .cb-top-btn { height: 36px; padding: 0 14px; font-size: .86rem; gap: 4px; } }
        .cb-menu { display: none; gap: 36px; }
        /* 넓은 화면 — 3칸 격자(양쪽 같은 폭)로 메뉴를 로고·버튼 폭과 상관없이 화면 정가운데에 둔다.
           로고 묶음(WEFLOW | 병의원 웹블로그 · 홈페이지)이 길어 메뉴가 로고 쪽에 붙어 보여서, 메뉴가 보이는 폭에서는 한 줄 그대로 두고 크기만 한 단계 줄인다 (2026-11-19) */
        @media (min-width: 1200px) {
          .cb-menu { display: flex; align-items: center; }
          .cb-top-inner { display: grid; grid-template-columns: 1fr auto 1fr; }
          .cb-top-inner .cb-brand { justify-self: start; font-size: 1.18rem; gap: 8px; }
          .cb-top-inner .cb-brand img { width: 24px; height: 24px; }
          .cb-top-inner .cb-brand-sep { height: 12px; margin: 0 2px; }
          .cb-top-inner .cb-brand-sub { font-size: .88rem; }
        }
        /* 메뉴가 다섯 개라, 메뉴가 여섯 개로 늘어, 메뉴가 처음 보이는 폭(1200~1439px)에서는 간격·글자를 줄여 로고·버튼과 겹치지 않게 */
        @media (min-width: 1200px) and (max-width: 1439px) { .cb-menu { gap: 24px; } .cb-menu-link, .cb-menu-trigger { font-size: .9rem !important; } }
        .cb-menu-link, .cb-menu-trigger { position: relative; display: inline-flex; align-items: center; gap: 3px; color: var(--cb-sub); font: inherit; font-weight: 600; font-size: .95rem; text-decoration: none; padding: 6px 0; border: 0; background: none; cursor: pointer; white-space: nowrap; transition: color .15s; }
        .cb-menu-link::after, .cb-menu-trigger::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--cb-text); transform: scaleX(0); transition: transform .25s ease; }
        .cb-menu-link:hover, .cb-menu-group:hover .cb-menu-trigger, .cb-menu-group:focus-within .cb-menu-trigger { color: var(--cb-text); }
        .cb-menu-link:hover::after, .cb-menu-group:hover .cb-menu-trigger::after, .cb-menu-group:focus-within .cb-menu-trigger::after { transform: scaleX(1); }
        /* 강조 메뉴('왜 WEFLOW?') — 이 페이지 파랑, 굵게 */
        .cb-menu-link.is-accent { color: var(--cb-accent); font-weight: 800; }
        .cb-menu-link.is-accent:hover { color: #1852b5; }
        .cb-menu-link.is-accent::after { background: var(--cb-accent); }
        .cb-drawer-nav a.is-accent { color: #1f63d6; font-weight: 800; }
        /* '왜 WEFLOW?' 묶음 — 금색 글씨에 광택이 왼쪽에서 오른쪽으로 흐른다. 메인 가격 안내(/pricing 의 .pr-gold)와 같은 흰 바탕용 중간 톤 금색,
           움직임은 사이트 공통 cGoldSheen(styles/globals.css). 글자를 배경으로 오려 내는 방식이라 꺾쇠(svg)는 색을 따로 준다 */
        .cb-menu-group .cb-menu-trigger.is-accent, .cb-drawer-group.is-accent > span { font-weight: 800; background: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #e2c68c 50%, #b8914e 62%, #a8823e 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: cGoldSheen 2.8s linear infinite; }
        .cb-menu-trigger.is-accent svg, .cb-drawer-group.is-accent svg, .cb-drawer-group.is-accent[aria-expanded="true"] svg { color: #b8914e; }
        .cb-menu-trigger.is-accent::after { background: #b8914e; }
        @media (prefers-reduced-motion: reduce) { .cb-menu-group .cb-menu-trigger.is-accent, .cb-drawer-group.is-accent > span { animation: none; } }
        /* 묶음 드롭다운 — 메인 헤더와 같은 흰 상자. 위 여백(padding-top)까지가 hover 영역이라 내려가는 사이에 닫히지 않는다 */
        .cb-menu-group { position: relative; }
        /* 누른 직후(.is-shut)와 헤더가 위로 숨은 동안에는 목록을 닫는다 */
        .cb-menu-group.is-shut .cb-menu-pop, .cb-top.is-hidden .cb-menu-pop { opacity: 0 !important; visibility: hidden !important; }
        .cb-menu-trigger svg { transition: transform .2s; }
        .cb-menu-group:hover .cb-menu-trigger svg, .cb-menu-group:focus-within .cb-menu-trigger svg { transform: rotate(180deg); }
        .cb-menu-pop { position: absolute; top: 100%; left: 50%; padding-top: 10px; transform: translateX(-50%) translateY(-4px); opacity: 0; visibility: hidden; transition: opacity .18s, transform .18s, visibility .18s; }
        .cb-menu-group:hover .cb-menu-pop, .cb-menu-group:focus-within .cb-menu-pop { opacity: 1; visibility: visible; transform: translateX(-50%); }
        .cb-menu-list { min-width: 176px; padding: 6px; background: #fff; border: 1px solid rgba(17,17,17,.08); border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,.12); }
        .cb-menu-list a { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border-radius: 8px; color: var(--cb-sub); font-weight: 600; font-size: .93rem; text-decoration: none; white-space: nowrap; transition: background .15s, color .15s; }
        .cb-menu-list a:hover { background: var(--cb-soft); color: var(--cb-text); }
        .cb-menu-list a svg { color: var(--cb-muted); }
        .cb-top-btn svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .cb-top-btn:hover svg { transform: translateX(3px); }
        @media (max-width: 480px) { .cb-brand-sep, .cb-brand-sub { display: none; } }

        .cb-top-right { display: flex; align-items: center; justify-self: end; }
        /* 햄버거 — 가운데 메뉴가 숨는 화면(1200px 미만)에서만 (메뉴가 여섯 개라 그보다 좁으면 로고·버튼과 겹친다), 상담 버튼 오른쪽에 붙는다 */
        .cb-burger { display: none; width: 44px; height: 44px; align-items: center; justify-content: center; margin-right: -8px; border: 0; background: none; color: #111418; cursor: pointer; }
        @media (max-width: 1199px) {
          .cb-burger { display: inline-flex; }
          .cb-top-right { margin-left: auto; }
          .cb-top-btn { margin-right: 6px; }
        }
        /* 휴대폰 — 화면 아래 두 칸 바에 '맞춤 견적 받기' 이 늘 있으니 헤더에서는 뺀다 */
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
        .cb-drawer-nav a { padding: 15px 28px; font-size: 1.08rem; font-weight: 600; color: #111418; text-decoration: none; }
        .cb-drawer-nav a:active { background: #f7f8fa; }
        /* 묶음 — 이름 줄을 누르면 아래 줄들이 펼쳐진다 (조금 들여 쓰고 한 단계 작게) */
        .cb-drawer-group { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 15px 28px; border: 0; background: none; font: inherit; font-size: 1.08rem; font-weight: 600; color: #111418; text-align: left; cursor: pointer; }
        .cb-drawer-group svg { color: #8a919c; transition: transform .2s; }
        .cb-drawer-sub { display: grid; transition: grid-template-rows .25s ease; }
        /* 펼친 줄들은 연회색 판 위에 — 어느 묶음에 속한 줄인지 한눈에 보이게 */
        .cb-drawer-sub > div { overflow: hidden; display: flex; flex-direction: column; background: #f7f8fa; transition: visibility .25s; }
        .cb-drawer-sub > div > a:first-child { margin-top: 6px; }
        .cb-drawer-sub > div > a:last-child { margin-bottom: 6px; }
        .cb-drawer-nav .cb-drawer-sub a { display: flex; align-items: center; gap: 4px; padding: 11px 28px 11px 40px; font-size: .97rem; font-weight: 500; color: #4b5360; }
        .cb-drawer-nav .cb-drawer-sub a:active { background: #eef0f3; }
        /* 펼친 묶음의 이름은 파랗게 */
        .cb-drawer-group[aria-expanded="true"] { color: #1f63d6; }
        .cb-drawer-group[aria-expanded="true"] svg { color: #1f63d6; }
        .cb-drawer-nav .cb-drawer-sub a svg { color: #8a919c; }
        /* 웹블로그 바로가기 — 메인 사이트의 금색 + 왼쪽에서 오른쪽으로 흐르는 광택 (금색 테두리 .btn-goldline 과 같은 색·속도).
           흰 바탕 위라 메인의 밝은 금색(.c-gold) 대신 한 단계 짙은 금색을 쓴다 */
        .cb-drawer-nav .cb-drawer-ext { display: flex; align-items: center; gap: 6px; font-weight: 800; color: #a8823e; }
        .cb-drawer-ext span { background: linear-gradient(115deg, #9a7434 0%, #b8903f 38%, #ecd08a 50%, #b8903f 62%, #9a7434 100%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: cbGoldSheen 2.8s linear infinite; }
        @keyframes cbGoldSheen { from { background-position: 250% center; } to { background-position: 0% center; } }
        .cb-drawer-foot { display: grid; gap: 10px; padding: 18px 20px max(22px, env(safe-area-inset-bottom)); border-top: 1px solid #e9ebef; }
        .cb-drawer-btn { display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 16px; border: 1.5px solid #d5d9df; color: #111418; font-size: 1rem; font-weight: 700; text-decoration: none; }
        .cb-drawer-btn--fill { background: #1f63d6; border-color: #1f63d6; color: #fff; }
        .cb-drawer-btn--tel svg { color: #16a34a; } /* 하단 바 '바로 전화' 와 같은 초록 수화기 */
        @media (prefers-reduced-motion: reduce) { .cb-drawer, .cb-drawer.is-open, .cb-drawer-dim, .cb-drawer-sub { transition: none; } .cb-drawer-ext span { animation: none; } }
      `}</style>
    </>
  )
}
