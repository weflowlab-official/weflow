"use client";
// 검색 결과 — 전체 글(가벼운 필드만)을 미리 받아 두고 브라우저에서 바로 거른다.
// 예전엔 검색할 때마다 서버가 DB 를 조회해 2~4초씩 걸렸다. 글이 수십 개라 브라우저에서 거르는 편이 즉시 뜬다.
// 거르는 기준: 제목 · 요약 · 태그 · 업종 · 세부업종 이름에 검색어가 들어 있으면 (대소문자 무시).
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import type { Post } from "@/blog/lib/types";
import { SearchHero } from "./SearchHero";
import { PostListWithMore } from "./PostListWithMore";
import { EmptyPosts } from "./EmptyPosts";

type Props = { posts: Post[]; keywords: string[] };

export function SearchResults({ posts, keywords }: Props) {
  const query = (useSearchParams().get("q") ?? "").trim();
  const term = query.toLowerCase();
  const results = term
    ? posts.filter((p) =>
        [p.title, p.summary, p.categoryName, p.subIndustryName, ...(p.tags ?? [])].some((v) => v?.toLowerCase().includes(term)),
      )
    : posts;

  return (
    <>
      {/* key: 검색어가 바뀌면 입력칸도 새 검색어로 */}
      <SearchHero key={query} query={query} keywords={keywords} resultCount={query ? results.length : undefined} />

      {/* 레퍼런스: 결과 영역 py-12 md:py-20 */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl py-12 md:py-20">
        {results.length > 0 ? (
          // 다른 목록 페이지와 같은 세로 카드 4열
          <PostListWithMore key={query} posts={results} initialCount={8} step={8} />
        ) : query ? (
          // 결과 없음 상태
          <div className="flex flex-col items-center gap-7.5 py-12 text-center md:py-20">
            <div className="flex flex-col gap-1 text-xl font-semibold leading-snug text-neutral-800 md:text-3xl">
              <p>
                <span className="text-brand-primary">{query}</span>
                <span>에 대한 검색 결과가 없습니다.</span>
              </p>
              <p>다른 이야기도 살펴볼까요?</p>
            </div>
            <Link
              href="/blog/posts"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-7 py-3 text-base font-medium text-neutral-800 transition-colors hover:bg-primary hover:text-primary-foreground md:text-lg"
            >
              다른 이야기 보러가기
              <IconArrowRight className="size-5" />
            </Link>
          </div>
        ) : (
          // 검색어도 글도 없음 (시드 전)
          <EmptyPosts />
        )}
      </div>
    </>
  );
}
