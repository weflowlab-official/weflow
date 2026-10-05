'use client'
import { useRef } from 'react'
import { MessageSquare, FileText, Palette, Code2, Monitor, ChevronsRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { steps } from '@/data/service'
import Reveal from '@/components/Reveal'

// data/service.ts 의 steps 순서에 1:1로 대응하는 단계별 아이콘
const STEP_ICONS: LucideIcon[] = [MessageSquare, FileText, Palette, Code2, Monitor]

/**
 * "홈페이지, 이렇게 만들어집니다" (제작 진행과정) 섹션 — 상담부터 배포까지 5단계를 사진 카드 한 줄로 놓고 옆으로 넘겨 본다 (검은 바탕).
 *
 * 스크롤 막대도 버튼도 두지 않는다. 넘기는 방법은 둘이다:
 *  - 손(터치)으로 옆으로 민다 — 카드 하나씩 자리에 맞춰 멈춘다
 *  - 마우스로 잡아 끈다
 * 카드 사이에는 오른쪽으로 깜빡이는 화살표가 있어, 옆으로 이어진다는 걸 알려 준다.
 * 사진은 단계마다 정해 둔 것(data/service.ts 의 image)을 쓴다 — 사람 얼굴·몸 없이 손과 화면만 나온다.
 *
 * (서비스 안내 탭에 있던 섹션 — 그 탭을 혜택 탭으로 합치면서 /benefits 에서 쓴다)
 * 머리말·카드 모양은 혜택 탭 공용 스타일(.svc-*, app/benefits/page.tsx)을 쓴다.
 */
export default function ServiceSteps() {
  const viewportRef = useRef<HTMLDivElement>(null)
  // 마우스로 끄는 중인 상태 — 누른 자리와 그때의 스크롤 위치
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  // 마우스로 잡아 끌기 — 터치는 브라우저가 알아서 넘겨 주므로 마우스일 때만 직접 움직인다
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    // 살짝 흔들린 클릭은 끌기로 치지 않는다
    if (!d.moved && Math.abs(dx) < 5) return
    d.moved = true
    e.currentTarget.classList.add('is-dragging')
    e.currentTarget.scrollLeft = d.left - dx
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null
    e.currentTarget.classList.remove('is-dragging')
  }

  return (
    <section className="svc-section svc-section--dark">
      <div className="svc-inner">
        <Reveal as="header" variant="up" className="svc-head">
          <p className="svc-eyebrow">5-STEP PROCESS</p>
          <h2 className="svc-title">홈페이지, 이렇게 만들어집니다</h2>
        </Reveal>
      </div>

      {/* 옆으로 넘기는 칸 — 화면 폭을 다 쓰고, 첫 카드는 본문 폭의 왼쪽 끝에서 시작한다 */}
      <div
        ref={viewportRef}
        className="pt-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        <Reveal as="div" stagger className="pt-track">
          {steps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? MessageSquare
            return (
              // 화살표가 카드 밖(카드 사이 틈)으로 나가야 해서, 모서리를 오려 내는 카드를 한 겹 감싼다
              <div key={s.num} className="pt-item">
                <div className="svc-card">
                  <div className="svc-card__photo">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="380px"
                      draggable={false}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <span className="svc-card__icon">
                    <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <div className="svc-card__body">
                    <span className="pt-step">STEP {s.num}</span>
                    <h3>{s.title}</h3>
                    <span className="pt-badge">{s.desc}</span>
                    <p style={{ whiteSpace: 'pre-line' }}>
                      {s.detail.split('|').map((part, k) => (
                        <span key={k}>
                          {k > 0 && <> <br className="br-mobile" /></>}
                          {part}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                {/* 카드 사이 화살표 (맨 끝 카드에선 CSS로 숨김) */}
                <span className="pt-arrow" aria-hidden="true">
                  <ChevronsRight size={30} strokeWidth={2.2} />
                </span>
              </div>
            )
          })}
        </Reveal>
      </div>

      <style>{`
        /* 섹션 좌우 여백을 뚫고 화면 폭을 다 쓴다. 대신 안쪽 여백(--pt-side)을 본문 폭의 좌우 여백과 같게 줘서
           첫 카드가 제목 줄과 같은 자리에서 시작하고, 끝까지 넘기면 마지막 카드도 같은 여백을 두고 멈춘다 */
        .pt-viewport {
          --pt-side: max(1.5rem, calc((100vw - 1120px) / 2));
          margin: 0 -1.5rem;
          padding: 4px var(--pt-side);
          overflow-x: auto;
          overflow-y: hidden;
          /* 카드 하나씩 자리에 맞춰 멈춘다 */
          scroll-snap-type: x mandatory;
          scroll-padding-inline: var(--pt-side);
          overscroll-behavior-x: contain;
          /* 스크롤 막대는 감춘다 */
          scrollbar-width: none;
          cursor: grab;
        }
        .pt-viewport::-webkit-scrollbar { display: none; }
        /* 끄는 동안에는 자리 맞춤을 풀어야 손을 따라 움직인다. 글씨가 긁혀 선택되지도 않게 한다 */
        .pt-viewport.is-dragging { scroll-snap-type: none; cursor: grabbing; user-select: none; }

        /* 카드 사이 틈 — 화살표가 카드에 걸치지 않고 들어갈 만큼 넓게 잡는다 */
        .pt-track {
          --pt-gap: clamp(3rem, 5vw, 4rem);
          display: flex;
          gap: var(--pt-gap);
          width: max-content;
        }
        .pt-item {
          position: relative;
          display: flex;
          flex: none;
          width: clamp(260px, 78vw, 380px);
          scroll-snap-align: start;
        }
        .pt-item > .svc-card { width: 100%; }

        .pt-step {
          display: block;
          margin-bottom: 0.45rem;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #9fd0ff;
        }
        /* 칩을 왼쪽으로 조금 당겨, 칩 안의 글자가 위 제목 글자와 거의 같은 자리에서 시작하게 한다
           (좌우 여백 11px 을 다 당기면 칩 바탕이 너무 튀어나와 보여 6px 만 당긴다) */
        .pt-badge {
          display: inline-block;
          margin: 0.7rem 0 0 -6px;
          padding: 3px 11px;
          border-radius: 9999px;
          background: rgba(159, 208, 255, 0.12);
          color: #9fd0ff;
          font-size: 0.8rem;
          font-weight: 700;
        }

        /* 카드 사이 화살표 — 틈 한가운데에 테두리 없이 화살표만. 오른쪽으로 밀리며 깜빡인다 */
        .pt-arrow {
          position: absolute;
          top: 50%;
          right: calc(var(--pt-gap) / -2 - 15px);
          width: 30px;
          height: 30px;
          margin-top: -15px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pt-arrow-blink 1.3s ease-in-out infinite;
        }
        .pt-item:last-child .pt-arrow { display: none; }
        @keyframes pt-arrow-blink {
          0%, 100% { opacity: 0.2; transform: translateX(-6px); }
          50% { opacity: 1; transform: translateX(5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pt-arrow { animation: none; opacity: 0.8; }
        }

        @media (max-width: 860px) {
          .pt-viewport { --pt-side: 1.25rem; margin: 0 -1.25rem; }
        }
      `}</style>
    </section>
  )
}
