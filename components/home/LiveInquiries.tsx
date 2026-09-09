'use client'
// 실시간 홈페이지 문의 보드 (연출용 데이터).
// 새 문의는 방문자가 이 보드를 실제로 보고 있을 때(탭이 보이고 + 보드가 화면 안)만 '방금 전'으로 들어오고,
// 시간 라벨은 실제 시계로만 흐른다 ('방금 전' → 1분 뒤 '1분 전' → …). 랜덤으로 시간을 밀어내지 않는다.
// 첫 도착은 보드가 보인 뒤 5~10초, 그 뒤로는 40초~2분 간격. 안 보는 동안 밀린 건 쌓아두지 않고 건너뛴다.
// 목록은 sessionStorage 에 남겨 같은 세션에서 다시 들어와도 아까 본 문의가 그만큼 나이 먹은 채로 이어진다.
import { useEffect, useRef, useState } from 'react'
import {
  LIVE_INDUSTRIES,
  LIVE_INQUIRY_TYPES,
  LIVE_SURNAMES,
} from '@/data/solution'

type Row = { id: number; industry: string; name: string; inquiry: string; at: number } // at: 문의 시각(epoch ms)

const VISIBLE = 5 // 동시에 보이는 행 수
const INITIAL_AGES_MIN = [2, 9, 15, 27, 41] // 첫 화면 각 행의 나이(분) — 위에서부터, 전부 다르게
const STORAGE_KEY = 'weflow-live-inquiries'
const STALE_MS = 2 * 60 * 60 * 1000 // 저장된 목록의 맨 위가 2시간 넘게 오래됐으면 새로 만든다 (죽은 보드처럼 보이니까)
const FIRST_ARRIVAL_MS = () => 5_000 + Math.random() * 5_000 // 보드가 보인 뒤 첫 도착
const NEXT_ARRIVAL_MS = () => 40_000 + Math.random() * 80_000 // 그다음부터
const CLOCK_TICK_MS = 20_000 // 라벨 갱신 주기 — 1분 경계를 20초 안에 잡는다

function ageLabel(ageMs: number) {
  const m = Math.floor(ageMs / 60_000)
  if (m <= 0) return '방금 전'
  if (m < 60) return `${m}분 전`
  return `${Math.floor(m / 60)}시간 전`
}

// 마스킹 이름 뒷글자 후보 — 성 + '*' + 한 글자
const NAME_TAILS = [
  '준', '수', '영', '희', '민', '아', '현', '서', '호', '경',
  '울', '빈', '연', '재', '지', '태', '솔', '미', '우', '란',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeRow(id: number, at: number): Row {
  return {
    id,
    industry: pick(LIVE_INDUSTRIES),
    name: `${pick(LIVE_SURNAMES)}*${pick(NAME_TAILS)}`,
    inquiry: pick(LIVE_INQUIRY_TYPES),
    at,
  }
}

function makeInitialRows(now: number): Row[] {
  return INITIAL_AGES_MIN.slice(0, VISIBLE).map((m, i) => makeRow(i, now - m * 60_000))
}

// 세션 저장소 — 시크릿 창·차단 설정에서는 접근 자체가 터질 수 있어 전부 try 로 감싼다
function loadRows(now: number): Row[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const rows = JSON.parse(raw) as Row[]
    if (!Array.isArray(rows) || rows.length === 0) return null
    if (now - rows[0].at > STALE_MS) return null
    return rows.slice(0, VISIBLE)
  } catch {
    return null
  }
}
function saveRows(rows: Row[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, VISIBLE)))
  } catch {
    /* 저장 못 해도 화면엔 지장 없다 */
  }
}

