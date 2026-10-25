// 메인 페이지 "그래서, 웹블로그" — 플랫폼 블로그의 한계 바로 뒤.
// 메인 사이트 /webblog 의 WHY WEB BLOG(화면이 붙어 있는 동안 스크롤에 맞춰 답 다섯 개가 차례로 지나가는 섹션)를 그대로 쓴다.
// 예전 '장점 카드'(StrengthsSection — SEO·AEO·GEO / AI 검색 / 업종)와 내용이 겹쳐, 그 자리를 이 섹션이 맡는다.
// 남색 헤더 아래에서 화면이 붙게 맞추고, 맺음 버튼만 이 페이지 아래 무료 견적 폼(#contact)으로 보낸다 (메인 사이트는 /diagnosis).
import BlogWhy from "@/app/(site)/clinic-blog/BlogWhy";
import { GENERAL_WHY } from "@/app/(site)/clinic-blog/blogWhyCopy";

const COPY = { ...GENERAL_WHY, end: { ...GENERAL_WHY.end, href: "#contact", label: "무료 견적 신청" } };

export function WhyWebBlogSection() {
  return (
    <div className="wwb">
      <BlogWhy copy={COPY} />
      {/* 웹블로그는 남색 헤더가 위에 붙어 있다(sticky, h-16 · lg:h-20) — 화면이 헤더 아래에서 붙게 해 내용이 헤더에 눌려 보이지 않게 */}
      <style>{`
        .wwb .bwy-pin { top: 64px; height: calc(100svh - 64px); }
        @media (min-width: 1024px) { .wwb .bwy-pin { top: 80px; height: calc(100svh - 80px); } }
        /* 헤더 아래 공간의 정가운데는 조금 낮아 보여, 장면들을 24px 위로 (아랫변을 48px 올려 가운데가 24px 올라가게) */
        .wwb .bwy-ask, .wwb .bwy-answer, .wwb .bwy-end { bottom: 48px; }
        /* 휴대폰 — 답 다섯 장면(01~05)만 원래 가운데로 (24px 내림) */
        @media (max-width: 800px) { .wwb .bwy-answer { bottom: 0; } }
      `}</style>
    </div>
  );
}
