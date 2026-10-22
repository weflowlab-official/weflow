"use client";
// 카테고리(큰 업종) 페이지의 세부업종 칩 + 글 목록.
// 칩을 누르면 주소에 ?sub=세부업종 이 붙고 그 업종 글만 보인다 — 메뉴 드롭다운의 세부업종 링크도 같은 주소로 들어온다.
// 걸러내기는 브라우저에서 한다: 카테고리 페이지는 정적 생성이라 주소의 ?sub 를 서버에서 읽지 않는다.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import type { Post, SubIndustry } from "@/blog/lib/types";
import { PostBrowser } from "./PostBrowser";

type Props = {
  posts: Post[];
  subs: SubIndustry[];
  tabs: ReactNode;
};

const chip = "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors md:text-[15px]";
const on = "border-primary bg-primary text-white";
const off = "border-neutral-200 bg-white text-neutral-700 hover:border-primary hover:text-primary";

export function IndustryBrowser({ posts, subs, tabs }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const sub = useSearchParams().get("sub");
  const current = subs.some((s) => s.slug === sub) ? sub : null;
  const shown = current ? posts.filter((p) => p.subIndustry === current) : posts;

  const select = (slug: string | null) => router.replace(slug ? `${pathname}?sub=${slug}` : pathname, { scroll: false });
  const count = (slug: string) => posts.filter((p) => p.subIndustry === slug).length;

  return (
    <>
      {subs.length > 0 && (
        <div className="mt-6 flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap [&::-webkit-scrollbar]:hidden" role="group" aria-label="세부업종">
          <button type="button" onClick={() => select(null)} aria-pressed={!current} className={`${chip} ${!current ? on : off}`}>
            전체 업종
          </button>
          {subs.map((s) => (
            <button key={s.slug} type="button" onClick={() => select(s.slug)} aria-pressed={current === s.slug} className={`${chip} ${current === s.slug ? on : off}`}>
              {s.name}
              <span className={`ml-1 ${current === s.slug ? "text-white/80" : "text-neutral-400"}`}>{count(s.slug)}</span>
            </button>
          ))}
        </div>
      )}
      {/* 칩을 바꾸면 정렬·더보기 상태를 처음부터 */}
      <PostBrowser key={current ?? "all"} posts={shown} tabs={tabs} />
    </>
  );
}
