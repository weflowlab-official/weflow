import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/Reveal'

/**
 * 06 · 관리자 페이지 — 01 에서 던진 "그 기능은 안 됩니다" 를 회수하는 자리.
 *
 * 페이지가 거절("안 됩니다")로 열렸으니, 마지막 본문은 그 반대말로 닫아야 매듭이 지어진다.
 * 그래서 기능 목록이 아니라 "사장님이 하신 말 → 그래서 만든 것" 짝으로 둔다.
 * 기능 이름을 늘어놓으면 또 하나의 스펙표가 되고, 말로 두면 "내 얘기네" 가 된다.
 *
 * 인용문은 문제를 정리한 문장이 아니라 실제로 하실 법한 말투로 둔다.
 * ("상담 신청을 놓칩니다" 는 사실이고, "며칠 지나 연락드린 적이 있어요" 는 그때의 마음이다.)
 * 답도 기능부터 말하지 않고 그 마음을 먼저 받은 뒤에 무엇을 만들었는지로 넘어간다.
 *
 * 세 짝의 아픈 지점이 서로 겹치지 않게 나눠 뒀다 — 빈도 / 사소한 것도 못 고침 / 놓쳐서 잃음.
 * 첫 짝(타이어)만 길고 나머지는 짧다. 셋 다 길면 결국 목록으로 읽혀서
 * "깊이 들어가서 만든다" 는 주장과 반대가 된다.
 */
const REQUESTS: { quote: string; answer: ReactNode }[] = [
  {
    quote: '계절마다 취급하는 타이어가 바뀌고, 차종도 계속 늘어납니다',
    answer: (
      <>
        바뀔 때마다 저희에게 연락해서 고치는 게 번거로우셨습니다. <br />
        그래서 관리자 페이지에서 타이어와 차종을 직접 추가하고 수정하실 수 있게 만들었습니다.
      </>
    ),
  },
  {
    quote: '오타 하나 고치는 것도 연락을 드려야 해서, 그냥 두고 있었어요',
    answer:
      '사소한 일로 연락하시는 게 미안하셨던 겁니다. 글을 쓰고 고치는 화면을 따로 만들어 드렸습니다.',
  },
  {
    quote: '문의가 온 줄도 몰라서, 며칠 지나 연락드린 적이 있어요',
    answer:
      '한 건을 놓치면 손님 한 분을 놓치는 일입니다. 신청이 한 줄씩 쌓이고, 연락드렸는지 표시해 둘 수 있게 만들었습니다.',
  },
]

