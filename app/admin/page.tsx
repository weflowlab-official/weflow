"use client";
/**
 * 관리자 대시보드 — 전체 현황·문의·예약·통계·유입 5개 탭을 한 페이지에서 전환한다.
 * 비밀번호 로그인(서버 세션 쿠키) 후 진입하며, 예약/문의는 /api/bookings·/api/inquiries,
 * 방문 기록은 /api/analytics 에서 받아온다. 데이터는 20초 폴링 + 탭 재포커스 시 갱신.
 * 모든 표·차트는 이 파일 안의 로컬 컴포넌트로 그린다 (외부 차트 라이브러리 없음).
 */
import Image from "next/image";
import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { SITE_LABEL } from "@/lib/site";
import {
  LogOut,
  Menu,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowLeft,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  Smartphone,
  Monitor,
  LogIn,
  DoorOpen,
  TrendingUp,
  ChevronsDown,
  CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { projectTypes } from "@/data/common";
import { portfolios } from "@/data/cases";
import { SITE_TYPE } from "@/lib/siteConfig";

// 관리자 비밀번호는 서버 환경변수(ADMIN_PASSWORD)에서만 검증 — 클라이언트 노출 제거

type Status = "pending" | "in_progress" | "done";
type Tab = "overview" | "checks" | "inquiries" | "analytics" | "traffic";
type Filter = "전체" | "대기" | "진행중" | "완료";

// 상태 코드 ↔ 화면 표기 (KO: 코드→한글, EN: 한글→코드 / 필터 버튼에서 역변환용)
const STATUS_KO: Record<Status, string> = {
  pending: "대기",
  in_progress: "진행중",
  done: "완료",
};
const STATUS_EN: Record<string, Status> = {
  대기: "pending",
  진행중: "in_progress",
  완료: "done",
};
// 상태 배지 색 (배경·글자·테두리)
const STATUS_STYLE: Record<
  Status,
  { bg: string; color: string; border: string }
> = {
  pending: {
    bg: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
  },
  in_progress: {
    bg: "var(--accent-light)",
    color: "var(--accent-hover)",
    border: "1px solid var(--accent)",
  },
  done: { bg: "var(--success-dim)", color: "var(--success-text)", border: "1px solid var(--success)" },
};

// /api/bookings 응답 한 건 — 상담 예약(희망 날짜·시간 포함)
interface Booking {
  id: string;
  status: Status;
  name: string;
  phone: string;
  type: string;
  industry: string;
  note: string;
  date: string;
  time: string;
  site?: string; // 어느 사이트에서 접수됐나 (weflow / landingpage / landinghomepage)
  createdAt: string;
}
// /api/inquiries 응답 한 건 — 일반 문의(일시 없음, 유입 소스가 붙기도 함)
interface Inquiry {
  id: string;
  status: Status;
  name: string;
  phone: string;
  type: string;
  industry: string;
  note: string;
  source?: string;
  site?: string;
  createdAt: string;
}
// /api/analytics 응답 한 건 — 방문자가 페이지 하나를 본 기록 (sessionId로 한 방문을 묶는다)
interface PageView {
  id: string;
  sessionId: string;
  path: string;
  referrer: string;
  source: string;
  medium: string;
  campaign: string;
  device: string;
  durationMs: number | null;
  maxScroll: number | null;
  createdAt: string;
}

// 목록 위 상태 필터 버튼
const FILTERS: Filter[] = ["전체", "대기", "진행중", "완료"];
// 사이드바·드로어 메뉴 = 탭 목록 (순서대로 노출)
const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "전체 현황" },
  { key: "inquiries", label: "문의 관리" },
  // 자동 진단(/check)에서 연락처를 남긴 리드 — source 'auto-diagnosis' 로 문의와 구분한다
  { key: "checks", label: "사이트 점검" },
  { key: "analytics", label: "통계 관리" },
  { key: "traffic", label: "유입 관리" },
];

// ── 기간 선택 — 왼쪽 프리셋(오늘·어제·최근 7일·이번달·지난달·전체) + 오른쪽 달력 범위 지정 ──
const DAY_MS = 86400000;

// 프리셋 키 하나 또는 달력으로 지정한 범위(s~e, 'YYYY-MM-DD')
type PeriodSel = { key: string; s?: string; e?: string };

const PERIOD_PRESETS: { key: string; label: string }[] = [
  { key: "today", label: "오늘" },
  { key: "yesterday", label: "어제" },
  { key: "7d", label: "최근 7일" },
  { key: "month", label: "이번달" },
  { key: "lastMonth", label: "지난달" },
  { key: "all", label: "전체" },
];

