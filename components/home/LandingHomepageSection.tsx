import Reveal from "@/components/Reveal";
import Image from "next/image";
import { Rows3, Anchor, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// 랜딩형 홈페이지의 특징 — 왼쪽 아이콘 목록을 채운다
const POINTS: { Icon: LucideIcon; label: string; desc: string }[] = [
  {
    Icon: Rows3,
    label: "원페이지 구성",
    desc: "한 페이지 안에 모든 섹션 포함",
  },
  {
    Icon: Anchor,
    label: "헤더 앵커 이동",
    desc: "메뉴 클릭 시 해당 섹션 스크롤",
  },
  { Icon: Target, label: "전환 집중", desc: "이탈없이 자연스러운 문의" },
];

/**
 * "03 · 랜딩형 홈페이지란" 섹션 — 랜딩형이 무엇인지 정의·특징으로 설명한다
 * 오른쪽 이미지를 누르면 참고용 랜딩형 사이트가 새 탭으로 열린다
 */
export default function LandingHomepageSection() {
  return (
    <section
      id="landing-home"
      style={{
        background: "var(--section-b)",
        padding: "clamp(2.25rem, 5vw, 4rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto", width: "100%" }}>
        {/* 헤더 */}
        <Reveal variant="up" style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
          <span className="footnote emphasized c-accent">
            03 · 랜딩형 홈페이지란
          </span>
          <h2
            className="title-1"
            style={{
              marginTop: "0.75rem",
              textAlign: "left",
              wordBreak: "keep-all",
            }}
          >
            랜딩형 홈페이지가 <span className="c-accent">무엇</span>인가요?
          </h2>
        </Reveal>

        {/* 좌 텍스트 · 우 이미지 */}
        <div className="lhd-split">
          {/* 왼쪽 */}
          <Reveal as="div" variant="left" className="lhd-text">
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
                “홈페이지의 신뢰감과 랜딩페이지의 집중력을 합친 형태”
              </p>
            </div>

            {/* 쉬운 풀이 */}
            <span className="footnote emphasized c-accent">쉽게 말하면</span>
            <p
              className="body"
              style={{ margin: "0.5rem 0 1.75rem", wordBreak: "keep-all" }}
            >
              여러 페이지로 흩어지지 않고,{" "}
              <strong>한 페이지 안에 모든 섹션</strong>을 담은 홈페이지예요.
              <br />
              상단 메뉴를 누르면 해당 섹션으로 이동하며, 소개부터 문의까지 한
              흐름으로 이어집니다.
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

          {/* 오른쪽 이미지 — 원본 비율 그대로(자르지 않음) */}
          <Reveal as="div" variant="right" className="lhd-img">
            <a
              className="lhd-img-frame"
              href="https://weflow-landinghomepage.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="참고 랜딩형 홈페이지 새 탭으로 열기"
            >
              <Image
                src="/images/main/main-landing-home-01.webp"
                alt="랜딩형 홈페이지란"
                width={751}
                height={820}
                sizes="(max-width: 768px) 100vw, 370px"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </a>

            {/* 곡선 화살표 + 캡션 */}
            <div className="lhd-img-note">
              <svg
                className="lhd-img-arrow"
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
              <p className="lhd-img-note-text">
                위 이미지를 클릭하면 <strong>참고 링크</strong>로 이동합니다.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .lhd-split {
          display: flex;
          align-items: flex-start;
          gap: clamp(1.75rem, 4vw, 3.5rem);
        }
        .lhd-text { flex: 1; min-width: 0; }
        .lhd-img { flex: 1; min-width: 0; margin-top: -1.25rem; }

        /* 이미지 — 클릭 가능 · 주기적으로 살짝 흔들려 클릭을 유도 */
        .lhd-img-frame {
          display: block;
          width: 100%;
          max-width: 370px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          cursor: pointer;
          transform-origin: 50% 62%;
          box-shadow: 0 10px 30px rgba(17, 17, 17, 0.14);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: lhdImgWiggle 3.8s ease-in-out infinite;
        }
        .lhd-img-frame:hover {
          animation: lhdImgWiggleHover 0.45s ease-in-out infinite;
          box-shadow: 0 18px 44px rgba(106, 146, 215, 0.3);
        }
        @keyframes lhdImgWiggle {
          0%, 70%, 100% { transform: rotate(0deg) translateY(0); }
          74% { transform: rotate(-1.3deg) translateY(-3px); }
          79% { transform: rotate(1.1deg) translateY(-1px); }
          84% { transform: rotate(-0.7deg) translateY(0); }
          89% { transform: rotate(0.4deg) translateY(0); }
          94% { transform: rotate(-0.15deg) translateY(0); }
        }
        /* hover 시 더 크고 빠르게 흔들림 */
        @keyframes lhdImgWiggleHover {
          0%, 100% { transform: rotate(0deg) scale(1.02); }
          25% { transform: rotate(-2.4deg) scale(1.02); }
          75% { transform: rotate(2.4deg) scale(1.02); }
        }

        /* 곡선 화살표 + 캡션 */
        .lhd-img-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          margin-top: 0.85rem;
        }
        .lhd-img-arrow { flex-shrink: 0; }
        .lhd-img-note-text {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.5;
          color: var(--text);
          word-break: keep-all;
        }
        .lhd-img-note-text strong { color: var(--accent); }

        @media (max-width: 768px) {
          .lhd-split { flex-direction: column; align-items: stretch; }
          .lhd-img { max-width: 360px; margin-top: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lhd-img-frame,
          .lhd-img-frame:hover { animation: none; }
        }
      `}</style>
    </section>
  );
}
