'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// 메인에 노출할 사례 — 사진을 누르면 해당 사이트가 새 창으로 열린다.
// 제작 사례 탭(data/cases.ts)과 달리 여기는 골라서 넣는다.
const SLIDES = [
  {
    src: '/images/cases/cases-kpsc-01.webp',
    alt: 'KPSC 미래 에너지 기업 홈페이지 제작 사례',
    url: 'https://helplus.kr/',
    blur: 'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAABwBACdASoYAAsAPrVMnkonJCKhsAgA4BaJbACdMoMljEnE5nI/h+OjDRiDAAD+743PnTLOoI6ZGasVek/kGRwaV/+X4fyhUfLFoPiYQ7HZ7Uj4dOHt41gFOrNsYMhYG/0cRQqJoUidzsaraI5AYeHZXG5joM7pUfkZhW8/UqGnKfR+MYHAJNUC3iKSbzw8tUAAAA==',
  },
  {
    src: '/images/cases/cases-saedure-01.webp',
    alt: '새두레 융복합 공연 문화기업 홈페이지 제작 사례',
    url: 'https://mazigut.com/',
    blur: 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADQAwCdASoYAAsAPrVInkmnJCKhMAgA4BaJYgAAW+yEc0tMP8LtRgAA/vaSElIns3t/WX6+LLd4OmXwfjIStGs17Zf/yezcHPqI9ylnVbT1+xrKnUMjuYeuLA6nIDNJPtvbvEAA',
  },
  {
    src: '/images/main/main-portfolio-01.webp',
    alt: '특장맨 특장 카니발 홈페이지 제작 사례',
    url: 'https://teukjangman.kr/',
    blur: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAwCdASoYAAsAPxGCtFIsKaUisAgBgCIJZwAAWeSShKv1huRWHQAA/p2Ge4KjjY/XvJMQgNeM+sK0U2oVjAQA',
  },
  {
    src: '/images/main/main-portfolio-02.webp',
    alt: 'CAMP CAMBIO 캄비오 캠핑장 홈페이지 제작 사례',
    url: 'https://cambiocamp.vercel.app/',
    blur: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAwCdASoYAAsAPxFyslAsJqSisAgBgCIJZwAAXBsFhl4KbBH72SAA+kmVferobhABT0HPfeMnttNRNRL72gcAAAA=',
  },
  {
    src: '/images/cases/cases-leesiyeon-01.webp',
    alt: '이시연 설계사 보험 상담 홈페이지 제작 사례',
    url: 'https://leesiyeon.vercel.app/',
    blur: 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABwAwCdASoYAAsAPzmIvlSvKSajMAgB4CcJQBhmhghwDauPkAAA/u4BB6RlxJcfGHe7ntroJ2UaQpa9kYt1/PXEe/BmkV+P7FMIW+Oq4vE1g0QfBJJnttPlqLWzDOJeIbhvyoRXVbDdcXCyGZjBJAAA',
  },
  {
    src: '/images/cases/cases-ruricompany-02.webp',
    alt: '루리컴퍼니 신차 할부·리스·장기렌트 홈페이지 제작 사례',
    url: 'https://ruricompany.vercel.app/',
    blur: 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADwAwCdASoYAAsAPzmGulQvKSWjMAgB4CcJYwCw7Btm5UY8mn9DPcQAAP7jSoZVR9ccHNhOQYcifFY6bhEJtig4YQvsio7p2yh24UuS3Uo6PRfSfIr4yaNJLXtVhqhyC3CCAAAA',
  },
  {
    src: '/images/cases/cases-parknara-01.webp',
    alt: '박나라 컨설턴트 홈페이지 제작 사례',
    url: 'https://parknara.vercel.app/',
    blur: 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADQAwCdASoYAAsAPzmKulOvKaWisAgB4CcJQBdgAySZ4RcWEiRYOXwA/unXZxTumV93M0CVtOwFwbE1SaR3dkqS3N0bqVUZtpmLzCQ+K8hN8boxUAVcHujrXZouK7Ho77j5oJaCwrJQ8zDHJdgAAA==',
  },
  {
    src: '/images/cases/cases-incar-01.webp',
    alt: '인카금융서비스 베스트사업단 보험설계사 채용 홈페이지 제작 사례',
    url: 'https://incarr.vercel.app/',
    blur: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACQAwCdASoYAAsAPzmIvlOvKScisAgB4CcJQBWABD4alo5Nv2oAAP7Y4VFd77tVgagDaTnYcXW46sfCFe21T0QgvtsT5/HfN3xFkAAA',
  },
]
const COUNT = SLIDES.length
const INTERVAL = 4000

