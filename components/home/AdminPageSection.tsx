import Reveal from "@/components/Reveal";
import Image from "next/image";
import { Database, Route, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const POINTS: { Icon: LucideIcon; label: string; desc: string }[] = [
  {
    Icon: Database,
    label: "확실한 고객 DB 확보",
    desc: "니즈까지 명확한 고객 유입",
  },
  { Icon: Route, label: "유입 경로 확인", desc: "채널/광고 유입 경로 파악" },
  {
    Icon: BarChart3,
    label: "통계로 유입되는 DB",
    desc: "통계적 관리를 통한 순차적 유입",
  },
];

export default function AdminPageSection() {
  return (
    <section
      id="admin"
      style={{
        background: "var(--section-b)",
        padding: "clamp(2.25rem, 5vw, 4rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto", width: "100%" }}>
        {/* 헤더 */}
        <Reveal variant="up" style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
          <span className="footnote emphasized c-accent">
            04 · 관리자 페이지란
          </span>
          <h2
            className="title-1"
            style={{
              marginTop: "0.75rem",
              textAlign: "left",
              wordBreak: "keep-all",
            }}
          >
            관리자 페이지가 <span className="c-accent">무엇</span>인가요?
          </h2>
        </Reveal>

        {/* 좌 텍스트 · 우 이미지 */}
        <div className="aps-split">
          {/* 왼쪽 */}
          <Reveal as="div" variant="left" className="aps-text">
            {/* 한 줄 정의 (인용) */}
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
                한마디로
              </span>
              <p
                className="callout"
                style={{ margin: "0.4rem 0 0", wordBreak: "keep-all" }}
              >
                “홈페이지로 들어온 고객 정보와 활동을 한곳에서 관리하는 나만의
                데이터 관제 센터”
              </p>
            </div>

            {/* 쉬운 풀이 */}
            <span className="footnote emphasized c-accent">쉽게 말하면</span>
            <p
              className="body"
              style={{ margin: "0.5rem 0 1.75rem", wordBreak: "keep-all" }}
            >
              홈페이지를 보고 들어온 고객은{" "}
              <strong>진짜 DB에 들어올 확률</strong>이 높아요.
              <br />
              통계를 통해 <strong>관리자 DB를 확보</strong>하고, 흩어진 고객
              정보를 자산으로 쌓아갈 수 있습니다.
            </p>

            {/* 핵심 포인트 3개 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
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
          <Reveal as="div" variant="right" className="aps-img">
            <a
              className="aps-img-frame"
              href="https://weflow-adminpage.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="참고 관리자 페이지 새 탭으로 열기"
              style={{
                position: "relative",
                display: "block",
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
                src="/images/main/main-admin-01.webp"
                alt="관리자 페이지"
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                style={{ objectFit: "cover" }}
              />
            </a>

            {/* 곡선 화살표 + 캡션 */}
            <div className="aps-img-note">
              <svg
                className="aps-img-arrow"
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
              <p className="aps-img-note-text">
                위 이미지를 클릭하면 <strong>참고 링크</strong>로 이동합니다.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .aps-split {
          display: flex;
          align-items: center;
          gap: clamp(1.75rem, 4vw, 3.5rem);
        }
        .aps-text { flex: 1; min-width: 0; }
        .aps-img { flex: 1; min-width: 0; }

        /* 이미지 — 주기적으로 살짝 흔들려 클릭을 유도 */
        .aps-img-frame {
          transform-origin: 50% 62%;
          box-shadow: 0 10px 30px rgba(17, 17, 17, 0.14);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: apsImgWiggle 3.8s ease-in-out infinite;
        }
        .aps-img-frame:hover {
          animation: apsImgWiggleHover 0.45s ease-in-out infinite;
          box-shadow: 0 18px 44px rgba(106, 146, 215, 0.3);
        }
        @keyframes apsImgWiggle {
          0%, 70%, 100% { transform: rotate(0deg) translateY(0); }
          74% { transform: rotate(-1.3deg) translateY(-3px); }
          79% { transform: rotate(1.1deg) translateY(-1px); }
          84% { transform: rotate(-0.7deg) translateY(0); }
          89% { transform: rotate(0.4deg) translateY(0); }
          94% { transform: rotate(-0.15deg) translateY(0); }
        }
        /* hover 시 더 크고 빠르게 흔들림 */
        @keyframes apsImgWiggleHover {
          0%, 100% { transform: rotate(0deg) scale(1.02); }
          25% { transform: rotate(-2.4deg) scale(1.02); }
          75% { transform: rotate(2.4deg) scale(1.02); }
        }

        /* 곡선 화살표 + 캡션 */
        .aps-img-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          margin-top: 0.85rem;
        }
        .aps-img-arrow { flex-shrink: 0; }
        .aps-img-note-text {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.5;
          color: var(--text);
          word-break: keep-all;
        }
        .aps-img-note-text strong { color: var(--accent); }

        @media (max-width: 768px) {
          .aps-split { flex-direction: column; align-items: stretch; }
          .aps-img { max-width: 360px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aps-img-frame,
          .aps-img-frame:hover { animation: none; }
        }
      `}</style>
    </section>
  );
}
