// 검색 결과 페이지 (/search?q=검색어). 상단 검색 영역(메인 히어로 톤) + 세로 카드 4열 목록 + View more.
// 검색어가 없으면 전체 글을 최신순으로, 결과가 없으면 "검색 결과가 없습니다" 상태를 보여준다 (레퍼런스 동작).
//
// 페이지는 검색어와 상관없이 한 번만 만들어 두고(다른 목록 페이지처럼 캐시), 전체 글 목록을 실어 보낸다.
// 실제 거르기는 브라우저(SearchResults)가 한다 — 검색할 때마다 DB 를 조회하던 때는 2~4초씩 걸렸다.
// 본문(content)은 목록 카드에 쓰지 않아 빼고 보낸다 (페이지가 무거워지지 않게).
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPosts, getSiteData } from "@/blog/lib/payload";
import { SearchHero } from "@/blog/components/posts/SearchHero";
import { SearchResults } from "@/blog/components/posts/SearchResults";

export const metadata: Metadata = { title: "업종·주제 검색" };

export default async function SearchPage() {
  // 인기 키워드는 사이트 공통 데이터(home 글로벌, 비어 있으면 기본값)
  const [{ popularKeywords }, all] = await Promise.all([getSiteData(), getAllPosts()]);
  const posts = all.map(({ content: _content, ...p }) => p);

  return (
    // useSearchParams 를 쓰는 부분은 Suspense 안에 — 정적 페이지로 만들 수 있게
    <Suspense fallback={<SearchHero query="" keywords={popularKeywords} />}>
      <SearchResults posts={posts} keywords={popularKeywords} />
    </Suspense>
  );
}
