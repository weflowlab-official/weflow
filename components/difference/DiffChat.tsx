"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, Ban } from "lucide-react";

// 고객 ↔ 템플릿 업체 대화 — 요청할 때마다 "안 됩니다"가 돌아온다
type Msg = { from: "me" | "them"; text: string };
const SCRIPT: Msg[] = [
  { from: "me", text: "SEO·AEO·GEO 구조 설계도 되나요?" },
  { from: "them", text: "죄송하지만 그 기능은 안 됩니다." },
  { from: "me", text: "자동 견적 계산기는 넣을 수 있나요?" },
  { from: "them", text: "그것도 지원이 안 돼요…" },
  { from: "me", text: "스마트스토어로 이어지는 구조는요?" },
  { from: "them", text: "템플릿에 없는 기능이라서요." },
  { from: "me", text: "예약·결제 기능은요?" },
  { from: "them", text: "추가 개발은 불가능합니다." },
  { from: "me", text: "관리자 페이지 항목 하나만 추가해 주세요." },
  { from: "them", text: "죄송합니다. 그건 안 됩니다." },
];

const TYPING_MS = 900; // 업체가 "…" 치는 시간
const ME_DELAY_MS = 750; // 내가 다음 질문을 보내기까지
const THEM_DELAY_MS = 350; // 내 질문 뒤 업체가 읽고 치기 시작하기까지
// 페이지에 들어오면 화면 진입을 기다리지 않고 바로 시작하되, 첫 문답(질문 1 + "안 됩니다" 1)만 빠르게 치고
// 그다음부터는 평소 속도로 이어진다 — 미리 떠 있는 게 아니라 '금방 나오는' 느낌 (PC·모바일 동일)
const FAST_COUNT = 2;
const FAST = { typing: 550, me: 300, them: 220 };

/**
 * 01 · 도입 인터랙션 — 카톡처럼 생긴 채팅창에서 고객 요청과 "안 됩니다" 답변이
 * 한 줄씩 자동으로 오간다. 페이지 진입과 동시에 시작하고, 거절 횟수가 위에 쌓인다.
 * 끝나면 다시 보기 버튼이 뜬다. 움직임 줄이기 설정에서는 대화를 한 번에 다 보여준다.
 */
