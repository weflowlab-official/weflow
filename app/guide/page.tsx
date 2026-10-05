// /guide — 제작 라인업 (메뉴 이름). 주소는 예전 이름대로 /guide 를 유지한다.
// 메인에 길게 깔려 있던 "홈페이지란 무엇인가" 설명 섹션들을 이리로 옮겼다.
// 메인은 이미 제작을 마음먹은 사람을 위한 자리로 두고, 알아보는 단계의 방문자는 여기서 읽는다.
//
// 메인과 같은 흰 바탕이다 — .theme-light 가 색 변수를 밝은 값으로 바꾼다 (styles/globals.css).
// '필요한 이유' 두 섹션(02·05)은 혜택 안내처럼 스크롤하는 대로 사진이 바뀐다 (ScrollPhotoList).
// 랜딩페이지 섹션(예전 04)과 자주 묻는 질문은 내렸다 — 파일은 그대로 있다
// (자주 묻는 질문은 메인과 가격 탭에 있다).
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import PageIntro from "@/components/PageIntro";
import ScrollToHash from "@/components/ScrollToHash";
import HomepageDefinitionSection from "@/components/home/HomepageDefinitionSection";
import WhatIsHomepageSection from "@/components/home/WhatIsHomepageSection";
import LandingHomepageSection from "@/components/home/LandingHomepageSection";
import AdminPageSection from "@/components/home/AdminPageSection";
import WhyAdminSection from "@/components/home/WhyAdminSection";

export const metadata: Metadata = {
  // 메뉴·푸터에 "제작 라인업" 으로 적혀 있으므로 검색 제목도 같은 이름을 쓴다.
  // 네이버 사이트링크는 메뉴 글자를 그대로 가져가는데, 검색 제목이 다른 이름이면
  // 같은 페이지가 두 이름으로 돌아다니게 된다.
  title: "제작 라인업 · WEFLOW",
  // 짧으면 네이버가 버리고 본문을 긁어 온다 — 그대로 쓰이는 /difference(88자) 수준으로 맞춘다
  description:
    "홈페이지와 랜딩형 홈페이지는 뭐가 다른지, 홈페이지와 관리자 페이지는 왜 필요한지 정리했습니다. 제작을 결정하기 전에 알아두면 좋은 내용을 통계와 실제 화면으로 담았습니다.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "제작 라인업 · WEFLOW",
    description:
      "홈페이지와 랜딩형 홈페이지는 뭐가 다른지, 관리자 페이지는 왜 필요한지 정리했습니다.",
    url: "/guide",
    // openGraph 를 정의하면 루트의 것을 통째로 덮어쓴다 — 이미지도 여기서 다시 지정해야 한다
    images: [{ url: "/images/og/guide.jpg", width: 1200, height: 630 }],
  },
};