export default function DiffAdmin() {
  return (
    <section
      style={{
        // 바로 위 05 가 section-b 라 여기는 section-a 로 번갈아 둔다
        background: 'var(--section-a)',
        padding: 'clamp(3rem, 7vw, 5rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <Reveal variant="up" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <span className="footnote emphasized c-accent" style={{ letterSpacing: '0.04em' }}>
            06 · 관리자 페이지
          </span>
          {/* WEFLOW 를 넣으면서 한 줄에 안 들어가 PC 에서도 항상 두 줄로 끊는다 */}
          <h2 className="title-1" style={{ margin: '0.9rem 0 0', wordBreak: 'keep-all' }}>
            <span className="title-lead">
              <span className="c-gold">WEFLOW</span>는 “안 됩니다” 대신,
            </span>{' '}
            <br />
            <span className="c-gold">원하시는 그대로 만듭니다</span>
          </h2>
          {/* PC 는 두 줄(첫 줄에 두 문장), 모바일은 세 줄.
              maxWidth 를 700px 로 둬야 PC 첫 줄이 안 접힌다 — 560px 면 "다르니까요"가 넘어간다.

              마지막 줄이 원래 "그 일에 맞춰 만듭니다" 였는데, 섹션 맺음말의
              "없던 것을 만들어 드릴 수 있습니다" 와 같은 말이라 시작과 끝에서 두 번 주장했다.
              여기서는 아래 사례로 넘기는 안내만 하고, 주장은 맺음말 한 번으로 둔다. */}
          <p
            className="body c-muted"
            style={{ margin: '1rem auto 0', maxWidth: '700px', wordBreak: 'keep-all' }}
          >
            관리자 페이지는 정해진 틀이 없습니다. <br className="br-mobile" />
            사장님이 매일 하시는 일이 다르니까요. <br />
            실제로 이런 말씀을 듣고, 이렇게 만들어 드렸습니다.
          </p>
        </Reveal>

        {/* 요청 → 만든 것. 04 는 갤러리, 05 는 좌우 비교 슬라이더라 이미 시각적으로 무겁다.
            여기는 세로로 담백하게 쌓아 CTA 앞에서 숨을 돌리게 한다. */}
        <Reveal stagger className="da-list">
          {REQUESTS.map(({ quote, answer }) => (
            <div key={quote} className="da-item">
              <p className="title-2 emphasized da-quote">“{quote}”</p>
              <p className="body c-muted da-answer">{answer}</p>
            </div>
          ))}
        </Reveal>

        <Reveal variant="up" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          {/* 페이지 전체의 결론이 앉는 자리 — 본문 크기로 두면 그냥 흘러간다.
              제목과 같은 방식(작고 흐린 밑밥 → 크고 금색인 결론)으로 두 단을 나눈다. */}
          <p className="da-close">
            <span className="da-close__lead">템플릿은 있는 기능 중에서 고르는 방식입니다.</span>
            <span className="da-close__main">
              저희는 처음부터 만들기 때문에, <br className="br-mobile" />
              <strong className="c-gold">없던 것을 만들어 드릴 수 있습니다.</strong>
            </span>
          </p>

          {/* 링크는 여기 하나만 — 짝마다 달면 시선이 흩어져 CTA 까지 못 간다 */}
          <Link href="/cases" className="da-more subhead emphasized">
            관리자 페이지가 들어간 사례 더 보기
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </Reveal>
      </div>

      <style>{`
        .da-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          max-width: 780px;
          margin: clamp(2rem, 4vw, 2.75rem) auto 0;
        }
        .da-item {
          background: var(--surface);
          border: 1px solid var(--border);
          /* 왼쪽 강조선 — 인용문이 "사장님이 하신 말" 로 읽히게 잡아 준다 */
          border-left: 3px solid var(--accent);
          border-radius: 14px;
          padding: clamp(1.1rem, 2.6vw, 1.5rem) clamp(1.1rem, 3vw, 1.7rem);
        }
        /* 말(큰 글씨) ↔ 답(작은 글씨) 대비가 있어야 두 줄이 서로 다른 목소리로 읽힌다 */
        .da-quote {
          margin: 0;
          word-break: keep-all;
          line-height: 1.5;
        }
        .da-answer {
          margin: 0.6rem 0 0;
          word-break: keep-all;
          line-height: 1.75;
        }

        /* ── 맺음말 ── */
        .da-close {
          margin: clamp(2.5rem, 5vw, 3.25rem) 0 0;
          word-break: keep-all;
        }
        /* 위에 짧은 금색 선을 둬서 "여기서 끝난다"는 신호를 준다 */
        .da-close::before {
          content: "";
          display: block;
          width: 46px;
          height: 2px;
          margin: 0 auto clamp(1.2rem, 3vw, 1.6rem);
          background: linear-gradient(90deg, transparent, #e9d3a6, transparent);
        }
        .da-close__lead {
          display: block;
          font-size: clamp(0.92rem, 2.2vw, 1rem);
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 0.7rem;
        }
        .da-close__main {
          display: block;
          font-size: clamp(1.3rem, 3.4vw, 1.85rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.45;
          color: var(--text);
        }

        .da-more {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 1.6rem;
          color: var(--accent);
          text-decoration: none;
        }
        .da-more:hover { text-decoration: underline; text-underline-offset: 4px; }
      `}</style>
    </section>
  )
}