export default function DiffChat() {
  const [shown, setShown] = useState(0); // 화면에 보이는 메시지 수
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0); // 다시 보기 할 때마다 +1
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 페이지 진입과 동시에 시작 — 움직임 줄이기 설정이면 대화를 한 번에 다 보여준다
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(SCRIPT.length);
    }
    setStarted(true);
  }, []);

  // 한 줄씩 진행
  useEffect(() => {
    if (!started || shown >= SCRIPT.length) return;
    const next = SCRIPT[shown];
    // 첫 문답만 빠르게
    const fast = shown < FAST_COUNT;
    const typingMs = fast ? FAST.typing : TYPING_MS;
    const meMs = fast ? FAST.me : ME_DELAY_MS;
    const themMs = fast ? FAST.them : THEM_DELAY_MS;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    if (next.from === "them") {
      t1 = setTimeout(() => {
        setTyping(true);
        t2 = setTimeout(() => {
          setTyping(false);
          setShown((n) => n + 1);
        }, typingMs);
      }, themMs);
    } else {
      t1 = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : meMs);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [started, shown, run]);

  // 새 말풍선이 붙으면 아래로 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, typing]);

  const denied = SCRIPT.slice(0, shown).filter((m) => m.from === "them").length;
  const done = shown >= SCRIPT.length;

  const replay = () => {
    setShown(0);
    setTyping(false);
    setRun((r) => r + 1);
  };

  return (
    <div ref={boxRef} className="dc-chat">
      {/* 상단 바 — 상대 이름 + 거절 카운터 */}
      <div className="dc-chat-head">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
          <span className="dc-avatar">T</span>
          <div style={{ minWidth: 0 }}>
            <p className="dc-name">템플릿 홈페이지 제작사</p>
            <p className="dc-status">
              <span className="dc-dot" /> 온라인
            </p>
          </div>
        </div>
        <span className={`dc-count${denied > 0 ? " bump" : ""}`} key={denied}>
          <Ban size={13} strokeWidth={2.5} /> 안 됩니다 × {denied}
        </span>
      </div>

      {/* 말풍선 */}
      <div ref={listRef} className="dc-chat-list">
        {SCRIPT.slice(0, shown).map((m, i) => (
          <div key={`${run}-${i}`} className={`dc-bubble dc-bubble--${m.from}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="dc-bubble dc-bubble--them dc-typing" aria-label="입력 중">
            <span /><span /><span />
          </div>
        )}
        {done && (
          <div className="dc-end">
            <p className="dc-end-text">…익숙한 대화 아닌가요?</p>
            <button type="button" onClick={replay} className="dc-replay">
              <RotateCcw size={14} strokeWidth={2.5} /> 다시 보기
            </button>
          </div>
        )}
      </div>

      <style>{`
        .dc-chat {
          max-width: 560px;
          margin: 0 auto;
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border);
          background: var(--surface);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }
        .dc-chat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          background: var(--surface-container);
          border-bottom: 1px solid var(--border);
        }
        .dc-avatar {
          flex-shrink: 0;
          width: 36px; height: 36px;
          border-radius: 9999px;
          background: #3a3a40;
          color: #cfcfd6;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .dc-name { margin: 0; font-size: 0.92rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dc-status { margin: 0; font-size: 0.72rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.3rem; }
        .dc-dot { width: 7px; height: 7px; border-radius: 9999px; background: #22c55e; display: inline-block; }
        .dc-count {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.3rem 0.7rem;
          border-radius: 9999px;
          background: rgba(239,68,68,0.16);
          color: #f87171;
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
        }
        .dc-count.bump { animation: dc-bump 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes dc-bump { 0% { transform: scale(1.35); background: rgba(239,68,68,0.45); } 100% { transform: scale(1); } }

        .dc-chat-list {
          height: 360px;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          scrollbar-width: none;
        }
        .dc-chat-list::-webkit-scrollbar { display: none; }
        .dc-bubble {
          max-width: 78%;
          padding: 0.65rem 0.9rem;
          border-radius: 18px;
          font-size: 0.95rem;
          line-height: 1.5;
          word-break: keep-all;
          animation: dc-pop 0.32s cubic-bezier(0.16,1,0.3,1);
          transform-origin: bottom left;
        }
        .dc-bubble--me {
          align-self: flex-end;
          background: var(--accent-strong);
          color: #fff;
          border-bottom-right-radius: 6px;
          transform-origin: bottom right;
        }
        .dc-bubble--them {
          align-self: flex-start;
          background: var(--surface-container-high);
          color: var(--text);
          border-bottom-left-radius: 6px;
        }
        @keyframes dc-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.92); }
          to { opacity: 1; transform: none; }
        }
        .dc-typing { display: flex; gap: 4px; padding: 0.8rem 0.95rem; }
        .dc-typing span {
          width: 7px; height: 7px; border-radius: 9999px;
          background: var(--text-muted);
          animation: dc-blink 1s infinite;
        }
        .dc-typing span:nth-child(2) { animation-delay: 0.15s; }
        .dc-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dc-blink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }

        .dc-end {
          margin-top: 0.6rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
          animation: dc-pop 0.4s ease;
        }
        .dc-end-text { margin: 0; font-weight: 700; color: var(--text-secondary); font-size: 0.95rem; }
        .dc-replay {
          display: inline-flex; align-items: center; gap: 0.35rem;
          background: transparent;
          border: 1px solid var(--outline-variant);
          color: var(--text-muted);
          border-radius: 9999px;
          padding: 0.35rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }
        .dc-replay:hover { color: var(--text); border-color: var(--outline); }
        @media (max-width: 480px) {
          .dc-chat-list { height: 320px; }
          .dc-bubble { max-width: 86%; font-size: 0.9rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dc-bubble, .dc-count.bump, .dc-end { animation: none; }
        }
      `}</style>
    </div>
  );
}
