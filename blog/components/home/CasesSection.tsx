// 메인 페이지 제작 사례 띠. 사이트의 실제 제작 사례(data/cases.ts — 상세가 있고 샘플이 아닌 것)를 카드로 보여 주고 /cases 로 잇는다.
// 사례 데이터는 사이트와 같은 파일을 읽으므로, 사례를 추가하면 여기도 저절로 늘어난다.
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { portfolios } from "@/data/cases";
import { Reveal } from "@/blog/components/ui/Reveal";

const SHOW = 6;

// 블로그 메인에서만 순서를 바꿀 사례: slug → 몇 번째(0부터). 사이트 /cases 순서(data/cases.ts)는 건드리지 않는다
const PIN: Record<string, number> = { hrentcar: 4 };

export function CasesSection() {
  const real = portfolios.filter((p) => p.detail && !p.placeholder && p.images.length > 0);
  const ordered = real.filter((p) => !(p.slug in PIN));
  for (const [slug, at] of Object.entries(PIN).sort((x, y) => x[1] - y[1])) {
    const c = real.find((p) => p.slug === slug);
    if (c) ordered.splice(at, 0, c);
  }
  const cases = ordered.slice(0, SHOW);
  if (cases.length === 0) return null;

  return (
    <section aria-labelledby="home-cases-title" className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary md:text-base">PORTFOLIO</p>
            <Reveal variant="up">
              <h2 id="home-cases-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                WEFLOW가 만든 홈페이지
              </h2>
            </Reveal>
            <p className="mt-3 text-base text-neutral-600 md:text-lg">웹블로그는 이런 홈페이지 안에 붙여<br className="md:hidden" /> 함께 운영할 수 있습니다.</p>
          </div>
          {/* 사이트 쪽 페이지라 루트 레이아웃이 달라, Link 여도 페이지를 새로 불러온다 */}
          <Link href="/cases" className="group hidden items-center gap-1 text-base font-semibold text-neutral-700 hover:text-primary md:flex">
            제작 사례 전체 보기
            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 lg:grid-cols-3 lg:gap-5">
          {cases.map((c, i) => (
            <Reveal key={c.slug} variant="fade-up" delay={0.05 * i}>
              <Link href={`/cases/${c.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] border border-neutral-200 bg-neutral-100">
                  <Image
                    src={c.images[0]}
                    alt={`${c.name} 홈페이지 화면`}
                    fill
                    sizes="(min-width: 1024px) 400px, 50vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-xs font-semibold text-primary md:text-sm">{c.category}</p>
                <p className="mt-0.5 text-base font-bold text-foreground md:text-lg">{c.name}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">{c.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Link href="/cases" className="mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-neutral-600 md:hidden">
          제작 사례 전체 보기
          <IconArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
