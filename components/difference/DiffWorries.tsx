import { MessageSquareOff, ShieldAlert, Clock, Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import DiffCompare from "@/components/difference/DiffCompare";

// 템플릿을 쓰면 걱정되는 것들 — 걱정 · 템플릿에서 생기는 일 · WEFLOW에서 달라지는 것
const WORRIES: { Icon: LucideIcon; worry: string; template: string; weflow: string }[] = [
  {
    Icon: MessageSquareOff,
    worry: "내 요구사항",
    template: "틀에 없는 기능은 “안 됩니다”로 끝납니다. 계산기·연결 설계·예약처럼 우리 업종에 꼭 필요한 것도 예외가 아닙니다.",
    weflow: "필요한 기능을 직접 개발해 넣습니다. 우리 업종의 고객 흐름에 맞춰, 문의까지 이어지는 구조로 만듭니다.",
  },
  {
    Icon: ShieldAlert,
    worry: "보안 · 속도 · 검색 노출",
    template:
      "예전 기술로 만든 같은 틀을 수백 곳이 쓰다 보니 한 곳이 뚫리면 전체가 위험하고, 안 쓰는 코드까지 실려 느립니다. 그래서 네이버·구글 상단 관리도 어렵습니다.",
    weflow:
      "사이트마다 독립된 구조로 최신 보안 업데이트를 따라가고, 빠른 로딩에 검색 구조까지 직접 설계해 상단 노출을 관리합니다.",
  },
  {
    Icon: Clock,
    worry: "고객이 받는 인상",
    template: "어디서 본 듯한 디자인이라 고객이 ‘올드함’을 먼저 느낍니다. 첫인상에서 신뢰를 잃습니다.",
    weflow: "브랜드에 맞춘 디자인으로 첫 화면부터 다르게 보입니다. 고객이 믿고 연락하는 홈페이지가 됩니다.",
  },
];

/**
 * 05 · 템플릿 대신 최신 기술을 써야 하는 이유 — 템플릿을 고를 때 걱정되는 세 가지를
 * 템플릿 / WEFLOW 로 나란히 비교한다. (검은 바탕 — 앞뒤 04·06 은 흰 바탕이다)
 */
export default function DiffWorries() {
  return (
    <section
      style={{
        background: "var(--section-b)",
        padding: "clamp(3rem, 7vw, 5rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <Reveal variant="up" style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <span className="footnote emphasized c-accent" style={{ letterSpacing: "0.04em" }}>
            05 · 템플릿(예전 기술) 대신 최신 기술을 써야 하는 이유
          </span>
          <h2 className="title-1" style={{ margin: "0.9rem 0 0", wordBreak: "keep-all" }}>
            <span className="title-lead">템플릿(예전 기술)을 고르면</span> <br className="br-mobile" />
            <span className="c-gold">이런 걱정이 따라옵니다</span>
          </h2>
          <p
            className="body c-muted"
            style={{ margin: "1rem auto 0", maxWidth: "560px", wordBreak: "keep-all" }}
          >
            말로 하면 잘 안 와닿죠. <br className="br-mobile" />
            먼저 두 화면을 직접 비교해 보세요.
          </p>
        </Reveal>

        {/* 템플릿 ↔ WEFLOW 좌우 비교 슬라이더 */}
        <Reveal variant="zoom" style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}>
          <DiffCompare />
        </Reveal>

        <Reveal stagger className="dw-rows" style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)" }}>
          {WORRIES.map(({ Icon, worry, template, weflow }) => (
            <div key={worry} className="dw-row">
              <div className="dw-row-head">
                <span className="dw-icon">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <h3 className="headline" style={{ margin: 0, wordBreak: "keep-all" }}>
                  {worry}
                </h3>
              </div>
              <div className="dw-cell dw-cell--tpl">
                <span className="dw-label">
                  <X size={13} strokeWidth={3} /> 템플릿(예전 기술)
                </span>
                <p className="callout c-muted" style={{ margin: 0, wordBreak: "keep-all" }}>
                  {template}
                </p>
              </div>
              <div className="dw-cell dw-cell--we">
                <span className="dw-label dw-label--we">
                  <Check size={13} strokeWidth={3} /> WEFLOW
                </span>
                <p className="callout" style={{ margin: 0, wordBreak: "keep-all", color: "var(--text)" }}>
                  {weflow}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        /* 세 칸의 세로 길이를 맞춘다 — 가장 긴 칸(보안·속도·검색 노출) 높이로 나머지도 늘어난다 */
        .dw-rows {
          display: grid;
          grid-auto-rows: 1fr;
          gap: 0.9rem;
        }
        .dw-row {
          display: grid;
          grid-template-columns: 220px 1fr 1fr;
          gap: 1rem;
          align-items: stretch;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: 1.25rem;
        }
        .dw-row-head {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .dw-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--accent-light);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dw-cell {
          border-radius: var(--radius-xl);
          padding: 0.9rem 1rem;
          border: 1px solid var(--border);
        }
        .dw-cell--tpl { background: var(--section-a); }
        .dw-cell--we {
          background: var(--accent-light);
          border-color: var(--accent-light);
        }
        .dw-label {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-bottom: 0.4rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #ef4444;
        }
        .dw-label--we { color: var(--accent); }
        @media (max-width: 860px) {
          /* 모바일 — 줄끼리는 높이를 맞추지 않고 각 줄이 자기 내용만큼만 쓴다.
             대신 한 줄 안의 템플릿·WEFLOW 두 박스는 1fr 1fr 로 그 줄에서 긴 쪽 높이에 맞춘다
             (내 요구사항 3줄 / 보안·속도 4줄 / 고객 인상 3줄 기준) */
          .dw-rows { grid-auto-rows: auto; }
          .dw-row { grid-template-columns: 1fr; grid-template-rows: auto 1fr 1fr; gap: 0.75rem; }
        }
      `}</style>
    </section>
  );
}