function dayFloor(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
function parseDay(s: string): number {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}
function isoDay(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fmtDayDot(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}.`;
}

// 선택 → [start, end) ms 구간. '오늘'은 로컬 자정부터, '최근 7일'은 현재 시각 기준 롤링.
function periodRange(
  p: PeriodSel,
  now: number,
): { start: number; end: number } {
  const t0 = dayFloor(now);
  switch (p.key) {
    case "today":
      return { start: t0, end: t0 + DAY_MS };
    case "yesterday":
      return { start: t0 - DAY_MS, end: t0 };
    case "7d":
      return { start: now - 7 * DAY_MS, end: t0 + DAY_MS };
    case "month": {
      const d = new Date(now);
      return {
        start: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
        end: t0 + DAY_MS,
      };
    }
    case "lastMonth": {
      const d = new Date(now);
      return {
        start: new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime(),
        end: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
      };
    }
    case "custom": {
      const s = p.s ? parseDay(p.s) : t0;
      const e = p.e ? parseDay(p.e) : s;
      return { start: s, end: e + DAY_MS };
    }
    default:
      return { start: 0, end: t0 + DAY_MS }; // 전체
  }
}

function periodLabelOf(p: PeriodSel, now: number): string {
  if (p.key === "custom") {
    const r = periodRange(p, now);
    return `${fmtDayDot(r.start)} ~ ${fmtDayDot(r.end - DAY_MS)}`;
  }
  return PERIOD_PRESETS.find((x) => x.key === p.key)?.label ?? "기간";
}

// createdAt 기준으로 선택 구간 내 항목만 반환
function withinPeriod<T extends { createdAt: string }>(
  rows: T[],
  p: PeriodSel,
): T[] {
  if (p.key === "all") return rows;
  const { start, end } = periodRange(p, Date.now());
  return rows.filter((r) => {
    const t = new Date(r.createdAt).getTime();
    return t >= start && t < end;
  });
}

// 기간 선택 버튼 — 누르면 네이버 광고 스타일 팝오버(프리셋 + 달력)가 열린다
function PeriodSelect({
  value,
  onChange,
}: {
  value: PeriodSel;
  onChange: (v: PeriodSel) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewY, setViewY] = useState(0); // 달력에 보이는 연·월
  const [viewM, setViewM] = useState(0);
  const [dS, setDS] = useState<number | null>(null); // 드래프트 시작·종료일(자정 ms)
  const [dE, setDE] = useState<number | null>(null);

  const now = Date.now();
  const todayMs = dayFloor(now);

  const openPanel = () => {
    // 현재 선택을 드래프트로 미리 채워둔다 ('전체'는 범위가 없으니 비움)
    if (value.key === "all") {
      setDS(null);
      setDE(null);
      const d = new Date(now);
      setViewY(d.getFullYear());
      setViewM(d.getMonth());
    } else {
      const r = periodRange(value, now);
      const s = dayFloor(r.start);
      const e = Math.max(s, dayFloor(Math.min(r.end - DAY_MS, now)));
      setDS(s);
      setDE(e);
      const d = new Date(e);
      setViewY(d.getFullYear());
      setViewM(d.getMonth());
    }
    setOpen(true);
  };

  // 날짜 클릭 — 시작 → 종료 순서로 고르고, 시작보다 앞을 누르면 시작을 옮긴다
  const pickDay = (ms: number) => {
    if (dS != null && dE == null) {
      if (ms < dS) setDS(ms);
      else setDE(ms);
    } else {
      setDS(ms);
      setDE(null);
    }
  };

  const apply = () => {
    if (dS == null) return;
    const e = dE ?? dS;
    onChange({ key: "custom", s: isoDay(dS), e: isoDay(e) });
    setOpen(false);
  };

  const moveMonth = (delta: number) => {
    const d = new Date(viewY, viewM + delta, 1);
    setViewY(d.getFullYear());
    setViewM(d.getMonth());
  };

  // 달력 한 달 치 데이터
  const firstDow = new Date(viewY, viewM, 1).getDay();
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const inDraft = (ms: number) => dS != null && ms >= dS && ms <= (dE ?? dS);
  const isEdge = (ms: number) => ms === dS || ms === (dE ?? dS);

  const navBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    cursor: "pointer",
    padding: "0.15rem 0.4rem",
  };
  const dateBox: React.CSSProperties = {
    flex: 1,
    textAlign: "center",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.4rem 0.3rem",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "var(--text)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => (open ? setOpen(false) : openPanel())}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "0.5rem 0.9rem",
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "var(--text)",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <CalendarDays size={15} strokeWidth={2.2} />
        {periodLabelOf(value, now)}
        <ChevronDown size={14} strokeWidth={2.2} />
      </button>

      {open && (
        <>
          {/* 팝오버 반응형 — PC 는 버튼 아래 좌우 배치, 좁은 화면은 중앙 모달 + 프리셋 가로 칩 */}
          <style>{`
            .pp-backdrop { position: fixed; inset: 0; z-index: 80; }
            .pp-panel {
              position: absolute;
              top: calc(100% + 6px);
              left: 0;
              z-index: 81;
              display: flex;
              gap: 0.9rem;
              width: min(460px, calc(100vw - 2rem));
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: 14px;
              padding: 0.9rem;
              box-shadow: 0 16px 44px rgba(0, 0, 0, 0.35);
            }
            .pp-presets {
              display: flex;
              flex-direction: column;
              gap: 0.1rem;
              min-width: 88px;
              border-right: 1px solid var(--border);
              padding-right: 0.7rem;
            }
            .pp-preset {
              background: none;
              border: none;
              border-radius: 8px;
              padding: 0.45rem 0.6rem;
              text-align: left;
              font-size: 0.86rem;
              font-weight: 600;
              color: var(--text);
              cursor: pointer;
              font-family: inherit;
              white-space: nowrap;
            }
            .pp-preset.is-on {
              background: rgba(37, 99, 235, 0.16);
              color: var(--accent);
              font-weight: 800;
            }
            @media (max-width: 640px) {
              .pp-backdrop { background: rgba(0, 0, 0, 0.5); }
              .pp-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                flex-direction: column;
                gap: 0.7rem;
                width: min(330px, calc(100vw - 1.25rem));
                max-height: calc(100vh - 1.5rem);
                overflow-y: auto;
              }
              .pp-presets {
                flex-direction: row;
                flex-wrap: wrap;
                gap: 0.35rem;
                min-width: 0;
                border-right: none;
                border-bottom: 1px solid var(--border);
                padding-right: 0;
                padding-bottom: 0.65rem;
              }
              .pp-preset {
                border: 1px solid var(--border);
                border-radius: 9999px;
                padding: 0.32rem 0.75rem;
                font-size: 0.8rem;
              }
              .pp-preset.is-on { border-color: var(--accent); }
            }
          `}</style>
          {/* 바깥 클릭 시 닫기 */}
          <div className="pp-backdrop" onClick={() => setOpen(false)} />
          <div className="pp-panel">
            {/* 프리셋 — PC 는 세로 목록, 모바일은 가로 칩 */}
            <div className="pp-presets">
              {PERIOD_PRESETS.map((p) => (
                <button
                  key={p.key}
                  className={`pp-preset${value.key === p.key ? " is-on" : ""}`}
                  onClick={() => {
                    onChange({ key: p.key });
                    setOpen(false);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* 오른쪽 — 달력 범위 지정 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 선택 중인 시작 → 종료 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  marginBottom: "0.7rem",
                }}
              >
                <span style={dateBox}>{dS != null ? fmtDayDot(dS) : "시작일"}</span>
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>→</span>
                <span style={dateBox}>
                  {dE != null ? fmtDayDot(dE) : dS != null ? fmtDayDot(dS) : "종료일"}
                </span>
              </div>

              {/* 연·월 이동 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.35rem",
                }}
              >
                <span>
                  <button onClick={() => setViewY(viewY - 1)} style={navBtn} aria-label="1년 전">«</button>
                  <button onClick={() => moveMonth(-1)} style={navBtn} aria-label="1달 전">‹</button>
                </span>
                <strong style={{ fontSize: "0.9rem", color: "var(--text)", whiteSpace: "nowrap" }}>
                  {viewY}년 {pad(viewM + 1)}월
                </strong>
                <span>
                  <button onClick={() => moveMonth(1)} style={navBtn} aria-label="1달 뒤">›</button>
                  <button onClick={() => setViewY(viewY + 1)} style={navBtn} aria-label="1년 뒤">»</button>
                </span>
              </div>

              {/* 요일 + 날짜 그리드 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "1px",
                  textAlign: "center",
                }}
              >
                {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                  <span
                    key={w}
                    style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "0.2rem 0" }}
                  >
                    {w}
                  </span>
                ))}
                {Array.from({ length: firstDow }).map((_, i) => (
                  <span key={`b${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const ms = new Date(viewY, viewM, i + 1).getTime();
                  const future = ms > todayMs;
                  const sel = inDraft(ms);
                  const edge = isEdge(ms);
                  return (
                    <button
                      key={i}
                      disabled={future}
                      onClick={() => pickDay(ms)}
                      style={{
                        border: "none",
                        borderRadius: edge ? "8px" : 0,
                        padding: "0.34rem 0",
                        fontSize: "0.82rem",
                        fontWeight: edge ? 800 : 500,
                        fontFamily: "inherit",
                        cursor: future ? "default" : "pointer",
                        color: future
                          ? "var(--text-muted)"
                          : edge
                            ? "#fff"
                            : sel
                              ? "var(--accent)"
                              : "var(--text)",
                        opacity: future ? 0.35 : 1,
                        background: edge
                          ? "var(--accent)"
                          : sel
                            ? "var(--accent-light, rgba(37,99,235,0.16))"
                            : "none",
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* 취소 · 확인 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "0.7rem",
                }}
              >
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.45rem 1.1rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={apply}
                  disabled={dS == null}
                  style={{
                    background: "var(--accent)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.45rem 1.3rem",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "#fff",
                    cursor: dS == null ? "default" : "pointer",
                    opacity: dS == null ? 0.5 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 제작 종류별 막대 — 항목마다 다른 색 (순서대로 순환)
const TYPE_COLORS = [
  "#0ea5e9",
  "#6366f1",
  "#ec4899",
  "#22c55e",
  "#8b5cf6",
  "#ef4444",
];

// 한 자리 수를 두 자리로 (날짜 키 만들 때)
function pad(n: number) {
  return String(n).padStart(2, "0");
}

// 접수일 표기 — YYYY-MM-DD HH:MM
function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// 페이지 상단 요약 카드 한 장 — "전체 문의 12건" 식
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "green";
}) {
  const accent = color === "blue" ? "var(--accent)" : "var(--success)";
  return (
    <div
      className="admin-stat-card"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "1.25rem 1.4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.55rem",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: accent,
            flexShrink: 0,
          }}
        />
        <p
          className="emphasized"
          style={{
            color: "var(--text-muted)",
            margin: 0,
            letterSpacing: "0.01em",
            fontSize: "0.92rem",
          }}
        >
          {label}
        </p>
      </div>
      <p
        style={{
          margin: 0,
          lineHeight: 1,
          fontSize: "2rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: accent,
        }}
      >
        {value}
        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginLeft: "0.2rem",
          }}
        >
          건
        </span>
      </p>
    </div>
  );
}

// 메모에서 자동 첨부된 "유입: …" · "기기: …" 줄을 분리한다 — 상세 펼침에서 업종 아래에 따로 보여주기 위해
// "네이버 광고 · 키워드: 카페홈페이지제작" → 채널 / 키워드 로 나누고, "기기: 모바일" 은 device 로
function splitNote(note: string): { entry: string; keyword: string; device: string; body: string } {
  const lines = (note || "").split("\n");
  const idx = lines.findIndex((l) => l.startsWith("유입: "));
  const devIdx = lines.findIndex((l) => l.startsWith("기기: "));
  const raw = idx >= 0 ? lines[idx].slice("유입: ".length) : "";
  const [entry, kw] = raw.split(" · 키워드: ");
  const device = devIdx >= 0 ? lines[devIdx].slice("기기: ".length).trim() : "";
  const body = lines.filter((_, i) => i !== idx && i !== devIdx).join("\n").trim();
  return { entry: entry || "", keyword: kw || "", device, body };
}

/**
 * 예약·문의 목록 표 — 두 탭이 같이 쓴다.
 * 행마다 상태 변경·삭제 버튼, 화살표를 누르면 업종·요청사항 상세가 아래로 펼쳐진다.
 * showSchedule 이면 '희망 일시' 열이 추가된다(예약용).
 */
