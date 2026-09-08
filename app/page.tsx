// 메인 페이지 (/) — 히어로부터 마지막 CTA까지 16개 섹션을 순서대로 쌓는다.
// 각 섹션의 실제 내용은 components/home/* 에 있고, 여기선 순서와 임시 문구만 잡는다.
"use client";
import { useEffect } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import TrustBand from "@/components/home/TrustBand";
import SolutionSection from "@/components/home/SolutionSection";
import LineupSection from "@/components/home/LineupSection";
import PartnershipSection from "@/components/home/PartnershipSection";
import WhyWeflowSection from "@/components/home/WhyWeflowSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import PricingSection from "@/components/home/PricingSection";
import TargetCustomerSection from "@/components/home/TargetCustomerSection";
import HomeServiceSection from "@/components/home/HomeServiceSection";
import HomeAboutSection from "@/components/home/HomeAboutSection";
import ComparisonCTA from "@/components/home/ComparisonCTA";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  // 이 페이지에 있는 동안만 body에 스크롤 스냅 클래스를 붙인다
  useEffect(() => {
    document.body.classList.add("snap-home");
    return () => document.body.classList.remove("snap-home");
  }, []);

  // .reveal 요소가 화면에 들어오면 visible을 붙여 등장 애니메이션을 튼다
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 1~2. 첫 화면 — 히어로와 신뢰 밴드를 한 덩어리로 묶어 화면 높이를 나눠 갖는다.
             밴드 높이를 픽셀로 빼면 기종·브라우저마다 글씨·여백이 달라 어긋나므로,
             밴드는 제 높이만 쓰고 히어로가 남은 공간을 채우게 한다 (flex: 1). */}
      <div className="first-screen">
        <HeroBanner />
        <TrustBand />
      </div>

      {/* 3. 솔루션 — 통계 밴드 + 실시간 문의 + 강점 6종.
             제작 사례·고객 인터뷰 섹션을 대신한다 (사례는 /cases 로, 히어로 CTA가 연결) */}
      <SolutionSection />

      {/* 홈페이지·랜딩페이지·관리자 페이지 설명은 /guide 로 옮겼다.
          메인은 이미 제작을 마음먹은 방문자가 보는 자리라, 정의부터 설명하면 문의까지 너무 멀어진다. */}

      {/* 제작 라인업 — 누르면 /guide 의 해당 설명으로 내려간다 */}
      <LineupSection />

      {/* 사례로 신뢰를 준 직후에 "얼마인가"를 바로 답한다 */}
      <BenefitsSection />
      {/* "이런 분들이라면" 으로 대상을 짚어준 뒤 바로 가격을 보여준다 */}
      <TargetCustomerSection />
      <PricingSection />
      {/* 타사 비교는 가격을 본 직후여야 문구가 맞는다 — 항상 가격 바로 아래 둔다 */}
      <ComparisonCTA />

      {/* 그다음 차별점 — 왜 WEFLOW여야 하는지 */}
      <PartnershipSection />
      <WhyWeflowSection />

      {/* 제작 과정 */}
      <HomeServiceSection />

      {/* 브랜드 한마디로 끝맺고 최종 CTA로 넘긴다 (WE·FLOW 뜻풀이는 /about 에만 둔다) */}
      <HomeAboutSection />

      {/* 16. 마지막 CTA (기존) */}
      <FinalCTA />

      <style>{`
        /* 히어로 + 신뢰 밴드를 한 화면에 묶는다.
           첫 화면 = 뷰포트 - 헤더(프로모션 띠 46 + 네비 64). svh 라 주소창 변화에 안전하다.
           히어로가 남은 높이를 전부 가져가고(flex:1) 밴드는 제 높이만 쓰므로,
           밴드 높이가 기기마다 달라도 항상 첫 화면에 함께 들어온다. */
        .first-screen {
          display: flex;
          flex-direction: column;
          min-height: calc(100svh - 110px);
        }
        .first-screen > .hero-section {
          flex: 1 1 0;
          min-height: 0;
        }
        /* 모바일: 하단 고정 바(56px)가 화면 아래를 덮으므로, 히어로 높이를 직접 잡아
           신뢰 밴드는 첫 줄("N년차 홈페이지 제작")까지만 바 위로 보이고
           둘째 줄("누적 제작 N건 이상")은 스크롤해야 나오게 한다.
           150px = 밴드 위 여백 + 안내 문구 + 첫 줄 높이(여유 포함) */
        @media (max-width: 768px) {
          .first-screen > .hero-section {
            flex: 0 0 auto;
            /* + 1cm = 위·아래 0.5cm 씩 늘린 히어로 패딩 몫 */
            min-height: calc(100svh - 110px - 56px - 150px + 1cm);
          }
        }
      `}</style>
    </>
  );
}
