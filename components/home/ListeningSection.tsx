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

/**
 * 일하는 방식 섹션 (회사소개 탭) — "고객의 소리에 귀 기울이는 WEFLOW", 여섯 가지를 사진 카드로.
 * 메인의 솔루션 카드 섹션과 같은 형식이다 — 검은 바탕, 영문 머리표 + 굵은 제목, 테두리 없는 카드.
 */
export default function ListeningSection() {
  return (
    <section className="listen-section">
      <div className="listen-inner">
        <Reveal as="header" variant="up" className="listen-head">
          <p className="listen-eyebrow">HOW WE WORK</p>
          <h2 className="listen-title">
            고객의 소리에 <span>귀 기울이는</span> WEFLOW
          </h2>
          <p className="listen-lead">WEFLOW의 일하는 방식</p>
        </Reveal>

        {/* 카드 여섯 장 — 사진이 위를 채우고, 아이콘 타일이 사진 아랫변에 반쯤 걸친다 */}
        <Reveal as="div" stagger className="listen-list">
          {POINTS.map(({ Icon, title, desc, img }) => (
            <div key={title} className="listen-card">
              <div className="listen-card-img">
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width: 860px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="listen-card-icon">
                <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="listen-card-body">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        /* 회사소개 탭의 다른 섹션(.ab-section)과 같은 규격 — 흰 섹션 사이에 검은 바탕으로 들어가 구분을 만든다 */
        .listen-section {
          background: #0e0e10;
          color: #fff;
          padding: clamp(4.5rem, 10vw, 8.5rem) 1.5rem;
        }
        .listen-inner { max-width: 1120px; margin: 0 auto; }

        .listen-head { text-align: center; margin-bottom: clamp(2.5rem, 6vw, 4.5rem); }
        .listen-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .listen-title {
          margin: 0;
          color: #fff;
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .listen-title span { color: #3f8fe0; }
        .listen-lead {
          margin: clamp(1.1rem, 2.4vw, 1.6rem) 0 0;
          font-size: clamp(0.98rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.66);
        }

        .listen-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
        }
        .listen-card {
          --listen-pad: clamp(1.4rem, 2.4vw, 2rem);
          border-radius: clamp(18px, 2.2vw, 28px);
          overflow: hidden;
          background: #1a1b1f;
        }
        .listen-card-img {
          position: relative;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: #24262b;
        }
        /* 마우스를 올리면 사진이 조금 다가온다 */
        .listen-card-img img { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .listen-card:hover .listen-card-img img { transform: scale(1.05); }
        /* 아이콘 — 흰 타일 위에 파란색으로. 카드에 마우스를 올리면 타일이 하늘색으로 채워지며 살짝 기운다 */
        .listen-card-icon {
          position: relative;
          z-index: 1;
          width: 56px;
          height: 56px;
          margin: -28px 0 0 var(--listen-pad);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #fff;
          color: #3f8fe0;
          box-shadow: 0 6px 16px rgba(17, 17, 17, 0.12);
          transition:
            background 0.25s,
            color 0.25s,
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .listen-card:hover .listen-card-icon { background: #a9d4ff; color: #12304f; transform: rotate(-6deg) scale(1.06); }
        .listen-card-body { padding: 1rem var(--listen-pad) var(--listen-pad); }
        .listen-card-body h3 {
          margin: 0;
          color: #fff;
          font-size: clamp(1.08rem, 1.6vw, 1.28rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          word-break: keep-all;
        }
        .listen-card-body p {
          margin: 0.6rem 0 0;
          font-size: clamp(0.92rem, 1.2vw, 1rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.66);
          word-break: keep-all;
        }
        /* 6장이라 태블릿에서는 2열로 한 번 접고, 모바일에서만 1열로 내린다 */
        @media (max-width: 860px) {
          .listen-section { padding-left: 1.25rem; padding-right: 1.25rem; }
          .listen-list { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .listen-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
