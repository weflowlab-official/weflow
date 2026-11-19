// 블로그 메인(/blog). 헤더/푸터는 app/(blog)/layout.tsx 가 감싸고, 여기서는 본문 섹션만 순서대로 조립한다.
// 구성: 히어로(검색·맞춤 견적) → 웹블로그 제작 사례 → 가장 많이 본 글 → 최신 글 → WHY WEFLOW 01(보안 뉴스) → WHY WEFLOW 02(WEFLOW여야만 하는 이유)
//       → 업종 카드 → 병의원 전용(/clinic-blog 로) → 제작 플랜 & 가격 안내 → FAQ → 맞춤 견적 받기 폼(#contact)
// WHY WEFLOW 01·02 · 가격 안내 · FAQ 는 병의원 랜딩(app/(site)/clinic-blog)의 부품을 그대로 가져다 쓴다 (2026-11-20) —
// 전 업종 페이지라 문구만 일반용(general)으로 바꾸고, 버튼은 이 페이지의 견적 폼에 잇는다. FAQ 는 병의원 랜딩의 질문을 전 업종 말로 바꾼 것이다 (관리자의 홈 FAQ 는 이제 이 페이지에 쓰이지 않는다).
// 예전에 있던 AI 검색 장면 · 플랫폼 블로그의 한계 · 그래서 웹블로그 · SEO·AEO·GEO 구조 · 웹블로그란? · 옛 상품 카드 · 제작 사례(맨 아래) 섹션은 뺐다 (부품 파일은 남아 있다).
// 데이터: Payload 'home' 글로벌(getHome) + 글 목록 + 카테고리. 글로벌 값이 비어 있으면 각 섹션의 기본 문구를 쓴다.
import { Suspense } from "react";
import type { Metadata } from "next";
import { POPULAR_SLUGS, getAllPosts, getCategories, getHome, getLatestPosts, getPostsBySlugs } from "@/blog/lib/payload";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/blog/components/home/HeroSection";
import { IndustryCardsSection } from "@/blog/components/home/IndustryCardsSection";
import { ClinicFocusSection } from "@/blog/components/home/ClinicFocusSection";
import { WebBlogCasesSection } from "@/blog/components/home/WebBlogCasesSection";
import { PopularPostsSection } from "@/blog/components/home/PopularPostsSection";
import { LatestPostsSection } from "@/blog/components/home/LatestPostsSection";
import { InquirySection } from "@/blog/components/home/InquirySection";
import { PlanButton } from "@/blog/components/home/PlanButton";
import { SITE_SCENE_CSS } from "@/blog/components/home/siteSceneCss";
// 병의원 랜딩의 부품
import SecurityNews from "@/app/(site)/clinic-blog/SecurityNews";
import WhyWeflow from "@/app/(site)/clinic-blog/WhyWeflow";
import ClinicPlans from "@/app/(site)/clinic-blog/ClinicPlans";
import ClinicFaq from "@/app/(site)/clinic-blog/ClinicFaq";

// 정식 주소 — 검색엔진이 ?query 가 붙은 주소도 이 페이지 하나로 본다. alternates 는 레이아웃과 합쳐지지 않고 덮어써서 RSS 도 다시 적는다
export const metadata: Metadata = {
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
};

// 최대 1분에 한 번 다시 생성: 예약 발행(발행일이 지난 글)이 1분 안에 나타나고, 조회수 순위도 갱신된다. 방문자는 항상 캐시된 페이지를 받는다.
export const revalidate = 60;

export default async function HomePage() {
  const [home, popular, latest, categories, all] = await Promise.all([getHome(), getPostsBySlugs(POPULAR_SLUGS), getLatestPosts(8), getCategories(), getAllPosts()]);

  return (
    <>
      {/* 무거운 클라이언트 섹션(궤도 애니메이션·목록)은 Suspense 로 끊어 둔다.
          그래야 헤더(햄버거·검색)가 먼저 상호작용 가능해지고, 그 전에 누른 탭도 React 가 재생해 준다.
          서버에서 HTML 은 이미 다 그려지므로 로딩 표시는 보이지 않는다 */}
      <Suspense>
        <HeroSection title={home.heroTitle} text={home.heroText} placeholder={home.searchPlaceholder} />
      </Suspense>
      {/* 실제로 운영 중인 웹블로그 사례 먼저 — 생소한 상품이라 실물부터 보여 준다 */}
      <WebBlogCasesSection />
      {/* 그다음 실제 글(가장 많이 본 글·최신 글) */}
      <PopularPostsSection posts={popular} />
      <Suspense>
        <LatestPostsSection posts={latest} />
      </Suspense>
      {/* 병의원 랜딩 부품은 .cb 안의 색 변수 · 공통 모양을 쓴다 — .site-scene 으로 감싸 변수를 넣고, 바탕 CSS(SITE_SCENE_CSS)는 아래에서 한 번만 싣는다 */}
      {/* WHY WEFLOW 01(오래된 홈페이지의 보안 뉴스) → 02(WEFLOW여야만 하는 이유 셋: 보안 · 검색·AI · 속도) */}
      <div className="site-scene">
        <SecurityNews who="우리 회사" chapter="WHY WEFLOW 01" warn={false} lead={false} />
        <WhyWeflow general />
      </div>
      {/* 우리 업종도 되나? — 전 업종 카드 먼저, 그다음 특히 병의원은 전용 페이지(/clinic-blog)로 */}
      <IndustryCardsSection categories={categories} posts={all} />
      <ClinicFocusSection />
      {/* 제작 플랜 & 가격 안내 — 버튼을 누르면 아래 견적 폼(#contact)으로 내려가며 문의 유형이 미리 골라진다 */}
      <div className="site-scene">
        <ClinicPlans
          general
          cta={(plan, best) => (
            <PlanButton plan={plan} className={`ch-plan-btn${best ? " ch-plan-btn--fill" : ""}`}>
              이 구성으로 견적 신청 <ArrowRight size={17} />
            </PlanButton>
          )}
        />
        {/* FAQ — 병의원 랜딩의 질문을 전 업종 말로 바꾼 것 (ClinicFaq 의 GENERAL_FAQ) */}
        <ClinicFaq general contactHref="#contact" />
      </div>
      <InquirySection />
      <style>{SITE_SCENE_CSS}</style>
    </>
  );
}
