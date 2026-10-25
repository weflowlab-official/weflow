'use client'
import { useEffect, useRef, useState } from 'react'
import { Code2 } from 'lucide-react'

/**
 * 'PHP란?' 박스 — 처음 듣는 사람을 위한 한 줄 설명 + 수치 두 개(83% · 89%) + 출처.
 * 어두운 보안 섹션 세 곳이 같은 박스를 쓴다: 메인(HomePhpSection) · 병의원 웹블로그(clinic-blog/SecurityNews) · 웹블로그(blog SecurityNewsSection).
 * 모양은 이 파일 안의 CSS(.php-what)만 쓴다 — 사이트(Tailwind v3)와 웹블로그(Tailwind v4) 어디에 넣어도 같게 보이도록.
 * 화면에 들어오면 아래에서 떠오른다.
 */
export default function PhpWhat() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`php-what${shown ? ' is-in' : ''}`}>
      <span className="php-what__icon"><Code2 size={24} strokeWidth={1.8} /></span>
      <div>
        <b>PHP란?</b>
        <p>홈페이지를 만들 때 20년 넘게 널리 쓰여 온 서버 프로그래밍 언어입니다.<br className="php-what__pc" />{' '}워드프레스·그누보드 같은 템플릿 홈페이지 제작 도구도 PHP로 만들어져 있습니다.</p>
        {/* 수치 출처: W3Techs 집계(서버 언어가 확인되는 사이트 기준)를 인용한 2026-10-22 보도 · 보안업체 말로리의 쇼단 집계 보도 */}
        <ul className="php-what__stats">
          <li><strong>83%</strong><span>국내 웹사이트 중<br />PHP를 쓰는 비율</span></li>
          <li><strong>89%</strong><span>버전이 확인된 국내 PHP 서버 중<br />지원이 끝난 옛 버전 비율</span></li>
        </ul>
        <small className="php-what__src">출처: W3Techs 집계 인용 보도(디지털타임스·뉴시스, 2026.10.22) · 쇼단 집계 인용 보도(스페셜타임스)</small>
      </div>

      <style>{`
        /* 박스 폭은 안의 글 길이에 맞춘다 (최대 860px) */
        .php-what { display: flex; gap: 18px; align-items: flex-start; width: fit-content; max-width: 860px; margin: clamp(2.5rem, 5vw, 3.5rem) auto 0; padding: clamp(1.25rem, 2.4vw, 1.75rem) clamp(1.4rem, 2.6vw, 2rem); border-radius: clamp(18px, 2.2vw, 24px); background: rgba(63,143,224,.12); box-shadow: inset 0 0 0 1px rgba(111,176,242,.25); color: #fff; text-align: left; opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.16,1,.3,1) .15s, transform .8s cubic-bezier(.16,1,.3,1) .15s; }
        .php-what.is-in { opacity: 1; transform: none; }
        .php-what__icon { flex: none; width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,.08); color: #6fb0f2; display: flex; align-items: center; justify-content: center; }
        .php-what b { font-size: 1.1rem; font-weight: 800; }
        .php-what p { margin: .35rem 0 0; font-size: 1rem; line-height: 1.7; color: rgba(255,255,255,.78); word-break: keep-all; }
        .php-what__pc { display: none; }
        @media (min-width: 768px) { .php-what__pc { display: inline; } }
        .php-what__stats { list-style: none; margin: 1.1rem 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .php-what__stats li { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,.05); }
        .php-what__stats strong { flex: none; font-size: clamp(1.8rem, 3.4vw, 2.4rem); font-weight: 800; letter-spacing: -0.03em; color: #ff7a7a; line-height: 1; }
        .php-what__stats span { font-size: .88rem; line-height: 1.45; color: rgba(255,255,255,.72); word-break: keep-all; }
        @media (max-width: 520px) { .php-what__stats { grid-template-columns: 1fr; } }
        .php-what__src { display: block; margin-top: .7rem; font-size: .75rem; line-height: 1.5; color: rgba(255,255,255,.4); }
        /* 휴대폰 — 수치 카드·출처는 아이콘 칸만큼 왼쪽으로 넓혀, 박스 안 가로폭을 다 쓴다 (왼쪽 끝을 아이콘 시작점에 맞춤: 아이콘 48 + 간격 18) */
        @media (max-width: 767px) { .php-what__stats, .php-what__src { margin-left: -66px; } .php-what__src { text-align: center; } }
        @media (prefers-reduced-motion: reduce) { .php-what { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </div>
  )
}