export default function LiveInquiries() {
  // 서버·클라이언트 렌더 결과가 달라지면 하이드레이션 경고가 나므로,
  // 최초에는 비워두고 마운트 후 클라이언트에서만 행을 채운다.
  const [rows, setRows] = useState<Row[]>([])
  const [now, setNow] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const trimTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const arrivedOnce = useRef(false) // 이 페이지에서 한 번이라도 도착했는지 — 첫 도착만 빠르게

  // 처음 채우기 — 세션에 남아 있으면 이어서, 없으면 새로
  useEffect(() => {
    const t = Date.now()
    const stored = loadRows(t)
    const initial = stored ?? makeInitialRows(t)
    nextId.current = initial.reduce((m, r) => Math.max(m, r.id), -1) + 1
    setRows(initial)
    setNow(t)
    if (!stored) saveRows(initial)
  }, [])

  // 시계 — 라벨만 실제 시간에 맞춰 갱신한다
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS)
    return () => clearInterval(t)
  }, [])

  // 새 문의 도착 — 보드가 화면 안에 있고 탭이 보일 때만 예약한다
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout> | null = null
    let inView = false

    const arrive = () => {
      timer = null
      const t = Date.now()
      setNow(t)
      setRows((prev) => {
        // 새 행은 맨 위에 '방금 전'. 마지막 행은 바로 지우지 않고 VISIBLE+1 개로 두어
        // 접힘(퇴장) 애니메이션을 보여준 뒤 아래에서 잘라낸다.
        const next = [makeRow(nextId.current++, t), ...prev.slice(0, VISIBLE)]
        saveRows(next)
        return next
      })
      setSpinning(true)
      setTimeout(() => setSpinning(false), 700)
      if (trimTimer.current) clearTimeout(trimTimer.current)
      trimTimer.current = setTimeout(() => setRows((p) => p.slice(0, VISIBLE)), 650)
      arrivedOnce.current = true
      schedule()
    }
    const schedule = () => {
      if (timer) clearTimeout(timer)
      timer = null
      if (!inView || document.hidden) return
      timer = setTimeout(arrive, arrivedOnce.current ? NEXT_ARRIVAL_MS() : FIRST_ARRIVAL_MS())
    }
    const cancel = () => {
      if (timer) clearTimeout(timer)
      timer = null
    }

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting
        if (inView) schedule()
        else cancel() // 안 보는 동안 밀린 건 쌓아두지 않는다
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    const onVis = () => (document.hidden ? cancel() : schedule())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancel()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      if (trimTimer.current) clearTimeout(trimTimer.current)
    }
  }, [])

  // 헤더의 '업데이트' 라벨도 맨 위 문의 시각을 그대로 따른다
  const updatedLabel = rows.length ? ageLabel(now - rows[0].at) : '방금 전'

  return (
    <div ref={cardRef} className="live-card">
      {/* 헤더: LIVE 배지 + 업데이트 표시 */}
      <div className="live-head">
        <p className="live-title">
          <span aria-hidden="true" className="live-dot">
            <span className="live-dot__ping" />
            <span className="live-dot__core" />
          </span>
          <span className="live-badge">LIVE</span>
          실시간 홈페이지 문의
        </p>
        <p className="live-updated">
          {updatedLabel} 업데이트
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={spinning ? 'live-spin' : ''}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
          </svg>
        </p>
      </div>

      {/* 목록 — 지역 / 이름(마스킹) / 문의 내용 / 시간 */}
      <ul aria-label="실시간 홈페이지 문의 목록" className="live-list">
        {rows.map((r, i) => (
          <li key={r.id} className={`live-row${i === 0 ? ' live-row--in' : ''}${i === VISIBLE ? ' live-row--out' : ''}`}>
            <span className="live-industry">
              {/* 업종 — 차양 달린 상점 아이콘 (lucide store) */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0, color: 'var(--accent)' }}
              >
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
                <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
              </svg>
              <span className="live-industry__text">{r.industry}</span>
            </span>
            <span className="live-name">{r.name}</span>
            <span className="live-inquiry">{r.inquiry}</span>
            <span className="live-age">{ageLabel(now - r.at)}</span>
          </li>
        ))}
        {/* 마운트 전에는 높이만 잡아둬 레이아웃이 튀지 않게 한다 */}
        {rows.length === 0 && <li className="live-row live-row--skeleton" aria-hidden="true" />}
      </ul>

      <style>{`
        .live-card {
          --live-row-h: 2.6rem; /* 행 높이 고정 — 목록 전체 높이(5행)를 못 박아 페이지가 안 움직이게 */
          max-width: 900px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          background: var(--surface);
          box-shadow: var(--shadow-card);
        }
        .live-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.9rem 1.25rem;
        }
        .live-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text);
          word-break: keep-all;
        }
        .live-dot { position: relative; display: flex; width: 8px; height: 8px; flex-shrink: 0; }
        .live-dot__ping {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #ef4444;
          opacity: 0.6;
          animation: livePing 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .live-dot__core {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #ef4444;
          animation: liveBreath 1.4s ease-in-out infinite;
        }
        .live-badge { color: #f87171; letter-spacing: 0.12em; font-weight: 800; }
        .live-updated {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin: 0;
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .live-spin { animation: liveSpin 0.7s linear; }

        /* 목록 높이를 5행으로 고정 — 새 행이 들어오고 나가는 동안(잠시 6행)에도
           바깥 레이아웃은 그대로라 스크롤 위치가 흔들리지 않는다 */
        .live-list {
          margin: 0;
          padding: 0;
          list-style: none;
          height: calc(var(--live-row-h) * 5);
          overflow: hidden;
        }
        .live-row {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          height: var(--live-row-h);
          padding: 0 1.25rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.8rem;
        }
        .live-row--skeleton { height: var(--live-row-h); }
        /* 새 행 — 높이가 0에서 펴지며 아래 행들을 밀고 내려오고,
           자리를 잡는 순간 배경이 노랗게 반짝였다가 1초에 걸쳐 원래 색으로 */
        .live-row--in {
          overflow: hidden;
          animation:
            liveRowIn 0.55s cubic-bezier(0.25, 0.8, 0.4, 1),
            liveRowFlash 1.1s ease-out 0.25s backwards;
        }
        /* 마지막 행 — 접히며 페이드 아웃 (650ms 뒤 목록에서 실제 제거) */
        .live-row--out {
          overflow: hidden;
          animation: liveRowOut 0.55s cubic-bezier(0.55, 0, 0.75, 0.6) forwards;
        }
        /* 업종 칸 — 모바일은 "차량/모빌리티 업종"이 들어가도록 0.7cm 넓혔다.
           그만큼 이름·제작 종류 칸도 오른쪽으로 밀린다. PC(아래 미디어 쿼리)는 원래 폭 그대로 */
        .live-industry {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          width: calc(5.9rem + 0.7cm);
          flex-shrink: 0;
        }
        .live-industry__text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
          color: var(--text);
        }
        .live-name { width: 2.8rem; flex-shrink: 0; color: var(--text-muted); }
        .live-inquiry {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text-secondary);
        }
        .live-age { flex-shrink: 0; font-size: 0.7rem; color: var(--text-muted); }

        @media (min-width: 769px) {
          .live-card { --live-row-h: 3rem; }
          .live-head { padding: 1rem 1.5rem; }
          .live-title { font-size: 1rem; }
          .live-updated { font-size: 0.75rem; }
          .live-row { gap: 2.25rem; padding: 0 1.5rem; font-size: 0.875rem; }
          .live-industry { width: 8rem; }
          .live-name { width: 4rem; }
        }

        @keyframes liveRowIn {
          from { height: 0; opacity: 0; transform: translateY(-6px); }
          60% { opacity: 0.35; }
          to { height: var(--live-row-h); opacity: 1; transform: none; }
        }
        /* 등장 플래시 — 사이트 형광펜 색(245,179,1) 계열의 옅은 노랑 */
        @keyframes liveRowFlash {
          from { background-color: rgba(245, 179, 1, 0.2); }
          to { background-color: transparent; }
        }
        @keyframes liveRowOut {
          from { height: var(--live-row-h); opacity: 1; }
          to { height: 0; border-top-width: 0; opacity: 0; }
        }
        @keyframes livePing {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        /* 붉은 점 — 퍼지는 링에 더해 점 자체도 숨쉬듯 커졌다 작아진다 */
        @keyframes liveBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        @keyframes liveSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .live-row--in, .live-row--out, .live-dot__ping, .live-dot__core, .live-spin { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
