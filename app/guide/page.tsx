// /guide — 제작 라인업 (메뉴 이름). 주소는 예전 이름대로 /guide 를 유지한다.
// 메인에 길게 깔려 있던 "홈페이지란 무엇인가" 설명 섹션들을 이리로 옮겼다.
// 메인은 이미 제작을 마음먹은 사람을 위한 자리로 두고, 알아보는 단계의 방문자는 여기서 읽는다.
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ScrollToHash from "@/components/ScrollToHash";
import HomepageDefinitionSection from "@/components/home/HomepageDefinitionSection";
import WhatIsHomepageSection from "@/components/home/WhatIsHomepageSection";
import LandingHomepageSection from "@/components/home/LandingHomepageSection";
import LandingPageSection from "@/components/home/LandingPageSection";
import AdminPageSection from "@/components/home/AdminPageSection";
import WhyAdminSection from "@/components/home/WhyAdminSection";
import FaqSection from "@/components/FaqSection";
import { CTA_BTN, CTA_BTN_FILLED } from "@/lib/ctaButton";

export const metadata: Metadata = {
  // 메뉴·푸터에 "제작 라인업" 으로 적혀 있으므로 검색 제목도 같은 이름을 쓴다.
  // 네이버 사이트링크는 메뉴 글자를 그대로 가져가는데, 검색 제목이 다른 이름이면
  // 같은 페이지가 두 이름으로 돌아다니게 된다.
  title: "제작 라인업 · WEFLOW",
  // 짧으면 네이버가 버리고 본문을 긁어 온다 — 그대로 쓰이는 /difference(88자) 수준으로 맞춘다
  description:
    "홈페이지와 랜딩페이지는 뭐가 다른지, 관리자 페이지는 왜 필요한지 정리했습니다. 제작 비용과 진행 절차에 대해 자주 묻는 질문도 함께 담았습니다.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "제작 라인업 · WEFLOW",
    description:
      "홈페이지와 랜딩페이지는 뭐가 다른지, 관리자 페이지는 왜 필요한지 정리했습니다.",
    url: "/guide",
    // openGraph 를 정의하면 루트의 것을 통째로 덮어쓴다 — 이미지도 여기서 다시 지정해야 한다
    images: [{ url: "/images/og/guide.jpg", width: 1200, height: 630 }],
  },
};

export default function GuidePage() {
  return (
    <div>
      {/* 메인 라인업에서 #앵커 를 달고 들어오면 해당 섹션으로 내려준다 */}
      <ScrollToHash />

      {/* 페이지 도입부 */}
      <section
        style={{
          background: "var(--section-a)",
          padding: "clamp(3rem, 7vw, 4.5rem) 1.5rem clamp(2rem, 5vw, 3rem)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            className="caption-2 emphasized c-accent"
            style={{ letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}
          >
            GUIDE
          </p>
          <h1 className="title-1" style={{ margin: "0 0 0.75rem", wordBreak: "keep-all" }}>
            홈페이지,{" "}
            <br className="br-mobile" />
            어디서부터 알아봐야 할까요?
          </h1>
          <p
            className="callout c-muted"
            style={{ margin: "0 0 1.75rem", maxWidth: "560px", wordBreak: "keep-all" }}
          >
            홈페이지와 랜딩형 홈페이지·랜딩페이지는 뭐가 다른지, 관리자 페이지는 왜 필요한지
            <br />제작을 결정하기 전에 알아두면 좋은 것들을 정리했습니다.
          </p>
          <Link
            href="/cases"
            className="btn-gold btn-gold--fill"
            style={{ fontSize: "1rem", padding: "0.85rem 2.2rem" }}
          >
            <span className="btn-gold__label">실제 고객 제작 사례 →</span>
          </Link>
        </div>
      </section>


      {/* 01~02 홈페이지 */}
      <HomepageDefinitionSection />
      <WhatIsHomepageSection />

      {/* 03~04 랜딩형·랜딩페이지 */}
      <LandingHomepageSection />
      <LandingPageSection />

      {/* 05~06 관리자 페이지 */}
      <AdminPageSection />
      <WhyAdminSection />

      {/* 자주 묻는 질문 — 구조화 데이터까지 이 컴포넌트가 함께 들고 있어 다른 페이지로 옮겨도 된다 */}
      <FaqSection />

      {/* 마무리 CTA — 서비스 페이지 ServiceCTA와 같은 서식 */}
      <section
        style={{
          padding: "clamp(2.5rem, 5vw, 3.5rem) 1.5rem",
          background: "var(--section-b)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Reveal
          variant="zoom"
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p
            className="caption-1 emphasized c-accent"
            style={{
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
            }}
          >
            GET STARTED
          </p>

          <h2
            className="emphasized"
            style={{
              marginBottom: "1rem",
              wordBreak: "keep-all",
              fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)",
              lineHeight: 1.25,
            }}
          >
            어떤 게 맞을지 모르겠다면
          </h2>

          <p
            className="c-muted"
            style={{
              marginBottom: "2rem",
              wordBreak: "keep-all",
              fontSize: "clamp(1.1rem, 2.6vw, 1.35rem)",
              lineHeight: 1.7,
            }}
          >
            업종과 목표를 알려주시면,
            <br className="br-mobile" /> 어떤 형태가 맞는지부터 함께 정리해 드립니다.
          </p>

          {/* CTA 버튼 */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="tel:010-2971-7280"
              className="btn-gold"
              style={CTA_BTN}
            >
              <span className="btn-gold__label">전화 상담하기</span> <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link
              href="/diagnosis"
              className="btn-gold btn-gold--fill"
              style={CTA_BTN}
            >
              <span className="btn-gold__label">무료 상담 신청</span> <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </Reveal>

        <style>{`
          .br-mobile { display: none; }
          @media (max-width: 560px) {
            .br-mobile { display: inline; }
          }
        `}</style>
      </section>
    </div>
  );
}
