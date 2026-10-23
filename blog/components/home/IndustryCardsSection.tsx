// 메인 페이지 업종 선택 카드. 큰 업종(카테고리)마다 카드 한 장: 아이콘 + 이름 + 설명 + 세부업종 칩 + 글 수.
// 카드를 누르면 그 업종 페이지로, 세부업종 칩을 누르면 그 칩이 켜진 목록으로 간다. 히어로의 "업종별로 보기" 버튼이 여기로 내려온다(#industries).
import Link from "next/link";
import {
  IconArrowRight,
  IconBook,
  IconBuildingFactory,
  IconCar,
  IconHome,
  IconScale,
  IconScissors,
  IconSchool,
  IconStethoscope,
  IconCategory,
  type Icon,
} from "@tabler/icons-react";
import type { Category, Post } from "@/blog/lib/types";
import { Reveal } from "@/blog/components/ui/Reveal";

// 카테고리 slug → 아이콘 (lib/industries.ts). 없으면 기본 아이콘
const ICONS: Record<string, Icon> = {
  clinic: IconStethoscope,
  "car-leisure": IconCar,
  "finance-pro": IconScale,
  business: IconBuildingFactory,
  "life-service": IconHome,
  "health-beauty": IconScissors,
  "edu-food-stay": IconSchool,
  guide: IconBook,
};

type Props = { categories: Category[]; posts: Post[] };

export function IndustryCardsSection({ categories, posts }: Props) {
  const count = (slug: string) => posts.filter((p) => p.category === slug).length;

  return (
    <section id="industries" aria-labelledby="home-industries-title" className="scroll-mt-20 bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary md:text-base">BY INDUSTRY</p>
          <Reveal variant="up">
            <h2 id="home-industries-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              우리 업종부터 골라 보세요
            </h2>
          </Reveal>
          <p className="mt-3 text-base text-neutral-600 md:text-lg">업종마다 고객이 검색하는 말이 달라,<br className="md:hidden" /> 웹블로그에 쓸 글도 달라집니다.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-4">
          {categories.map((c, i) => {
            const CardIcon = ICONS[c.slug] ?? IconCategory;
            const n = count(c.slug);
            return (
              <Reveal key={c.slug} variant="fade-up" delay={0.05 * i}>
                <div className="group relative flex h-full flex-col rounded-[14px] border border-neutral-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--brand-primary-20)] hover:shadow-[0_10px_30px_0_var(--brand-primary-10)] md:p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-[12px] bg-[var(--brand-primary-10)] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <CardIcon className="size-6" stroke={1.75} />
                    </span>
                    {n > 0 && <span className="text-xs font-semibold text-neutral-400">글 {n}편</span>}
                  </div>
                  {/* 카드 전체가 눌리도록 링크를 카드 위에 펼친다 (세부업종 칩은 그 위로 올려 따로 눌린다) */}
                  <Link href={`/blog/${c.slug}`} className="mt-4 text-lg font-bold text-foreground after:absolute after:inset-0 after:content-[''] md:text-xl">
                    {c.name}
                  </Link>
                  {c.description && <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{c.description}</p>}
                  {c.subs.length > 0 && (
                    <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                      {c.subs.slice(0, 4).map((s) => (
                        <Link
                          key={s.slug}
                          href={`/blog/${c.slug}?sub=${s.slug}`}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-primary hover:text-primary"
                        >
                          {s.name}
                        </Link>
                      ))}
                      {c.subs.length > 4 && <span className="px-1 py-1 text-xs text-neutral-400">+{c.subs.length - 4}</span>}
                    </div>
                  )}
                  <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-primary">
                    보러 가기
                    <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
