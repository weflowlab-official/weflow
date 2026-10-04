import Image from 'next/image'
import Link from 'next/link'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { OFFICIAL_CHANNELS } from '@/data/common'

// 외부 채널 주소 — data/common.ts 의 공용 상수를 쓴다.
// 예전에는 여기서 따로 적어 두었는데, 같은 주소를 사업자 구조화 데이터(sameAs)도 써야 해서
// 한곳으로 모았다. 두 군데 적어 두면 채널이 바뀔 때 한쪽만 고치고 지나가게 된다.
const { kakao: KAKAO_URL, blog: BLOG_URL, instagram: INSTAGRAM_URL, youtube: YOUTUBE_URL } =
  OFFICIAL_CHANNELS

/*
 * 링크 열 — 헤더(Navbar)의 메뉴 묶음과 같은 이름·같은 구성으로 맞춘다.
 * 헤더에서 드롭다운으로 묶인 둘(WEFLOW 혜택 · 포트폴리오)은 그대로 한 열씩,
 * 헤더에 낱개로 있는 것(회사소개 · 사이트 점검 · 상담 버튼)은 '바로가기' 한 열에 모은다.
 * 헤더 메뉴(Navbar 의 NAV_ITEMS)를 고치면 여기도 같이 고친다.
 */
const LINK_COLUMNS = [
  {
    title: 'WEFLOW 혜택',
    links: [
      { label: '혜택 안내', href: '/benefits' },
      { label: '가격 안내', href: '/pricing' },
      { label: '왜 WEFLOW?', href: '/difference' },
    ],
  },
  {
    title: '포트폴리오',
    links: [
      { label: '제작 사례', href: '/cases' },
      { label: '제작 라인업', href: '/guide' },
    ],
  },
  {
    title: '바로가기',
    links: [
      { label: '회사소개', href: '/about' },
      { label: '사이트 점검', href: '/check' },
      { label: '맞춤 견적', href: '/diagnosis' },
    ],
  },
]

/* 아이콘 SVG */
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
  </svg>
)
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const KakaoIcon = () => <RiKakaoTalkFill size={14} />

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const NaverIcon = () => (
  <svg width="14" height="14" viewBox="-3.5 -3.5 31 31" fill="currentColor">
    <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.39.53A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.89.53 9.39.53 9.39.53s7.5 0 9.39-.53a3 3 0 0 0 2.11-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.57V8.43L15.82 12z"/>
  </svg>
)

// 상담문의 열 — 아이콘은 각 채널 브랜드 색으로 표시
const CONTACT_LINKS = [
  { label: '전화문의',          href: 'tel:010-2971-7280',              Icon: PhoneIcon,    external: false, color: '#16a34a' },
  { label: '이메일 문의',       href: 'mailto:contact@weflowlab.kr',    Icon: MailIcon,     external: false, color: '#5b9bff' },
  { label: '카카오 채널 문의',  href: KAKAO_URL,                         Icon: KakaoIcon,    external: true,  color: '#FEE500' },
  { label: '인스타 문의',       href: INSTAGRAM_URL,                     Icon: InstagramIcon, external: true, color: '#E4405F' },
  { label: '블로그',            href: BLOG_URL,                          Icon: NaverIcon,    external: true,  color: '#03C75A' },
  { label: '유튜브',            href: YOUTUBE_URL,                       Icon: YoutubeIcon,  external: true,  color: '#FF0000' },
]

/**
 * 모든 페이지 하단의 푸터 — 브랜드·사업자 정보 + 링크 3열(헤더 메뉴와 같은 묶음) + 상담문의 + 카피라이트.
 * 하단에 약간의 여백(paddingBottom)을 둔다.
 *
 * 흰 바탕이다. 사이트 기본 색 변수(--text 등)는 어두운 바탕용이라, 푸터 안에서만
 * 밝은 바탕용 값으로 덮어쓴다 — 안쪽의 글씨·선이 모두 이 값을 따라간다.
 */
const LIGHT = {
  '--text': '#111',
  '--text-secondary': '#5c6066',
  '--text-muted': '#8a8a8a',
  '--border': 'rgba(17, 17, 17, 0.1)',
} as React.CSSProperties

export default function Footer() {
  return (
    <footer style={{ ...LIGHT, background: '#fff', color: 'var(--text-muted)', paddingBottom: '72px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>

        {/* ── 메인 그리드 ── */}
        <div className="ft-main">

          {/* 브랜드 + 사업자 정보 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {/* 로고 원본이 흰색이라 흰 바탕에서는 검정으로 뒤집는다 */}
              <Image src="/logo.png" alt="WEFLOW" width={24} height={24}
                style={{ width: 24, height: 24, objectFit: 'contain', filter: 'brightness(0)' }} />
              <span className="headline emphasized" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>WEFLOW</span>
            </div>
            <p className="footnote" style={{ lineHeight: 1.8, margin: '0 0 1.25rem', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>
              제작부터 관리까지<br />비즈니스 성장을 함께합니다.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', color: 'var(--text-muted)' }} className="footnote">
              {/* span 이 아니라 p 로 두는 이유 —
                  span 은 줄바꿈이 없는 요소라, 검색엔진이 글자만 뽑을 때
                  "신서준사업자등록번호" 처럼 항목이 붙어버린다 (검색 결과에 그대로 노출됨) */}
              <p style={{ margin: 0 }}>대표 : 신서준</p>
              <p style={{ margin: 0 }}>사업자등록번호 : 884-07-03480</p>
              <p style={{ margin: 0 }}>이메일 : contact@weflowlab.kr</p>
              <p style={{ margin: 0 }}>운영시간 : 연중무휴 24시간 상담가능</p>
            </div>
          </div>

          {/* 링크 열 — 헤더 메뉴와 같은 묶음 */}
          {LINK_COLUMNS.map(col => (
            <div key={col.title}>
              <p className="ft-col-title">{col.title}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="footnote" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 상담문의 */}
          <div>
            <p className="ft-col-title">상담문의</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {CONTACT_LINKS.map(({ label, href, Icon, external, color }) => (
                <li key={label}>
                  <a href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', textDecoration: 'none' }} className="footnote">
                    <span style={{ display: 'inline-flex', color }}>
                      <Icon />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 하단 카피라이트 ── */}
        <div style={{
          borderTop: '1px solid var(--border)', marginTop: '2.5rem',
          paddingTop: '1.25rem', paddingBottom: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/privacy" className="caption-2" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>개인정보처리방침</Link>
            <span className="caption-2" style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>이용약관</span>
            <Link href="/admin" className="caption-2" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>관리자</Link>
          </div>
          <span className="caption-2" style={{ color: 'var(--text-muted)' }}>© 2026 WEFLOW. All rights reserved.</span>
        </div>
      </div>

      <style>{`
        .ft-col-title {
          font-size: 1.05rem; font-weight: 600; color: var(--text);
          letter-spacing: -0.01em;
          margin: 0 0 0.95rem;
        }
        /* 푸터 내부 글씨 키우기 */
        footer .footnote { font-size: 0.95rem; }
        footer .caption-2 { font-size: 0.82rem; }
        .ft-main {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        /* 좁아지면 브랜드 칸이 한 줄을 다 쓰고, 링크 네 열이 2 × 2 로 놓인다 */
        @media (max-width: 900px) {
          .ft-main { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .ft-main > :first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .ft-main { grid-template-columns: 1fr; gap: 1.75rem; }
        }
      `}</style>
    </footer>
  )
}
