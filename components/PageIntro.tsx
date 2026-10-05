import type { ReactNode } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

// 제목 글자가 나타나는 박자(초) — 첫 글자가 시작하는 때, 글자 사이 간격, 글자 하나가 나타나는 데 걸리는 시간
const WRITE_START = 0.15
const WRITE_STEP = 0.05
const WRITE_CHAR = 0.08

// 큰 글씨(굵기 900)의 영문 대문자 폭 — 글자 크기 1 일 때의 폭(em). 글꼴 파일(WeflowSans-900)에서 잰 값이다.
// 좁은 화면에서 낱말을 본문 폭에 꼭 맞게 키우려면 낱말의 실제 폭을 알아야 한다
// (글자마다 폭이 달라서 — I 는 0.28, W 는 1.06 — 글자 수만으로는 맞출 수 없다)
const CAP_EM: Record<string, number> = {
  A: 0.766, B: 0.647, C: 0.744, D: 0.711, E: 0.603, F: 0.567, G: 0.749, H: 0.728, I: 0.281,
  J: 0.569, K: 0.69, L: 0.554, M: 0.903, N: 0.704, O: 0.771, P: 0.636, Q: 0.771, R: 0.647,
  S: 0.645, T: 0.664, U: 0.702, V: 0.766, W: 1.055, X: 0.735, Y: 0.737, Z: 0.671,
}

/**
 * 페이지 맨 위 도입부 — 라벨 · 제목(h1) · 설명 · CTA.
 * 하위 페이지들이 제목 없이 본문부터 시작하던 걸 이걸로 통일한다.
 * (제목이 h1 하나뿐이어야 하므로 페이지당 한 번만 쓴다)
 *
 * 메인과 같은 흰 바탕 형식이다 — 왼쪽에 영문 머리표 + 굵은 제목 + 검은 알약 버튼,
 * 그 뒤 오른쪽에는 머리표 낱말이 하늘색 테두리 글씨로 크게 깔린다 (메인 제작 사례 섹션의 'WEFLOW' 글씨와 같은 모양).
 * 큰 글씨는 배경이다 — 옅은 색으로, 본문 폭의 오른쪽 끝에 맞춰(왼쪽 글 묶음과 양옆 여백이 같게) 글 묶음의 위아래
 * 한가운데에 놓이고, 처음 보일 때 왼쪽부터 써지듯 드러난다.
 * 좁은 화면에서는 제목과 설명 문단 사이에 걸쳐 깔린다 — 낱말 전체가 본문 폭 안에 들어가 잘리지 않는다.
 * 제목은 줄 단위 배열로 받는다 — 타자를 치듯 한 글자씩 차례로 나타난다 (줄을 넘어가도 차례가 이어진다).
 * hl 을 켠 줄은 파랗게 칠해진다. 뒤의 큰 글씨도 제목과 같은 때 시작해 같은 때 다 써진다.
 */
