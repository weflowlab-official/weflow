"use client";
// 메인 페이지 "WEFLOW가 만든 웹블로그" — 히어로 바로 아래. 실제로 운영 중인 웹블로그 사례를 사례마다 화면 여러 장의 슬라이더로 보여 준다.
// 사진은 저절로 끝없이 넘어가고 커서를 올리면 멈춘다. 사진이나 이름 줄을 누르면 그 웹블로그가 새 창으로 열린다. 아래쪽 CasesSection 은 홈페이지 사례.
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { IconArrowUpRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Reveal } from "@/blog/components/ui/Reveal";

type Case = { name: string; category: string; desc: string; href: string; image: string; count: number };

// 사진: public/images/cases/webblog/{image}-01.webp ~ 순서대로
const CASES: Case[] = [
  {
    name: "모두의안과",
    category: "병의원 · 안과",
    desc: "의료진이 직접 쓰는 안과 지식 가이드",
    href: "https://modooeyeblog.kr/",
    image: "modooeye",
    count: 7,
  },
  {
    name: "KPSC",
    category: "기업",
    desc: "회사 소식과 나눔·파트너십 이야기를 전하는 웹블로그",
    href: "https://helplus.kr/blog",
    image: "kpsc",
    count: 5,
  },
];

const navButton =
  "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-colors hover:bg-primary hover:text-white";

function CaseCard({ c }: { c: Case }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <div>
      {/* 커서가 화살표 위에 있을 때도 멈춰 있도록 Swiper 가 아니라 바깥 상자에서 멈춘다 */}
      <div
        className="relative overflow-hidden rounded-[12px] border border-neutral-200 bg-neutral-100"
        onMouseEnter={() => swiper?.autoplay?.pause()}
        onMouseLeave={() => swiper?.autoplay?.resume()}
      >
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setIndex(s.realIndex)}
          className="w-full"
        >
          {Array.from({ length: c.count }, (_, i) => (
            <SwiperSlide key={i}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" draggable={false} aria-label={`${c.name} 웹블로그 새 창으로 열기`} className="relative block aspect-[2/1]">
                <Image
                  src={`/images/cases/webblog/${c.image}-${String(i + 1).padStart(2, "0")}.webp`}
                  alt={`${c.name} 웹블로그 화면 ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  draggable={false}
                  className="object-cover object-top"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <button type="button" aria-label="이전 화면" onClick={() => swiper?.slidePrev()} className={`${navButton} left-2`}>
          <IconChevronLeft className="size-5" />
        </button>
        <button type="button" aria-label="다음 화면" onClick={() => swiper?.slideNext()} className={`${navButton} right-2`}>
          <IconChevronRight className="size-5" />
        </button>
        <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
          {index + 1} / {c.count}
        </span>
      </div>
      <a href={c.href} target="_blank" rel="noopener noreferrer" className="group mt-3 block">
        <p className="text-xs font-semibold text-primary md:text-sm">{c.category}</p>
        <p className="mt-0.5 flex items-center gap-1 text-base font-bold text-foreground transition-colors group-hover:text-primary md:text-lg">
          {c.name}
          <IconArrowUpRight className="size-4 text-neutral-400 transition-colors group-hover:text-primary" />
        </p>
        <p className="mt-0.5 text-sm text-neutral-500">{c.desc}</p>
      </a>
    </div>
  );
}

export function WebBlogCasesSection() {
  return (
    <section aria-labelledby="home-webblog-cases-title" className="bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-primary md:text-base">CASES</p>
        <Reveal variant="up">
          <h2 id="home-webblog-cases-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            WEFLOW가 만든 웹블로그
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-10">
          {CASES.map((c, i) => (
            <Reveal key={c.name} variant="fade-up" delay={0.1 * i}>
              <CaseCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
