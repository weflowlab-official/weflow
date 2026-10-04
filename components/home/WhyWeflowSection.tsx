import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import { X, PencilRuler, Workflow, ShieldCheck, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CTA_BTN, CTA_BTN_FILLED } from "@/lib/ctaButton";

// AI로만 만든 홈페이지의 한계 — 목업 이미지 옆 X 목록을 채운다
const AI_CONS = [
  "어디서 본 듯한 천편일률 템플릿",
  "맥락 없이 자동 생성된 어색한 문구",
  "문의(전환)를 고려하지 않은 구조",
  "운영·수정·검색 노출은 결국 내 몫",
];

// 위플로우의 차별점 — 하단 3카드 그리드를 채운다
const DIFFS: { Icon: LucideIcon; title: string; desc: string; img: string }[] = [
  {
    Icon: PencilRuler,
    title: "사람이 직접 기획·설계",
    desc: "템플릿이 아니라, 전문가가 목표부터 구조까지 전략을 세웁니다.",
    img: "/images/main/main-weflow-02.webp",
  },
  {
    Icon: Workflow,
    title: "고객만의 맞춤 플로우",
    desc: "업종·고객 흐름에 맞춰 방문자가 문의에 이르는 동선을 설계합니다.",
    img: "/images/main/main-weflow-03.webp",
  },
  {
    Icon: ShieldCheck,
    title: "신뢰감 있는 완성도",
    desc: "브랜드를 담은 디자인으로 고객이 믿고 연락하는 홈페이지를 만듭니다.",
    img: "/images/main/main-weflow-04.webp",
  },
];

/**
 * "왜 위플로우인가" 섹션 — AI로 직접 만들면 되지 않나? 라는 질문에서 출발해
 * AI 결과물의 한계 → 우리가 원한 홈페이지 → 위플로우의 차별점 3카드 → CTA 순으로 이어진다
 */