/**
 * 메인 포트폴리오 섹션의 사례 캐러셀 — 4초 자동 전환 · 화살표·스와이프로 조작.
 * 아래 고객 인터뷰 섹션과 높이를 맞추려고 16:9로 두고, 사진은 자르지 않고 늘린다.
 */
export default function PortfolioCarousel() {
  // pos는 0..COUNT 범위. COUNT는 트랙 끝에 덧댄 첫 장의 복제본 자리다.
  // 마지막 장에서 한 번 더 오른쪽으로 밀면 복제본까지 이동한 뒤,
  // 애니메이션이 끝나는 순간 티 안 나게 0으로 되돌린다 — 항상 오른쪽으로만 흐른다.
  const [pos, setPos] = useState(0)
  const [animated, setAnimated] = useState(true)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const next = () => {
    setAnimated(true)
    setPos(p => p + 1)
  }

  // 뒤로 갈 때도 이음매가 보이지 않게 — 첫 장이면 복제본으로 순간이동 후 왼쪽으로 민다
  const prev = () => {
    if (pos === 0) {
      setAnimated(false)
      setPos(COUNT)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimated(true)
          setPos(COUNT - 1)
        }),
      )
    } else {
      setAnimated(true)
      setPos(p => p - 1)
    }
  }

  // 복제본 자리에 도착하면 애니메이션 없이 처음으로 되감는다
  const onTransitionEnd = () => {
    if (pos === COUNT) {
      setAnimated(false)
      setPos(0)
    }
  }

  // 자동 전환 (마우스를 올리거나 직접 넘기면 멈춘다)
  useEffect(() => {
    if (paused || COUNT < 2 || !animated) return
    const id = setTimeout(next, INTERVAL)
    return () => clearTimeout(id)
  }, [pos, paused, animated])

  // 모바일 스와이프 — 40px 넘게 끌면 이전/다음 사례로
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) (delta < 0 ? next : prev)()
    touchStartX.current = null
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="pc-frame"
      role="group"
      aria-roledescription="carousel"
      aria-label="제작 사례"
    >
      {/* 슬라이드 트랙 — 끝에 첫 장을 한 벌 덧대 오른쪽으로만 흐르게 한다 */}
      <div
        onTransitionEnd={onTransitionEnd}
        style={{
          display: 'flex',
          height: '100%',
          transform: `translateX(-${pos * 100}%)`,
          transition: animated ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
        }}
      >
        {[...SLIDES, SLIDES[0]].map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden={i !== pos}
            tabIndex={i === pos ? 0 : -1}
            aria-label={`${s.alt} 사이트 새 창에서 열기`}
            style={{
              flex: '0 0 100%',
              height: '100%',
              position: 'relative',
              display: 'block',
              background: 'var(--bg-secondary)',
            }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 1100px) 100vw, 1100px"
              style={{ objectFit: 'fill' }}
              priority={i === 0}
              placeholder="blur"
              blurDataURL={s.blur}
            />
          </a>
        ))}
      </div>

      {/* 좌우 화살표 */}
      {COUNT > 1 && (
        <>
          <button type="button" onClick={prev} aria-label="이전 사례" className="pc-arrow" style={{ left: '0.75rem' }}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={next} aria-label="다음 사례" className="pc-arrow" style={{ right: '0.75rem' }}>
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <style>{`
        .pc-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          transition: border-color 0.2s, box-shadow 0.3s;
        }
        .pc-frame:hover {
          border-color: var(--accent);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);
        }
        .pc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          color: var(--text);
          background: var(--surface-container);
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          transition: background 0.2s;
        }
        .pc-arrow:hover {
          background: var(--surface-container-high);
        }
      `}</style>
    </div>
  )
}