function RequestTable({
  title,
  rows,
  showSchedule,
  onStatusChange,
  onDelete,
  onExport,
  onSeeAll,
}: {
  title?: string;
  rows: (Booking | Inquiry)[];
  showSchedule?: boolean;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onSeeAll?: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const colSpan = showSchedule ? 8 : 7;

  return (
    <section>
      {/* 표 제목 + 전체 보기 링크 + 엑셀 다운로드 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {title && (
            <h2
              className="title-3 emphasized"
              style={{ color: "var(--text)", margin: 0 }}
            >
              {title}
            </h2>
          )}
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="semibold"
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
                whiteSpace: "nowrap",
                marginLeft: "auto",
                fontSize: "0.95rem",
              }}
            >
              전체 보기 →
            </button>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onExport}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              padding: "0.45rem 1rem",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "border-color 0.15s, color 0.15s",
            }}
            className="semibold"
          >
            <Download size={16} /> 엑셀 다운로드
          </button>
        </div>
      </div>
      <div
        style={{
          overflowX: "auto",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "780px",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "0.98rem",
            textAlign: "left",
          }}
        >
          {/* 헤더 행 */}
          <thead>
            <tr>
              {[
                "접수일",
                "이름",
                "연락처",
                "제작 종류",
                ...(showSchedule ? ["희망 일시"] : []),
                "상태",
                "관리",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="emphasized"
                  style={{
                    padding: "0.9rem 1rem",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={colSpan}
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                  className="subhead"
                >
                  표시할 항목이 없습니다.
                </td>
              </tr>
            )}
            {/* 접수 건 한 줄 + (펼침 시) 상세 행 */}
            {rows.map((row) => {
              const expanded = expandedId === row.id;
              const st = row.status as Status;
              const b = row as Booking;
              const bd = "1px solid var(--border-subtle)";
              return (
                <Fragment key={row.id}>
                  <tr className="admin-row">
                    <td
                      style={{
                        padding: "0.9rem 1rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        borderBottom: bd,
                      }}
                    >
                      {fmt(row.createdAt)}
                    </td>
                    <td
                      style={{
                        padding: "0.9rem 1rem",
                        fontWeight: 600,
                        color: "var(--text)",
                        borderBottom: bd,
                      }}
                    >
                      {row.name}
                      {/* 예약 폼(/booking)으로 들어온 신청은 칩으로 구분 */}
                      {"source" in row && row.source === "booking" && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            background: "rgba(139, 92, 246, 0.15)",
                            color: "#8b5cf6",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                          }}
                        >
                          예약 신청
                        </span>
                      )}
                      {/* 본 사이트가 아닌 곳(랜딩페이지 등)에서 온 접수는 출처 배지 */}
                      {row.site && row.site !== "weflow" && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            background: "var(--accent-light)",
                            color: "var(--accent)",
                            whiteSpace: "nowrap",
                            verticalAlign: "middle",
                          }}
                        >
                          {SITE_LABEL[row.site] || row.site}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "0.9rem 1rem",
                        color: "var(--text-secondary)",
                        borderBottom: bd,
                      }}
                    >
                      {row.phone}
                    </td>
                    <td
                      style={{
                        padding: "0.9rem 1rem",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        borderBottom: bd,
                      }}
                    >
                      {row.type || "-"}
                    </td>
                    {showSchedule && (
                      <td
                        style={{
                          padding: "0.9rem 1rem",
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          borderBottom: bd,
                        }}
                      >
                        {b.date} {b.time}
                      </td>
                    )}
                    <td style={{ padding: "0.9rem 1rem", borderBottom: bd }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: STATUS_STYLE[st].bg,
                          color: STATUS_STYLE[st].color,
                          border: STATUS_STYLE[st].border,
                          borderRadius: "7px",
                          padding: "0.3rem 0.8rem",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {STATUS_KO[st]}
                      </span>
                    </td>
                    <td style={{ padding: "0.9rem 1rem", borderBottom: bd }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          flexWrap: "nowrap",
                        }}
                      >
                        <ActionBtn
                          active={st === "in_progress"}
                          onClick={() => onStatusChange(row.id, "in_progress")}
                        >
                          진행중
                        </ActionBtn>
                        <ActionBtn
                          active={st === "done"}
                          green
                          onClick={() => onStatusChange(row.id, "done")}
                        >
                          완료
                        </ActionBtn>
                        <ActionBtn red onClick={() => onDelete(row.id)}>
                          삭제
                        </ActionBtn>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "0.9rem 0.75rem",
                        textAlign: "right",
                        borderBottom: bd,
                      }}
                    >
                      <button
                        onClick={() => setExpandedId(expanded ? null : row.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          padding: "0.25rem",
                        }}
                      >
                        {expanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* 펼침 상세 — 업종·추가요청사항 */}
                  {expanded && (
                    <tr style={{ background: "var(--bg-secondary)" }}>
                      <td
                        colSpan={colSpan}
                        style={{ padding: "1.1rem 1.25rem", borderBottom: bd }}
                      >
                        <dl className="detail-dl">
                          <div>
                            <dt
                              className="emphasized"
                              style={{
                                color: "var(--text-muted)",
                                marginBottom: "0.3rem",
                                fontSize: "0.85rem",
                              }}
                            >
                              업종
                            </dt>
                            <dd
                              style={{
                                color: "var(--text-secondary)",
                                margin: 0,
                              }}
                            >
                              {row.industry || "-"}
                            </dd>
                            {/* 유입 경로 — 메모에 자동으로 붙은 "유입: …" 줄을 업종 아래로 뺀다 */}
                            {splitNote(row.note).entry && (
                              <>
                                <dt
                                  className="emphasized"
                                  style={{
                                    color: "var(--text-muted)",
                                    marginTop: "1rem",
                                    marginBottom: "0.3rem",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  유입
                                </dt>
                                <dd
                                  style={{
                                    color: "var(--text-secondary)",
                                    margin: 0,
                                  }}
                                >
                                  {splitNote(row.note).entry}
                                </dd>
                              </>
                            )}
                            {/* 신청 기기 — 접수 시 서버가 브라우저 정보로 판별해 메모에 붙인 "기기: …" 줄 */}
                            {splitNote(row.note).device && (
                              <>
                                <dt
                                  className="emphasized"
                                  style={{
                                    color: "var(--text-muted)",
                                    marginTop: "1rem",
                                    marginBottom: "0.3rem",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  신청 기기
                                </dt>
                                <dd
                                  style={{
                                    color: "var(--text-secondary)",
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                  }}
                                >
                                  {splitNote(row.note).device === "데스크탑" ? (
                                    <Monitor size={15} strokeWidth={2} />
                                  ) : (
                                    <Smartphone size={15} strokeWidth={2} />
                                  )}
                                  {splitNote(row.note).device}
                                </dd>
                              </>
                            )}
                          </div>
                          <div>
                            <dt
                              className="emphasized"
                              style={{
                                color: "var(--text-muted)",
                                marginBottom: "0.3rem",
                                fontSize: "0.85rem",
                              }}
                            >
                              추가요청사항
                            </dt>
                            <dd
                              style={{
                                color: "var(--text-secondary)",
                                margin: 0,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {splitNote(row.note).body || "-"}
                            </dd>
                            {/* 광고 키워드 — 왼쪽 '유입'과 같은 줄에 맞춘다 */}
                            {splitNote(row.note).keyword && (
                              <>
                                <dt
                                  className="emphasized"
                                  style={{
                                    color: "var(--text-muted)",
                                    marginTop: "1rem",
                                    marginBottom: "0.3rem",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  키워드
                                </dt>
                                <dd
                                  style={{
                                    color: "var(--text-secondary)",
                                    margin: 0,
                                  }}
                                >
                                  {splitNote(row.note).keyword}
                                </dd>
                              </>
                            )}
                          </div>
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// 표 안 작은 버튼 (진행중/완료/삭제) — active면 채워지고, red/green으로 색을 고른다
function ActionBtn({
  children,
  onClick,
  red,
  green,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  red?: boolean;
  green?: boolean;
  active?: boolean;
}) {
  let bg = "var(--surface)",
    border = "var(--border)",
    color = "var(--text-secondary)";
  if (active && green) {
    bg = "var(--success-dim)";
    border = "var(--success)";
    color = "var(--success-text)";
  } else if (active) {
    bg = "var(--accent-light)";
    border = "var(--accent)";
    color = "var(--accent-hover)";
  } else if (red) {
    bg = "var(--surface)";
    border = "var(--danger)";
    color = "#ef4444";
  }
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "6px",
        padding: "0.3rem 0.8rem",
        fontSize: "0.85rem",
        fontWeight: active ? 700 : 500,
        color,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// 상태 분포 누적 막대의 구간 — 표시 순서와 색
const STATUS_SEG: { key: Status; label: string; color: string }[] = [
  { key: "pending", label: "대기", color: "#cbd5e1" },
  { key: "in_progress", label: "진행중", color: "var(--accent)" },
  { key: "done", label: "완료", color: "#22c55e" },
];

// 차트 범례 한 칸 — 색 네모 + 이름
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

/**
 * 통계 관리 탭 — 사이트 점검·문의 접수 데이터를 기간별로 집계해 보여준다.
 * 일별 접수 추이(꺾은선), 상태 분포(누적 막대), 제작 종류별 건수(가로 막대).
 */
function AnalyticsView({
  checks: allB,
  inquiries: allI,
}: {
  checks: Inquiry[];
  inquiries: Inquiry[];
}) {
  // 기간 선택
  const [period, setPeriod] = useState<PeriodSel>({ key: "today" });
  // 현재 시각 — 자정을 지나면 '오늘' 집계가 다음 날로 넘어가야 하므로
  // 마운트에 고정하지 않고 매 렌더(폴링·포커스 갱신 시) 다시 읽는다
  const now = Date.now();
  const range = periodRange(period, now);
  const periodLabel = periodLabelOf(period, now);

  // 선택 기간만 집계 ('오늘'은 달력상 오늘 자정부터)
  const checks = withinPeriod(allB, period);
  const inquiries = withinPeriod(allI, period);

  // ── 일별 접수 추이 (차트 구간은 선택 범위의 첫날~끝날) ──
  const chartEnd = dayFloor(Math.min(range.end - DAY_MS, now)); // 마지막 버킷 날짜
  let chartStart = dayFloor(range.start);
  if (period.key === "all") {
    // 전체: 데이터가 시작된 날부터 (없으면 최근 14일)
    chartStart = chartEnd - 13 * DAY_MS;
    const all = [...allB, ...allI];
    if (all.length) {
      const earliest = dayFloor(
        Math.min(...all.map((r) => new Date(r.createdAt).getTime())),
      );
      chartStart = Math.min(chartStart, earliest);
    }
  }
  // 범위가 너무 길면 차트만 최근 92일로 자른다 (집계 숫자는 전체 범위 기준)
  if ((chartEnd - chartStart) / DAY_MS + 1 > 92) {
    chartStart = chartEnd - 91 * DAY_MS;
  }
  const DAYS = Math.max(1, Math.round((chartEnd - chartStart) / DAY_MS) + 1);
  const buckets: { key: string; label: string; b: number; i: number }[] = [];
  for (let n = 0; n < DAYS; n++) {
    const d = new Date(chartStart + n * DAY_MS);
    buckets.push({
      key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      b: 0,
      i: 0,
    });
  }
  const bidx: Record<string, number> = {};
  buckets.forEach((x, n) => {
    bidx[x.key] = n;
  });
  const dkey = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  checks.forEach((r) => {
    const k = dkey(r.createdAt);
    if (k in bidx) buckets[bidx[k]].b++;
  });
  inquiries.forEach((r) => {
    const k = dkey(r.createdAt);
    if (k in bidx) buckets[bidx[k]].i++;
  });
  // '오늘'처럼 하루만 볼 때: 선이 0에서 올라가도록 맨 앞에 0 기준점 추가
  if (buckets.length === 1) {
    buckets.unshift({ key: "__start", label: "", b: 0, i: 0 });
  }
  const maxDaily = Math.max(1, ...buckets.map((x) => Math.max(x.b, x.i)));

  // ── 상태 분포 ──
  const stCount = (arr: { status: Status }[]): Record<Status, number> => ({
    pending: arr.filter((r) => r.status === "pending").length,
    in_progress: arr.filter((r) => r.status === "in_progress").length,
    done: arr.filter((r) => r.status === "done").length,
  });
  const statusRows = [
    { label: "사이트 점검", data: stCount(checks) },
    { label: "문의", data: stCount(inquiries) },
  ];

  // ── 제작 종류별 ──
  const typeCount: Record<string, number> = {};
  projectTypes.forEach((t) => {
    typeCount[t] = 0;
  });
  [...checks, ...inquiries].forEach((r) => {
    if (r.type in typeCount) typeCount[r.type]++;
  });
  const maxType = Math.max(1, ...Object.values(typeCount));

  // ── SVG 좌표 ──
  const W = 720,
    H = 250,
    padL = 30,
    padR = 12,
    padT = 12,
    padB = 26;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const baseY = padT + plotH;
  const y = (v: number) => baseY - (v / maxDaily) * plotH;
  // 첫 점은 왼쪽 끝, 마지막 점은 오른쪽 끝까지 펼침
  const cx = (n: number) =>
    buckets.length <= 1
      ? padL + plotW / 2
      : padL + (n / (buckets.length - 1)) * plotW;
  const gridVals = Array.from(new Set([0, Math.round(maxDaily / 2), maxDaily]));
  const C_B = "#0ea5e9";
  const C_I = "#ec4899";

  const card: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "1.4rem 1.5rem",
  };
  const h3: React.CSSProperties = {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--text)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* 상단 바 — 기간 선택 */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <PeriodSelect value={period} onChange={setPeriod} />
      </div>

      {/* 최근 14일 접수 추이 */}
      <section style={card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <h3 style={h3}>{periodLabel} 접수 추이</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Legend color={C_B} label="사이트 점검" />
            <Legend color={C_I} label="문의" />
          </div>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", marginTop: "0.9rem" }}
          role="img"
          aria-label="최근 14일 사이트 점검·문의 접수 추이"
        >
          {gridVals.map((v) => (
            <g key={v}>
              <line
                x1={padL}
                y1={y(v)}
                x2={W - padR}
                y2={y(v)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={padL - 6}
                y={y(v) + 3}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-muted)"
              >
                {v}
              </text>
            </g>
          ))}
          {/* 꺾은선 */}
          <polyline
            fill="none"
            stroke={C_B}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={buckets.map((d, n) => `${cx(n)},${y(d.b)}`).join(" ")}
          />
          <polyline
            fill="none"
            stroke={C_I}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={buckets.map((d, n) => `${cx(n)},${y(d.i)}`).join(" ")}
          />
          {/* 마커 + x축 라벨 */}
          {buckets.map((d, n) => (
            <g key={d.key}>
              <circle
                cx={cx(n)}
                cy={y(d.b)}
                r={4}
                fill="var(--surface)"
                stroke={C_B}
                strokeWidth={2}
              >
                <title>
                  {d.label} · 사이트 점검 {d.b}
                </title>
              </circle>
              <circle
                cx={cx(n)}
                cy={y(d.i)}
                r={4}
                fill="var(--surface)"
                stroke={C_I}
                strokeWidth={2}
              >
                <title>
                  {d.label} · 문의 {d.i}
                </title>
              </circle>
              {n % 2 === 1 && (
                <text
                  x={cx(n)}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-muted)"
                >
                  {d.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </section>

      <div className="analytics-2col">
        {/* 상태 분포 */}
        <section style={card}>
          <h3 style={{ ...h3, marginBottom: "1.1rem" }}>상태 분포</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {statusRows.map((row) => {
              const total =
                row.data.pending + row.data.in_progress + row.data.done;
              return (
                <div key={row.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {row.label}
                    </span>
                    <span
                      style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                    >
                      {total}건
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      height: 22,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "var(--bg-secondary)",
                      gap: total ? 2 : 0,
                    }}
                  >
                    {STATUS_SEG.map((seg) => {
                      const v = row.data[seg.key];
                      if (!v) return null;
                      return (
                        <div
                          key={seg.key}
                          title={`${seg.label} ${v}`}
                          style={{
                            width: `${(v / total) * 100}%`,
                            background: seg.color,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1.1rem",
              flexWrap: "wrap",
            }}
          >
            {STATUS_SEG.map((seg) => (
              <Legend key={seg.key} color={seg.color} label={seg.label} />
            ))}
          </div>
        </section>

        {/* 제작 종류별 */}
        <section style={card}>
          <h3 style={{ ...h3, marginBottom: "1.1rem" }}>제작 종류별 건수</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {projectTypes.map((t, i) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    flex: "0 0 132px",
                    fontSize: "0.86rem",
                    color: "var(--text-secondary)",
                    wordBreak: "keep-all",
                  }}
                >
                  {t}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 18,
                    borderRadius: 5,
                    background: "var(--bg-secondary)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(typeCount[t] / maxType) * 100}%`,
                      height: "100%",
                      background: TYPE_COLORS[i % TYPE_COLORS.length],
                      borderRadius: 5,
                    }}
                  />
                </div>
                <span
                  style={{
                    flex: "0 0 30px",
                    textAlign: "right",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {typeCount[t]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// 유입 소스 표기·색 — 채널별 브랜드 컬러
const SOURCE_KO: Record<string, string> = {
  kakao: "카카오",
  naver: "네이버",
  instagram: "인스타그램",
  facebook: "페이스북",
  google: "구글",
  daum: "다음",
  twitter: "X(트위터)",
  youtube: "유튜브",
  band: "밴드",
  threads: "스레드",
  direct: "직접 유입",
  // 유료 광고 클릭은 같은 채널의 검색·SNS 유입과 따로 센다
  "naver-ad": "네이버 광고",
  "google-ad": "구글 광고",
  // 인스타·페이스북은 같은 메타 광고가 노출된 자리만 다른 것 — 어디서 눌렀는지 보이게 따로 적는다
  "facebook-ad": "페이스북 광고",
  "instagram-ad": "인스타 광고",
  "kakao-ad": "카카오 광고",
  "threads-ad": "스레드 광고",
};
const SOURCE_COLOR: Record<string, string> = {
  kakao: "#fae100",
  naver: "#03c75a",
  "naver-ad": "#15803d",
  "google-ad": "#b91c1c",
  "facebook-ad": "#1e40af",
  "instagram-ad": "#be185d",
  "kakao-ad": "#a16207",
  instagram: "#f06595",
  facebook: "#1877f2",
  google: "#ea4335",
  daum: "#06b6d4",
  twitter: "#e7e9ea",
  youtube: "#ff0000",
  band: "#00c73c",
  threads: "#e1e1e6",
  "threads-ad": "#8e8e93",
  direct: "#94a3b8",
};
// utm 약자·별칭 소스 통합 (예: ig → instagram) — 같은 채널을 한 줄로 합침
const SOURCE_ALIAS: Record<string, string> = {
  ig: "instagram",
  insta: "instagram",
  fb: "facebook",
  meta: "facebook",
  yt: "youtube",
  x: "twitter",
  "band.us": "band",
  // 스레드 — 링크 리다이렉트 도메인이 소스로 남은 예전 기록을 합친다
  "l.threads.com": "threads",
  threads_net: "threads",
};
// 소스 문자열 정규화 — 소문자화 + 별칭 흡수, 값이 없으면 직접 유입
function normSource(s: string): string {
  const k = (s || "direct").toLowerCase();
  return SOURCE_ALIAS[k] || k;
}
// 경로 → 한글 페이지 이름 (이탈 페이지 표기용)
const PAGE_KO: Record<string, string> = {
  "/": "메인",
  "/about": "회사 소개",
  "/benefits": "WEFLOW 혜택",
  "/booking": "예약",
  "/cases": "제작 사례",
  "/check": "사이트 점검",
  "/diagnosis": "무료 상담",
  "/difference": "왜 WEFLOW?",
  "/guide": "제작 라인업",
  "/pricing": "가격 안내",
  "/reviews": "고객 인터뷰",
  "/service": "서비스 소개",
  // 사례 상세(/cases/[slug]) — 사례 데이터에서 이름을 가져와 자동으로 붙는다.
  // 사례를 추가해도 여기를 손댈 필요가 없다.
  ...Object.fromEntries(portfolios.map((p) => [`/cases/${p.slug}`, `사례 · ${p.name}`])),
};
// 경로 → 사람이 알아보는 한글 이름 (쿼리·해시 제거, 미등록 경로는 경로 그대로)
function pageName(path: string): string {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return PAGE_KO[clean] || clean;
}
// 접속 기기 표기·색
const DEVICE_KO: Record<string, string> = {
  mobile: "모바일",
  tablet: "태블릿",
  desktop: "데스크탑",
};
const DEVICE_COLOR: Record<string, string> = {
  mobile: "var(--accent)",
  tablet: "#f59e0b",
  desktop: "#22c55e",
};

// 머문 시간 표기 — ms → "45초" / "2분 10초"
function fmtDur(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}초`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m}분 ${rem}초` : `${m}분`;
}

function TrafficMetric({
  Icon,
  label,
  value,
  sub,
  tint,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tint: string;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.3rem 1.4rem",
        borderTop: `4px solid ${tint}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "0.7rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            width: 38,
            height: 38,
            borderRadius: 10,
            background: `${tint}1a`,
            color: tint,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <p
          className="emphasized"
          style={{
            color: "var(--text-secondary)",
            margin: 0,
            fontSize: "0.95rem",
            wordBreak: "keep-all",
          }}
        >
          {label}
        </p>
      </div>
      <p
        style={{
          margin: 0,
          lineHeight: 1.05,
          fontSize: "2.35rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "var(--text)",
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            margin: "0.45rem 0 0",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionHead({
  Icon,
  title,
  desc,
  tint,
}: {
  Icon: LucideIcon;
  title: string;
  /** 설명 — 모바일 줄바꿈이 필요하면 <br className="br-mobile" /> 를 섞어 넘긴다 */
  desc: React.ReactNode;
  tint: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.7rem",
        marginBottom: "1.2rem",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          width: 40,
          height: 40,
          borderRadius: 11,
          background: `${tint}1a`,
          color: tint,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={21} strokeWidth={2.2} />
      </span>
      <div>
        <h3
          style={{
            margin: "0 0 0.15rem",
            fontSize: "1.15rem",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            wordBreak: "keep-all",
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

// 카드 안 칸 머리글 (전체 · 광고별 · 키워드별)
function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 0.7rem",
        fontSize: "0.8rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </p>
  );
}

// 한 항목(광고 매체·키워드)의 기기 구성 — 항목 이름 아래에 기기별로 한 줄씩,
// 다른 카드와 같은 "라벨 · 막대 · n명 (nn%)" 형식. 퍼센트는 그 항목 안에서의 비중이다
function DeviceSplitRow({ label, byDevice }: { label: string; byDevice: Record<string, number> }) {
  const parts = Object.entries(byDevice).sort((a, b) => b[1] - a[1]);
  const total = parts.reduce((s, r) => s + r[1], 0);
  return (
    <div>
      <p
        title={label}
        style={{
          margin: "0 0 0.45rem",
          fontSize: "0.86rem",
          fontWeight: 700,
          color: "var(--text)",
          wordBreak: "break-all",
          lineHeight: 1.35,
        }}
      >
        {label} <span style={{ fontWeight: 500, color: "var(--text-muted)" }}>· {total}명</span>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {parts.map(([dev, n]) => (
          <BarRow
            key={dev}
            label={DEVICE_KO[dev] || dev}
            color={DEVICE_COLOR[dev] || "var(--accent)"}
            value={n}
            max={total}
            right={`${n}명 (${Math.round((n / total) * 100)}%)`}
          />
        ))}
      </div>
    </div>
  );
}

function BarRow({
  label,
  color,
  value,
  max,
  right,
  labelWidth = 92,
  wrapLabel = false,
}: {
  label: string;
  color: string;
  value: number;
  max: number;
  right: string;
  /** 라벨 칸 너비(px) — 키워드처럼 긴 라벨은 넓힌다 */
  labelWidth?: number;
  /** true 면 말줄임 대신 줄바꿈으로 글자를 전부 보여준다 */
  wrapLabel?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {/* 라벨 칸 너비를 고정해 막대 시작선이 전부 같은 자리에 온다 */}
      <span
        title={label}
        style={{
          flex: `0 0 ${labelWidth}px`,
          fontSize: "0.86rem",
          color: "var(--text-secondary)",
          ...(wrapLabel
            ? { wordBreak: "break-all", lineHeight: 1.35 }
            : {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }),
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 18,
          borderRadius: 5,
          background: "var(--bg-secondary)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${max ? (value / max) * 100 : 0}%`,
            height: "100%",
            background: color,
            borderRadius: 5,
          }}
        />
      </div>
      <span
        style={{
          flex: "0 0 78px",
          textAlign: "right",
          fontSize: "0.88rem",
          fontWeight: 700,
          color: "var(--text)",
        }}
      >
        {right}
      </span>
    </div>
  );
}

function TrafficView({
  pageViews: allPageViews,
  loading,
}: {
  pageViews: PageView[];
  loading: boolean;
}) {
  const card: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "1.4rem 1.5rem",
  };

  // 기간 선택
  const [period, setPeriod] = useState<PeriodSel>({ key: "today" });
  const pageViews = withinPeriod(allPageViews, period);

  // 날짜별 방문자 차트(가로 스크롤)를 진입 시 맨 오른쪽(최근)으로 이동
  const dailyScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = dailyScrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [allPageViews.length]);

  // 세션 단위로 묶기 (createdAt 오름차순 가정)
  const sessions = new Map<string, PageView[]>();
  pageViews.forEach((v) => {
    const arr = sessions.get(v.sessionId);
    if (arr) arr.push(v);
    else sessions.set(v.sessionId, [v]);
  });
  const sessionList = Array.from(sessions.values());

  // 날짜별 방문자 차트는 기간 선택과 무관하게 최근 14일 전체를 보여줌
  // → 기간 필터가 걸린 pageViews가 아니라 전체 데이터로 세션을 다시 묶는다
  const allSessions = new Map<string, PageView[]>();
  allPageViews.forEach((v) => {
    const arr = allSessions.get(v.sessionId);
    if (arr) arr.push(v);
    else allSessions.set(v.sessionId, [v]);
  });
  const allSessionList = Array.from(allSessions.values());

  const totalSessions = sessionList.length;
  const totalViews = pageViews.length;

  // 유입 소스별 세션 (첫 페이지 기준)
  const sourceCount: Record<string, number> = {};
  const keywordCount: Record<string, number> = {}; // 광고 키워드별 세션 (파워링크 n_keyword 등)
  const deviceCount: Record<string, number> = {};
  // 광고로 온 세션의 기기 — 전체 / 광고 매체별 / 키워드별
  const adDeviceCount: Record<string, number> = {};
  const adDeviceBySource: Record<string, Record<string, number>> = {};
  const adDeviceByKeyword: Record<string, Record<string, number>> = {};
  const exitCount: Record<string, number> = {};
  const adExitCount: Record<string, number> = {}; // 광고 유입 세션의 이탈 페이지
  let bounced = 0;
  let durSum = 0,
    durN = 0;
  sessionList.forEach((views) => {
    const entry = views[0];
    const exit = views[views.length - 1];
    // 세션(기기당 하루)은 첫 페이지 기준이지만, 그날 광고를 클릭한 적이 있으면 광고 유입으로 친다
    // — 아침에 직접 들어왔다가 오후에 광고로 다시 온 사람이 '직접 유입'에 묻히지 않게
    // 같은 날 광고를 여러 매체에서 눌렀으면 매체마다 따로 센다 (같은 매체 반복은 한 번).
    // 광고 클릭이 없을 때만 첫 페이지의 유입 소스를 쓴다
    const paidViews = views.filter((v) => v.medium === "cpc" || v.medium === "paid");
    if (paidViews.length) {
      new Set(paidViews.map((v) => `${normSource(v.source)}-ad`)).forEach((src) => {
        sourceCount[src] = (sourceCount[src] || 0) + 1;
      });
      const kws = new Set(paidViews.map((v) => v.campaign).filter(Boolean));
      kws.forEach((kw) => {
        keywordCount[kw] = (keywordCount[kw] || 0) + 1;
      });
      // 기기는 세션(기기당 하루) 단위라 하나뿐 — 광고 매체·키워드 카드와 같은 단위로 센다
      const dev = entry.device || "desktop";
      adDeviceCount[dev] = (adDeviceCount[dev] || 0) + 1;
      new Set(paidViews.map((v) => `${normSource(v.source)}-ad`)).forEach((src) => {
        (adDeviceBySource[src] ||= {})[dev] = (adDeviceBySource[src][dev] || 0) + 1;
      });
      kws.forEach((kw) => {
        (adDeviceByKeyword[kw] ||= {})[dev] = (adDeviceByKeyword[kw][dev] || 0) + 1;
      });
      // 광고 유입 이탈 페이지 — 키워드 카드와 같은 단위(키워드당 1회)로 세서
      // 두 카드의 합계가 항상 일치한다 (한 기기가 키워드 2개로 오면 이탈도 2로)
      adExitCount[exit.path] = (adExitCount[exit.path] || 0) + kws.size;
    } else {
      const src = normSource(entry.source);
      sourceCount[src] = (sourceCount[src] || 0) + 1;
    }
    deviceCount[entry.device] = (deviceCount[entry.device] || 0) + 1;
    exitCount[exit.path] = (exitCount[exit.path] || 0) + 1;
    if (views.length === 1) bounced++;
    const sessionDur = views.reduce((a, v) => a + (v.durationMs || 0), 0);
    if (sessionDur > 0) {
      durSum += sessionDur;
      durN++;
    }
  });
  const bounceRate = totalSessions
    ? Math.round((bounced / totalSessions) * 100)
    : 0;
  const avgDur = durN ? durSum / durN : 0;

  const sourceRows = Object.entries(sourceCount).sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(1, ...sourceRows.map((r) => r[1]));
  const keywordRows = Object.entries(keywordCount).sort((a, b) => b[1] - a[1]);
  const maxKeyword = Math.max(1, ...keywordRows.map((r) => r[1]));
  const deviceRows = Object.entries(deviceCount).sort((a, b) => b[1] - a[1]);
  const adDeviceRows = Object.entries(adDeviceCount).sort((a, b) => b[1] - a[1]);
  const adSessionTotal = adDeviceRows.reduce((s, r) => s + r[1], 0);
  // 매체·키워드별은 세션 많은 순, 키워드는 상위 8개만
  const sumDev = (m: Record<string, number>) => Object.values(m).reduce((a, b) => a + b, 0);
  const adDeviceSourceRows = Object.entries(adDeviceBySource).sort((a, b) => sumDev(b[1]) - sumDev(a[1]));
  const adDeviceKeywordRows = Object.entries(adDeviceByKeyword)
    .sort((a, b) => sumDev(b[1]) - sumDev(a[1]))
    .slice(0, 8);
  const exitRows = Object.entries(exitCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxExit = Math.max(1, ...exitRows.map((r) => r[1]));
  const adExitTotal = Object.values(adExitCount).reduce((a, b) => a + b, 0);
  const adExitRows = Object.entries(adExitCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxAdExit = Math.max(1, ...adExitRows.map((r) => r[1]));

  // 일별 방문(세션 수) — 최근 14일
  const DAYS = 14;
  const today = new Date();
  const days: { key: string; label: string; v: number }[] = [];
  const didx: Record<string, number> = {};
  for (let n = DAYS - 1; n >= 0; n--) {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - n,
    );
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    didx[key] = days.length;
    days.push({ key, label: `${d.getMonth() + 1}/${d.getDate()}`, v: 0 });
  }
  allSessionList.forEach((views) => {
    const d = new Date(views[0].createdAt);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (key in didx) days[didx[key]].v++;
  });
  const maxDay = Math.max(1, ...days.map((d) => d.v));

  // 시간대별 (0~23시, 페이지뷰 기준)
  const hours = Array.from({ length: 24 }, () => 0);
  pageViews.forEach((v) => {
    hours[new Date(v.createdAt).getHours()]++;
  });
  const maxHour = Math.max(1, ...hours);

  // 스크롤 도달 퍼널 — max_scroll 기록된 페이지뷰 기준
  const scrolled = pageViews.filter((v) => v.maxScroll != null);
  const scrollTotal = scrolled.length;
  const scrollThresholds = [25, 50, 75, 100];
  const scrollReach = scrollThresholds.map((t) => ({
    t,
    n: scrolled.filter((v) => (v.maxScroll as number) >= t).length,
  }));
  const avgScroll = scrollTotal
    ? Math.round(
        scrolled.reduce((a, v) => a + (v.maxScroll as number), 0) / scrollTotal,
      )
    : 0;

  if (loading && allPageViews.length === 0) {
    return (
      <p className="subhead c-muted" style={{ padding: "2rem 0" }}>
        불러오는 중…
      </p>
    );
  }
  if (!loading && allPageViews.length === 0) {
    return (
      <div style={card}>
        <p
          className="subhead"
          style={{
            color: "var(--text-muted)",
            margin: 0,
            textAlign: "center",
            padding: "2rem 0",
          }}
        >
          아직 수집된 방문 데이터가 없습니다.
          <br />
          방문이 기록되면 여기에 유입·이탈 통계가 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* 상단 바 — 기간 선택 (왼쪽) */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <PeriodSelect value={period} onChange={setPeriod} />
      </div>

      {/* 요약 지표 */}
      <div
        className="traffic-metric-grid"
        style={{ display: "grid", gap: "1rem" }}
      >
        <TrafficMetric
          Icon={Users}
          tint="#3373df"
          label="방문자 수"
          value={`${totalSessions}명`}
          sub="선택 기간 방문 고객"
        />
        <TrafficMetric
          Icon={Eye}
          tint="#8b5cf6"
          label="본 페이지 수"
          value={`${totalViews}회`}
          sub="고객들이 열어본 페이지"
        />
        {SITE_TYPE === "multi" ? (
          <TrafficMetric
            Icon={MousePointerClick}
            tint="#f59e0b"
            label="즉시 이탈률"
            value={`${bounceRate}%`}
            sub={`한 페이지만 보고 이탈 (${bounced}명)`}
          />
        ) : (
          <TrafficMetric
            Icon={ChevronsDown}
            tint="#0ea5e9"
            label="평균 스크롤 도달"
            value={scrollTotal ? `${avgScroll}%` : "-"}
            sub="페이지를 평균 이만큼 내려봄"
          />
        )}
        <TrafficMetric
          Icon={Clock}
          tint="var(--success)"
          label="평균 머문 시간"
          value={avgDur ? fmtDur(avgDur) : "-"}
          sub="한 명이 머문 평균 시간"
        />
      </div>

      {/* 핵심 한 줄 하이라이트 */}
      {sourceRows.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.9rem",
            background: "linear-gradient(135deg, var(--accent-light), var(--surface-container))",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "1.15rem 1.4rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: SOURCE_COLOR[sourceRows[0][0]] || "var(--accent)",
              color: "var(--on-accent)",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={24} strokeWidth={2.4} />
          </span>
          <p
            style={{
              margin: 0,
              fontSize: "1.15rem",
              color: "var(--text)",
              wordBreak: "keep-all",
              lineHeight: 1.45,
            }}
          >
            고객이 가장 많이 들어온 곳은{" "}
            <strong
              // 어두운 배경이라 채널 고유색을 그대로 써도 잘 읽힌다
              // (흰 배경이던 시절엔 카카오 노랑만 어둡게 눌러 썼었다)
              style={{ color: SOURCE_COLOR[sourceRows[0][0]] || "var(--accent)" }}
            >
              {SOURCE_KO[sourceRows[0][0]] || sourceRows[0][0]}
            </strong>{" "}
            이에요 — 전체 방문자의{" "}
            <strong>
              {totalSessions
                ? Math.round((sourceRows[0][1] / totalSessions) * 100)
                : 0}
              %
            </strong>
          </p>
        </div>
      )}

      {/* 유입 소스 + 기기별 */}
      <div className="analytics-2col">
        <section style={card}>
          <SectionHead
            Icon={LogIn}
            tint="#3373df"
            title="어디서 들어왔나요?"
            desc="고객들이 우리 사이트를 찾은 경로"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {sourceRows.length === 0 && (
              <p className="c-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                데이터 없음
              </p>
            )}
            {sourceRows.map(([src, cnt]) => (
              <BarRow
                key={src}
                label={SOURCE_KO[src] || src}
                color={SOURCE_COLOR[src] || "var(--accent)"}
                value={cnt}
                max={maxSource}
                right={`${cnt}명 (${totalSessions ? Math.round((cnt / totalSessions) * 100) : 0}%)`}
              />
            ))}
          </div>
        </section>

        <section style={card} className="dev-card">
          <SectionHead
            Icon={Smartphone}
            tint="#8b5cf6"
            title="무엇으로 봤나요?"
            desc="휴대폰·컴퓨터 등 접속 기기"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {deviceRows.map(([dev, cnt]) => (
              <BarRow
                key={dev}
                label={DEVICE_KO[dev] || dev}
                color={DEVICE_COLOR[dev] || "var(--accent)"}
                value={cnt}
                max={Math.max(1, ...deviceRows.map((r) => r[1]))}
                right={`${cnt}명 (${totalSessions ? Math.round((cnt / totalSessions) * 100) : 0}%)`}
              />
            ))}
          </div>
        </section>

        {/* 광고로 온 고객의 기기 — 전체 → 광고 매체별 → 키워드별.
            네이버 파워링크는 PC·모바일 입찰이 따로라 어디에 예산을 둘지 판단하는 근거가 된다.
            광고 클릭이 한 건이라도 있을 때만 보인다 */}
        {adSessionTotal > 0 && (
        <section style={card} className="ad-dev-card">
          <SectionHead
            Icon={Smartphone}
            tint="#15803d"
            title="광고로 온 고객은 무엇으로 봤나요?"
            desc={
              <>
                광고를 클릭해 들어온 고객의 접속 기기
                <br className="br-mobile" /> — 광고별·키워드별
              </>
            }
          />
          {/* PC 는 두 칸 — 왼쪽에 전체(기기 3줄뿐이라 짧다)와 광고별을 위아래로, 오른쪽에 키워드별.
              모바일은 세로로 쌓는다 */}
          <div className="ad-dev-grid">
            <div className="ad-dev-col">
              <SubHead>전체</SubHead>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {adDeviceRows.map(([dev, cnt]) => (
                  <BarRow
                    key={dev}
                    label={DEVICE_KO[dev] || dev}
                    color={DEVICE_COLOR[dev] || "var(--accent)"}
                    value={cnt}
                    max={Math.max(1, ...adDeviceRows.map((r) => r[1]))}
                    right={`${cnt}명 (${Math.round((cnt / adSessionTotal) * 100)}%)`}
                  />
                ))}
              </div>

              <div className="ad-dev-sub">
                <SubHead>광고별</SubHead>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {adDeviceSourceRows.map(([src, byDev]) => (
                    <DeviceSplitRow key={src} label={SOURCE_KO[src] || src} byDevice={byDev} />
                  ))}
                </div>
              </div>
            </div>

            <div className="ad-dev-col">
              <SubHead>키워드별</SubHead>
              {adDeviceKeywordRows.length === 0 ? (
                <p className="c-muted" style={{ margin: 0, fontSize: "0.9rem" }}>키워드 기록 없음</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {adDeviceKeywordRows.map(([kw, byDev]) => (
                    <DeviceSplitRow
                      key={kw}
                      label={/^\d{12,}$/.test(kw) ? `ID …${kw.slice(-6)}` : kw}
                      byDevice={byDev}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* 광고 키워드별 유입 — 광고 클릭이 한 건이라도 있을 때만 보인다.
            PC 는 광고 이탈 카드와 나란히 두 칸, 모바일은 기기 카드보다 위(order)로 온다 */}
        {keywordRows.length > 0 && (
        <section style={card}>
          <SectionHead
            Icon={LogIn}
            tint="#15803d"
            title="어떤 키워드로 왔나요?"
            desc="광고를 클릭해 들어온 검색어"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {(() => {
              // 퍼센트는 키워드 유입끼리의 비중 — 합치면 100% 가 되게
              const keywordTotal = keywordRows.reduce((s, r) => s + r[1], 0);
              return keywordRows.map(([kw, cnt]) => (
                <BarRow
                  key={kw}
                  // 검색어 대신 네이버 키워드 ID(숫자)만 넘어온 세션은 짧게 표기
                  label={/^\d{12,}$/.test(kw) ? `ID …${kw.slice(-6)}` : kw}
                  color="#15803d"
                  value={cnt}
                  max={maxKeyword}
                  right={`${cnt}명 (${keywordTotal ? Math.round((cnt / keywordTotal) * 100) : 0}%)`}
                  labelWidth={128}
                  wrapLabel
                />
              ));
            })()}
          </div>
        </section>
        )}

        {/* 광고 유입 이탈 페이지 — 광고를 보고 온 세션이 마지막으로 본 곳 */}
        {adExitRows.length > 0 && (
        <section style={card}>
          <SectionHead
            Icon={DoorOpen}
            tint="#f59e0b"
            title="광고로 온 고객은 어느 페이지에서 나갔나요?"
            desc="광고를 클릭해 들어온 고객이 마지막으로 보고 떠난 페이지"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {adExitRows.map(([path, cnt]) => (
              <BarRow
                key={path}
                label={pageName(path)}
                color="#f59e0b"
                value={cnt}
                max={maxAdExit}
                right={`${cnt}명 (${adExitTotal ? Math.round((cnt / adExitTotal) * 100) : 0}%)`}
              />
            ))}
          </div>
        </section>
        )}
      </div>

      {/* 일별 방문 추이 */}
      <section style={card}>
        <SectionHead
          Icon={TrendingUp}
          tint="var(--success)"
          title="날짜별 방문자"
          desc="최근 14일 동안 하루에 몇 명이 왔는지"
        />
        <div ref={dailyScrollRef} style={{ overflowX: "auto", overflowY: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "0.5rem",
            height: 160,
            minWidth: 620,
          }}
        >
          {days.map((d) => (
            <div
              key={d.key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                }}
              >
                {d.v || ""}
              </span>
              <div
                title={`${d.label} · ${d.v}명`}
                style={{
                  width: "100%",
                  maxWidth: 34,
                  height: `${(d.v / maxDay) * 100}%`,
                  minHeight: d.v ? 4 : 0,
                  background: "var(--accent)",
                  borderRadius: "5px 5px 0 0",
                  transition: "height 0.2s",
                }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* 시간대별 + 오른쪽: (다중)이탈 페이지 / (랜딩)스크롤 도달률 */}
      {SITE_TYPE === "multi" ? (
        <div className="analytics-2col">
          <section style={card}>
            <SectionHead
              Icon={Clock}
              tint="#3373df"
              title="언제 많이 오나요?"
              desc="하루 중 방문이 몰리는 시간대 (0~23시)"
            />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "2px",
                height: 130,
              }}
            >
              {hours.map((h, i) => (
                <div
                  key={i}
                  title={`${i}시 · ${h}회`}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${(h / maxHour) * 100}%`,
                      minHeight: h ? 3 : 0,
                      background:
                        i >= 9 && i <= 18 ? "var(--accent)" : "var(--outline)",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.4rem",
                fontSize: "0.68rem",
                color: "var(--text-muted)",
              }}
            >
              <span>0시</span>
              <span>6시</span>
              <span>12시</span>
              <span>18시</span>
              <span>23시</span>
            </div>
          </section>

          <section style={card}>
            <SectionHead
              Icon={DoorOpen}
              tint="#ef4444"
              title="어느 페이지에서 나갔나요?"
              desc="고객이 마지막으로 보고 떠난 페이지"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {exitRows.length === 0 && (
                <p
                  className="c-muted"
                  style={{ margin: 0, fontSize: "0.9rem" }}
                >
                  데이터 없음
                </p>
              )}
              {exitRows.map(([path, cnt]) => (
                <BarRow
                  key={path}
                  label={pageName(path)}
                  color="#f87171"
                  value={cnt}
                  max={maxExit}
                  right={`${cnt}회`}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="analytics-2col">
          <section style={card}>
            <SectionHead
              Icon={Clock}
              tint="#3373df"
              title="언제 많이 오나요?"
              desc="하루 중 방문이 몰리는 시간대 (0~23시)"
            />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "2px",
                height: 130,
              }}
            >
              {hours.map((h, i) => (
                <div
                  key={i}
                  title={`${i}시 · ${h}회`}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${(h / maxHour) * 100}%`,
                      minHeight: h ? 3 : 0,
                      background:
                        i >= 9 && i <= 18 ? "var(--accent)" : "var(--outline)",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.4rem",
                fontSize: "0.68rem",
                color: "var(--text-muted)",
              }}
            >
              <span>0시</span>
              <span>6시</span>
              <span>12시</span>
              <span>18시</span>
              <span>23시</span>
            </div>
          </section>

          <section style={card}>
            <SectionHead
              Icon={ChevronsDown}
              tint="#0ea5e9"
              title="어디까지 봤나요?"
              desc="고객이 페이지를 얼마나 아래까지 내려봤는지 — 뚝 떨어지는 구간이 이탈 지점이에요"
            />
            {scrollTotal === 0 ? (
              <p className="c-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                아직 스크롤 데이터가 없습니다.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {scrollReach.map(({ t, n }) => {
                  const pct = Math.round((n / scrollTotal) * 100);
                  return (
                    <BarRow
                      key={t}
                      label={`${t}% 지점`}
                      color="#0ea5e9"
                      value={n}
                      max={scrollTotal}
                      right={`${pct}%`}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false); // 인증 확인 완료 여부(로그인창 깜빡임 방지)
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [filter, setFilter] = useState<Filter>("전체");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [pvLoading, setPvLoading] = useState(false);
  const [listPeriod, setListPeriod] = useState<PeriodSel>({ key: "today" });
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // 서버 세션(httpOnly 쿠키)으로 로그인 여부 확인
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d?.authed))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  // 새로고침해도 현재 탭 유지 — 마지막 탭을 저장하고 진입 시 복원
  useEffect(() => {
    const saved = localStorage.getItem("weflow_admin_tab") as Tab | null;
    if (saved && TABS.some((t) => t.key === saved)) setTab(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("weflow_admin_tab", tab);
  }, [tab]);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const iRes = await fetch("/api/inquiries");
      setInquiries(await iRes.json());
    } catch {}
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  // 유입 통계 탭 진입 시 방문 데이터 로드
  useEffect(() => {
    if (!authed || tab !== "traffic") return;
    setPvLoading(true);
    fetch("/api/analytics?days=30")
      .then((r) => r.json())
      .then((d) => setPageViews(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setPvLoading(false));
  }, [authed, tab]);

  // 자동 갱신: 20초 폴링 + 탭 재포커스 시 (조용히 갱신)
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => load(true), 20000);
    const onFocus = () => load(true);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [authed, load]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setAuthed(true);
        setPw("");
        return;
      }
    } catch {}
    setPwError(true);
    setTimeout(() => setPwError(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    setAuthed(false);
  };

  const updateStatus = (
    url: string,
    id: string,
    status: Status,
    setter: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    setter((prev) =>
      prev.map((r: any) => (r.id === id ? { ...r, status } : r)),
    );
    fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const remove = (
    url: string,
    id: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setter((prev) => prev.filter((r: any) => r.id !== id));
    fetch(`${url}/${id}`, { method: "DELETE" });
  };

  const filterRows = <T extends { status: Status }>(rows: T[]) =>
    filter === "전체"
      ? rows
      : rows.filter((r) => STATUS_KO[r.status] === filter);

  // 인증 확인 전에는 로그인창을 렌더하지 않음 (모바일에서 로그인창 깜빡임 방지)
  if (!checked) return null;

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-secondary)",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "1.75rem 2.75rem 2.75rem",
            width: "100%",
            maxWidth: "440px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
            <Image
              src="/logo.png"
              alt="WEFLOW"
              width={72}
              height={72}
              style={{
                width: 72,
                height: 72,
                margin: "0 auto 0.4rem",
                display: "block",
              }}
            />
            <h1
              className="title-2 emphasized"
              style={{ margin: "0 0 0.35rem" }}
            >
              관리자 로그인
            </h1>
            <p
              className="subhead"
              style={{
                color: "var(--text-muted)",
                margin: 0,
                fontSize: "1.05rem",
              }}
            >
              WEFLOW 관리자 대시보드
            </p>
          </div>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}
          >
            <div>
              <label
                className="subhead semibold"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  color: "var(--text-secondary)",
                  fontSize: "1.05rem",
                }}
              >
                비밀번호
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="비밀번호를 입력하세요"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                style={{
                  borderColor: pwError ? "#ef4444" : undefined,
                  fontSize: "1.05rem",
                  padding: "0.8rem 0.95rem",
                }}
                autoFocus
              />
              {pwError && (
                <p
                  className="footnote"
                  style={{
                    color: "#ef4444",
                    marginTop: "0.35rem",
                    fontSize: "0.9rem",
                  }}
                >
                  비밀번호가 올바르지 않습니다.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{
                justifyContent: "center",
                padding: "1rem",
                fontSize: "1.1rem",
              }}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 사이트 점검(/check) 리드는 source 로 구분해 일반 문의와 따로 관리한다
  const generalI = inquiries.filter((i) => i.source !== "auto-diagnosis");
  const checkI = inquiries.filter((i) => i.source === "auto-diagnosis");
  const pendingC = checkI.filter((c) => c.status === "pending").length;
  const pendingI = generalI.filter((i) => i.status === "pending").length;
  const filteredC = filterRows(withinPeriod(checkI, listPeriod));
  const filteredI = filterRows(withinPeriod(generalI, listPeriod));

  return (
    <div
      className="admin-wrap"
      style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}
    >
      {/* ── 데스크탑 사이드바 ── */}
      <aside
        className="admin-sidebar"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "1.75rem 1.4rem 0" }}>
          <button
            onClick={() => setTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.35rem",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            title="전체 현황으로"
          >
            <Image
              src="/logo.png"
              alt="WEFLOW"
              width={32}
              height={32}
              style={{ width: 32, height: 32 }}
            />
            <span
              className="emphasized"
              style={{ color: "var(--text)", fontSize: "1.42rem" }}
            >
              WEFLOW
            </span>
          </button>
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "1.02rem",
              fontWeight: 500,
            }}
          >
            관리자
          </p>
        </div>
        <nav
          style={{
            padding: "1.1rem 0.85rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            flex: 1,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? "var(--accent)" : "none",
                color: tab === t.key ? "var(--on-accent)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "12px",
                padding: "0.85rem 1.1rem",
                fontSize: "1.12rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all 0.15s",
                width: "100%",
              }}
            >
              {t.label}
            </button>
          ))}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.55rem 0.25rem",
                fontSize: "1.02rem",
              }}
              className="semibold"
            >
              <ArrowLeft size={18} /> 사이트로 돌아가기
            </Link>
            <button
              onClick={handleLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0.55rem 0.25rem",
                fontSize: "1.02rem",
              }}
              className="semibold"
            >
              <LogOut size={18} /> 로그아웃
            </button>
          </div>
        </nav>
      </aside>

      {/* ── 모바일 상단 헤더 ── */}
      <header
        className="admin-mobile-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setTab("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Image
              src="/logo.png"
              alt="WEFLOW"
              width={26}
              height={26}
              style={{ width: 26, height: 26 }}
            />
            <span
              className="subhead emphasized"
              style={{ color: "var(--text)" }}
            >
              WEFLOW
            </span>
          </button>
          <span
            className="caption-1 medium"
            style={{ color: "var(--text-muted)" }}
          >
            관리자
          </span>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "0.5rem",
          }}
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── 모바일 오버레이 ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className="admin-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.6)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.28s ease",
          display: "none",
        }}
      />

      {/* ── 모바일 왼쪽 드로어 ── */}
      <div
        className="admin-drawer"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 201,
          width: "min(260px, 80vw)",
          background: "var(--surface)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
          display: "none",
          flexDirection: "column",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* 드로어 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.25rem",
            height: "72px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => {
                setTab("overview");
                setMenuOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Image
                src="/logo.png"
                alt="WEFLOW"
                width={26}
                height={26}
                style={{ width: 26, height: 26 }}
              />
              <span
                className="subhead emphasized"
                style={{ color: "var(--text)" }}
              >
                WEFLOW
              </span>
            </button>
            <span
              className="caption-1 medium"
              style={{ color: "var(--text-muted)" }}
            >
              관리자
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "0.4rem",
            }}
          >
            <X size={20} />
          </button>
        </div>
        {/* 드로어 내비 */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: tab === t.key ? "var(--accent)" : "transparent",
                color: tab === t.key ? "var(--on-accent)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "10px",
                padding: "0.75rem 1rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                borderLeft: tab === t.key ? "none" : "3px solid transparent",
                transition: "all 0.15s",
                marginBottom: "0.15rem",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {/* 드로어 하단 */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "0.4rem 0",
            }}
          >
            <ArrowLeft size={16} /> 사이트로 돌아가기
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "none",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: "0.4rem 0",
            }}
          >
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </div>

      {/* 메인 */}
      <main
        className="admin-main"
        style={{
          flex: 1,
          padding: "clamp(1.75rem, 3vw, 2.75rem) clamp(1.5rem, 3vw, 2.75rem)",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.75rem, 3vw, 2.5rem)",
          }}
        >
          {/* 헤더 */}
          <div>
            <p
              className="footnote emphasized c-accent"
              style={{ margin: "0 0 0.5rem", letterSpacing: "0.02em" }}
            >
              관리자 대시보드
            </p>
            <h1
              className="admin-page-title emphasized"
              style={{
                color: "var(--text)",
                margin: "0 0 1.5rem",
                fontSize: "clamp(1.9rem, 4vw, 2.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {TABS.find((t) => t.key === tab)?.label}
            </h1>
            {tab !== "analytics" && tab !== "traffic" && (
              <div
                style={{ display: "grid", gap: "1rem" }}
                className={tab === "overview" ? "stat-grid-4" : "stat-grid-2"}
              >
                {tab !== "checks" && (
                  <>
                    <StatCard
                      label="전체 문의"
                      value={generalI.length}
                      color="blue"
                    />
                    <StatCard
                      label="대기중 문의"
                      value={pendingI}
                      color="green"
                    />
                  </>
                )}
                {tab !== "inquiries" && (
                  <>
                    <StatCard
                      label="전체 사이트 점검"
                      value={checkI.length}
                      color="blue"
                    />
                    <StatCard
                      label="대기중 사이트 점검"
                      value={pendingC}
                      color="green"
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* 통계 탭 */}
          {tab === "analytics" && (
            <AnalyticsView checks={checkI} inquiries={generalI} />
          )}

          {/* 유입 통계 탭 */}
          {tab === "traffic" && (
            <TrafficView pageViews={pageViews} loading={pvLoading} />
          )}

          {/* 필터 + 새로고침 */}
          {tab !== "analytics" && tab !== "traffic" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                }}
              >
                <PeriodSelect value={listPeriod} onChange={setListPeriod} />
                <div
                  style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={
                        filter === f
                          ? "admin-filter-btn admin-filter-btn-active"
                          : "admin-filter-btn"
                      }
                      style={{
                        background: filter === f ? "var(--accent)" : "var(--surface)",
                        color: filter === f ? "var(--on-accent)" : "var(--text-secondary)",
                        border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "999px",
                        padding: "0.45rem 1.1rem",
                        fontSize: "0.92rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => load()}
                disabled={loading}
                className="admin-refresh-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "999px",
                  padding: "0.45rem 1.1rem",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <RefreshCw size={14} className={loading ? "spin" : ""} />
                <span className="refresh-label">새로고침</span>
              </button>
            </div>
          )}

          {/* 테이블 */}
          {tab !== "checks" &&
            tab !== "analytics" &&
            tab !== "traffic" && (
              <RequestTable
                title={tab === "overview" ? "문의 관리" : undefined}
                rows={filteredI}
                onStatusChange={(id, s) =>
                  updateStatus("/api/inquiries", id, s, setInquiries)
                }
                onDelete={(id) => remove("/api/inquiries", id, setInquiries)}
                onExport={() =>
                  window.open("/api/export?type=inquiries", "_blank")
                }
                onSeeAll={
                  tab === "overview" ? () => setTab("inquiries") : undefined
                }
              />
            )}
          {/* 사이트 점검 리드 — 같은 inquiries 테이블을 쓰므로 상태 변경·삭제도 같은 API 로 간다 */}
          {tab !== "inquiries" && tab !== "analytics" && tab !== "traffic" && (
            <RequestTable
              title={tab === "overview" ? "사이트 점검" : undefined}
              rows={filteredC}
              onStatusChange={(id, s) =>
                updateStatus("/api/inquiries", id, s, setInquiries)
              }
              onDelete={(id) => remove("/api/inquiries", id, setInquiries)}
              onExport={() =>
                window.open("/api/export?type=inquiries", "_blank")
              }
              onSeeAll={
                tab === "overview" ? () => setTab("checks") : undefined
              }
            />
          )}
        </div>
      </main>

      <style>{`
        .admin-wrap { display: flex; flex-direction: row; }
        .admin-sidebar { width: 264px; position: sticky; top: 0; align-self: flex-start; height: 100vh; overflow-y: auto; }
        .admin-stat-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .admin-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.45); }
        .admin-row td { transition: background 0.12s ease; }
        .admin-row:hover td { background: var(--bg-secondary); }
        .stat-grid-4 { grid-template-columns: repeat(4, 1fr); }
        .stat-grid-2 { grid-template-columns: repeat(4, 1fr); }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .detail-dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.95rem; }
        .analytics-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        /* 광고 기기 카드 — 두 칸 그리드를 가로로 꽉 채우고 안은 전체·광고별·키워드별 3열 */
        .analytics-2col .ad-dev-card { grid-column: 1 / -1; }
        .ad-dev-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .ad-dev-col { min-width: 0; }
        /* 왼쪽 칸에서 전체 아래에 붙는 광고별 — 가로선으로 나눈다 */
        .ad-dev-sub { margin-top: 1.1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
        .ad-dev-col + .ad-dev-col { border-left: 1px solid var(--border); padding-left: 1.5rem; }
        @media (max-width: 900px) {
          .ad-dev-grid { grid-template-columns: 1fr; gap: 1.1rem; }
          .ad-dev-col + .ad-dev-col { border-left: none; padding-left: 0; border-top: 1px solid var(--border); padding-top: 1rem; }
        }
        @media (max-width: 900px) {
          .analytics-2col { grid-template-columns: 1fr; }
          /* 모바일: 기기 카드를 광고 카드들 뒤로 — 유입 경로 → 키워드 → 광고 이탈 → 기기 순 */
          .analytics-2col .dev-card { order: 1; }
          .analytics-2col .ad-dev-card { order: 2; }
        }
        .traffic-metric-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .traffic-metric-grid { grid-template-columns: repeat(2, 1fr); } }
        /* 320px급 초소형 화면 — 2열이면 큰 숫자가 카드를 밀어내 가로로 넘친다 */
        @media (max-width: 359px) { .traffic-metric-grid { grid-template-columns: 1fr; } }

        @media (max-width: 768px) {
          .admin-wrap { flex-direction: column; }
          .admin-sidebar { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-overlay { display: block !important; }
          .admin-drawer { display: flex !important; }
          .stat-grid-4, .stat-grid-2 { grid-template-columns: repeat(2, 1fr); }
          .admin-main { padding: 1.25rem 1rem 5rem !important; }
          .refresh-label { display: none; }
          .admin-refresh-btn { padding: 0.35rem 0.6rem !important; }
        }

        @media (max-width: 480px) {
          .stat-grid-2 { grid-template-columns: repeat(2, 1fr); max-width: 100%; }
          .detail-dl { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
