import type { Metadata } from "next";
import { draftMode } from "next/headers";
import "@/blog/blog.css";
import { SiteHeader } from "@/blog/components/layout/SiteHeader";
import { SiteFooter } from "@/blog/components/layout/SiteFooter";
import { FloatingCta } from "@/blog/components/layout/FloatingCta";
import { SiteProvider } from "@/blog/components/SiteProvider";
import { LivePreviewListener } from "@/blog/components/LivePreviewListener";
import { getSiteData } from "@/blog/lib/payload";
import PageTracker from "@/components/PageTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

// 블로그 전역 메타. 회사명은 Payload 회사 정보에서 읽는다.
export async function generateMetadata(): Promise<Metadata> {
  const { clinic } = await getSiteData();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${clinic.name} 웹블로그 | 업종별 웹블로그가 필요한 이유`, template: `%s | ${clinic.name} 웹블로그` },
    description:
      "네이버·구글에 등록되고 AI 검색이 읽는 웹블로그. 차량·금융·병의원·인테리어 등 업종별로 웹블로그가 왜 필요한지, SEO·AEO·GEO 구조 설계까지 알아보세요.",
    alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
    // 사이트(app/(site)/layout.tsx)와 같은 파비콘. 이 레이아웃은 루트라 사이트 메타를 물려받지 않는다
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
        { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/favicon-192.png",
    },
    // 공유 이미지는 app/(blog)/blog/opengraph-image.jpg (사이트와 같은 로고 이미지) 가 기본. 글 페이지는 썸네일이 있으면 썸네일로 대체된다
    openGraph: { type: "website", siteName: `${clinic.name} 웹블로그`, locale: "ko_KR" },
    twitter: { card: "summary_large_image" },
  };
}

// 블로그 프론트 루트 레이아웃: 헤더 + 본문 + 푸터 + 퀵메뉴. (관리자 /blogadmin 은 별도 레이아웃)
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, { isEnabled: isPreview }] = await Promise.all([getSiteData(), draftMode()]);
  const { clinic } = site;

  // 블로그 구조화 데이터 (검색엔진·AI 검색이 "누구의 블로그인지" 읽도록). 회사 자체 정보는 사이트 레이아웃의 ProfessionalService 가 담당
  const siteUrl = SITE_URL.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${clinic.name} 웹블로그`,
    url: `${siteUrl}/blog`,
    inLanguage: "ko",
    publisher: {
      "@type": "Organization",
      name: clinic.name,
      alternateName: "위플로우",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/logo-navy.png`,
      telephone: clinic.phone,
      email: clinic.fax || undefined,
      sameAs: clinic.sns.map((s) => s.href),
    },
  };

  return (
    <html lang="ko" className="h-full antialiased font-sans">
      <head>
        {/* Pretendard 가변 폰트 (레퍼런스와 동일). 추후 self-host로 교체 가능 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      {/* 모바일은 하단 고정 바(전화/카카오톡/견적) 높이만큼 아래 여백을 둬 푸터가 가려지지 않게 */}
      <body className="flex min-h-full flex-col bg-white pb-14 text-slate-800 md:pb-0">
        <SiteProvider value={site}>
          {/* 관리자 미리보기 중이면 저장할 때마다 새로고침 */}
          {isPreview && <LivePreviewListener />}
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          {/* 우하단 퀵메뉴 플로팅 버튼 + 드로어 */}
          <FloatingCta />
        </SiteProvider>
        {/* 방문 기록 — 사이트와 같은 /api/track 으로 보내 관리자 유입 관리에 웹블로그로 잡힌다 (관리자 미리보기는 세지 않음) */}
        {!isPreview && <PageTracker />}
      </body>
    </html>
  );
}
