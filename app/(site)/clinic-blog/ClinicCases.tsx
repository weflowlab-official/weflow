'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * 제작 사례 — 히어로 바로 아래. 실제로 운영 중인 병원 웹블로그를 화면 여러 장의 슬라이더로 보여 준다.
 * 웹블로그 메인(/blog)의 'WEFLOW가 만든 웹블로그'(blog/components/home/WebBlogCasesSection.tsx)와 같은 방식:
 * 사진은 저절로 끝없이 넘어가고 커서를 올리면 멈춘다. 사진이나 이름 줄을 누르면 그 웹블로그가 새 창으로 열린다.
 * 병의원 페이지라 병원 사례만 싣는다 — 사례가 늘면 CASES 에 더하면 된다.
 */

type Case = { name: string; category: string; desc: string; href: string; image: string; count: number }

// 사진: public/images/cases/webblog/{image}-01.webp ~ 순서대로 (웹블로그 메인과 같은 파일)
const CASES: Case[] = [
  {
    name: '모두의안과',
    category: '병의원 · 안과',
    desc: '의료진이 직접 쓰는 안과 지식 가이드',
    href: 'https://modooeyeblog.kr/',
    image: 'modooeye',
    count: 7,
  },
]

function CaseCard({ c }: { c: Case }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [index, setIndex] = useState(0)

  return (
    <div className="cc-card">
      {/* 커서가 화살표 위에 있을 때도 멈춰 있도록 Swiper 가 아니라 바깥 상자에서 멈춘다 */}
      <div
        className="cc-frame"
        onMouseEnter={() => swiper?.autoplay?.pause()}
        onMouseLeave={() => swiper?.autoplay?.resume()}
      >
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={setSwiper}
          onSlideChange={s => setIndex(s.realIndex)}
        >
          {Array.from({ length: c.count }, (_, i) => (
            <SwiperSlide key={i}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" draggable={false} aria-label={`${c.name} 웹블로그 새 창으로 열기`} className="cc-shot">
                <Image
                  src={`/images/cases/webblog/${c.image}-${String(i + 1).padStart(2, '0')}.webp`}
                  alt={`${c.name} 웹블로그 화면 ${i + 1}`}
                  fill
                  sizes="(min-width: 960px) 920px, 100vw"
                  draggable={false}
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <button type="button" aria-label="이전 화면" onClick={() => swiper?.slidePrev()} className="cc-nav cc-nav--prev">
          <ChevronLeft size={20} />
        </button>
        <button type="button" aria-label="다음 화면" onClick={() => swiper?.slideNext()} className="cc-nav cc-nav--next">
          <ChevronRight size={20} />
        </button>
        <span className="cc-count">{index + 1} / {c.count}</span>
      </div>
      <a href={c.href} target="_blank" rel="noopener noreferrer" className="cc-info">
        <span>
          <em>{c.category}</em>
          <strong>{c.name}</strong>
          <small>{c.desc}</small>
        </span>
        <b>실제 사례 보러가기 <ArrowUpRight size={17} /></b>
      </a>
    </div>
  )
}

export default function ClinicCases() {
  return (
    <section id="cases" className="cc" aria-labelledby="cc-title">
      <div className="cb-wrap">
        <p className="cb-chapter">CASES</p>
        <h2 id="cc-title" className="cb-h2">WEFLOW가 만든 <br className="cb-mo" />실제 제작 사례</h2>
        <div className="cc-list">
          {CASES.map(c => <CaseCard key={c.name} c={c} />)}
        </div>
      </div>

      <style>{`
        .cc { padding: 88px 0 96px; text-align: center; border-top: 1px solid var(--cb-line); }
        @media (min-width: 960px) { .cc { padding: 120px 0 140px; } }
        /* minmax(0, 1fr) + min-width: 0 — 없으면 슬라이더(Swiper)가 사진 전체 폭만큼 칸을 밀어내 화면 밖으로 커진다 */
        .cc-list { display: grid; grid-template-columns: minmax(0, 1fr); gap: 40px; max-width: 920px; margin: 44px auto 0; text-align: left; }
        .cc-card { min-width: 0; }
        .cc-frame .swiper { width: 100%; }
        .cc-frame { position: relative; overflow: hidden; border-radius: 16px; border: 1px solid var(--cb-line); background: var(--cb-soft); box-shadow: 0 24px 60px rgba(17,20,24,.08); }
        .cc-shot { position: relative; display: block; aspect-ratio: 2 / 1; }
        .cc-nav { position: absolute; top: 50%; z-index: 2; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; transform: translateY(-50%); border: 0; border-radius: 50%; background: rgba(255,255,255,.92); color: var(--cb-text); box-shadow: 0 4px 14px rgba(17,20,24,.16); cursor: pointer; transition: background .15s, color .15s; }
        .cc-nav:hover { background: var(--cb-accent); color: #fff; }
        .cc-nav--prev { left: 10px; }
        .cc-nav--next { right: 10px; }
        .cc-count { position: absolute; right: 10px; bottom: 10px; z-index: 2; padding: 3px 9px; border-radius: 999px; background: rgba(17,20,24,.6); color: #fff; font-size: .78rem; font-weight: 700; }
        /* 이름 줄 — 왼쪽 병원 정보, 오른쪽 '보러 가기'. 줄 전체가 링크 */
        .cc-info { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 18px; padding: 0 4px; color: var(--cb-text); text-decoration: none; }
        .cc-info span { display: grid; gap: 2px; min-width: 0; }
        .cc-info em { font-style: normal; font-size: .9rem; font-weight: 700; color: var(--cb-accent); }
        .cc-info strong { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.02em; }
        .cc-info small { font-size: .95rem; color: var(--cb-sub); }
        .cc-info b { flex: none; display: inline-flex; align-items: center; gap: 4px; padding: 11px 18px; border-radius: 999px; border: 1.5px solid #d5d9df; font-size: .95rem; font-weight: 700; white-space: nowrap; transition: border-color .15s, color .15s; }
        .cc-info:hover b { border-color: var(--cb-accent); color: var(--cb-accent); }
        /* 휴대폰 — '보러가기' 버튼은 뺀다. 이름 줄과 화면 그림이 그대로 링크라 눌러서 갈 수는 있다 */
        @media (max-width: 767px) { .cc-info b { display: none; } }
        @media (max-width: 560px) { .cc-nav { width: 32px; height: 32px; } }
      `}</style>
    </section>
  )
}