export default function PageIntro({
  eyebrow,
  title,
  body,
  ctaHref = '/diagnosis',
  ctaLabel = '맞춤 견적 받기 →',
}: {
  /** 제목 위 영문 라벨 — 오른쪽 큰 글씨로도 쓰인다 */
  eyebrow: string
  /** 제목 — 한 줄에 하나씩. hl: 그 줄을 강조색(파랑)으로 */
  title: { text: string; hl?: boolean }[]
  /** 줄바꿈이 필요하면 <br />를 넣은 JSX를 넘긴다 */
  body?: ReactNode
  ctaHref?: string
  ctaLabel?: string
}) {
  // 몇 번째 글자인지 — 줄을 넘어가도 이어서 센다 (글자마다 이만큼씩 늦게 나타난다)
  let n = 0
  // 제목이 다 써지는 데 걸리는 시간 — 뒤의 큰 글씨가 같은 때 끝나도록 이 길이로 맞춘다
  const chars = title.reduce((sum, l) => sum + Array.from(l.text).length, 0)
  const writeDur = Math.max(0, chars - 1) * WRITE_STEP + WRITE_CHAR
  // 큰 글씨 낱말의 폭(em) — 표에 없는 글자는 평균값으로 친다
  const markEm = Array.from(eyebrow.toUpperCase()).reduce((sum, ch) => sum + (CAP_EM[ch] ?? 0.66), 0)
  return (
    // --pi-n: 큰 글씨의 글자 수 — 넓은 화면의 글씨 크기를 여기서 계산한다
    // --pi-em: 큰 글씨 낱말의 실제 폭(em) — 좁은 화면에서 본문 폭에 꼭 맞추는 데 쓴다
    <section
      className="pi-light"
      style={
        {
          '--pi-n': eyebrow.length,
          '--pi-em': markEm.toFixed(3),
          '--pi-write-start': `${WRITE_START}s`,
          '--pi-write-dur': `${writeDur.toFixed(2)}s`,
        } as React.CSSProperties
      }
    >
      {/* 뒤에 깔리는 큰 글씨 — 장식이라 보조 기술에는 숨긴다. 맨 앞에 두어 글 묶음보다 뒤에 깔리게 한다.
          넓은 화면용이다 — 좁은 화면에서는 이걸 감추고, 아래 설명 문단 뒤에 깔리는 것(pi-mark--body)을 쓴다 */}
      <p className="pi-mark pi-mark--side" aria-hidden="true">
        {eyebrow}
      </p>

      <div className="pi-inner">
        <Reveal variant="up">
          <p className="pi-eyebrow">{eyebrow}</p>
        </Reveal>
        {/* 제목은 Reveal(서서히 떠오르기) 밖에 둔다 — 안에 두면 묶음이 떠오르는 동안 글자가 이미 다 나와 버려
            한꺼번에 나타난 것처럼 보인다 */}
        {/* 글자를 하나씩 쪼개 두므로, 읽어 주는 기기에는 통째 문장(aria-label)을 넘긴다 */}
        <h1 className="pi-title" aria-label={title.map((l) => l.text).join(' ')}>
          {title.map((line, i) => (
            <span key={i} className={line.hl ? 'pi-line pi-line--hl' : 'pi-line'} aria-hidden="true">
              {/* 낱말 단위로 묶는다 — 글자 하나하나가 inline-block 이라, 묶지 않으면 좁은 화면에서
                  낱말 한가운데서 줄이 꺾인다 (word-break: keep-all 은 inline-block 사이에는 듣지 않는다).
                  띄어쓰기도 한 박자로 세어, 묶기 전과 같은 속도로 써진다 */}
              {line.text.split(' ').map((word, w) => (
                <span key={w}>
                  {w > 0 && (n++, ' ')}
                  <span className="pi-word">
                    {Array.from(word).map((ch, j) => (
                      <span key={j} className="pi-char" style={{ animationDelay: `${(WRITE_START + n++ * WRITE_STEP).toFixed(2)}s` }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              ))}{' '}
            </span>
          ))}
        </h1>
        <Reveal variant="up" delay={0.2}>
          {body && (
            <div className="pi-bodywrap">
              {/* 좁은 화면용 큰 글씨 — 제목과 설명 문단 사이에 걸쳐 깔린다 (낱말 전체가 본문 폭 안에 들어간다) */}
              <p className="pi-mark pi-mark--body" aria-hidden="true">
                {eyebrow}
              </p>
              <p className="pi-body">{body}</p>
            </div>
          )}
          <Link href={ctaHref} className="pi-cta">
            {ctaLabel}
          </Link>
        </Reveal>
      </div>

      <style>{`
        /* 아래에 흰 섹션이 이어지므로, 섹션 사이 여백은 이쪽 아래 여백이 맡는다 */
        .pi-light {
          /* 큰 글씨의 크기를 정하는 글자 수 — 여덟 자(BENEFITS)보다 짧은 낱말은 여덟 자로 친다.
             글자 수로만 나누면 짧은 낱말(GUIDE)일수록 글자가 커져, 탭마다 상단의 크기가 달라진다 */
          --pi-w: max(var(--pi-n), 8);
          --pi-pt: clamp(3.5rem, 7vw, 6rem);
          --pi-pb: clamp(4.5rem, 10vw, 8.5rem);
          position: relative;
          overflow: hidden;
          background: #fff;
          color: #111;
          padding: var(--pi-pt) 1.5rem var(--pi-pb);
        }
        .pi-inner { position: relative; max-width: 1120px; margin: 0 auto; }
        .pi-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: #8a8a8a;
        }
        .pi-title {
          /* 좁은 화면에서 큰 글씨(pi-mark--body)가 제목 아랫줄까지 올라온다 — 그 위에 그려지게 한다
             (큰 글씨는 속을 흰색으로 칠해 두어서, 아래에 깔리면 제목이 지워진다) */
          position: relative;
          z-index: 1;
          margin: 0;
          color: #111;
          font-size: clamp(1.9rem, 4vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          word-break: keep-all;
        }
        .pi-line { display: block; }
        /* 낱말 — 안에서는 줄이 꺾이지 않는다 */
        .pi-word { display: inline-block; white-space: nowrap; }
        .pi-line--hl { color: #3f8fe0; }
        /* 글자 하나 — 숨겨 두었다가 제 차례(animation-delay)에 톡 나타난다. 타자를 치는 느낌 */
        .pi-char {
          display: inline-block;
          white-space: pre;
          opacity: 0;
          animation: pi-type ${WRITE_CHAR}s linear forwards;
        }
        @keyframes pi-type {
          to { opacity: 1; }
        }
        .pi-bodywrap { position: relative; }
        .pi-body {
          /* 뒤에 깔리는 큰 글씨(pi-mark--body)보다 위에 그려지게 */
          position: relative;
          margin: clamp(1.1rem, 2.4vw, 1.6rem) 0 0;
          font-size: clamp(0.98rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          color: #5c6066;
          word-break: keep-all;
        }
        .pi-cta {
          display: inline-flex;
          align-items: center;
          margin-top: clamp(1.75rem, 3.5vw, 2.5rem);
          padding: 0.9rem 1.9rem;
          border: 1.5px solid #111;
          border-radius: 9999px;
          background: #111;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .pi-cta:hover { background: transparent; color: #111; }

        /* ── 뒤에 깔리는 큰 글씨 — 하늘색 테두리만 있는 글씨가 왼쪽에서 오른쪽으로 써지듯 드러난다 ── */
        .pi-mark {
          position: absolute;
          /* 오른쪽 끝을 본문 폭(.pi-inner)의 오른쪽 끝에 맞춘다 — 왼쪽 글 묶음과 양옆 여백이 같아진다.
             위아래는 글 묶음 한가운데 (섹션 위아래 여백이 달라, 그 차이의 절반만큼 올린다) */
          right: max(1.5rem, calc((100% - 1120px) / 2));
          top: calc(50% + (var(--pi-pt) - var(--pi-pb)) / 2);
          transform: translateY(-50%);
          margin: 0;
          /* 여덟 자짜리 낱말이 화면 폭의 58% 쯤(최대 900px)을 차지하는 크기 — 0.6 은 굵은 영문 대문자 한 자의 평균 폭(em) */
          font-size: calc(min(58vw, 900px) / (var(--pi-w) * 0.6));
          font-weight: 900;
          line-height: 1;
          white-space: nowrap;
          text-transform: uppercase;
          /* 테두리를 먼저 그리고 그 위에 바탕색(흰색)으로 속을 칠한다 — 눈에는 테두리만 있는 글씨로 보인다.
             속을 비워 두면(transparent) 안 된다: 이 글꼴의 D 는 세로 기둥과 둥근 부분, 두 조각을 겹쳐 그린 글자라
             조각마다 테두리가 그려져 겹친 자리에 선이 생기고 글자가 끊겨 보인다. 속을 칠하면 그 선이 덮인다.
             칠이 테두리의 안쪽 절반도 덮으므로, 보이는 굵기(2px)의 두 배로 긋는다 */
          color: #fff;
          paint-order: stroke fill;
          /* 배경이라 메인의 하늘색(#7fbcf7)보다 한참 옅게 */
          -webkit-text-stroke: 4px #e6f1fc;
          clip-path: inset(0 100% 0 0);
          /* 제목과 같은 때 시작해 같은 때 끝난다 — 제목이 일정한 박자로 써지므로 이쪽도 일정한 속도로 */
          animation: pi-mark-in var(--pi-write-dur) linear var(--pi-write-start) forwards;
          pointer-events: none;
          user-select: none;
        }
        @keyframes pi-mark-in {
          to { clip-path: inset(0 0 0 0); }
        }

        /* 설명 문단 뒤의 큰 글씨는 좁은 화면에서만 쓴다 */
        .pi-mark--body { display: none; }

        /* 좁은 화면 — 옆에 둘 자리가 없으므로, 큰 글씨를 제목과 설명 문단 사이에 걸쳐 깐다.
           본문 폭의 오른쪽 끝에 붙고(오른쪽 정렬), 글씨의 위아래 가운데가 제목과 설명 사이 틈의 한가운데에 온다
           (top 은 그 틈 — 설명 문단의 위 여백 — 의 절반만큼 위). 낱말이 본문 폭에 꼭 맞게, 잘리지 않는 한에서
           가장 크게 잡는다 — 본문 폭을 낱말의 실제 폭(--pi-em)으로 나눈 크기. 테두리가 글자 밖으로 나오는 몫으로
           6px 을 남긴다 (화면이 넓어져도 9rem 보다 커지지는 않는다) */
        @media (max-width: 860px) {
          .pi-light {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .pi-mark--side { display: none; }
          .pi-mark--body {
            display: block;
            top: calc(clamp(1.1rem, 2.4vw, 1.6rem) / -2);
            right: 0;
            font-size: min(calc((100vw - 2.5rem - 6px) / var(--pi-em)), 9rem);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pi-mark { animation: none; clip-path: none; }
          .pi-char { animation: none; opacity: 1; }
        }
      `}</style>
    </section>
  )
}
