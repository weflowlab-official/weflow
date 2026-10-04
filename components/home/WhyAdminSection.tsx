import type { ReactNode } from "react";
import { Star, Crown } from "lucide-react";
import ScrollPhotoList from "@/components/ScrollPhotoList";

type Point = { order: string; title: string; kw: string; desc: ReactNode };

// 관리자 페이지가 필요한 이유 3가지 — 항목마다 키워드 + 설명
const POINTS: Point[] = [
  {
    order: "첫째",
    title: "확실한 고객 DB 확보",
    kw: "확실한 고객 DB",
    desc: (
      <>
        카톡·SNS 연동 폼으로 이름만 남기고 들어오는 것과 달리,
        <br />
        <strong>원하는 요청사항까지 직접 입력</strong>하고 들어옵니다.
        <br />
        니즈가 분명한, 진짜 상담으로 이어지는 확실한 고객 DB가 쌓입니다.
      </>
    ),
  },
  {
    order: "둘째",
    title: "고객의 유입 경로 파악",
    kw: "실시간 유입 경로",
    desc: (
      <>
        고객이 블로그·광고·검색 등 무엇을 보고 사이트에 들어왔는지
        <br />
        <strong>유입 경로가 함께 기록</strong>됩니다.
        <br />
        어떤 채널이 실제 문의로 이어지는지 확인해, 마케팅을 효율적으로 조정할 수
        있어요.
      </>
    ),
  },
  {
    order: "셋째",
    title: "통계와 함께 한 줄씩 쌓이는 DB",
    kw: "실시간 통계 관리",
    desc: (
      <>
        문의·예약이 한 건씩 기록되고, <strong>유입·전환·상태 통계</strong>가
        자동으로 집계됩니다.
        <br />
        흩어지지 않고 관리자 페이지 한곳에서, 데이터가 그대로 내 자산으로
        축적됩니다.
      </>
    ),
  },
];

/**
 * "05 · 관리자 페이지가 필요한 이유" 섹션 — 고객 DB·유입 경로·통계 3가지를
 * 혜택 안내와 같은 방식으로 보여준다 (WhatIsHomepageSection과 같은 구조):
 * 왼쪽 사진이 붙어 따라오고, 오른쪽 항목을 스크롤하는 대로 사진이 바뀐다.
 *
 * 사진은 관리자 페이지의 실제 화면 캡처라 비율이 제각각이다(세로로 긴 것 둘, 가로로 긴 것 하나).
 * 정사각 자리에 자르지 않고(contain) 넣는다 — 캡처 바탕이 흰색이라 남는 자리가 티 나지 않는다.
 */
export default function WhyAdminSection() {
  return (
    <section
      id="why-admin"
      style={{
        background: "var(--section-a)",
        padding: "clamp(2.25rem, 5vw, 4rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto", width: "100%" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <span className="footnote emphasized c-accent">
            05 · 관리자 페이지가 필요한 이유
          </span>
          {/* 별 5개 (배경 없이) */}
          <div
            aria-hidden="true"
            style={{ display: "flex", gap: "1px", margin: "0.9rem 0 0.5rem" }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={19}
                fill="#f5b301"
                color="#f5b301"
                strokeWidth={0}
              />
            ))}
          </div>
          <h2
            className="title-1"
            style={{ marginTop: 0, textAlign: "left", wordBreak: "keep-all" }}
          >
            관리자 페이지가{" "}
            <span className="c-accent tilt-hl tilt-hl-red">왜 필요할까요?</span>
          </h2>
        </div>

        <ScrollPhotoList
          photoRatio={1}
          fit="contain"
          caption={
            <>
              WEFLOW <strong>관리자 페이지</strong>의 실제 화면입니다.
            </>
          }
          items={POINTS.map((p, i) => ({
            key: p.order,
            img: `/images/main/main-adminwhy-0${i + 1}.webp`,
            alt: p.title,
            body: (
              <>
                <p className="spl-kicker">
                  <Crown size={22} strokeWidth={2} color="#f5b301" fill="#f5b301" aria-hidden="true" />
                  {p.order}
                  <span className="spl-badge">핵심</span>
                </p>
                <h3 className="spl-title">{p.title}</h3>
                <p className="spl-stat spl-stat--text">{p.kw}</p>
                <p className="spl-desc">{p.desc}</p>
              </>
            ),
          }))}
        />
      </div>
    </section>
  );
}
