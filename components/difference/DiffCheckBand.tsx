'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Gauge } from 'lucide-react'
import Reveal from '@/components/Reveal'

/**
 * 02(템플릿이란) 바로 뒤에 끼워 넣는 슬림 배너 — /check 로 넘긴다.
 *
 * 이 자리인 이유: 02 를 막 읽은 방문자의 머릿속 질문이 "그럼 내 사이트는 어느 쪽이지?" 다.
 * 03(최신 기술이란)으로 넘어가면 관심이 '내 사이트'에서 '위플로우의 기술'로 옮겨가
 * 같은 문구도 안 먹힌다.
 *
 * 번호(01~06)를 붙이지 않는다 — 문제→해법 흐름 사이에 낀 삽입물이라
 * 번호를 주면 정식 섹션으로 읽혀 리듬이 끊긴다. 배경도 section-a/b 를 쓰지 않고
 * 강조색 계열로 깔아 "끼어든 것"으로 보이게 둔다.
 */
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
        <p className="dcb-hook title-2 emphasized">
          <Gauge size={20} strokeWidth={2.4} className="dcb-icon" aria-hidden="true" />
          그럼 우리 사이트는 지금 어느 쪽일까요?
        </p>

        <p className="subhead c-muted dcb-sub">
          주소만 넣으면 로딩 속도 · 검색 노출 · 모바일 대응 · 문의 동선
          <br className="br-mobile" /> 네 가지를 바로 점수로 보여드립니다.
        </p>

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
           삽입물로 읽히게 한다. accent-light(#1b2840)는 남색 판이라 무겁게 가라앉았고,
           surface-container(#232326)·surface(#1c1c1f)는 차례로 너무 떠서 그보다 반 단 낮췄다.
           section-b(#151517)까지 내리면 바로 아래 03 과 같은 색이 돼 띠로 안 읽히므로
           둘 사이의 값을 직접 쓴다. 위아래 테두리가 경계를 마저 잡아 준다.
           높이는 낮게 — 화면 반쪽을 넘기면 정식 섹션처럼 보인다. */
        .dcb {
          background: #1a1a1d;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: clamp(1.75rem, 4vw, 2.5rem) 1.25rem;
        }
        .dcb-inner {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
          text-align: center;
        }
        .dcb-hook {
          margin: 0;
          word-break: keep-all;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .dcb-icon { color: var(--accent); flex-shrink: 0; }
        .dcb-sub {
          margin: 0.6rem 0 0;
          word-break: keep-all;
          line-height: 1.65;
        }
        /* 주소칸과 버튼 높이는 여기서 한 값으로 못 박는다.
           원래 높이가 다르다(주소칸 ≈41px / 버튼 ≈45px). flex 의 기본 stretch 가
           주소칸을 늘려 주긴 하지만, Safari 는 flex 안의 <input> 을 안 늘리는 경우가 있어
           눈으로 보이는 높이를 우연에 맡기게 된다. */
        .dcb-row {
          display: flex;
          align-items: stretch;
          gap: 0.6rem;
          margin-top: 1.1rem;
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
        }
      `}</style>
    </section>
  )
}
