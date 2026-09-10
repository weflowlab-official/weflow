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
          <br className="br-mobile" /> 네 가지를 바로 점수로 보여드립니다.{' '}
          <strong className="dcb-free">연락처는 받지 않습니다.</strong>
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
          <button type="button" className="btn-primary dcb-btn" onClick={go}>
            무료로 점검하기 <ArrowRight size={17} strokeWidth={2.5} />
          </button>
        </div>
      </Reveal>

      <style>{`
        /* 앞뒤 섹션(02 section-a #0e0e10 / 03 section-b #151517)보다 한참 밝은 면을 깔아
           삽입물로 읽히게 한다. accent-light(#1b2840)는 남색 판이라 무겁게 가라앉았다 —
           파란 기는 아이콘과 "연락처는 받지 않습니다" 글씨에만 남기고 면은 중립으로 띄운다.
           높이는 낮게 — 화면 반쪽을 넘기면 정식 섹션처럼 보인다. */
        .dcb {
          background: var(--surface-container);
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
        /* "연락처는 받지 않습니다" — 이 배너에서 가장 중요한 약속이라 색으로 집는다.
           이 문장이 없으면 그냥 또 하나의 영업 버튼으로 읽힌다. */
        .dcb-free { color: var(--accent); }

        .dcb-row {
          display: flex;
          gap: 0.6rem;
          margin-top: 1.1rem;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }
        .dcb-input { flex: 1 1 auto; min-width: 0; }
        .dcb-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          white-space: nowrap;
          cursor: pointer;
        }

        @media (max-width: 560px) {
          .dcb-row { flex-direction: column; }
          .dcb-btn { width: 100%; }
        }
      `}</style>
    </section>
  )
}
