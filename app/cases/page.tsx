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

const DESCRIPTION =
  "WEFLOW가 직접 제작한 홈페이지를 업종과 플랜별로 모았습니다. 완성 화면만이 아니라 어떤 요청을 어떻게 풀었는지까지 사례마다 정리했습니다.";

/**
 * og:image 는 여기서 지정하지 않는다 — 루트의 기본 이미지를 그대로 물려받는다.
 *
 * 사례 스크린샷 한 장을 써 봤지만 맞지 않았다. 그 그림은 고객사의 첫 화면이라,
 * 검색 결과나 카톡 미리보기에서 보면 위플로우가 아니라 그 고객사로 읽힌다.
 * 목록 페이지를 사례 하나가 대표하게 되는 것도 이상하고, 첫 사례가 바뀌면 대표 그림도 바뀐다.
 *
 * 네이버 가이드는 "사이트 전체에 반복되는 로고" 를 쓰지 않는 경우가 있다고 하니
 * 언젠가는 채워야 한다. 다만 그때는 사례를 모아 만든 전용 이미지여야 한다
 * (1200×630, 글씨·로고는 가운데 630×630 안에 — 네이버가 정사각으로 자른다).
 */

export const metadata: Metadata = {
  title: "제작 사례 · WEFLOW",
  // 짧으면 네이버가 버리고 본문을 긁어 온다 — 그대로 쓰이는 /difference(88자) 수준으로 맞춘다
  description: DESCRIPTION,
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "제작 사례 · WEFLOW",
    description: DESCRIPTION,
    url: "/cases",
    // openGraph 를 정의하면 루트(app/layout.tsx)의 것을 통째로 덮어쓴다.
    // 이미지를 여기 적지 않으면 카톡·네이버 미리보기에 그림이 아예 안 나온다.
    images: [{ url: "/images/og/cases.jpg", width: 1200, height: 630 }],
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
