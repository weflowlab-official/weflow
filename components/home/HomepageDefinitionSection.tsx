"use client";

import Reveal from "@/components/Reveal";
import Image from "next/image";
import { Home, Clock, Search, Database, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// 홈페이지가 무엇인지 한 줄로 짚는 포인트 — 왼쪽 아이콘 목록을 채운다 (고객 DB 행 아래)
const POINTS: { Icon: LucideIcon; label: string; desc: string }[] = [
  { Icon: Home, label: "브랜드의 얼굴", desc: "방문자가 처음 마주하는 첫인상" },
  {
    Icon: Clock,
    label: "24시간 접점",
    desc: "잠든 사이에도 고객을 맞이하는 창구",
  },
  {
    Icon: Search,
    label: "검색의 목적지",
    desc: "궁금할 때 찾아오는 신뢰의 종착지",
  },
];

/**
 * "01 · 홈페이지의 정의" 섹션 — 홈페이지가 무엇인지 사전적 정의와 쉬운 풀이로 설명한다
 * 왼쪽은 정의·핵심 포인트, 오른쪽은 지금 보고 있는 홈페이지 이미지(클릭하면 맨 위로)
 */
export default function HomepageDefinitionSection() {
  return (
    <section
      id="homepage"
      style={{
        background: "var(--section-b)",
        // 위 여백은 두지 않는다 — 바로 위 도입부(PageIntro)의 아래 여백이 섹션 사이 간격을 맡는다
        // (혜택 안내 탭의 첫 섹션과 같은 방식. 여기서도 주면 간격이 그만큼 더 벌어진다)
        padding: "0 1.25rem clamp(2.25rem, 5vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto", width: "100%" }}>
        {/* 헤더 */}
        <Reveal variant="up" style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
          <span className="footnote emphasized c-accent">
            01 · 홈페이지의 정의
          </span>
          <h2
            className="title-1"
            style={{
              marginTop: "0.75rem",
              textAlign: "left",
              wordBreak: "keep-all",
            }}
          >
            홈페이지가 <span className="c-accent">무엇</span>인가요?
          </h2>
        </Reveal>

        {/* 좌 텍스트 · 우 이미지 */}
        <div className="def-split">
          {/* 왼쪽 */}
          <Reveal as="div" variant="left" className="def-text">
            {/* 사전적 정의 (인용) */}
            <div
              style={{
                width: "fit-content",
                maxWidth: "100%",
                borderLeft: "3px solid var(--accent)",
                background: "var(--surface)",
                borderRadius: "0 var(--radius-xl) var(--radius-xl) 0",
                padding: "0.75rem 1.1rem",
                marginBottom: "1.75rem",
              }}
            >
              <span
                className="caption-1 emphasized c-muted"
                style={{ letterSpacing: "0.02em" }}
              >
                사전적 정의
              </span>
              <p
                className="callout"
                style={{ margin: "0.4rem 0 0", wordBreak: "keep-all" }}
              >
                “인터넷에서 특정 개인·기업을 대표하는 시작 페이지”
              </p>
            </div>

            {/* 쉬운 풀이 */}
            <span className="footnote emphasized c-accent">쉽게 말하면</span>
            <p
              className="body"
              style={{ margin: "0.5rem 0 0.9rem", wordBreak: "keep-all" }}
            >
              온라인에 있는 우리 가게의{" "}
              <strong>대문이자 24시간 영업사원</strong>이에요.
              <br />
              방문자가 브랜드를 처음 만나고, 신뢰하고, 문의로 이어지는
              출발점입니다.
            </p>
            {/* 핵심 포인트 3개 (첫 행은 고객 DB 강조) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}
              >
                <span
                  style={{
                    width: "42px",
                    height: "42px",
                    flexShrink: 0,
                    borderRadius: "var(--radius-xl)",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Database size={20} strokeWidth={2} />
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className="headline"
                    style={{
                      margin: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.15rem",
                    }}
                  >
                    고객 DB{" "}
                    <ArrowUp
                      size={18}
                      strokeWidth={2.6}
                      color="var(--accent)"
                    />
                  </span>
                  <span
                    className="callout c-muted"
                    style={{ wordBreak: "keep-all" }}
                  >
                    명확한 고객 DB 유입량 증가
                  </span>
                </div>
              </div>
              {POINTS.map(({ Icon, label, desc }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.9rem",
                  }}
                >
                  <span
                    style={{
                      width: "42px",
                      height: "42px",
                      flexShrink: 0,
                      borderRadius: "var(--radius-xl)",
                      background: "var(--accent-light)",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className="headline" style={{ margin: 0 }}>
                      {label}
                    </span>
                    <span
                      className="callout c-muted"
                      style={{ wordBreak: "keep-all" }}
                    >
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* 오른쪽 이미지 */}
          <Reveal as="div" variant="right" className="def-img">
            <div
              className="def-img-frame"
              role="button"
              tabIndex={0}
              aria-label="페이지 상단으로 이동"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: "var(--radius-2xl)",
                overflow: "hidden",
                background: "var(--surface-container)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <Image
                src="/images/main/main-homepage-01.webp"
                alt="홈페이지란"
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* 곡선 화살표 + 캡션 */}
            <div className="def-img-note">
              <svg
                className="def-img-arrow"
                width="38"
                height="33"
                viewBox="0 0 64 56"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M56 29 C 32 41, 13 33, 17 13"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M8 22 L17 10 L28 20"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="def-img-note-text">
                위 이미지는 지금 보고 계신 <strong>홈페이지</strong>입니다.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .def-split {
          display: flex;
          align-items: center;
          gap: clamp(1.75rem, 4vw, 3.5rem);
        }
        .def-text { flex: 1; min-width: 0; }
        .def-img { flex: 1; min-width: 0; }

        /* 이미지 — 주기적으로 살짝 흔들려 클릭을 유도 */
        .def-img-frame {
          transform-origin: 50% 62%;
          box-shadow: 0 10px 30px rgba(17, 17, 17, 0.14);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: defImgWiggle 3.8s ease-in-out infinite;
        }
        .def-img-frame:hover {
          animation: defImgWiggleHover 0.45s ease-in-out infinite;
          box-shadow: 0 18px 44px rgba(106, 146, 215, 0.3);
        }
        @keyframes defImgWiggle {
          0%, 70%, 100% { transform: rotate(0deg) translateY(0); }
          74% { transform: rotate(-1.3deg) translateY(-3px); }
          79% { transform: rotate(1.1deg) translateY(-1px); }
          84% { transform: rotate(-0.7deg) translateY(0); }
          89% { transform: rotate(0.4deg) translateY(0); }
          94% { transform: rotate(-0.15deg) translateY(0); }
        }
        /* hover 시 더 크고 빠르게 흔들림 */
        @keyframes defImgWiggleHover {
          0%, 100% { transform: rotate(0deg) scale(1.02); }
          25% { transform: rotate(-2.4deg) scale(1.02); }
          75% { transform: rotate(2.4deg) scale(1.02); }
        }

        /* 곡선 화살표 + 캡션 */
        .def-img-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          margin-top: 0.85rem;
        }
        .def-img-arrow { flex-shrink: 0; }
        .def-img-note-text {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.5;
          color: var(--text);
          word-break: keep-all;
        }
        .def-img-note-text strong { color: var(--accent); }

        @media (max-width: 768px) {
          .def-split { flex-direction: column; align-items: stretch; }
          .def-img { max-width: 360px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .def-img-frame,
          .def-img-frame:hover { animation: none; }
        }
      `}</style>
    </section>
  );
}
