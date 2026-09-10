import type { ReactNode } from 'react'
import { Ear, MessageCircle, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Reveal from '@/components/Reveal'

/**
 * 07 · 일하는 방식 — 05 가 기술 걱정을 풀었다면 여기는 사람 걱정을 푼다.
 *
 * 실제로 들어오는 문의는 "그 기능이 되나요" 보다 "지난번에 연락이 끊겨서 상처가 있습니다,
 * 또 그럴까봐" 쪽이 많다. 그건 06(관리자 페이지)이 답할 수 있는 걱정이 아니라서
 * 섹션을 따로 뒀다. 바로 뒤 CTA 에서 연락처를 여쭙기 직전이라,
 * "연락하면 그다음 어떻게 되는지" 를 먼저 안심시키는 자리이기도 하다.
 *
 * "요구사항 다 들어드립니다" 라고 쓰면 다른 업체와 똑같은 말이 된다.
 * 그래서 걱정에 먼저 이름을 붙이고, 답은 짧게만 둔다.
 */
const PROMISES: { Icon: LucideIcon; title: string; desc: ReactNode }[] = [
  {
    Icon: Ear,
    title: '다 듣고 시작합니다',
    desc: (
      <>
        “이건 되나요?”에 안 된다는 답부터 드리지 않습니다. 무엇이 필요하신지 먼저 여쭙고, <br />
        되는 방법을 찾습니다.
      </>
    ),
  },
  {
    Icon: MessageCircle,
    title: '연락이 끊기지 않습니다',
    desc: '만들어 드리고 사라지지 않습니다. 궁금한 게 생기시면 그때 바로 물어보실 수 있습니다.',
  },
  {
    Icon: Wrench,
    title: '말씀하신 대로 돌아갑니다',
    // "몇 번인지는 세지 않습니다" 가 이 섹션에서 제일 센 약속이라 줄을 따로 준다
    desc: (
      <>
        쓰시다 불편한 곳이 나오면 그때도 고칩니다. <br />
        몇 번인지는 세지 않습니다.
      </>
    ),
  },
]

export default function DiffPromise() {
  return (
    <section
      style={{
        // 06 이 section-a 라 여기는 section-b — 뒤따르는 CTA 가 다시 section-a 다
        background: 'var(--section-b)',
        padding: 'clamp(3rem, 7vw, 5rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <Reveal variant="up" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <span className="footnote emphasized c-accent" style={{ letterSpacing: '0.04em' }}>
            07 · 일하는 방식
          </span>
          <h2 className="title-1" style={{ margin: '0.9rem 0 0', wordBreak: 'keep-all' }}>
            <span className="title-lead">걱정하시는 건,</span> <br className="br-mobile" />
            <span className="c-gold">대개 기능이 아니더라고요</span>
          </h2>
          <p
            className="body c-muted"
            style={{ margin: '1rem auto 0', maxWidth: '560px', wordBreak: 'keep-all' }}
          >
            말이 통할지, 중간에 연락이 끊기지 않을지. <br className="br-mobile" />
            저희가 가장 많이 듣는 걱정입니다.
          </p>
        </Reveal>

        {/* 06 의 인용 카드와 달리 면(배경)을 주지 않는다 — 같은 카드가 두 번 나오면 목록으로 읽힌다 */}
        <Reveal stagger className="dp-list">
          {PROMISES.map(({ Icon, title, desc }) => (
            <div key={title} className="dp-item">
              <span className="dp-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={2} />
              </span>
              {/* 크기는 dp-name / dp-desc 에서 직접 잡는다 — subhead·footnote 를 쓰면
                  그 클래스의 크기와 겹쳐 어느 쪽이 이기는지가 로드 순서에 달린다 */}
              <p className="emphasized dp-name">{title}</p>
              <p className="c-muted dp-desc">{desc}</p>
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        .dp-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.5rem, 3vw, 2.25rem);
          /* 글씨를 키운 만큼 폭도 넓혀야 제목이 두 줄로 접히지 않는다
             ("말씀하신 대로 돌아갑니다" 가 제일 길다) */
          max-width: 1000px;
          margin: clamp(2rem, 4vw, 2.75rem) auto 0;
        }
        .dp-item { text-align: center; }
        .dp-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 9999px;
          background: var(--accent-light);
          color: var(--accent);
          margin-bottom: 0.9rem;
        }
        .dp-name {
          margin: 0;
          word-break: keep-all;
          font-size: clamp(1.05rem, 2.4vw, 1.25rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.4;
        }
        .dp-desc {
          margin: 0.55rem 0 0;
          word-break: keep-all;
          font-size: clamp(0.92rem, 2vw, 1rem);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          /* 모바일은 3단이 좁아 글자가 깨진다 — 세로로 쌓고 아이콘을 왼쪽에 붙인다 */
          .dp-list { grid-template-columns: 1fr; gap: 1.5rem; max-width: 480px; }
          .dp-item {
            display: grid;
            grid-template-columns: 54px 1fr;
            column-gap: 0.9rem;
            text-align: left;
            align-items: start;
          }
          .dp-icon { grid-row: span 2; margin-bottom: 0; }
          .dp-desc { grid-column: 2; }
        }
      `}</style>
    </section>
  )
}
