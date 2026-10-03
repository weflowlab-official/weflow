import { MessageCircle, PenLine, Users, PencilRuler, Workflow, Wrench } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { LucideIcon } from "lucide-react";

// WEFLOW의 일하는 방식 6가지 — 상담(듣기) → 기획·설계 → 동선 → 워딩 → 전담 케어 → 운영 순.
// 회사 소개에 따로 있던 "WEFLOW가 일하는 방식" 3장을 여기로 합쳤다.
// 메인의 일하는 방식 카드(HomeCardSections)도 같은 목록을 쓴다
export const POINTS: { Icon: LucideIcon; title: string; desc: string; img: string }[] =
  [
    {
      Icon: MessageCircle,
      title: "소통",
      desc: "제작 전 충분한 상담으로 고객이 진짜 원하는 것을 먼저 듣고 시작합니다.",
      img: "/images/main/main-listen-01.webp",
    },
    {
      Icon: PencilRuler,
      title: "직접 기획·설계",
      desc: "템플릿에 맞추지 않고, 목표부터 구조까지 직접 기획합니다.",
      img: "/images/about/about6.webp",
    },
    {
      Icon: Workflow,
      title: "맞춤형 플로우",
      desc: "업종과 고객 흐름에 맞춰 문의로 이어지는 동선을 설계합니다.",
      img: "/images/about/about7.webp",
    },
    {
      Icon: PenLine,
      title: "맞춤형 워딩",
      desc: "업종과 브랜드 톤에 맞춰, 문구 하나까지 직접 다듬습니다.",
      img: "/images/main/main-listen-02.webp",
    },
    {
      Icon: Users,
      title: "1:1 맞춤 시스템",
      desc: "담당자 한 명이 1:1 케어로 처음부터 끝까지 관리해, 디테일까지 챙깁니다.",
      img: "/images/main/main-listen-03.webp",
    },
    {
      Icon: Wrench,
      title: "지속 가능한 운영",
      desc: "제작 이후에도 장애 대응과 유지보수를 끝까지 책임집니다.",
      img: "/images/about/about8.webp",
    },
  ];

/** 한 줄 소개 섹션 — "고객의 소리에 귀 기울이는 WEFLOW", 일하는 방식 3가지를 카드로 */
export default function ListeningSection() {
  return (
    <section
      style={{
        background: "var(--section-b)",
        padding: "clamp(3rem, 6vw, 4.5rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        {/* 헤더 (좌측 정렬) */}
        <Reveal variant="up" style={{ marginBottom: "clamp(1.75rem, 4vw, 2.5rem)" }}>
          <span className="footnote emphasized c-accent">한 줄 소개</span>
          <h2
            className="title-1"
            style={{ marginTop: "0.75rem", textAlign: "left" }}
          >
            고객의 소리에 <span className="c-accent">귀 기울이는</span> WEFLOW
          </h2>
          <p
            className="body c-muted"
            style={{
              margin: "1rem 0 0",
              maxWidth: "640px",
              wordBreak: "keep-all",
            }}
          >
            WEFLOW의 일하는 방식
          </p>
        </Reveal>

        {/* 3개 카드 (각 카드에 이미지) */}
        <Reveal as="div" stagger className="listen-list">
          {POINTS.map(({ Icon, title, desc, img }) => (
            <div key={title} className="listen-card">
              <span className="listen-card-icon">
                <Icon size={22} strokeWidth={2} />
              </span>
              <h3 className="headline" style={{ margin: "0.9rem 0 0.35rem" }}>
                {title}
              </h3>
              <p
                className="callout"
                style={{ margin: 0, wordBreak: "keep-all" }}
              >
                {desc}
              </p>
              <div className="listen-card-img">
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width: 860px) 100vw, 340px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        .listen-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
        .listen-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: 1.5rem 1.6rem;
        }
        .listen-card-icon {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          border-radius: var(--radius-xl);
          background: var(--accent-light);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .listen-card-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 4 / 3;
          margin-top: 1.25rem;
          border-radius: var(--radius-xl);
          background: var(--surface-container);
          border: 1px solid var(--border);
        }
        /* 6장이라 태블릿에서는 2열로 한 번 접고, 모바일에서만 1열로 내린다 */
        @media (max-width: 860px) {
          .listen-list { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .listen-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
