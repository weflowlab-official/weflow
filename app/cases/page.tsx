import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PortfolioShowcase from "@/components/cases/PortfolioShowcase";
import { CTA_BTN } from "@/lib/ctaButton";

/**
 * 제작 사례 페이지(/cases) — 실제 제작 사례만 보여준다.
 * 업종별 예시 사례(칩 필터 + 카드 그리드)는 실제 사례가 아니어서 걷어냈고,
 * 필터는 PortfolioShowcase가 자체적으로 갖고 있다.
 */

export const metadata: Metadata = {
  title: "제작 사례 · WEFLOW",
  description: "WEFLOW가 직접 제작한 홈페이지 사례를 업종별로 확인하세요.",
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "제작 사례 · WEFLOW",
    description: "WEFLOW가 직접 제작한 홈페이지 사례를 업종별로 확인하세요.",
    url: "/cases",
  },
};

/**
 * 주소의 ?cat=업종 을 서버에서 읽어 목록에 넘긴다.
 * 상세에서 뒤로 가거나 '← 제작 사례'로 돌아올 때, 첫 화면부터 그 업종 칩이 열린 채로 그려져
 * '전체'가 잠깐 보였다가 바뀌는 깜빡임이 없다. (이 페이지는 요청마다 서버에서 그린다)
 */
export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  return (
    <div>
      <section
        style={{
          background: "var(--section-a)",
          padding: "clamp(3rem, 7vw, 4.5rem) 1.5rem clamp(3rem, 6vw, 4rem)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            className="caption-2 emphasized c-accent"
            style={{
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            SUCCESS CASES
          </p>
          <h1 className="title-1" style={{ margin: "0 0 0.75rem" }}>
            제작 사례 포트폴리오
          </h1>
          <p
            className="callout c-muted"
            style={{
              margin: "0 0 2rem",
              maxWidth: "480px",
              wordBreak: "keep-all",
            }}
          >
            WEFLOW가 직접 제작한 사례입니다.
            <br />
            사례별로 어떤 고민이 있었고 어떻게 풀었는지 담았습니다.
          </p>

          {/* 실제 제작 사례 목록 */}
          <PortfolioShowcase initialCategory={cat} />

          {/* 마무리 CTA — 다른 탭과 같은 두 버튼 한 쌍 */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "clamp(2.5rem, 5vw, 3.5rem)",
            }}
          >
            <a href="tel:010-2971-7280" className="btn-gold" style={CTA_BTN}>
              <span className="btn-gold__label">전화 상담하기</span> <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link href="/diagnosis" className="btn-gold btn-gold--fill" style={CTA_BTN}>
              <span className="btn-gold__label">무료 상담 신청</span> <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
