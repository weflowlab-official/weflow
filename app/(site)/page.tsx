// 메인 페이지 (/) — 히어로 → 신뢰 밴드 → 제작 사례 → 왜 WEFLOW → 일하는 방식·솔루션 → 자주 묻는 질문 → 마지막 CTA.
// 각 섹션의 실제 내용은 components/home/* 에 있고, 여기선 순서만 잡는다.
// (리뉴얼 전의 솔루션·제작 라인업·혜택·가격·비교·제휴·제작 과정·회사소개 섹션은 메인에서 내렸다 — 파일은 그대로 있다)
"use client";
import { useEffect, useRef } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import TrustBand from "@/components/home/TrustBand";
import HomeCasesSection from "@/components/home/HomeCasesSection";
import HomeWhyIntro from "@/components/home/HomeWhyIntro";
import HomeCardSections from "@/components/home/HomeCardSections";
import HomeFaqSection from "@/components/home/HomeFaqSection";
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

  // 히어로 카드 펼침 — 스크롤 진행도(0~1)를 --hero-p 로 넘기면
  // CSS 가 카드 둘레 여백과 모서리 둥글기를 그만큼 줄여 화면을 꽉 채운다
  const firstScreenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = firstScreenRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.3));
      el.style.setProperty("--hero-p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // 흰 바탕을 한 겹 깐다 — 사이트 기본 바탕(body)은 검정이라, 흰 섹션끼리 맞닿는 자리에
    // 소수점 높이 때문에 실금이 생기면 그 틈으로 검은 선이 비치고 스크롤할 때 깜빡거린다
    // (모바일 제작 사례 섹션 아래에서 보였다). 뒤가 흰색이면 틈이 생겨도 보이지 않는다
    <div className="home-page">
      {/* 1. 첫 화면 — 히어로가 둥근 카드로 떠 있다가 스크롤하면 화면 폭을 꽉 채운다 */}
      <div className="first-screen" ref={firstScreenRef}>
        <HeroBanner />
      </div>

      {/* 2. 신뢰 밴드 — 첫 화면 아래로 내렸다 */}
      <TrustBand />

      {/* 제작 사례 — 자체 도메인으로 운영 중인 실제 사례 다섯 개 (PC 는 한 줄에 다섯 장, 모바일은 옆으로 넘긴다) */}
      <HomeCasesSection />

      {/* '왜 WEFLOW?' 도입 — 문장이 양옆에서 들어오고 바탕이 어두워지며 아래 섹션들로 넘어간다 */}
      <HomeWhyIntro />

      {/* 일하는 방식 여섯 가지 + 솔루션 강점 여덟 가지 — 같은 모양의 카드 2열 (흰 바탕으로 돌아온다) */}
      <HomeCardSections />

      {/* 자주 묻는 질문 — 메인 형식(흰 바탕, 좌우 2단). 가격 탭도 같은 것을 쓴다 */}
      <HomeFaqSection />

      {/* 마지막 CTA */}
      <FinalCTA />

      <style>{`
        .home-page { background: #fff; }
        /* 첫 화면 = 뷰포트 - 헤더(64). svh 라 주소창 변화에 안전하다.
           히어로는 이 높이를 전부 채운다.

           카드 모양은 히어로를 clip-path 로 오려서 만든다 — 실제 크기는 그대로라
           스크롤 중에 글자가 다시 배치되지 않는다. --hero-p(0→1)가 커질수록
           둘레 여백(--hero-gap)과 둥글기가 0 으로 줄어 화면을 꽉 채운다. */
        .first-screen {
          --hero-p: 0;
          --hero-gap-max: 24px;
          --hero-radius-max: 28px;
          --hero-gap: calc((1 - var(--hero-p)) * var(--hero-gap-max));
          /* 위쪽 여백 — 흰 헤더가 이미 여백 노릇을 해서 옆·아래보다 훨씬 좁게 잡는다
             (같은 값이면 카드가 화면 아래로 처져 보인다) */
          --hero-gap-top: calc((1 - var(--hero-p)) * 4px);
          display: flex;
          flex-direction: column;
          min-height: calc(100svh - 64px);
          background: #fff;
        }
        .first-screen > .hero-section {
          flex: 1 1 0;
          min-height: 0;
          clip-path: inset(
            var(--hero-gap-top) var(--hero-gap) var(--hero-gap)
            round calc((1 - var(--hero-p)) * var(--hero-radius-max))
          );
        }
        /* 모바일: 하단 고정 바(56px)가 화면 아래를 덮으므로 그만큼 뺀다 */
        @media (max-width: 768px) {
          .first-screen {
            --hero-gap-max: 12px;
            --hero-radius-max: 20px;
            min-height: calc(100svh - 64px - 56px);
          }
        }
      `}</style>
    </div>
  );
}