export default function WhyWeflowSection() {
  return (
    <section
      style={{
        background: "var(--section-a)",
        padding: "clamp(3rem, 7vw, 5.5rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        {/* Beat 1 — 질문 던지기 */}
        <Reveal
          variant="up"
          style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}
        >
          <span
            className="footnote emphasized c-accent"
            style={{ letterSpacing: "0.04em" }}
          >
            AI의 함정
          </span>
          <h2
            className="title-1"
            style={{ margin: "0.9rem 0 0", wordBreak: "keep-all" }}
          >
            “요즘 AI가 대세라던데,
            <br />
            그냥 내가 만들면 되지 않을까?”
          </h2>
          <p
            className="body c-muted"
            style={{
              margin: "1rem auto 0",
              maxWidth: "520px",
              wordBreak: "keep-all",
            }}
          >
            누구나 한 번쯤 하는 생각입니다.{" "}
            <br className="br-mobile" />
            그런데 막상 만들어 보면—
          </p>
        </Reveal>

        {/* Beat 2 — AI 결과물 + 단점 */}
        <div
          className="why-split"
          style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          {/* 이미지(브라우저 목업) 자리 — 추후 교체 */}
          <div
            style={{
              borderRadius: "var(--radius-2xl)",
              border: "1px solid var(--border)",
              overflow: "hidden",
              background: "var(--section-a)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.65rem 0.9rem",
                background: "var(--surface-container)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "9999px",
                  background: "#ff5f57",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "9999px",
                  background: "#febc2e",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "9999px",
                  background: "#28c840",
                }}
              />
            </div>
            <div
              style={{
                /* 사진 원본 비율(2816×1536)과 같게 — 다르면 cover 가 위아래를 잘라낸다 */
                aspectRatio: "2816 / 1536",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/main/main-ai-homepage.webp"
                alt="AI로만 만든 홈페이지 예시"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          {/* 단점 */}
          <div className="why-cons">
            <h3
              className="title-2 emphasized"
              style={{ margin: "0 0 0.85rem", wordBreak: "keep-all" }}
            >
              우리가 원했던 건 <span className="c-accent">이게 아니죠.</span>
            </h3>
            <p
              className="body c-muted"
              style={{
                margin: "0 0 1.5rem",
                wordBreak: "keep-all",
                fontSize: "clamp(1.05rem, 2.4vw, 1.2rem)",
              }}
            >
              AI가 뚝딱 만들어 준 결과물엔,{" "}
              <br className="br-mobile" />
              이런 한계가 반복됩니다.
            </p>
            <ul
              style={{
                listStyle: "none",
                // 모바일에서 폭이 fit-content 로 줄 때 덩어리째 가운데 오도록 auto.
                // 데스크탑에서는 폭이 꽉 차 있어 auto 여도 달라지는 게 없다.
                margin: "0 auto",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.05rem",
              }}
            >
              {AI_CONS.map((t) => (
                <li
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 26,
                      height: 26,
                      borderRadius: "9999px",
                      background: "rgba(239,68,68,0.16)",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "1px",
                    }}
                  >
                    <X size={15} strokeWidth={2.5} />
                  </span>
                  <span
                    className="body c-secondary"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Beat 3 — 전환점 (핵심 강조) */}
        <Reveal
          variant="fade"
          style={{
            textAlign: "center",
            maxWidth: "820px",
            margin: "clamp(8rem, 17vw, 13rem) auto",
          }}
        >
          <h2
            className="title-1"
            style={{ margin: 0, wordBreak: "keep-all", lineHeight: 1.35 }}
          >
            우리가 원한 건 <br className="wf-br-m" />
            <span
              className="c-accent emphasized hl"
              style={{ transitionDelay: "0.35s" }}
            >
              홈페이지 다운 홈페이지
            </span>
            ,
            <br />
            고객이{" "}
            <span
              className="c-accent emphasized hl"
              style={{ transitionDelay: "0.75s" }}
            >
              신뢰할 수 있는
            </span>{" "}
            <br className="wf-br-m" />
            홈페이지였습니다.
          </h2>
          {/* 결과물 예시 2장 — 원본 비율(약 1.8:1)에 맞춰 잘리지 않게 둔다 */}
          <div className="wf-shots">
            {[
              { src: "/images/main/main-weflow-01.webp", alt: "홈페이지다운 홈페이지 예시 1" },
              { src: "/images/main/main-weflow-05.webp", alt: "홈페이지다운 홈페이지 예시 2" },
            ].map(({ src, alt }) => (
              <div key={src} className="wf-shot">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Beat 4 — 그래서 위플로우 */}
        <div style={{ marginTop: 0 }}>
          <SplitText
            as="p"
            className="title-1 emphasized"
            style={{ textAlign: "center", margin: "0 0 1rem" }}
            segments={[
              { text: "그래서, " },
              { text: "WEFLOW", className: "c-accent" },
              { text: "입니다." },
            ]}
          />
          <p
            className="body c-muted"
            style={{
              textAlign: "center",
              maxWidth: "620px",
              margin: "0 auto clamp(2.5rem, 6vw, 3.5rem)",
              wordBreak: "keep-all",
              fontSize: "clamp(1.05rem, 2.4vw, 1.25rem)",
            }}
          >
            AI가 채우지 못한 자리를, 사람이 전략으로 채웁니다.
          </p>

          {/* 차별점 3카드 */}
          <div className="why-diffs" style={{ marginTop: "1.1rem" }}>
            {DIFFS.map(({ Icon, title, desc, img }) => (
              <div
                key={title}
                style={{
                  background: "var(--section-a)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-2xl)",
                  padding: "1.6rem",
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "var(--radius-xl)",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon size={22} strokeWidth={2} />
                </span>
                <h3
                  className="headline"
                  style={{ margin: "0 0 0.4rem", wordBreak: "keep-all" }}
                >
                  {title}
                </h3>
                <p
                  className="callout"
                  style={{ margin: 0, wordBreak: "keep-all" }}
                >
                  {desc}
                </p>
                <div className="why-diff-img">
                  <Image
                    src={img}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beat 5 — 마무리 + CTA */}
        <div
          style={{ textAlign: "center", marginTop: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          <p
            className="title-2"
            style={{ margin: "0 0 1.5rem", wordBreak: "keep-all" }}
          >
            보기 좋은 페이지가 아니라,{" "}
            <br className="br-mobile" />
            <span className="c-accent emphasized">성과를 내는 페이지</span>.
          </p>
          <div style={{ display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="tel:010-2971-7280"
              className="btn-gold"
              style={CTA_BTN}
            >
              <span className="btn-gold__label">전화 상담하기</span> <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link
              href="/diagnosis"
              className="btn-gold btn-gold--fill"
              style={CTA_BTN}
            >
              <span className="btn-gold__label">맞춤 견적 받기</span> <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .why-split {
          display: grid;
          /* 사진 칸을 글보다 조금 좁게 — 비율을 유지한 채 사진만 작아진다 */
          grid-template-columns: 1.05fr 0.95fr;
          /* 사진 + 문구를 한 덩어리로 보고 가운데에 모은다 */
          max-width: 1080px;
          margin-inline: auto;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: center;
        }
        .wf-shots {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: clamp(2rem, 5vw, 3rem);
        }
        .wf-shot {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1024 / 572;
          border-radius: var(--radius-2xl);
          background: var(--surface-container);
          border: 1px solid var(--border);
        }
        /* 좁은 화면에서도 두 장을 나란히 — 폰에서만 세로로 쌓는다 */
        @media (max-width: 480px) {
          .wf-shots { grid-template-columns: 1fr; }
        }
        .why-diffs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.1rem;
        }
        .why-diff-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 4 / 3;
          margin-top: 1.25rem;
          border-radius: var(--radius-xl);
          background: var(--surface-container);
          border: 1px solid var(--border);
        }
        .wf-br-m { display: none; }
        @media (max-width: 768px) {
          .why-split, .why-diffs { grid-template-columns: 1fr; }
          /* 한 단으로 쌓이면 섹션 나머지와 같이 가운데로 —
             목록은 가장 긴 줄 기준으로 덩어리째 가운데 두고 줄끼리는 왼쪽에 맞춘다.
             (그래야 X 표시가 세로로 한 줄에 선다) */
          .why-cons { text-align: center; }
          .why-cons ul {
            width: fit-content;
            text-align: left;
          }
        }
        @media (max-width: 600px) {
          .wf-br-m { display: inline; }
        }
      `}</style>
    </section>
  );
}
