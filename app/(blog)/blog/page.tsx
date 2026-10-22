// 블로그 메인(/blog). 헤더/푸터는 app/(blog)/layout.tsx 가 감싸고, 여기서는 본문 섹션만 순서대로 조립한다.
// 구성: 히어로(검색·무료 견적) → 업종 카드 → AI 검색 장면 → 가장 많이 본 글 → 최신 글 → 웹블로그란?(홈페이지 비교) → 장점 카드 → 제작 사례 → FAQ → 무료 견적 신청 폼(#contact)
// 홍보용 흐름: 업종을 골라 들어가거나, 웹블로그가 무엇을 하는지 보고, 사례와 FAQ 를 거쳐 상담으로.
// 데이터: Payload 'home' 글로벌(getHome) + 글 목록 + 카테고리. 글로벌 값이 비어 있으면 각 섹션의 기본 문구를 쓴다.
import { Suspense } from "react";
import { getAllPosts, getCategories, getHome, getLatestPosts, getPopularPosts } from "@/blog/lib/payload";
import { HeroSection } from "@/blog/components/home/HeroSection";
import { IndustryCardsSection } from "@/blog/components/home/IndustryCardsSection";
import { AiSearchSection } from "@/blog/components/home/AiSearchSection";
import { PopularPostsSection } from "@/blog/components/home/PopularPostsSection";
import { LatestPostsSection } from "@/blog/components/home/LatestPostsSection";
import { SummarySection } from "@/blog/components/home/SummarySection";
import { StrengthsSection } from "@/blog/components/home/StrengthsSection";
import { CasesSection } from "@/blog/components/home/CasesSection";
import { FaqSection } from "@/blog/components/home/FaqSection";
import { InquirySection } from "@/blog/components/home/InquirySection";

// 최대 1분에 한 번 다시 생성: 예약 발행(발행일이 지난 글)이 1분 안에 나타나고, 조회수 순위도 갱신된다. 방문자는 항상 캐시된 페이지를 받는다.
export const revalidate = 60;

export default async function HomePage() {
  const [home, popular, latest, categories, all] = await Promise.all([getHome(), getPopularPosts(4), getLatestPosts(8), getCategories(), getAllPosts()]);

  return (
    <>
      {/* 무거운 클라이언트 섹션(궤도 애니메이션·목록)은 Suspense 로 끊어 둔다.
          그래야 헤더(햄버거·검색)가 먼저 상호작용 가능해지고, 그 전에 누른 탭도 React 가 재생해 준다.
          서버에서 HTML 은 이미 다 그려지므로 로딩 표시는 보이지 않는다 */}
      <Suspense>
        <HeroSection title={home.heroTitle} text={home.heroText} placeholder={home.searchPlaceholder} />
      </Suspense>
      <IndustryCardsSection categories={categories} posts={all} />
      <AiSearchSection />
      <PopularPostsSection posts={popular} />
      <Suspense>
        <LatestPostsSection posts={latest} />
      </Suspense>

      <SummarySection title={home.summaryTitle} text={home.summaryText} />
      <StrengthsSection keyPoints={home.keyPoints} />
      <CasesSection />
      <FaqSection items={home.faq} />
      <InquirySection />
    </>
  );
}
