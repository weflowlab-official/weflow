"use client";
import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { FileEdit, Camera, PlaySquare, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";

// 제휴 마케팅 운영 항목 6가지 — 카드 그리드를 채우는 데이터
const AD_SERVICES: { Icon: LucideIcon; title: string; desc: string }[] = [
  { Icon: FileEdit, title: "블로그 업로드", desc: "네이버 블로그 정기 업로드" },
  { Icon: Camera, title: "인스타 업로드", desc: "인스타그램·메타 광고 정기 업로드" },
  { Icon: PlaySquare, title: "유튜브 숏폼", desc: "유튜브 숏폼 제작·업로드 운영" },
  { Icon: MapPin, title: "네이버 플레이스", desc: "지역 검색·지도 노출 등록·관리" },
];

// 운영 항목 카드 한 장 (마우스를 올리면 배경·아이콘 색이 강조된다)
function AdCard({
  Icon,
  title,
  desc,
  img,
}: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  img?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--accent-light)" : "var(--surface)",
        border: hovered
          ? "1.5px solid var(--accent)"
          : "1.5px solid var(--border)",
        borderRadius: "10px",
        padding: "1.25rem",
        cursor: "default",
        transition: "all 0.18s",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          background: hovered ? "var(--accent)" : "var(--accent-light)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.85rem",
          transition: "background 0.18s",
        }}
      >
        <Icon
          size={20}
          color={hovered ? "var(--on-accent)" : "var(--accent)"}
          strokeWidth={2}
        />
      </div>
      <h4
        className="headline c-primary"
        style={{ margin: "0 0 0.4rem", wordBreak: "keep-all" }}
      >
        {title}
      </h4>
      <p className="callout c-muted" style={{ margin: 0, wordBreak: "keep-all" }}>
        {desc}
      </p>
      <div className="ad-card-img">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="ad-img-ph">이미지</span>
        )}
      </div>
    </div>
  );
}

/** 서비스 페이지 "제휴 마케팅 업체 연결" 섹션 — 제작 후 운영 지원 항목을 카드로 보여준다 (한 화면 높이·스크롤 스냅) */
export default function AdManagement() {
  return (
    <section
      style={{
        padding: "3.5rem 1.5rem",
        background: "var(--section-a)",
        scrollSnapAlign: "start",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        {/* 헤더 */}
        <Reveal
          variant="up"
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <p
            className="caption-1 emphasized c-accent"
            style={{
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            AD MANAGEMENT
          </p>
          <h2 className="title-1 ad-title" style={{ margin: "0 0 0.5rem" }}>
            제휴 마케팅 업체 연결
          </h2>
          <p className="body c-muted" style={{ margin: 0 }}>
            제작 후에도 꾸준히 성장할 수 있도록{" "}
            <br className="br-mobile" />
            전방위 운영을 지원합니다
          </p>
        </Reveal>

        {/* 카드 그리드 */}
        <Reveal as="div" stagger className="ad-grid">
          {AD_SERVICES.map(({ Icon, title, desc }, i) => (
            <AdCard
              key={title}
              Icon={Icon}
              title={title}
              desc={desc}
              img={`/images/service/service${i + 18}.webp`}
            />
          ))}
        </Reveal>

        {/* 안내 문구 */}
        <Reveal
          variant="up"
          style={{
            marginTop: "2rem",
            padding: "1rem 1.25rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p className="footnote c-muted" style={{ margin: 0 }}>
            플랜에 따라 운영 항목이 달라집니다.
            <br className="br-mobile" />
            <span className="c-accent semibold"> 맞춤 견적</span>을 통해
            운영 플랜을 확인하세요.
          </p>
        </Reveal>
      </div>

      <style>{`
        .ad-title { font-size: clamp(2rem, 4.5vw, 3rem); }
        .ad-card-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 16 / 9;
          margin-top: 0.9rem;
          border-radius: 8px;
          background: var(--surface-container);
          border: 1px solid var(--border);
        }
        .ad-img-ph {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        /* 카드 4장 — 2×2 로 배치 (3열이면 마지막 한 장이 혼자 남는다) */
        .ad-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.9rem;
        }
        @media (max-width: 480px) {
          .ad-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
