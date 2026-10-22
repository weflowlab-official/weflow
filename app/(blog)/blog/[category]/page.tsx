// 카테고리(큰 업종) 글 목록 페이지 (/blog/car-leisure, ...). Payload categories 컬렉션의 slug 가 경로.
// 구성: 빵부스러기 > 제목·설명 > 세부업종 칩 > 탭(전체 + 모든 업종, 현재 업종 활성) > 카드 그리드 + View more
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getCategory, getPostsByCategory } from "@/blog/lib/payload";
import { Breadcrumb } from "@/blog/components/ui/Breadcrumb";
import { PageTitle } from "@/blog/components/posts/PageTitle";
import { CategoryTabs } from "@/blog/components/posts/CategoryTabs";
import { PostBrowser } from "@/blog/components/posts/PostBrowser";
import { IndustryBrowser } from "@/blog/components/posts/IndustryBrowser";

// 최대 1분에 한 번 다시 생성 (예약 발행 글 반영)
export const revalidate = 60;

// 모든 카테고리를 빌드 시 정적 생성
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  return cat ? { title: cat.name, description: cat.description } : {};
}

// params 를 최상위에서 읽어 없는 카테고리는 진짜 404 상태코드를 돌려준다 (SEO).
export default async function CategoryPage({ params }: PageProps<"/blog/[category]">) {
  const { category } = await params;
  const cat = await getCategory(decodeURIComponent(category));
  if (!cat) notFound();

  const [posts, categories] = await Promise.all([getPostsByCategory(cat.slug), getCategories()]);
  const tabs = <CategoryTabs basePath={`/blog/${cat.slug}`} categories={categories} current={cat.slug} mode="path" />;

  return (
    // 레퍼런스: 컨테이너 py-12 md:py-16
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-16">
      <Breadcrumb items={[{ label: "홈", href: "/blog" }, { label: cat.name }]} />
      <PageTitle title={cat.name} />
      {cat.description && <p className="mt-3 text-base leading-relaxed text-neutral-600 md:text-lg">{cat.description}</p>}

      {/* 세부업종 칩(?sub=) → 탭(전체 + 모든 업종, 현재 업종 활성) + 정렬 드롭박스 → 목록.
          칩은 주소의 ?sub 를 읽어야 해서 Suspense 로 감싼다. 서버 HTML 에는 전체 글 목록이 먼저 그려진다 */}
      <Suspense fallback={<PostBrowser posts={posts} tabs={tabs} />}>
        <IndustryBrowser posts={posts} subs={cat.subs} tabs={tabs} />
      </Suspense>
    </div>
  );
}

