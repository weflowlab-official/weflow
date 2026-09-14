'use client'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Phone, ClipboardCheck, CalendarCheck } from 'lucide-react'

// PC 우측 세로 플로팅 — 전화·상담. bg/fg는 버튼 색.
// metal 을 주면 금속 테두리와 광택이 붙는다(.fab-metal + .fab-gold/.fab-silver).
// 바탕은 금속이 앞에 서도록 어두운 유리로 둔다 — 금색 CTA 버튼(.btn-gold)과 같은 처리다.
// fg 는 각 금속의 중간 색. 평소엔 광택 애니메이션이 덮어쓰지만,
// 움직임 줄이기를 켠 사용자에게는 이 색이 그대로 보인다.
// metal 클래스는 반드시 통째로 적는다. 이 스타일들은 globals.css 의 @layer components 안에
// 있고, Tailwind 는 소스에 글자 그대로 적힌 클래스만 남기고 나머지를 빌드에서 지운다.
// `fab-${metal}` 처럼 조립하면 클래스가 통째로 사라져 테두리·글자가 안 보이게 된다.
const GLASS = 'rgba(14,14,16,0.82)'
const ITEMS = [
  { href: '/diagnosis', label: '무료 상담', icon: ClipboardCheck, size: 26, bg: GLASS, fg: '#c9a262', wiggle: true, metal: 'fab-metal fab-gold' },
  // 수화기는 실루엣 하나뿐이라 안쪽을 파내지 않는다 (solidIcon) — 파면 가늘어 보인다
  { href: 'tel:010-2971-7280', label: '24시간 상담', icon: Phone, size: 25, bg: GLASS, fg: '#a3a3aa', tel: true, metal: 'fab-metal fab-silver', solidIcon: true },
]

/**
 * 고정 CTA — 화면 크기에 따라 모양이 다르다.
 * · PC: 우측 세로 원형 버튼 3개(전화·카톡·상담). hover 하면 라벨이 왼쪽으로 펼쳐진다.
 * · 모바일: 화면 맨 아래에 붙는 두 칸 바(바로전화 · 무료상담신청).
 *   원형 버튼이 스크롤을 따라다니며 내용을 가리는 것보다, 늘 같은 자리의 큰 바가 누르기 쉽다.
 * 전화/외부 링크는 <a>, 내부 경로는 <Link>로 나눠 그린다.
 */
export default function FloatingButtons() {
  return (
    <>
      {/* PC — 우측 세로 원형 버튼 (모바일에선 CSS 로 숨김) */}
      <div className="floating-cta">
        {ITEMS.map(({ href, label, icon: Icon, size, bg, fg, tel, wiggle, metal, solidIcon }) => {
          const style = { '--fab-bg': bg, '--fab-fg': fg } as CSSProperties
          const className = ['fab', wiggle && 'fab-wiggle', metal, solidIcon && 'fab-icon-solid']
            .filter(Boolean)
            .join(' ')
          const inner = (
            <>
              <span className="fab-label">{label}</span>
              <span className="fab-icon"><Icon size={size} /></span>
            </>
          )

          if (tel) {
            return (
              <a key={label} href={href} aria-label={label} className={className} style={style}>
                {inner}
              </a>
            )
          }
          return (
            <Link key={label} href={href} aria-label={label} className={className} style={style}>
              {inner}
            </Link>
          )
        })}
      </div>

      {/* 모바일 — 화면 맨 아래 두 칸 바 (PC 에선 CSS 로 숨김) */}
      <div className="mobile-cta-bar">
        <a href="tel:010-2971-7280" className="mobile-cta-bar__btn mobile-cta-bar__btn--call">
          <Phone size={20} strokeWidth={1.8} />
          바로전화
        </a>
        <Link href="/diagnosis" className="mobile-cta-bar__btn mobile-cta-bar__btn--form">
          <CalendarCheck size={20} strokeWidth={1.8} />
          무료상담신청
        </Link>
      </div>
    </>
  )
}