export default function GuidePage() {
  return (
    <div className="theme-light">
      {/* 메인 라인업에서 #앵커 를 달고 들어오면 해당 섹션으로 내려준다 */}
      <ScrollToHash />

      {/* 페이지 도입부 — 혜택 안내 탭과 같은 형식 (영문 머리표 + 굵은 제목 + 검은 알약 버튼, 뒤에 큰 테두리 글씨) */}
      <PageIntro
        eyebrow="GUIDE"
        title={[{ text: "홈페이지," }, { text: "어디서부터 알아봐야 할까요?", hl: true }]}
        body={
          <>
            홈페이지와 랜딩형 홈페이지는 뭐가 다른지, 관리자 페이지는 왜 필요한지
            <br />
            제작을 결정하기 전에 알아두면 좋은 것들을 정리했습니다.
          </>
        }
        ctaHref="/cases"
        ctaLabel="실제 고객 제작 사례 →"
      />

      {/* 01~02 홈페이지 */}
      <HomepageDefinitionSection />
      <WhatIsHomepageSection />

      {/* 03 랜딩형 홈페이지 */}
      <LandingHomepageSection />

      {/* 04~05 관리자 페이지 */}
      <AdminPageSection />
      <WhyAdminSection />

      {/* 마무리 CTA — 회사소개 탭 맨 아래와 같은 파란 띠 + 흰 글씨 */}
      <section className="gd-cta">
        <span aria-hidden className="gd-cta__dot gd-cta__dot--lg" />
        <span aria-hidden className="gd-cta__dot gd-cta__dot--sm" />
        <Reveal variant="zoom" className="gd-cta__in">
          <h2 className="gd-cta__title">어떤 게 맞을지 모르겠다면</h2>
          <p className="gd-cta__sub">
            업종과 목표를 알려주시면,
            <br className="gd-cta__br" /> 어떤 형태가 맞는지부터 함께 정리해 드립니다.
          </p>
          <div className="gd-cta__btns">
            <a href="tel:010-2971-7280" className="gd-cta__btn btn-goldline">
              전화 상담하기 <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link href="/diagnosis" className="gd-cta__btn gd-cta__btn--solid btn-goldline">
              맞춤 견적 받기 <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </Reveal>
      </section>

      <style>{`
        /* ── CTA — 화면 폭을 다 채우는 파란 띠, 흰 글씨 (회사소개 탭의 .ab-cta 와 같은 색) ── */
        .gd-cta {
          position: relative;
          overflow: hidden;
          background: var(--accent);
          padding: clamp(4rem, 9vw, 7rem) 1.25rem;
          text-align: center;
        }
        /* 장식 원 */
        .gd-cta__dot { position: absolute; border-radius: 9999px; background: rgba(14, 14, 16, 0.1); }
        .gd-cta__dot--lg { right: -80px; bottom: -120px; width: 320px; height: 320px; }
        .gd-cta__dot--sm { right: 40px; bottom: -60px; width: 180px; height: 180px; }
        .gd-cta__in { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
        .gd-cta__title {
          margin: 0;
          color: #fff;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          word-break: keep-all;
        }
        .gd-cta__sub {
          margin: 0.9rem 0 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: clamp(1.05rem, 2.2vw, 1.3rem);
          font-weight: 600;
          line-height: 1.7;
          word-break: keep-all;
        }
        .gd-cta__btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: clamp(2rem, 5vw, 3rem);
        }
        .gd-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--on-accent-strong);
          font-size: 1.1rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-radius: 9999px;
          padding: 0.95rem 2.2rem;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
        }
        .gd-cta__btn:hover { background: rgba(255, 255, 255, 0.22); border-color: var(--on-accent-strong); }
        .gd-cta__btn:active { transform: scale(0.97); }
        /* 주 버튼 — 흰색 채움 (강조) */
        .gd-cta__btn--solid {
          background: var(--on-accent-strong);
          color: var(--accent-strong);
          border-color: var(--on-accent-strong);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        }
        .gd-cta__btn--solid:hover { background: rgba(255, 255, 255, 0.88); border-color: rgba(255, 255, 255, 0.88); }
        /* 좁은 화면 — 두 버튼을 세로로 쌓지 않고 한 줄에 반씩 놓는다 (하단 고정 바와 같은 배치).
           한 줄에 들어가게 글씨·여백·화살표를 조금씩 줄인다 */
        @media (max-width: 480px) {
          .gd-cta__btns { flex-wrap: nowrap; gap: 0.6rem; }
          .gd-cta__btn {
            flex: 1 1 0;
            min-width: 0;
            justify-content: center;
            gap: 0.3rem;
            padding: 0.85rem 0.5rem;
            font-size: 0.95rem;
            white-space: nowrap;
          }
          .gd-cta__btn svg { width: 16px; height: 16px; flex-shrink: 0; }
        }

        /* 좁은 화면에서만 줄바꿈 */
        .gd-cta__br { display: none; }
        @media (max-width: 560px) {
          .gd-cta__br { display: inline; }
        }
      `}</style>
    </div>
  );
}
