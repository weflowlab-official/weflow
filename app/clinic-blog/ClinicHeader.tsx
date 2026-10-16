'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

/**
 * 병·의원 블로그 페이지 상단 띠 — 브랜드와 상담 버튼만 있고, 메인 사이트로 가는 링크는 두지 않는다.
 * 첫 화면에서는 투명하게 두어 제목에 시선이 가게 하고, 조금이라도 내리면 흰 바탕과 아래 선을 깐다.
 * 가운데 메뉴는 페이지 안의 섹션(id)으로만 이동한다 — 넓은 화면에서만 보이고, 좁은 화면에서는 상담 버튼만 남긴다.
 */
const MENU = [
  { href: '#story', label: '지금의 블로그' },
  { href: '#webblog', label: '웹블로그란' },
  { href: '#process', label: '진행 과정' },
  { href: '#faq', label: '자주 묻는 질문' },
]

export default function ClinicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

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

  return (
    <header className={`cb-top ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <div className="cb-wrap cb-top-inner">
        {/* 로고를 누르면 이 페이지 맨 위로 부드럽게 올라간다 — 메인 사이트로 가지 않는다 */}
        <a
          href="#"
          className="cb-brand"
          aria-label="맨 위로"
          onClick={e => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          {/* 로고 원본이 흰색이라 검정으로 뒤집는다 (메인 헤더와 같은 처리) */}
          <Image src="/logo.png" alt="" width={28} height={28} style={{ filter: 'brightness(0)' }} />
          WEFLOW
          <i className="cb-brand-sep" aria-hidden="true" />
          <span className="cb-brand-sub">병·의원 웹블로그</span>
        </a>
        <nav className="cb-menu" aria-label="페이지 안 이동">
          {MENU.map(m => (
            <a key={m.href} href={m.href}>{m.label}</a>
          ))}
        </nav>
        <a href="#contact" className="cb-top-btn">
          무료 상담 신청 <ArrowRight size={15} />
        </a>
      </div>
    </header>
  )
}
