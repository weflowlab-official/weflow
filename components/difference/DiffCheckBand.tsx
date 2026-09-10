'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Gauge, Search, Smartphone, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Reveal from '@/components/Reveal'

/**
 * 02(템플릿이란) 바로 뒤에 끼워 넣는 배너 — /check 로 넘긴다.
 *
 * 이 자리인 이유: 02 를 막 읽은 방문자의 머릿속 질문이 "그럼 내 사이트는 어느 쪽이지?" 다.
 * 03(최신 기술이란)으로 넘어가면 관심이 '내 사이트'에서 '위플로우의 기술'로 옮겨가
 * 같은 문구도 안 먹힌다.
 *
 * 번호(01~06)를 붙이지 않는다 — 문제→해법 흐름 사이에 낀 삽입물이라
 * 번호를 주면 정식 섹션으로 읽혀 리듬이 끊긴다.
 */

/** 점검 항목 — /check 의 CATEGORY_META 와 같은 넷을 같은 아이콘으로 보여준다 */
const CHECKS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Gauge, label: '로딩 속도' },
  { Icon: Search, label: '검색 노출' },
  { Icon: Smartphone, label: '모바일 대응' },
  { Icon: MessageCircle, label: '문의 동선' },
]

export default function DiffCheckBand() {
  const [url, setUrl] = useState('')
  const router = useRouter()

  // 주소를 여기서 받아 /check 로 넘긴다 — 버튼만 두면 한 단계가 더 생겨 그만큼 빠진다
  const go = () => {
    const v = url.trim()
    router.push(v ? `/check?url=${encodeURIComponent(v)}` : '/check')
  }

  return (
    <section className="dcb">
      <Reveal variant="up" className="dcb-inner">
        <span className="dcb-badge">자동 사이트 점검</span>

        <p className="dcb-hook">그럼 우리 사이트는 지금 어느 쪽일까요?</p>
        <p className="subhead c-muted dcb-sub">
          주소만 넣으면 네 가지를 바로 점수로 보여드립니다.
        </p>

        {/* 항목을 글자로만 나열하면 그냥 문장이 된다 — 아이콘 칩으로 두면 "도구"로 읽힌다 */}
        <ul className="dcb-chips">
          {CHECKS.map(({ Icon, label }) => (
            <li key={label} className="dcb-chip">
              <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="dcb-row">
          <input
            className="form-input dcb-input"
            type="text"
            inputMode="url"
            placeholder="www.우리사이트.com"
            aria-label="점검할 사이트 주소"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
          />
          {/* 모바일은 주소칸이 좁아지므로 버튼 글자를 짧게 바꿔 자리를 내준다 */}
          <button type="button" className="btn-primary dcb-btn" onClick={go}>
            <span className="dcb-btn__long">무료로 점검하기</span>
            <span className="dcb-btn__short">무료 점검</span>
            <ArrowRight size={17} strokeWidth={2.5} />
          </button>
        </div>
      </Reveal>

      <style>{`
        /* 앞뒤 섹션(02 section-a #0e0e10 / 03 section-b #151517)보다 밝은 면을 깔아
           삽입물로 읽히게 한다. section-b 까지 내리면 바로 아래 03 과 같은 색이 돼
           띠로 안 읽히므로 그 위의 값을 직접 쓴다.
           면이 평평하면 허전해서, 위에서 아래로 옅어지는 파란 빛을 한 겹 얹었다. */
        .dcb {
          background:
            radial-gradient(120% 120% at 50% 0%, rgba(106, 146, 215, 0.12), transparent 62%),
            #1a1a1d;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: clamp(2rem, 4.5vw, 2.75rem) 1.25rem;
        }
        .dcb-inner {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
          text-align: center;
        }

        .dcb-badge {
          display: inline-block;
          padding: 0.28rem 0.75rem;
          border-radius: 9999px;
          background: var(--accent-light);
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          margin-bottom: 0.8rem;
        }

        .dcb-hook {
          margin: 0;
          word-break: keep-all;
          font-size: clamp(1.2rem, 3.2vw, 1.6rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.4;
        }
        .dcb-sub {
          margin: 0.55rem 0 0;
          word-break: keep-all;
          line-height: 1.65;
        }

        .dcb-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.45rem;
          list-style: none;
          margin: 1.1rem 0 0;
          padding: 0;
        }
        .dcb-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border-radius: 9999px;
          background: var(--surface-container);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 0.82rem;
          white-space: nowrap;
        }
        .dcb-chip svg { color: var(--accent); flex-shrink: 0; }

        /* 주소칸과 버튼 높이는 여기서 한 값으로 못 박는다.
           원래 높이가 다르다(주소칸 ≈41px / 버튼 ≈45px). flex 의 기본 stretch 가
           주소칸을 늘려 주긴 하지만, Safari 는 flex 안의 <input> 을 안 늘리는 경우가 있어
           눈으로 보이는 높이를 우연에 맡기게 된다. */
        .dcb-row {
          display: flex;
          align-items: stretch;
          gap: 0.6rem;
          margin-top: 1.2rem;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }
        .dcb-input,
        .dcb-btn { height: 48px; }
        .dcb-input { flex: 1 1 auto; min-width: 0; }
        .dcb-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          white-space: nowrap;
          cursor: pointer;
          /* 높이를 고정했으니 위아래 여백은 걷어낸다 — 남겨 두면 글자가 눌린다 */
          padding-top: 0;
          padding-bottom: 0;
        }

        /* 버튼 글자 — 기본은 긴 쪽, 모바일에서 짧은 쪽으로 바꾼다 */
        .dcb-btn__short { display: none; }

        /* 모바일에서도 주소칸과 버튼을 한 줄에 둔다.
           버튼은 flex-shrink:0 이라 줄지 않으므로, 좁은 화면에서는 글자와 좌우 여백을
           줄여 자리를 만들고 남는 폭을 주소칸이 가져가게 한다
           (주소칸은 min-width:0 이라 얼마든지 줄어든다). */
        @media (max-width: 560px) {
          .dcb-row { gap: 0.45rem; }
          .dcb-btn__long { display: none; }
          .dcb-btn__short { display: inline; }
          .dcb-btn {
            padding-left: 1.1rem;
            padding-right: 1.1rem;
            font-size: 0.9rem;
          }
          /* 칩 넷이 두 줄로 접힌다 — flex 로 두면 글자 길이대로 흘러 줄이 삐뚤어지므로
             2열 그리드로 바꿔 칸 폭을 같게 맞춘다.
             width:fit-content + 1fr 조합이 핵심이다. 그리드가 제 내용 폭으로 줄어들면
             1fr 두 칸이 "가장 넓은 칸"(모바일 대응) 기준으로 같아진다.
             max-width 를 주면 화면 폭까지 늘어나 칩이 쓸데없이 넓어진다. */
          .dcb-chips {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            width: fit-content;
            gap: 0.4rem;
            margin-left: auto;
            margin-right: auto;
          }
          .dcb-chip {
            justify-content: center;
            padding: 0.4rem 0.5rem;
            font-size: 0.78rem;
          }
        }
      `}</style>
    </section>
  )
}
